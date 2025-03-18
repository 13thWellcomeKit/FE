import Header from "../components/Header";
import styled from "styled-components";
import { IoIosArrowRoundForward } from "react-icons/io";
import { ReactComponent as mainlogo } from "../svg/mainlogo.svg";
import { useNavigate } from "react-router-dom";

const breakpoints = {
  mobile: "576px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1200px",
};

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: row;
  background: var(--Bold-Black, #1c1b1a);
  box-sizing: border-box;
  gap: 3rem;
  overflow: hidden;
  justify-content: center;
  align-items: center;

  @media (max-width: ${breakpoints.laptop}) {
    flex-direction: column;
    align-items: center;
    gap: 5rem;
    text-align: center;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 40vw;
  max-width: 600px;

  @media (max-width: ${breakpoints.laptop}) {
    width: 80%;
    align-items: center;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 90%;
  }
`;

const TitleText = styled.h1`
  font-family: Montserrat;
  font-size: 6rem;
  font-weight: 700;
  line-height: 140%;
  color: #fff;
  margin-bottom: 1.5rem;

  @media (max-width: ${breakpoints.laptop}) {
    font-size: 4rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 3rem;
  }
`;

const MiddleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  @media (max-width: ${breakpoints.laptop}) {
    width: 80%;
    align-items: center;
  }
`;

const MiddleText = styled.h1`
  font-family: Pretendard;
  font-size: 2.25rem;
  font-weight: 600;
  line-height: 140%;
  color: #fff;
  margin: 0;

  @media (max-width: ${breakpoints.laptop}) {
    font-size: 1.75rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const IntroButton = styled.div`
  width: 14rem;
  height: 3.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  border: 1.5px solid #fff;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #ff7710;
    border-color: #ff7710;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 12rem;
    height: 3rem;
  }
`;

const ButtonText = styled.h1`
  font-family: Pretendard;
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.25rem;
  }
`;

const Arrow = styled(IoIosArrowRoundForward)`
  width: 1.5rem;
  height: 1.5rem;
  color: #fff;
`;

const CircleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: min(45vw, 670px);
  height: min(45vw, 670px);
  aspect-ratio: 1 / 1;

  @media (max-width: ${breakpoints.laptop}) {
    width: min(50vw, 500px);
    height: min(50vw, 500px);
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: min(60vw, 400px);
    height: min(60vw, 400px);
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: min(75vw, 300px);
    height: min(75vw, 300px);
  }
`;

const Circle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0.7;
  background: linear-gradient(
    rgba(254, 88, 38, 0.75) 0%,
    rgba(0, 0, 0, 0) 47.5%,
    #200801 100%
  );
  transform: rotate(-75deg);
`;

const MainLogo = styled(mainlogo)`
  width: 80%;
  height: auto;
  position: absolute;
`;

const TextOverlay = styled.h1`
  position: absolute;
  color: white;
  font-family: Montserrat;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -2.4%;
  font-size: clamp(2rem, 5vw, 6rem);

  @media (max-width: ${breakpoints.mobile}) {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
  }
`;

export default function Main() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <PageContainer>
        <TextContainer>
          <TitleText>WELCOME</TitleText>
          <MiddleContainer>
            <MiddleText>
              한국외대 글로벌캠퍼스
              <br />
              멋쟁이사자처럼입니다.
            </MiddleText>
            <MiddleText>13기 아기사자 여러분, 환영합니다!</MiddleText>
            <IntroButton onClick={() => navigate("/introduce")}>
              <ButtonText>멋사 알아보기</ButtonText>
              <Arrow />
            </IntroButton>
          </MiddleContainer>
        </TextContainer>
        <CircleContainer>
          <Circle />
          <MainLogo />
          <TextOverlay>
            GROWL-TO
            <br />→ WORLD
          </TextOverlay>
        </CircleContainer>
      </PageContainer>
    </>
  );
}
