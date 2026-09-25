import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactQRScanner from "react-qr-scanner";
import Header from "../components/Header";
import CheckBoard from "../components/Board";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";
import axiosInstance from "../axiosInstance";
import media from "styled-media-query";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/Breakpoints";
import { useAuth } from "../AuthContext";
import { errorMessage, extractQrToken } from "../attendance";

const TextContainer = styled.div`
  display: flex;
  width: 32.8125rem;
  height: 18.12rem;
  flex-direction: column;
  margin-top: 12.25rem;
  gap: 2.5rem;

  ${media.lessThan("medium")`
    width: 24.375rem;
    height: 27.88rem;
    display: flex;
    padding: 0rem 1rem;
    align-items: center;
    gap: 2.5rem;
    box-sizing: border-box;
    justify-content: flex-end;
    margin-top: 0rem;
  `}
`;

const ButtonContainer = styled.div`
  width: 26.75rem;
  height: 3.25rem;
  gap: 2rem;
  display: flex;
  flex-direction: row;

  ${media.lessThan("medium")`
    flex-direction: column; 
    justify-content: center;
    align-items: center;
    width: 12.37rem;
    height: 13.75rem;
  `}
`;

const TitleText = styled.h1`
  font-family: Montserrat;
  font-size: 3.7rem;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.1rem;
  color: #ffff;
  margin: 0;
`;

const MiddleText = styled.h1`
  font-family: Pretendard;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.0375rem;
  color: #ffff;
  margin: 0;

  ${media.lessThan("medium")`
    font-size: 1.25rem;
  `}
`;

const QrButton = styled.div`
  display: flex;
  width: 12.375rem;
  height: 3.25rem;
  justify-content: center;
  align-items: center;
  background-color: #ffff;
  border-radius: 3.125rem;
  font-family: Pretendard;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: -0.02813rem;
  color: #ff7710;
  cursor: pointer;
  @media (max-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

const CheckButton = styled.div`
  display: flex;
  width: 12.375rem;
  height: 3.25rem;
  justify-content: center;
  align-items: center;
  background-color: #ffff;
  border-radius: 3.125rem;
  font-family: Pretendard;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: -0.02813rem;
  color: #ff7710;
  cursor: pointer;

  @media (min-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  width: 60rem;
  height: auto;
  padding: 1.125rem 1rem;
  justify-content: center;
  align-items: center;
  background-color: #ffff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  border-radius: 1rem;

  ${media.lessThan("medium")`
    width: 90%;
    height: auto;
    max-height: 90vh;
  `}
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Close = styled(IoMdClose)`
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-self: flex-end;
`;

const ScannerContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 1rem 0;
`;

const QrStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.75rem;
  font-family: Pretendard;
  font-size: 1.125rem;
  color: ${(props) => (props.$expired ? "#d03b3b" : "#1c1b1a")};
`;

const RegenerateButton = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 3.125rem;
  border: none;
  background-color: #ff7710;
  color: #ffffff;
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const formatRemaining = (seconds) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

const MessageBox = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  background-color: ${(props) =>
    props.type === "success"
      ? "#d4edda"
      : props.type === "error"
      ? "#f8d7da"
      : "#e2e3e5"};
  color: ${(props) =>
    props.type === "success"
      ? "#155724"
      : props.type === "error"
      ? "#721c24"
      : "#383d41"};
`;

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
  const { isLoggedIn } = useAuth();
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
      setMessage(`출석 결과: ${response.data?.message ?? response.data}`);
      setMessageType("success");
      return true;
    } catch (error) {
      console.error("서버 요청 실패:", error);
      setMessage(
        "출석 처리 실패: " + errorMessage(error, error.message)
      );
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
    setMessage("카메라 접근 실패: " + err.message);
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
      console.log(response.data);
      setBoarddata(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <>
      <Header />
      <PageContainer>
        <TextContainer>
          <TitleText>QR 출석체크</TitleText>
          <MiddleText>
            QR코드로 출석체크를 진행해주세요.
            <br />
            출석체크는 모바일에서만 가능합니다.
          </MiddleText>
          <ButtonContainer>
            <QrButton onClick={openQrModal}>QR 체크 진행</QrButton>
            <CheckButton onClick={openScanModal}>출석하기</CheckButton>
            <QrButton onClick={fetchBoarddata}>출석부 최신화</QrButton>
          </ButtonContainer>
          {message && <MessageBox type={messageType}>{message}</MessageBox>}
        </TextContainer>
        {boarddata && boarddata.length > 0 ? (
          <CheckBoard memberdata={boarddata} onUpdated={fetchBoarddata} />
        ) : null}
      </PageContainer>

      {modalType && (
        <>
          <ModalOverlay onClick={closeModal} />
          <Modal>
            <Close onClick={closeModal} size={24} />

            {modalType === "qr" && (
              <>
                {qrImage ? (
                  <img
                    src={qrImage}
                    alt="QR Code"
                    style={{
                      width: "95%",
                      height: "auto",
                      opacity: remaining === 0 ? 0.2 : 1,
                    }}
                  />
                ) : (
                  <p>Loading...</p>
                )}
                {remaining !== null && (
                  <QrStatus $expired={remaining === 0}>
                    {remaining === 0
                      ? "QR이 만료되었습니다."
                      : `남은 유효 시간 ${formatRemaining(remaining)}`}
                    {remaining === 0 && (
                      <RegenerateButton onClick={fetchQrCode}>
                        QR 재생성
                      </RegenerateButton>
                    )}
                  </QrStatus>
                )}
              </>
            )}

            {modalType === "scan" && (
              <>
                {!scanResult ? (
                  <ScannerContainer>
                    <ReactQRScanner
                      delay={300}
                      constraints={{
                        video: {
                          facingMode: { exact: "environment" },
                        },
                      }}
                      onError={handleError}
                      onScan={handleScan}
                      style={{ width: "100%" }}
                    />
                  </ScannerContainer>
                ) : (
                  <p>스캔 완료: 처리 중...</p>
                )}
                {message && (
                  <MessageBox type={messageType}>{message}</MessageBox>
                )}
              </>
            )}
          </Modal>
        </>
      )}
    </>
  );
}
