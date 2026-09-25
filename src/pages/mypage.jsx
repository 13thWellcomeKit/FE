import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import styled from "styled-components";
import axiosInstance from "../axiosInstance";
import Image from "../image/Logo.png";
import PageContainer from "../components/PageContainer";
import breakpoints from "../components/Breakpoints";
import {
  ATTENDANCE_STATUS,
  STATUS_ORDER,
  formatDate,
  formatTime,
} from "../attendance";

const MypageContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 85.5rem;
  height: auto;
  min-height: 47.56rem;
  padding: 3.75rem 2.25rem;
  flex-direction: column;
  border-radius: 1.25rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.19);
  backdrop-filter: blur(10px);

  @media (max-width: ${breakpoints.laptop}) {
    max-width: 100%;
    padding: 2.5rem 1.5rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    height: auto;
    padding: 2rem 1.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1.5rem 1rem;
  }
`;

const MypageHeader = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  min-height: 5.56rem;
  flex-direction: row;
  margin-bottom: 2rem;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${breakpoints.tablet}) {
    height: auto;
    gap: 24px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
    height: auto;
  }
`;

const MypageBody = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  min-height: 32.44rem;
  flex-direction: row;
  gap: 2rem;

  @media (max-width: ${breakpoints.laptop}) {
    height: auto;
  }

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;

const TextBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  height: auto;
  min-height: 29.25rem;
  margin-left: 2rem;

  @media (max-width: ${breakpoints.laptop}) {
    margin-left: 2rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    margin-left: 0;
  }
`;

const ImgBody = styled.img`
  width: 45%;
  max-width: 32.4375rem;
  height: auto;
  object-fit: contain;
  aspect-ratio: 1/1;

  @media (max-width: ${breakpoints.laptop}) {
    max-width: 25rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    max-width: 20rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    max-width: 17.87rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
    margin-top: 1rem;
    justify-content: space-between;
  }
`;

const HeaderText = styled.h1`
  width: auto;
  max-width: 51.63rem;
  margin: 0;
  color: #ffff;
  font-family: Montserrat;
  font-size: 4rem;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 5.6rem */
  letter-spacing: -0.1rem;

  @media (max-width: ${breakpoints.laptop}) {
    font-size: 3rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    font-size: 2.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const MypageButton = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 13rem;
  height: 3.25rem;
  padding: 0.75rem;
  justify-content: center;
  align-items: center;
  border-radius: 3.125rem;
  background-color: #ffff;
  color: #ff7710;
  font-family: Pretendard;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 1.75rem */
  letter-spacing: -0.03125rem;
  cursor: pointer;

  &:hover {
    background-color: #ff7710;
    color: #ffff;
  }

  @media (max-width: ${breakpoints.laptop}) {
    width: 10rem;
    font-size: 1rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    margin: 0;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 48%;
    height: 2.5rem;
    font-size: 0.875rem;
    padding: 0.5rem;
    line-height: 100%;
    letter-spacing: -0.02188rem;
  }
`;

const MypageText = styled.h1`
  font-family: Pretendard;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: -0.02813rem;
  color: #ffff;
  margin: 0;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const MypageBox = styled.div`
  display: flex;
  height: 3.25rem;
  padding: 0.75rem 2rem;
  align-items: center;
  border-radius: 3.125rem;
  box-sizing: border-box;
  margin-top: 1rem;
  margin-bottom: 1rem;
  background-color: rgba(255, 255, 255, 0.19);
  border-color: rgba(255, 255, 255, 0.19);
  color: #ffff;

  @media (max-width: ${breakpoints.mobile}) {
    height: 2.75rem;
    padding: 0.5rem 1.5rem;
  }
`;

const AttendanceSection = styled.section`
  margin-top: 2.5rem;
  font-family: Pretendard;
  color: #ffffff;
`;

const SectionTitle = styled.h2`
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

const SummaryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1rem;
  font-size: 1.125rem;
`;

const AttendanceList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AttendanceItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  background-color: rgba(255, 255, 255, 0.08);
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;

  &::before {
    content: "";
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: ${(props) => props.$color};
  }
`;

const MutedText = styled.span`
  color: #9d9d9d;
  font-size: 0.9rem;
  margin-left: 0.5rem;
`;

export default function MyPage() {
  const navigate = useNavigate();
  const [userdata, setUserdata] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [manito, setManito] = useState(null);
  const [manitoMessage, setManitoMessage] = useState("");
  const [manitoError, setManitoError] = useState("");
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
      console.log(response.data);
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
      const imageUrl = URL.createObjectURL(response.data);
      setProfileImage(imageUrl);
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
      setManitoError("");
    } catch (err) {
      setManitoError(
        err.response?.data || "마니또 정보를 불러오지 못했습니다."
      );
    }
  };

  return (
    <>
      <Header></Header>
      <PageContainer>
        <MypageContainer>
          <MypageHeader>
            <HeaderText>MY Page</HeaderText>
            <ButtonContainer>
              <MypageButton onClick={() => navigate("/change-profile")}>
                프로필 이미지 변경
              </MypageButton>
              <MypageButton onClick={() => navigate("/change-password")}>
                비밀번호 변경
              </MypageButton>
            </ButtonContainer>
          </MypageHeader>
          <MypageBody>
            <ImgBody src={profileImage || Image} alt="프로필 이미지" />
            <TextBody>
              <MypageText>이름</MypageText>
              <MypageBox>{userdata.name}</MypageBox>
              <MypageText>학번</MypageText>
              <MypageBox>{userdata.studentName}</MypageBox>
              <MypageText>소속팀</MypageText>
              <MypageBox>{userdata.teamName}</MypageBox>
              <MypageText>개발트랙</MypageText>
              <MypageBox>{userdata.devPart}</MypageBox>
              <MypageText>나의 마니또</MypageText>
              <MypageBox>
                {manito?.name || manitoMessage || (manitoError ? "-" : "-")}
              </MypageBox>
            </TextBody>
          </MypageBody>
          <AttendanceSection>
            <SectionTitle>내 출석</SectionTitle>
            {attendanceError && <MutedText>{attendanceError}</MutedText>}
            {attendance && (
              <>
                <SummaryRow>
                  {STATUS_ORDER.map((status) => (
                    <StatusBadge
                      key={status}
                      $color={ATTENDANCE_STATUS[status].color}
                    >
                      {ATTENDANCE_STATUS[status].label}{" "}
                      {
                        attendance.filter((a) => a.attendanceStatus === status)
                          .length
                      }
                    </StatusBadge>
                  ))}
                </SummaryRow>
                {attendance.length === 0 ? (
                  <MutedText>아직 출석 기록이 없습니다.</MutedText>
                ) : (
                  <AttendanceList>
                    {attendance.map((a, i) => (
                      <AttendanceItem key={`${a.date}-${i}`}>
                        <span>{formatDate(a.date)}</span>
                        <span>
                          <StatusBadge
                            $color={
                              ATTENDANCE_STATUS[a.attendanceStatus]?.color
                            }
                          >
                            {ATTENDANCE_STATUS[a.attendanceStatus]?.label ??
                              "-"}
                          </StatusBadge>
                          {formatTime(a.attendanceTime) && (
                            <MutedText>{formatTime(a.attendanceTime)}</MutedText>
                          )}
                        </span>
                      </AttendanceItem>
                    ))}
                  </AttendanceList>
                )}
              </>
            )}
          </AttendanceSection>
        </MypageContainer>
      </PageContainer>
    </>
  );
}
