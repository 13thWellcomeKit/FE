import styled from "styled-components";
import { useState } from "react";
import axiosInstance from "../axiosInstance";
import {
  ATTENDANCE_STATUS,
  STATUS_ORDER,
  errorMessage,
  formatTime,
  statusLabel,
} from "../attendance";
import { Button, Dialog, ErrorText, Muted, Overlay, StatusDot } from "./ui";
import { color, radius, size } from "../theme";

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  color: ${color.muted};
  font-size: ${size.sm};
`;

const Toggle = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  input {
    accent-color: ${color.brand};
    width: 1rem;
    height: 1rem;
  }
`;

const Scroll = styled.div`
  max-height: 32rem;
  overflow-y: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 0.8rem 0.5rem;
    text-align: left;
    border-bottom: 1px solid ${color.line};
  }
  th {
    position: sticky;
    top: 0;
    background: ${color.surface};
    color: ${color.muted};
    font-size: ${size.sm};
    font-weight: 500;
  }
  td:last-child,
  th:last-child {
    text-align: right;
  }
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  white-space: nowrap;

  small {
    color: ${color.muted};
    font-variant-numeric: tabular-nums;
  }
`;

const EditButton = styled.button`
  padding: 0.35rem 0.85rem;
  border-radius: ${radius.pill};
  border: 1px solid ${color.line};
  background: none;
  color: ${color.text};
  font-size: ${size.sm};
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${color.brand};
    color: ${color.brand};
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Choices = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin: 1.25rem 0 1rem;
`;

const Choice = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.45rem;
  height: 3.25rem;
  border-radius: ${radius.control};
  border: 1.5px solid ${(p) => (p.$current ? color.brand : color.line)};
  background: ${(p) => (p.$current ? "rgba(255, 119, 16, 0.1)" : color.raised)};
  color: ${color.text};
  font-weight: 700;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${color.text};
  }
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
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
      setError(errorMessage(err, "상태를 바꾸지 못했습니다. 다시 시도해주세요."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Toolbar>
        <span>
          {showAll ? "전체" : "지각·결석"} {rows.length}명
        </span>
        <Toggle>
          <input
            type="checkbox"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
          />
          전체 보기
        </Toggle>
      </Toolbar>
      {rows.length === 0 ? (
        <Muted style={{ padding: "2rem 0" }}>
          {showAll ? "출석부가 비어 있습니다." : "지각·결석자가 없습니다."}
        </Muted>
      ) : (
        <Scroll>
          <Table>
            <thead>
              <tr>
                <th>팀</th>
                <th>이름</th>
                <th>상태</th>
                <th>
                  <span className="sr-only">수정</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((member, index) => (
                <tr key={member.attendanceId ?? index}>
                  <td>{member.teamName ?? "-"}</td>
                  <td>{member.name}</td>
                  <td>
                    <Status>
                      <StatusDot $color={ATTENDANCE_STATUS[member.attendanceStatus]?.color} />
                      {statusLabel(member.attendanceStatus)}
                      {formatTime(member.attendanceTime) && (
                        <small>{formatTime(member.attendanceTime)}</small>
                      )}
                    </Status>
                  </td>
                  <td>
                    <EditButton
                      // attendanceId가 없는 응답은 구버전 BE. 어느 행인지 특정할 수 없어 수정 불가.
                      disabled={member.attendanceId == null}
                      title={
                        member.attendanceId == null
                          ? "서버 업데이트 후 사용할 수 있습니다."
                          : undefined
                      }
                      onClick={() => openEditor(member)}
                    >
                      수정
                    </EditButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroll>
      )}

      {editing && (
        <Overlay onClick={closeEditor}>
          <Dialog onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: size.lg }}>{editing.name}님 출석 상태</h2>
            <Muted style={{ marginTop: "0.25rem" }}>
              {editing.teamName ? `${editing.teamName}, ` : ""}지금은{" "}
              {statusLabel(editing.attendanceStatus)}
            </Muted>
            <Choices>
              {STATUS_ORDER.map((status) => (
                <Choice
                  key={status}
                  $current={status === editing.attendanceStatus}
                  aria-pressed={status === editing.attendanceStatus}
                  disabled={saving}
                  onClick={() => changeStatus(status)}
                >
                  <StatusDot $color={ATTENDANCE_STATUS[status].color} />
                  {ATTENDANCE_STATUS[status].label}
                </Choice>
              ))}
            </Choices>
            {saving && <Muted>저장하는 중…</Muted>}
            {error && <ErrorText role="alert">{error}</ErrorText>}
            <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
              <Button $variant="ghost" onClick={closeEditor} disabled={saving}>
                취소
              </Button>
            </div>
          </Dialog>
        </Overlay>
      )}
    </div>
  );
}
