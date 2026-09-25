import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactQRScanner from "react-qr-scanner";
import styled from "styled-components";
import CheckBoard from "../components/Board";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../AuthContext";
import { errorMessage, extractQrToken } from "../attendance";
import {
  Button,
  Dialog,
  Muted,
  Notice,
  Overlay,
  Page,
  PageHead,
  Panel,
  PanelTitle,
  Stack,
} from "../components/ui";
import { bp, color, radius, size } from "../theme";

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 22rem) minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;

  @media (max-width: ${bp.laptop}) {
    grid-template-columns: 1fr;
  }
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`;

const DialogHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;

  h2 {
    font-size: ${size.lg};
  }
`;

// QR은 흰 바탕이어야 인식이 잘 된다.
const QrFrame = styled.div`
  padding: 1rem;
  border-radius: ${radius.control};
  background: #ffffff;

  img {
    display: block;
    width: 100%;
    height: auto;
    transition: opacity 0.2s;
  }
`;

const Countdown = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1.25rem;

  strong {
    font-size: ${size.x2};
    font-variant-numeric: tabular-nums;
    color: ${(p) => (p.$expired ? color.danger : color.text)};
  }
`;

const Scanner = styled.div`
  overflow: hidden;
  border-radius: ${radius.control};
  background: #000;
