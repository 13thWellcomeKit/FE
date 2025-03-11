import React, { useState } from "react";  // useState import 추가
import Header from "../components/Header";
import CheckBoard from "../components/Board";
import styled from "styled-components";
import { QRCodeSVG } from 'qrcode.react'; 
import { IoMdClose } from "react-icons/io";


const PageContainer = styled.div`
    width : 100%;
    height : 59.38rem;
    padding : 2.25rem 3.44rem;
    display: flex;
    flex-direction: row;
    background: var(--Bold-Black, #1C1B1A);
    box-sizing: border-box;
    gap: 10.69rem;
`

const TextContainer = styled.div`
    display: flex;
    width: 32.8125rem;
    height : 18.12rem;
    flex-direction: column;
    margin-top : 12.25rem;
    gap : 2.5rem;
`

const ButtonContainer = styled.div`
    width : 26.75rem;
    height: 3.25rem;
    gap : 2rem;
    display: flex;
    flex-direction: row;
`

const TitleText = styled.h1`
    font-family: Montserrat;
    font-size: 4rem;
    font-style: normal;
    font-weight: 700;
    line-height: 140%; /* 5.6rem */
    letter-spacing: -0.1rem;
    color: #FFFF;
    margin: 0;
`

const MiddleText = styled.h1`
    font-family: Pretendard;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 2.1rem */
    letter-spacing: -0.0375rem;
    color: #FFFF;
    margin: 0;
`

const QrButton = styled.div`
    display: flex;
    width: 12.375rem;
    height: 3.25rem;
    justify-content: center;
    align-items: center;
    background-color: #FFFF;
    border-radius: 3.125rem;
    font-family: Pretendard;
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 500;
    line-height: 140%; /* 1.575rem */
    letter-spacing: -0.02813rem;
    color : #FF7710;
    cursor: pointer;
`

const QRModal = styled.div`
    display: flex;
    flex-direction: column;
    width: 35.9375rem;
    height: 35.9375rem;
    padding: 1.125rem 1rem;
    justify-content: center;
    align-items: center;
    background-color: #FFFF;
    position: fixed;  
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;  
    border-radius: 1rem;
`

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);  
    z-index: 999;  
`

const Close = styled(IoMdClose)`
    margin-left: auto;
    cursor: pointer;
`

export default function Check() {
    const [isModalOpen, setIsModalOpen] = useState(false);  

    const openModal = () => setIsModalOpen(true);  
    const closeModal = () => setIsModalOpen(false);  

    return (
        <>
            <Header />
            <PageContainer>
                <TextContainer>
                    <TitleText>QR 출석체크</TitleText>
                    <MiddleText>
                        QR코드로 출석체크를 진행해주세요.<br/>
                        출석체크는 모바일에서만 가능합니다.
                    </MiddleText>
                    <ButtonContainer>
                        <QrButton onClick={openModal}>QR 체크 진행</QrButton>
                        <QrButton>출석부 최신화</QrButton>
                    </ButtonContainer>
                </TextContainer>
                <CheckBoard />
            </PageContainer>

            {isModalOpen && (
                <>
                    <ModalOverlay onClick={closeModal} />
                    <QRModal>
                        <Close onClick={closeModal} size = {24}/>
                        <QRCodeSVG value="https://github.com/orgs/13thWellcomeKit/repositories" size={530} />
                    </QRModal>
                </>
            )}
        </>
    );
}
