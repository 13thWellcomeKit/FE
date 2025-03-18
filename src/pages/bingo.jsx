import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import bingoImage from "../svg/bingo.svg";
import { BsExclamationTriangle } from "react-icons/bs";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../AuthContext";
import { Cookies } from "react-cookie";

const PageContainer = styled.div`
  width: 100%;
  height: 59.38rem;
  padding: 2.25rem 3.44rem;
  display: flex;
  flex-direction: row;
  background: var(--Bold-Black, #1c1b1a);
  box-sizing: border-box;
  gap: 10.69rem;
`;

const BingoTextContainer = styled.div`
  max-width: 37.5rem;
  margin-right: 1.25rem;
  margin-top: 0.125rem;
`;

const BingoTitle = styled.h1`
  color: white;
  margin: 0.625rem 0;
  font-size: 6rem;
  font-weight: bold;
  white-space: nowrap;
`;

const BingoDescription = styled.p`
  font-family: Pretendard;
  font-weight: medium;
  color: white;
  font-size: 1.5rem;
  margin: 0.625rem 0;
  margin-top: 2.5rem;
  font-weight: 500;
`;

const BingoCaution = styled.h2`
  color: #ff7710;
  margin: 0.625rem 0;
  margin-top: 2.5rem;
  font-size: 2rem;
  display: flex;
  align-items: center;
`;

const CautionIcon = styled(BsExclamationTriangle)`
  margin-right: 0.5rem;
  font-size: 2rem;
`;

const BingoFooter = styled.p`
  color: white;
  margin: 0.625rem 0;
  margin-top: 1rem;
  font-size: 1.25rem;
  font-family: Pretendard;
  font-weight: lighter;
`;

const BingoCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  margin-left: 43.75rem;
  margin-top: -24.375rem;
`;

const BingoCard = styled.div`
  width: 10.625rem;
  height: 9.875rem;
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: transform 1s ease-in-out;

  ${({ flipped }) =>
    flipped &&
    `
        transform: rotateY(540deg);
    `}
`;

const BingoImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
`;

const CardContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  transform: rotateY(180deg);
  backface-visibility: hidden;
  font-size: 1.25rem;
  font-weight: bold;
  outline: 1px solid #9d9d9d;
  outline-offset: -1px;
`;

const BingoText = () => (
  <BingoTextContainer>
    <BingoTitle>Let’s Bingo</BingoTitle>
    <BingoDescription>
      여러분들의 팀과 함께 빙고를 채워보세요.
      <br />
      가장 먼저 빙고를 채운 팀에게는
      <br />
      굉장한 어메이징한 상품이 제공됩니다:)
    </BingoDescription>
    <BingoCaution>
      <CautionIcon /> CAUTION!
    </BingoCaution>
    <BingoFooter>
      빙고를 돌릴 수 있는 권한은 각 팀의 운영진에게만 있습니다.
      <br />
      팀원들과 잘 상의 후 결정해주시기 바랍니다.
    </BingoFooter>
  </BingoTextContainer>
);

const BingoCardComponent = ({ image, content, flipped, onClick }) => (
  <BingoCard onClick={onClick} flipped={flipped ? true : undefined}>
    {" "}
    {/* flipped 값이 true일 때만 설정 */}
    <BingoImage src={image} alt={`Bingo ${content}`} />
    <CardContent>{content}</CardContent>
  </BingoCard>
);

const BingoBoard = ({ images, flippedCards, handleCardClick }) => (
  <BingoCardContainer>
    {images.map((image, index) => (
      <BingoCardComponent
        key={image.id}
        image={image.src}
        content={image.content}
        flipped={flippedCards[index]}
        onClick={() => handleCardClick(index)}
      />
    ))}
  </BingoCardContainer>
);

export default function Bingo() {
  const { token } = useAuth();
  const [flippedCards, setFlippedCards] = useState(Array(9).fill(false));
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBingoData = async () => {
      const cookies = new Cookies();
      const storedToken = cookies.get("accessToken"); // ✅ 쿠키에서 다시 가져오기
      if (!storedToken) {
        console.warn("⚠️ 액세스 토큰이 없습니다.");
        return;
      }

      try {
        const response = await axiosInstance.get("/bingo", {
          headers: {
            Authorization: `Bearer ${storedToken}`, // ✅ 직접 추가
          },
        });

        setMissions(response.data.missions || []);
      } catch (error) {
        console.error("미션 데이터를 가져오는 데 실패했습니다:", error);
      }
    };

    fetchBingoData();
  }, []);
  const handleCardClick = (index) => {
    const newFlippedCards = [...flippedCards];
    newFlippedCards[index] = !newFlippedCards[index];
    setFlippedCards(newFlippedCards);
  };

  const images = missions.map((mission, index) => ({
    id: index + 1,
    src: bingoImage,
    content: mission.content || `미션 ${index + 1}`,
  }));

  return (
    <>
      <Header />
      <PageContainer>
        <div className="bingo-content">
          <BingoText />
          {loading ? (
            <div>로딩 중...</div>
          ) : error ? (
            <div>미션 데이터를 불러오는 중 오류가 발생했습니다.</div>
          ) : (
            <BingoBoard
              images={images}
              flippedCards={flippedCards}
              handleCardClick={handleCardClick}
            />
          )}
        </div>
      </PageContainer>
    </>
  );
}
