import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import CheckBoard from "../components/Board";
import axiosInstance from "../axiosInstance";
import breakpoints from "../components/Breakpoints";
import { useAuth } from "../AuthContext";
import {
  ATTENDANCE_STATUS,
  STATUS_ORDER,
  errorMessage,
  formatDate,
} from "../attendance";

// 이 횟수 이상 결석하면 표에서 강조한다. 수료 기준이 정해지면 맞춰 바꿀 것.
const ABSENT_WARNING = 3;

const Page = styled.div`
  min-height: 100vh;
  background: #1c1b1a;
  color: #ffffff;
  font-family: Pretendard;
  padding: 2.25rem 3.44rem;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 1.5rem 1rem;
  }
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  margin: 0;
  font-family: Montserrat;
  font-size: 2.5rem;
  font-weight: 700;
`;

const PillButton = styled.button`
  padding: 0.6rem 1.5rem;
  border-radius: 3.125rem;
  border: none;
  background: #ffffff;
  color: #ff7710;
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #ff7710;
    color: #ffffff;
  }
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const Tiles = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Tile = styled.div`
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.08);
`;

const TileLabel = styled.div`
  color: #9d9d9d;
  font-size: 0.95rem;
`;

const TileValue = styled.div`
  font-size: 2.25rem;
  font-weight: 700;
  margin-top: 0.25rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0 0 1rem;
`;

const SessionStrip = styled.div`
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 2rem;
`;

const SessionCard = styled.button`
  flex: 0 0 auto;
  min-width: 11rem;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  border: 2px solid ${(p) => (p.$selected ? "#ff7710" : "transparent")};
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-family: Pretendard;
  text-align: left;
  cursor: pointer;
`;

const SessionDate = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const StatusLine = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: #e6e6e6;
`;

const Dot = styled.span`
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: ${(p) => p.$color};
`;

const DetailWrap = styled.div`
  margin-bottom: 2.5rem;
`;

const TableTools = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.75rem;
  color: #9d9d9d;

  select {
    font-family: Pretendard;
    padding: 0.3rem 0.5rem;
  }
`;

const TableScroll = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 40rem;

  th,
  td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }
  th {
    color: #9d9d9d;
    font-weight: 500;
  }
  td.num {
    font-variant-numeric: tabular-nums;
  }
`;

const Row = styled.tr`
  background: ${(p) => (p.$warn ? "rgba(208, 59, 59, 0.15)" : "transparent")};
`;

const WarnBadge = styled.span`
  margin-left: 0.5rem;
  padding: 0.1rem 0.5rem;
  border-radius: 0.5rem;
  background: #d03b3b;
  color: #ffffff;
  font-size: 0.8rem;
`;

const Meter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const MeterTrack = styled.div`
  width: 5rem;
  height: 0.35rem;
  border-radius: 0.2rem;
  background: rgba(255, 119, 16, 0.2);
  overflow: hidden;

  div {
    height: 100%;
    background: #ff7710;
  }
`;

const Notice = styled.p`
  color: #9d9d9d;
`;

const formatRate = (rate) =>
  rate == null ? "-" : `${(rate * 100).toFixed(1)}%`;

const SORTS = {
  team: { label: "팀순", fn: () => 0 },
  absent: { label: "결석 많은 순", fn: (a, b) => b.absent - a.absent },
  rate: {
    label: "출석률 낮은 순",
    fn: (a, b) => (a.rate ?? 2) - (b.rate ?? 2),
  },
};