`;

const formatRemaining = (seconds) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

export default function Check() {
  const [modalType, setModalType] = useState(null); // 'qr' for generating, 'scan' for scanning
  const [qrImage, setQrImage] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [boarddata, setBoarddata] = useState(null);
  // 서버가 X-QR-Valid-Seconds로 알려준 만료 시각(로컬 시계 기준). 헤더가 없으면(구버전 BE) null.
  const [qrDeadline, setQrDeadline] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoggedIn, isAdmin } = useAuth();
  const [boardError, setBoardError] = useState(null);
  const navigate = useNavigate();
  const autoSubmitted = useRef(false);

  // 폰 기본 카메라로 QR을 찍으면 /check?token=... 으로 바로 들어온다.
  const tokenParam = searchParams.get("token");
  useEffect(() => {
    if (!tokenParam || autoSubmitted.current) return;
    autoSubmitted.current = true;
    if (!isLoggedIn) {
      const back = `/check?token=${encodeURIComponent(tokenParam)}`;
      navigate(`/login?redirect=${encodeURIComponent(back)}`, {
        replace: true,
      });
      return;
    }
    // 새로고침 시 다시 제출되지 않도록 주소에서 토큰을 지운다.
    setSearchParams({}, { replace: true });
    submitToken(tokenParam);
  }, [tokenParam, isLoggedIn, navigate, setSearchParams]);

  useEffect(() => {
    if (!qrDeadline) {
      setRemaining(null);
      return;
    }
    const tick = () =>
      setRemaining(Math.max(0, Math.ceil((qrDeadline - Date.now()) / 1000)));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [qrDeadline]);

  useEffect(() => {
    if (modalType === "qr") {
      fetchQrCode();
    }
  }, [modalType]);


  const fetchQrCode = async () => {
    try {
      const response = await axiosInstance.get("/attendance/generate-qr", {
        responseType: "blob",
      });
      const imageUrl = URL.createObjectURL(response.data);
      setQrImage((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return imageUrl;
      });
      const validSeconds = Number(response.headers["x-qr-valid-seconds"]);
      setQrDeadline(
        Number.isFinite(validSeconds) && response.headers["x-qr-valid-seconds"]
          ? Date.now() + validSeconds * 1000
          : null
      );
    } catch (error) {
      console.error("Error fetching QR code:", error);
      setMessage("QR 코드를 불러오는데 실패했습니다.");
      setMessageType("error");
    }
  };

  const sendQRDataToServer = async (qrData) => {
    const ok = await submitToken(extractQrToken(qrData));
    if (ok) {
      setTimeout(() => {
        setScanResult(null);
        setTimeout(() => {
          closeModal();
        }, 2000);
      }, 1000);
    }
  };

  const submitToken = async (token) => {
    try {
      const response = await axiosInstance.post("/attendance/success", {
        token,
      });
      // 응답 본문은 문자열("OOO님, 출석 완료")
      setMessage(String(response.data?.message ?? response.data));
      setMessageType("success");
      return true;
    } catch (error) {
      console.error("서버 요청 실패:", error);
      setMessage(errorMessage(error, "출석하지 못했습니다. 다시 찍어주세요."));
      setMessageType("error");
      return false;
    }
  };

  // 스캐너는 300ms마다 onScan을 부른다. 한 번만 제출되도록 ref로 막는다.
  const scanHandled = useRef(false);
  const handleScan = (data) => {
    if (data && !scanHandled.current) {
      scanHandled.current = true;
      setScanResult(data.text);
      sendQRDataToServer(data.text);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setMessage("카메라를 열 수 없습니다. 브라우저 설정에서 카메라 권한을 허용해주세요.");
    setMessageType("error");
  };

  const openQrModal = () => {
    setModalType("qr");
    setMessage(null);
    setMessageType(null);
    fetchBoarddata();
  };

  const openScanModal = () => {
    scanHandled.current = false;
    setModalType("scan");
    setMessage(null);
    setMessageType(null);
  };

  const closeModal = () => {
    setModalType(null);
    if (qrImage) URL.revokeObjectURL(qrImage);
    setQrImage(null);
    setQrDeadline(null);
    setScanResult(null);
    setMessage(null);
  };
  const fetchBoarddata = async () => {
    try {
      const response = await axiosInstance.get("/attendance/today/attendance");
      setBoarddata(response.data);
      setBoardError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setBoarddata(null);
      setBoardError(
        error.response?.data?.errorCode === "SESSION_NOT_FOUND"
          ? "오늘 세션이 아직 없습니다. QR을 띄우면 세션이 시작되고 출석부가 만들어집니다."
          : errorMessage(error, "출석부를 불러오지 못했습니다.")
      );
    }
  };

  useEffect(() => {
    if (isAdmin) fetchBoarddata();
  }, [isAdmin]);
  return (
    <Page>
      <PageHead
        title="출석"
        description="세션 장소에 띄운 QR을 찍으면 출석이 기록됩니다. 세션 시작 20분 뒤부터는 지각입니다."
      />
      <Layout>
        <Panel>
          <PanelTitle>QR로 출석하기</PanelTitle>
          <Stack>
            <Muted>휴대폰 기본 카메라로 찍어도 바로 출석됩니다.</Muted>
            <Button $block onClick={openScanModal}>
              카메라 열기
            </Button>
            {message && !modalType && (
              <Notice $tone={messageType} role="status">
                {message}
              </Notice>
            )}
          </Stack>
        </Panel>

        {isAdmin && (
          <Panel>
            <PanelTitle>오늘 출석부</PanelTitle>
            <Toolbar>
              <Button onClick={openQrModal}>QR 띄우기</Button>
              <Button $variant="secondary" onClick={fetchBoarddata}>
                새로고침
              </Button>
            </Toolbar>
            {boardError && <Muted>{boardError}</Muted>}
            {boarddata && boarddata.length > 0 && (
              <CheckBoard memberdata={boarddata} onUpdated={fetchBoarddata} />
            )}
          </Panel>
        )}
      </Layout>

      {modalType && (
        <Overlay onClick={closeModal}>
          <Dialog $width={modalType === "qr" ? "34rem" : "26rem"} onClick={(e) => e.stopPropagation()}>
            <DialogHead>
              <h2>{modalType === "qr" ? "출석 QR" : "QR 찍기"}</h2>
              <Button $variant="ghost" onClick={closeModal}>
                닫기
              </Button>
            </DialogHead>

            {modalType === "qr" && (
              <>
                <QrFrame>
                  {qrImage ? (
                    <img
                      src={qrImage}
                      alt="출석 QR 코드"
                      style={{ opacity: remaining === 0 ? 0.15 : 1 }}
                    />
                  ) : (
                    <Muted style={{ color: "#555", padding: "4rem 0", textAlign: "center" }}>
                      QR을 만드는 중…
                    </Muted>
                  )}
                </QrFrame>
                {remaining !== null && (
                  <Countdown $expired={remaining === 0}>
                    <div>
                      <Muted>{remaining === 0 ? "만료됨" : "남은 시간"}</Muted>
                      <strong>{formatRemaining(remaining)}</strong>
                    </div>
                    {remaining === 0 && <Button onClick={fetchQrCode}>새 QR 만들기</Button>}
                  </Countdown>
                )}
                {message && (
                  <Notice $tone={messageType} style={{ marginTop: "1rem" }}>
                    {message}
                  </Notice>
                )}
              </>
            )}

            {modalType === "scan" && (
              <Stack>
                {!scanResult ? (
                  <Scanner>
                    <ReactQRScanner
                      delay={300}
                      constraints={{
                        video: {
                          facingMode: { exact: "environment" },
                        },
                      }}
                      onError={handleError}
                      onScan={handleScan}
                      style={{ width: "100%", display: "block" }}
                    />
                  </Scanner>
                ) : (
                  <Muted>출석을 처리하는 중…</Muted>
                )}
                {message && (
                  <Notice $tone={messageType} role="status">
                    {message}
                  </Notice>
                )}
              </Stack>
            )}
          </Dialog>
        </Overlay>
      )}
    </Page>
  );
}
