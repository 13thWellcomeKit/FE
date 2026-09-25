import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axiosInstance from "../axiosInstance";
import DefaultImage from "../image/Logo.png";
import { Button, Muted, Page, PageHead, Panel, PanelTitle, StatusDot } from "../components/ui";
import { ATTENDANCE_STATUS, STATUS_ORDER, formatDate, formatTime } from "../attendance";
import { bp, color, radius, size } from "../theme";

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 20rem) minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;

  @media (max-width: ${bp.laptop}) {
    grid-template-columns: 1fr;
  }
`;

const Avatar = styled.img`
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  object-fit: cover;
  background: ${color.raised};
  border: 2px solid ${color.brand};
`;

const Name = styled.h2`
  margin-top: 1.25rem;
  font-size: ${size.x2};
  font-weight: 700;
`;

const Facts = styled.dl`
  margin: 1.5rem 0 0;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem 1.25rem;

  dt {
    color: ${color.muted};
    font-size: ${size.sm};
  }
  dd {
    margin: 0;
    font-weight: 600;
  }
`;

const Tally = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const TallyItem = styled.div`
  padding: 1rem;
  border-radius: ${radius.control};
  background: ${color.raised};

  span {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: ${color.muted};
    font-size: ${size.sm};
  }
  strong {
    display: block;
    margin-top: 0.25rem;
    font-size: ${size.x2};
    font-variant-numeric: tabular-nums;
  }
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 0;
  border-top: 1px solid ${color.line};
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;

  small {
    color: ${color.muted};
    font-weight: 400;
    font-variant-numeric: tabular-nums;
  }
`;

const DEV_PART = { FRONT_END: "프론트엔드", BACK_END: "백엔드" };

export default function MyPage() {
  const navigate = useNavigate();
  const [userdata, setUserdata] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [manito, setManito] = useState(null);
  const [manitoMessage, setManitoMessage] = useState("");
  const [attendance, setAttendance] = useState(null);
  const [attendanceError, setAttendanceError] = useState("");

  useEffect(() => {
    fetchMyData();
    fetchMyProfile();
    fetchMyManito();
    fetchMyAttendance();
  }, []);

  const fetchMyAttendance = async () => {
    try {
      const res = await axiosInstance.get("/attendance/my-attendance");
      // 서버는 attendanceTime 순으로 줘서 결석(시각 null)이 섞인다. 날짜 최신순으로 다시 정렬.
      const sorted = [...(res.data || [])].sort((a, b) =>
        String(b.date).localeCompare(String(a.date))
      );
      setAttendance(sorted);
      setAttendanceError("");
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setAttendanceError("출석 기록을 불러오지 못했습니다.");
    }
  };

  const fetchMyData = async () => {
    try {
      const response = await axiosInstance.get("/user/info");
      setUserdata(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchMyProfile = async () => {
    try {
      const response = await axiosInstance.get("/user/profileImage", {
        responseType: "blob",
      });
      setProfileImage(URL.createObjectURL(response.data));
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  const fetchMyManito = async () => {
    try {
      const res = await axiosInstance.get("/manito/my");
      if (typeof res.data === "string") {
        setManito(null);
        setManitoMessage(res.data); // "아직 마니또 생성 전입니다!" 등
      } else {
        setManito(res.data);
        setManitoMessage("");
      }
    } catch (err) {
      setManitoMessage("");
    }
  };

  return (
    <Page>
      <PageHead
        title="마이페이지"
        actions={
          <>
            <Button $variant="secondary" onClick={() => navigate("/change-profile")}>
              프로필 사진 변경
            </Button>
            <Button $variant="secondary" onClick={() => navigate("/change-password")}>
              비밀번호 변경
            </Button>
          </>
        }
      />
      <Layout>
        <Panel>
          <Avatar src={profileImage || DefaultImage} alt="프로필 사진" />
          <Name>{userdata.name || " "}</Name>
          <Facts>
            <dt>학번</dt>
            <dd>{userdata.studentName || "-"}</dd>
            <dt>팀</dt>
            <dd>{userdata.teamName || "배정 전"}</dd>
            <dt>트랙</dt>
            <dd>{DEV_PART[userdata.devPart] || userdata.devPart || "-"}</dd>
            <dt>마니또</dt>
            <dd>{manito?.name || manitoMessage || "-"}</dd>
          </Facts>
        </Panel>

        <Panel>
          <PanelTitle>내 출석</PanelTitle>
          {attendanceError && <Muted>{attendanceError}</Muted>}
          {attendance && (
            <>
              <Tally>
                {STATUS_ORDER.map((status) => (
                  <TallyItem key={status}>
                    <span>
                      <StatusDot $color={ATTENDANCE_STATUS[status].color} />
                      {ATTENDANCE_STATUS[status].label}
                    </span>
                    <strong>
                      {attendance.filter((a) => a.attendanceStatus === status).length}
                    </strong>
                  </TallyItem>
                ))}
              </Tally>
              {attendance.length === 0 ? (
                <Muted>첫 세션에서 QR을 찍으면 여기에 기록이 쌓입니다.</Muted>
              ) : (
                <List>
                  {attendance.map((a, i) => {
                    const meta = ATTENDANCE_STATUS[a.attendanceStatus];
                    return (
                      <Item key={`${a.date}-${i}`}>
                        <span>{formatDate(a.date)}</span>
                        <Status>
                          <StatusDot $color={meta?.color} />
                          {meta?.label ?? "-"}
                          {formatTime(a.attendanceTime) && (
                            <small>{formatTime(a.attendanceTime)}</small>
                          )}
                        </Status>
                      </Item>
                    );
                  })}
                </List>
              )}
            </>
          )}
        </Panel>
      </Layout>
    </Page>
  );
}
