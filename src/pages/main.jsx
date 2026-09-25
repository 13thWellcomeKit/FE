import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ReactComponent as MainLogo } from "../svg/mainlogo.svg";
import Header from "../components/Header";
import { Button } from "../components/ui";
import { useAuth } from "../AuthContext";
import { bp, color, font, size } from "../theme";

const Hero = styled.main`
  position: relative;
  max-width: 72rem;
  min-height: calc(100vh - 4.5rem);
  margin: 0 auto;
  padding: 4rem 3rem;
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  align-items: center;
  gap: 3rem;
  overflow: hidden;

  @media (max-width: ${bp.laptop}) {
    grid-template-columns: 1fr;
    min-height: auto;
    padding: 2.5rem 1rem 4rem;
  }
`;

const Kicker = styled.p`
  color: ${color.muted};
  font-size: ${size.lg};
  font-weight: 600;
  margin-bottom: 1.5rem;

  @media (max-width: ${bp.tablet}) {
    font-size: ${size.md};
  }
`;

// 앱에서 가장 크게 쓰는 요소. 다른 페이지는 이 크기를 쓰지 않는다.
const Slogan = styled.h1`
  font-family: ${font.display};
  font-weight: 800;
  font-size: ${size.hero};
  line-height: 0.92;
  letter-spacing: -0.035em;

  span {
    display: block;
    white-space: nowrap;
  }
  .arrow {
    color: ${color.brand};
    margin-right: 0.12em;
  }
`;

const Welcome = styled.p`
  margin-top: 2rem;
  max-width: 28rem;
  font-size: ${size.xl};
  font-weight: 600;
  line-height: 1.45;

  @media (max-width: ${bp.tablet}) {
    font-size: ${size.lg};
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2.5rem;
`;

// 로고 뒤 주황 고리는 사자 갈기를 옮긴 것
const Mark = styled.div`
  position: relative;
  justify-self: center;
  width: min(100%, 26rem);
  aspect-ratio: 1;
  display: grid;
  place-items: center;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(
      from 200deg,
      ${color.brand},
      rgba(255, 119, 16, 0) 55%,
      ${color.brand}
    );
    -webkit-mask: radial-gradient(circle, transparent 62%, #000 63%);
    mask: radial-gradient(circle, transparent 62%, #000 63%);
  }

  /* 로고는 남색 도장이라 어두운 바탕에서 묻힌다. 밝은 원판 위에 올린다. */
  &::after {
    content: "";
    position: absolute;
    inset: 13%;
    border-radius: 50%;
    background: ${color.text};
  }

  svg {
    position: relative;
    z-index: 1;
    width: 64%;
    height: auto;
  }

  @media (max-width: ${bp.laptop}) {
    grid-row: 1;
    width: min(60vw, 14rem);
    justify-self: start;
  }
`;

export default function Main() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <>
      <Header />
      <Hero>
        <div>
          <Kicker>한국외대 글로벌캠퍼스 멋쟁이사자처럼 13기</Kicker>
          <Slogan aria-label="Growl to world">
            <span>GROWL-TO</span>
            <span>
              <span className="arrow" style={{ display: "inline" }}>
                →
              </span>
              WORLD
            </span>
          </Slogan>
          <Welcome>13기 아기사자 여러분, 환영합니다.</Welcome>
          <Actions>
            <Button onClick={() => navigate("/introduce")}>멋사 알아보기</Button>
            <Button
              $variant="secondary"
              onClick={() => navigate(isLoggedIn ? "/check" : "/login")}
            >
              {isLoggedIn ? "출석하러 가기" : "로그인"}
            </Button>
          </Actions>
        </div>
        <Mark aria-hidden="true">
          <MainLogo />
        </Mark>
      </Hero>
    </>
  );
}
