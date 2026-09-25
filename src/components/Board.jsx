import styled from "styled-components";
import breakpoints from "../components/Breakpoints";
import { useState } from "react";
import axiosInstance from "../axiosInstance";
import {
  ATTENDANCE_STATUS,
  STATUS_ORDER,
  errorMessage,
  formatTime,
  statusLabel,
} from "../attendance";

const BoardContainer = styled.div`
  width: 42rem;
  height: 52rem;
  display: flex;
  flex-direction: column;
  background-color: white;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  @media (max-width: ${breakpoints.laptop}) {
    display: none;
  }
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  font-family: Pretendard;
  font-size: 0.95rem;
  color: #1c1b1a;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
`;

const BoardTitle = styled.div`
  width: 100%;
  height: 4rem;
  background-color: #f4f5f6;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
`;

const TitleBox = styled.div`
  flex: 1;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 1px solid #9d9d9d;
  font-family: Pretendard;
  font-size: 1.25rem;
  font-weight: 600;
  color: black;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.9rem;
    padding: 0.5rem;
  }
`;

const BoardRow = styled.div`
  width: 100%;
  height: 4rem;
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
`;

const RowBox = styled.div`
  flex: 1;
  height: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-top: 1px solid #9d9d9d;
  border-bottom: 1px solid #9d9d9d;
  border-left: 1px solid #9d9d9d;
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 400;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 0.9rem;
    height: 3.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.8rem;
    height: 3rem;
  }
`;

const SubText = styled.span`
  font-size: 0.8rem;
  color: #6b6b6b;
`;

const FixBox = styled.div`
  flex: 1;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 1px solid #9d9d9d;
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 400;
  gap: 1rem;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 0.9rem;
    height: 3.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.8rem;
    height: 3rem;
  }
`;

const FixButton = styled.button`
  width: 5.5rem;
  height: 2.38rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ff7710;
  background: none;
  color: #ff7710;
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;

  &:disabled {
    border-color: #c4c4c4;
    color: #c4c4c4;
    cursor: not-allowed;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 4.5rem;
    height: 2rem;
    font-size: 0.9rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 4rem;
    height: 1.8rem;
    font-size: 0.8rem;
  }
`;

const EmptyText = styled.p`
  font-family: Pretendard;
  text-align: center;
  color: #6b6b6b;
  margin: 2rem 0;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Dialog = styled.div`
  width: 22rem;
  max-width: calc(100vw - 2rem);
  padding: 1.75rem 1.5rem;
  border-radius: 1rem;
  background: #ffffff;
  font-family: Pretendard;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DialogTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const DialogText = styled.p`
  margin: 0;
  color: #4a4a4a;
`;

const StatusChoices = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StatusChoice = styled.button`
  flex: 1;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  border-radius: 0.5rem;
  border: 2px solid ${(props) => (props.$current ? "#1c1b1a" : "#d9d9d9")};
  background: ${(props) => (props.$current ? "#f4f5f6" : "#ffffff")};
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: ${(props) => (props.$current ? 600 : 400)};
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`;

const Dot = styled.span`
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: ${(props) => props.$color};
`;

const CancelButton = styled.button`
  align-self: flex-end;
  background: none;
  border: none;
  color: #6b6b6b;
  font-family: Pretendard;
  font-size: 0.95rem;
  cursor: pointer;
`;

const ErrorText = styled.p`
  margin: 0;
  color: #b3261e;
  font-size: 0.9rem;
`;

export default function CheckBoard({ memberdata, onUpdated }) {
  const [showAll, setShowAll] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // 기본은 정정이 필요한 지각·결석자만. 출석 처리된 사람을 결석으로 되돌릴 때는 전체 보기.
  const rows = showAll
    ? memberdata
    : memberdata.filter(
        (member) =>
          member.attendanceStatus === "ABSENT" ||
          member.attendanceStatus === "LATE"
      );

  const openEditor = (member) => {
    setEditing(member);
    setError(null);
  };

  const closeEditor = () => {
    if (saving) return;
    setEditing(null);
    setError(null);
  };

  const changeStatus = async (status) => {
    if (status === editing.attendanceStatus) {
      closeEditor();
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await axiosInstance.patch(`/attendance/${editing.attendanceId}`, {
        status,
      });
      setEditing(null);
      onUpdated?.();
    } catch (err) {
      console.error("출석 상태 수정 실패:", err);
      setError(errorMessage(err, "출석 상태를 바꾸지 못했습니다."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <BoardContainer>
      <Toolbar>
        <span>
          {showAll ? "전체" : "지각·결석"} {rows.length}명
        </span>
        <ToggleLabel>
          <input
            type="checkbox"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
          />
          전체 보기
        </ToggleLabel>
      </Toolbar>
      <BoardTitle>
        <TitleBox>팀</TitleBox>
        <TitleBox>이름</TitleBox>
        <TitleBox>출석</TitleBox>
        <TitleBox>출석수정</TitleBox>
      </BoardTitle>
      {rows.length === 0 && <EmptyText>표시할 인원이 없습니다.</EmptyText>}
      {rows.map((member, index) => (
        <BoardRow key={member.attendanceId ?? index}>
          <RowBox>{member.teamName ?? "-"}</RowBox>
          <RowBox>{member.name}</RowBox>
          <RowBox>
            {statusLabel(member.attendanceStatus)}
            {formatTime(member.attendanceTime) && (
              <SubText>{formatTime(member.attendanceTime)}</SubText>
            )}
          </RowBox>
          <FixBox>
            <FixButton
              // attendanceId가 없는 응답은 구버전 BE. 어느 행인지 특정할 수 없어 수정 불가.
              disabled={member.attendanceId == null}
              title={
                member.attendanceId == null
                  ? "서버 업데이트 후 사용할 수 있습니다."
                  : undefined
              }
              onClick={() => openEditor(member)}
            >
              출석수정
            </FixButton>
          </FixBox>
        </BoardRow>
      ))}

      {editing && (
        <ModalOverlay onClick={closeEditor}>
          <Dialog
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <DialogTitle>출석 상태 변경</DialogTitle>
            <DialogText>
              {editing.teamName ? `${editing.teamName} · ` : ""}
              {editing.name}님의 상태를 선택하세요. 현재:{" "}
              <b>{statusLabel(editing.attendanceStatus)}</b>
            </DialogText>
            <StatusChoices>
              {STATUS_ORDER.map((status) => (
                <StatusChoice
                  key={status}
                  $current={status === editing.attendanceStatus}
                  disabled={saving}
                  onClick={() => changeStatus(status)}
                >
                  <Dot $color={ATTENDANCE_STATUS[status].color} />
                  {ATTENDANCE_STATUS[status].label}
                </StatusChoice>
              ))}
            </StatusChoices>
            {saving && <DialogText>저장 중…</DialogText>}
            {error && <ErrorText>{error}</ErrorText>}
            <CancelButton onClick={closeEditor} disabled={saving}>
              취소
            </CancelButton>
          </Dialog>
        </ModalOverlay>
      )}
    </BoardContainer>
  );
}
