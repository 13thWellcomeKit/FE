import React, { useState, useEffect } from "react";
import styled from "styled-components";
import bingoImage from "../svg/bingo.svg";
import axiosInstance from "../axiosInstance";
import { Muted, Page, PageHead, Panel } from "../components/ui";
import { bp, color, radius, size } from "../theme";

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 19rem);
  gap: 1.5rem;
  align-items: start;

  @media (max-width: ${bp.laptop}) {
    grid-template-columns: 1fr;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$cols}, minmax(0, 1fr));
  gap: 0.5rem;
  max-width: 40rem;
`;

const Cell = styled.button`
  position: relative;
  aspect-ratio: 1;
  padding: 0;
  border: none;
  background: none;
  perspective: 800px;
  cursor: ${(p) => (p.$revealed ? "default" : "pointer")};
`;

const Flip = styled.div`
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
  transform: ${(p) => (p.$revealed ? "rotateY(180deg)" : "none")};
`;

const Face = styled.div`
  position: absolute;
  inset: 0;
  border-radius: ${radius.control};
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  overflow: hidden;
`;

const Back = styled(Face)`
  background: ${color.raised};
  border: 1px solid ${color.line};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  ${Cell}:hover:not(:disabled) & {
    border-color: ${color.brand};
  }
`;

const Front = styled(Face)`
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem;
  text-align: center;
  font-size: ${size.sm};
  font-weight: 700;
  line-height: 1.35;
  background: ${(p) => (p.$complete ? color.brand : color.surface)};
  color: ${(p) => (p.$complete ? color.ink : color.text)};
  border: 1.5px ${(p) => (p.$complete ? "solid" : "dashed")}
    ${(p) => (p.$complete ? color.brand : color.muted)};

  @media (max-width: ${bp.mobile}) {
    font-size: 0.72rem;
  }
`;

const Badge = styled.span`
  padding: 0.1rem 0.5rem;
  border-radius: ${radius.pill};
  background: ${color.raised};
  color: ${color.muted};
  font-size: 0.7rem;
  font-weight: 600;
`;

const Rules = styled.ol`
  margin: 0;
  padding-left: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: ${color.muted};

  strong {
    color: ${color.text};
  }
`;

const Legend = styled.ul`
  list-style: none;
  margin: 1.5rem 0 0;
  padding: 1.25rem 0 0;
  border-top: 1px solid ${color.line};
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  font-size: ${size.sm};

  li {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  i {
    width: 1rem;
    height: 1rem;
    border-radius: 4px;
    display: inline-block;
  }
`;

export default function Bingo() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // 열렸지만 승인 전인 칸이 있으면 새 칸을 열 수 없다(서버 규칙과 같음).
  const pending = missions.some((m) => m.isRevealed && !m.isComplete);

  useEffect(() => {
    const fetchBingoData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/bingo");

        console.log("서버 응답 데이터:", response.data);

        const missionData = Array.isArray(response.data)
          ? response.data
          : response.data.missions || [];

        setMissions(missionData);
      } catch (error) {
        console.error("미션 데이터를 가져오는 데 실패했습니다:", error);
        setError("데이터를 불러오는데 실패했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchBingoData();
  }, []);

  const handleCardClick = async (index) => {
    if (isProcessing) {
      alert("처리 중입니다. 잠시만 기다려주세요.");
      return;
    }

    if (pending) {
      alert("열린 미션이 승인되면 다음 칸을 열 수 있습니다.");
      return;
    }

    if (missions[index]?.isRevealed) {
      return;
    }

    setIsProcessing(true);

    try {
      const response = await axiosInstance.put(
        `/bingo/reveal/${missions[index].id}`
      );
      console.log("빙고 승인 응답:", response.data);

      if (response.status === 200) {
        setMissions((prevMissions) =>
          prevMissions.map((mission, i) =>
            i === index
              ? { ...mission, isFlipping: true, content: response.data }
              : mission
          )
        );

        setTimeout(() => {
          setMissions((prevMissions) =>
            prevMissions.map((mission, i) =>
              i === index
                ? { ...mission, isRevealed: true, isFlipping: false }
                : mission
            )
          );
        }, 1000);
      }
    } catch (error) {
      console.error("빙고 승인이 실패했습니다:", error);
      alert("칸을 열지 못했습니다. 승인 대기 중인 미션이 없는지 확인해주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  const cols = Math.max(3, Math.round(Math.sqrt(missions.length)) || 3);

  return (
    <Page>
      <PageHead
        title="Let's Bingo"
        display
        description="팀원과 미션을 하나씩 열고 완료해서 빙고를 만드세요. 가장 먼저 빙고를 완성한 팀에게 상품이 있습니다."
      />
      <Layout>
        <div>
          {loading ? (
            <Muted>빙고판을 불러오는 중…</Muted>
          ) : error ? (
            <Muted>빙고판을 불러오지 못했습니다. 팀 배정이 끝났는지 운영진에게 확인해주세요.</Muted>
          ) : missions.length === 0 ? (
            <Muted>아직 빙고판이 없습니다. 팀이 배정되면 여기에 빙고판이 생깁니다.</Muted>
          ) : (
            <Grid $cols={cols}>
              {missions.map((mission, index) => {
                const revealed = !!mission.isRevealed;
                const text = mission.content || mission.mission;
                return (
                  <Cell
                    key={mission.id ?? index}
                    $revealed={revealed}
                    disabled={revealed || isProcessing}
                    onClick={() => handleCardClick(index)}
                    aria-label={
                      revealed
                        ? `${text}, ${mission.isComplete ? "완료" : "승인 대기"}`
                        : `${index + 1}번 칸 열기`
                    }
                  >
                    <Flip $revealed={revealed}>
                      <Back>
                        <img src={bingoImage} alt="" />
                      </Back>
                      <Front $complete={mission.isComplete}>
                        {text}
                        {revealed && !mission.isComplete && <Badge>승인 대기</Badge>}
                      </Front>
                    </Flip>
                  </Cell>
                );
              })}
            </Grid>
          )}
        </div>

        <Panel>
          <Rules>
            <li>
              칸은 <strong>각 팀 운영진</strong>이 엽니다. 팀원과 상의해서 고르세요.
            </li>
            <li>한 번에 한 칸만 열립니다. 미션을 끝내면 운영진이 승인합니다.</li>
            <li>승인되면 칸이 채워지고 다음 칸을 열 수 있어요.</li>
          </Rules>
          <Legend>
            <li>
              <i style={{ background: color.raised, border: `1px solid ${color.line}` }} />
              아직 안 연 칸
            </li>
            <li>
              <i style={{ border: `1.5px dashed ${color.muted}` }} />
              승인 대기
            </li>
            <li>
              <i style={{ background: color.brand }} />
              완료
            </li>
          </Legend>
        </Panel>
      </Layout>
    </Page>
  );
}
