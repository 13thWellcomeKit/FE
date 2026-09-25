import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { BsInstagram } from "react-icons/bs";
import { SiVelog } from "react-icons/si";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Page, PageHead } from "../components/ui";
import { bp, color, radius, size } from "../theme";

import introduce1 from "../image/introduce1.png";
import Logo from "../image/LIKELION UNIV._white@3x.png";
import Together from "../image/IMG_9678 1.png";
import Image1 from "../image/image 12.png";
import Image2 from "../image/image 13.png";
import Image3 from "../image/image 14.png";
import Image4 from "../image/image 15.png";
import Image5 from "../image/image 16.png";
import Image6 from "../image/image 17.png";
import Image7 from "../image/image 18.png";
import Image8 from "../image/image 19.png";
import Image9 from "../image/image 20.png";
import Image10 from "../image/image 21.png";
import Image11 from "../image/image 22.png";
import Image12 from "../image/image 11.png";
import Image13 from "../image/image 24.png";
import Image14 from "../image/image 25.png";

const CAROUSEL_IMAGES = [Image9, Image10, Image11];
const SCROLL_IMAGES = [Image1, Image2, Image3, Image4, Image5, Image6, Image7, Image8];

const Intro = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 3rem;
  align-items: center;
  margin-bottom: 5rem;

  @media (max-width: ${bp.laptop}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const Body = styled.p`
  max-width: 38rem;
  font-size: ${size.lg};
  line-height: 1.75;
  color: #d9d3cb;

  @media (max-width: ${bp.tablet}) {
    font-size: ${size.md};
  }
`;

const Figure = styled.img`
  display: block;
  width: 100%;
  height: auto;
  border-radius: ${radius.panel};
  background: ${color.surface};
`;

const Statement = styled.p`
  max-width: 44rem;
  margin: 0 0 3rem;
  font-size: ${size.x2};
  font-weight: 700;
  line-height: 1.35;

  @media (max-width: ${bp.tablet}) {
    font-size: ${size.xl};
  }
`;

const Points = styled.ol`
  list-style: none;
  margin: 0 0 5rem;
  padding: 0;
  counter-reset: point;
`;

const Point = styled.li`
  counter-increment: point;
  display: grid;
  grid-template-columns: 4.5rem minmax(0, 1fr);
  gap: 0 1.5rem;
  padding: 2.5rem 0;
  border-top: 1px solid ${color.line};

  &::before {
    content: counter(point);
    font-family: "Montserrat", sans-serif;
    font-weight: 800;
    font-size: ${size.x3};
    line-height: 1;
    color: ${color.brand};
  }

  & > div {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    min-width: 0;
  }

  h2 {
    font-size: ${size.xl};
    line-height: 1.35;
  }

  @media (max-width: ${bp.tablet}) {
    grid-template-columns: 2.5rem minmax(0, 1fr);
    gap: 0 1rem;

    &::before {
      font-size: ${size.x2};
    }
  }
`;

const Tracks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  span {
    padding: 0.5rem 1rem;
    border-radius: ${radius.pill};
    border: 1px solid ${color.line};
    font-weight: 600;
  }
`;

const Note = styled.p`
  color: ${color.muted};
  font-size: ${size.sm};
`;

const marquee = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const Marquee = styled.div`
  overflow: hidden;
  border-radius: ${radius.control};
  background: #ffffff;
  padding: 1rem 0;

  div {
    display: flex;
    gap: 2.5rem;
    width: max-content;
    animation: ${marquee} 40s linear infinite;
  }
  img {
    height: 2.5rem;
    width: auto;
  }
  &:hover div {
    animation-play-state: paused;
  }
`;

const Carousel = styled.div`
  position: relative;

  button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 2.75rem;
    height: 2.75rem;
    display: grid;
    place-items: center;
    border-radius: 50%;
    border: none;
    background: rgba(28, 27, 26, 0.8);
    color: ${color.text};
    font-size: 1.4rem;
    cursor: pointer;
  }
  button:first-of-type {
    left: 0.75rem;
  }
  button:last-of-type {
    right: 0.75rem;
  }
`;

const Dots = styled.p`
  margin-top: 0.75rem;
  text-align: center;
  color: ${color.muted};
  font-size: ${size.sm};
  font-variant-numeric: tabular-nums;
`;

const Activity = styled.article`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 2.5rem;
  align-items: center;
  margin-bottom: 3rem;

  h3 {
    font-size: ${size.xl};
    margin-bottom: 0.75rem;
  }
  p {
    color: #d9d3cb;
    line-height: 1.75;
  }

  @media (max-width: ${bp.laptop}) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const Closing = styled.section`
  margin-top: 5rem;
  padding-top: 3rem;
  border-top: 1px solid ${color.line};
`;

const Socials = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.9rem 1.4rem;
    border-radius: ${radius.pill};
    border: 1px solid ${color.line};
    color: ${color.text};
    text-decoration: none;
    font-weight: 600;
  }
  a:hover {
    border-color: ${color.brand};
  }
  svg {
    color: ${color.brand};
    font-size: 1.25rem;
  }