function downloadCsv(members) {
  const header = ["팀", "이름", "파트", "출석", "지각", "결석", "출석률(%)"];
  const lines = members.map((m) => [
    m.teamName ?? "",
    m.userName,
    m.devPart ?? "",
    m.present,
    m.late,
    m.absent,
    m.rate == null ? "" : (m.rate * 100).toFixed(1),
  ]);
  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [header, ...lines].map((r) => r.map(escape).join(",")).join("\r\n");
  // BOM이 없으면 엑셀이 한글을 깨뜨린다.
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  a.href = url;
  a.download = `출석통계_${today}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminAttendance() {
  const { isLoggedIn, userType } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [sortKey, setSortKey] = useState("team");

  const isAdmin = userType === "ADMIN";

  const fetchStats = async () => {
    try {
      const [s, m] = await Promise.all([
        axiosInstance.get("/attendance/sessions"),
        axiosInstance.get("/attendance/summary"),
      ]);
      setSessions(s.data || []);
      setMembers(m.data || []);
      setError("");
    } catch (err) {
      console.error("출석 통계 조회 실패:", err);
      setError(errorMessage(err, "출석 통계를 불러오지 못했습니다."));
    }
  };

  const fetchDetail = async (sessionId) => {
    try {
      const res = await axiosInstance.get(`/attendance/sessions/${sessionId}`);
      setDetail(res.data || []);
    } catch (err) {
      console.error("세션 출석부 조회 실패:", err);
      setError(errorMessage(err, "세션 출석부를 불러오지 못했습니다."));
    }
  };

  useEffect(() => {
    if (isAdmin) fetchStats();
  }, [isAdmin]);

  const selectSession = (id) => {
    setSelectedId(id);
    setDetail(null);
    fetchDetail(id);
  };

  // 과거 세션을 정정하면 카드 숫자와 누적 통계도 같이 바뀐다.
  const handleDetailUpdated = () => {
    fetchDetail(selectedId);
    fetchStats();
  };

  const sortedMembers = useMemo(
    () => [...members].sort(SORTS[sortKey].fn),
    [members, sortKey]
  );

  const rated = members.filter((m) => m.rate != null);
  const averageRate =
    rated.length === 0
      ? null
      : rated.reduce((sum, m) => sum + m.rate, 0) / rated.length;
  const warnCount = members.filter((m) => m.absent >= ABSENT_WARNING).length;

  if (!isLoggedIn || userType === null || (userType && !isAdmin)) {
    return (
      <>
        <Header />
        <Page>
          <Notice>
            {isLoggedIn
              ? "운영진만 접근할 수 있습니다."
              : "로그인이 필요합니다."}
          </Notice>
        </Page>
      </>
    );
  }
  if (userType === undefined) {
    return (
      <>
        <Header />
        <Page>
          <Notice>불러오는 중…</Notice>
        </Page>
      </>
    );
  }

  return (
    <>
      <Header />
      <Page>
        <TitleRow>
          <Title>출석 통계</Title>
          <PillButton
            onClick={() => downloadCsv(sortedMembers)}
            disabled={members.length === 0}
          >
            CSV 내보내기
          </PillButton>
        </TitleRow>
        {error && <Notice>{error}</Notice>}

        <Tiles>
          <Tile>
            <TileLabel>진행한 세션</TileLabel>
            <TileValue>{sessions.length}회</TileValue>
          </Tile>
          <Tile>
            <TileLabel>부원 평균 출석률 (지각 0.5회)</TileLabel>
            <TileValue>{formatRate(averageRate)}</TileValue>
          </Tile>
          <Tile>
            <TileLabel>결석 {ABSENT_WARNING}회 이상</TileLabel>
            <TileValue>{warnCount}명</TileValue>
          </Tile>
        </Tiles>

        <SectionTitle>세션별 현황</SectionTitle>
        {sessions.length === 0 ? (
          <Notice>아직 진행한 세션이 없습니다.</Notice>
        ) : (
          <SessionStrip>
            {sessions.map((s) => (
              <SessionCard
                key={s.sessionId}
                $selected={s.sessionId === selectedId}
                onClick={() => selectSession(s.sessionId)}
              >
                <SessionDate>{formatDate(s.sessionDate)}</SessionDate>
                {STATUS_ORDER.map((status) => (
                  <StatusLine key={status}>
                    <Dot $color={ATTENDANCE_STATUS[status].color} />
                    {ATTENDANCE_STATUS[status].label}{" "}
                    {
                      s[
                        { PRESENT: "presentCount", LATE: "lateCount", ABSENT: "absentCount" }[status]
                      ]
                    }
                  </StatusLine>
                ))}
              </SessionCard>
            ))}
          </SessionStrip>
        )}

        {selectedId && (
          <DetailWrap>
            <SectionTitle>
              {formatDate(
                sessions.find((s) => s.sessionId === selectedId)?.sessionDate
              )}{" "}
              출석부
            </SectionTitle>
            {detail ? (
              <CheckBoard memberdata={detail} onUpdated={handleDetailUpdated} />
            ) : (
              <Notice>불러오는 중…</Notice>
            )}
          </DetailWrap>
        )}

        <SectionTitle>부원별 누적</SectionTitle>
        <TableTools>
          정렬
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            {Object.entries(SORTS).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </TableTools>
        <TableScroll>
          <Table>
            <thead>
              <tr>
                <th>팀</th>
                <th>이름</th>
                <th>파트</th>
                <th>출석</th>
                <th>지각</th>
                <th>결석</th>
                <th>출석률</th>
              </tr>
            </thead>
            <tbody>
              {sortedMembers.map((m) => {
                const warn = m.absent >= ABSENT_WARNING;
                return (
                  <Row key={m.userId} $warn={warn}>
                    <td>{m.teamName ?? "-"}</td>
                    <td>
                      {m.userName}
                      {warn && <WarnBadge>결석 {ABSENT_WARNING}회+</WarnBadge>}
                    </td>
                    <td>{m.devPart === "FRONT_END" ? "FE" : m.devPart === "BACK_END" ? "BE" : "-"}</td>
                    <td className="num">{m.present}</td>
                    <td className="num">{m.late}</td>
                    <td className="num">{m.absent}</td>
                    <td className="num">
                      <Meter>
                        <MeterTrack>
                          <div style={{ width: `${(m.rate ?? 0) * 100}%` }} />
                        </MeterTrack>
                        {formatRate(m.rate)}
                      </Meter>
                    </td>
                  </Row>
                );
              })}
            </tbody>
          </Table>
        </TableScroll>
      </Page>
    </>
  );
}
