import React, { useState } from 'react';
import styled from 'styled-components';
import Header from "../components/Header";
import bingoImage from '../svg/bingo.svg';
import { BsExclamationTriangle } from 'react-icons/bs';

const PageContainer = styled.div`
    width: 100%;
    height: 59.38rem;
    padding: 2.25rem 3.44rem;
    display: flex;
    flex-direction: row;
    background: var(--Bold-Black, #1C1B1A);
    box-sizing: border-box;
    gap: 30.69rem;
    overflow: hidden;
`;

const images = [
    { id: 1, src: bingoImage, content: '미션 1' },
    { id: 2, src: bingoImage, content: '미션 2' },
    { id: 3, src: bingoImage, content: '미션 3' },
    { id: 4, src: bingoImage, content: '미션 4' },
    { id: 5, src: bingoImage, content: '미션 5' },
    { id: 6, src: bingoImage, content: '미션 6' },
    { id: 7, src: bingoImage, content: '미션 7' },
    { id: 8, src: bingoImage, content: '미션 8' },
    { id: 9, src: bingoImage, content: '미션 9' },
];

const BingoTextContainer = styled.div`
    max-width: 600px;
    margin-right: 20px;
    margin-top: 2px;
`;

const BingoTitle = styled.h1`
    color: white;
    margin: 10px 0;
    font-size: 96px;
    font-weight: bold;
    white-space: nowrap;
`;

const BingoDescription = styled.p`
    font-family: Pretendard;
    font-weight: medium;
    color: white;
    font-size: 24px;
    margin: 10px 0;
    margin-top: 40px;
    font-weight: 500;
`;

const BingoCaution = styled.h2`
    color: #FF7710;
    margin: 10px 0;
    margin-top: 40px;
    font-size: 32px;
    display: flex;
    align-items: center;
`;

const CautionIcon = styled(BsExclamationTriangle)`
    margin-right: 8px;
    font-size: 32px;
`;

const BingoFooter = styled.p`
    color: white;
    margin: 10px 0;
    margin-top: 16px;
    font-size: 20px;
    font-family: Pretendard;
    font-weight: lighter;
`;

const BingoCardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0px;
    margin-left: 700px;
    margin-top: -390px;
`;

const BingoCard = styled.div`
    width: 170px;  
    height: 158px;
    cursor: pointer;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    transform-style: preserve-3d;
    perspective: 1000px;
    transition: transform 1s ease-in-out;

    ${({ flipped }) => flipped && `
        transform: rotateY(540deg); /* 1800도 회전: 5번 회전 */
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
    font-size: 20px;
    font-weight: bold;
    outline: 1px solid #9D9D9D; /* 테두리를 내부로 */
    outline-offset: -1px; /* 내부로 밀어 넣기 */
`;


const BingoText = () => (
    <BingoTextContainer>
        <BingoTitle>Let’s Bingo</BingoTitle>
        <BingoDescription>
            여러분들의 팀과 함께 빙고를 채워보세요.<br />
            가장 먼저 빙고를 채운 팀에게는<br />
            굉장한 어메이징한 상품이 제공됩니다:)
        </BingoDescription>
        <BingoCaution>
            <CautionIcon /> CAUTION!
        </BingoCaution>
        <BingoFooter>
            빙고를 돌릴 수 있는 권한은 각 팀의 운영진에게만 있습니다.<br />
            팀원들과 잘 상의 후 결정해주시기 바랍니다.
        </BingoFooter>
    </BingoTextContainer>
);

const BingoCardComponent = ({ image, content, flipped, onClick }) => (
    <BingoCard onClick={onClick} flipped={flipped}>
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
    const [flippedCards, setFlippedCards] = useState(Array(9).fill(false));

    const handleCardClick = (index) => {
        const newFlippedCards = [...flippedCards];
        newFlippedCards[index] = !newFlippedCards[index];
        setFlippedCards(newFlippedCards);
    };

    return (
        <>
            <Header />
            <PageContainer>
                <div className="bingo-content">
                    <BingoText />
                    <BingoBoard images={images} flippedCards={flippedCards} handleCardClick={handleCardClick} />
                </div>
            </PageContainer>
        </>
    );
}