`;

export default function Introduce() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? CAROUSEL_IMAGES.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === CAROUSEL_IMAGES.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <Page>
      <PageHead title="About us" display />

      <Intro>
        <Body>
          2013년, 서울대학교에서 이두희 대표를 필두로 시작된 '멋쟁이사자처럼
          대학'. 현재는 국내외 121개 대학, 4천여 명이 활동하는 국내 최대 규모의
          IT 창업 동아리로 자리매김하였습니다. "내 아이디어를 내 손으로
          실현한다"는 모토로, 누구든지 자신이 원하는 IT 서비스를 구현할 수 있도록
          각종 스터디와 네트워킹, 행사를 지원하고 있습니다.
        </Body>
        <Figure src={introduce1} alt="멋쟁이사자처럼 활동 사진" />
      </Intro>

      <Statement>
        멋쟁이사자처럼 대학은 13기를 맞이해, 보다 전문적인 IT 창업 동아리로
        새롭게 시작합니다.
      </Statement>

      <Points>
        <Point>
          <div>
            <h2>개발 트랙을 3가지로 나누어 진행합니다.</h2>
            <Tracks>
              <span>FE (프론트엔드)</span>
              <span>BE (백엔드)</span>
              <span>FE or BE (공통)</span>
            </Tracks>
            <Note>공통 트랙은 5주차 이후 FE와 BE 중 하나를 선택합니다.</Note>
          </div>
        </Point>

        <Point>
          <div>
            <h2>2024년보다 더욱 강화된 교육을 제공합니다.</h2>
            <Body>
              멋쟁이사자처럼 대학 교육 플랫폼 TECHIT 강좌를 무상 제공합니다.
              활동 중에는 선택한 트랙이 아니어도 모든 강의를 수강할 수 있습니다.
            </Body>
            <img src={Logo} alt="LIKELION UNIV." style={{ width: "min(100%, 18rem)" }} />
          </div>
        </Point>

        <Point>
          <div>
            <h2>각종 해커톤으로 코딩 실력을 키울 수 있습니다.</h2>
            <Body>
              중앙아이디어톤(5월), 중앙해커톤(8월)을 비롯한 각종 연합해커톤에서
              여러 사람과 교류하며 실력을 키웁니다.
            </Body>
            <Figure src={Together} alt="해커톤 단체 사진" />
            <Marquee aria-label="함께한 학교와 단체">
              <div>
                {[...SCROLL_IMAGES, ...SCROLL_IMAGES].map((src, i) => (
                  <img key={i} src={src} alt="" />
                ))}
              </div>
            </Marquee>
          </div>
        </Point>

        <Point>
          <div>
            <h2>개발 경험이 많은 운영진이 직접 세션을 진행합니다.</h2>
            <Body>
              운영진 8명이 각 팀 프로젝트의 팀장을 맡고 세션도 직접 준비합니다.
            </Body>
            <Carousel>
              <Figure
                src={CAROUSEL_IMAGES[currentIndex]}
                alt={`세션 사진 ${currentIndex + 1}`}
              />
              <button onClick={goToPrevious} aria-label="이전 사진">
                <IoIosArrowBack />
              </button>
              <button onClick={goToNext} aria-label="다음 사진">
                <IoIosArrowForward />
              </button>
            </Carousel>
            <Dots>
              {currentIndex + 1} / {CAROUSEL_IMAGES.length}
            </Dots>
          </div>
        </Point>

        <Point>
          <div>
            <h2>2학기에는 트랙이 추가됩니다.</h2>
            <Body>추가 트랙을 선택해 다양한 교육 프로그램을 이수할 수 있습니다.</Body>
            <Figure src={Image12} alt="2학기 추가 트랙 안내" />
          </div>
        </Point>
      </Points>

      <Statement>한국외대(글로벌) 멋사는 이런 활동도 합니다.</Statement>

      <Activity>
        <Figure src={Image13} alt="풍생고 교육봉사" />
        <div>
          <h3>풍생고 교육봉사</h3>
          <p>
            풍생고 학생들에게 코딩 멘토링을 합니다. 프론트엔드와 백엔드로 나누어
            스터디를 운영하거나 함께 프로젝트를 합니다. 봉사활동 시간이
            인정되고 소정의 강사비도 지급됩니다.
          </p>
        </div>
      </Activity>

      <Activity>
        <Figure src={Image14} alt="멋쟁이사자처럼 대학 연합해커톤" />
        <div>
          <h3>멋쟁이사자처럼 대학 연합해커톤</h3>
          <p>
            멋사 대학에 속한 여러 학교와 함께 해커톤을 엽니다. IT에 관심 있는
            학생끼리 아이디어와 경험을 나누는 네트워킹 자리입니다.
          </p>
        </div>
      </Activity>

      <Closing>
        <Statement style={{ marginBottom: 0 }}>
          13기 아기사자 여러분, 1년 동안 열정적으로 참여해 꼭 수료하시길 바랍니다!
        </Statement>
        <Socials>
          <a href="https://www.instagram.com/hufsglobal_likelion/" target="_blank" rel="noreferrer">
            <BsInstagram /> 인스타그램
          </a>
          <a href="https://velog.io/@hufsglobal09/posts" target="_blank" rel="noreferrer">
            <SiVelog /> 벨로그
          </a>
        </Socials>
      </Closing>
    </Page>
  );
}
