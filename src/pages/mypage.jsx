import Header from "../components/Header"
import styled from "styled-components"
import { useState } from "react"


const PageContainer = styled.div`
    width : 100%;
    height : 59.38rem;
    padding : 2.25rem 3.44rem;
    display: flex;
    flex-direction: row;
    background: var(--Bold-Black, #1C1B1A);
    box-sizing: border-box;
    gap: 10.69rem;
    overflow: hidden;
`

const MypageContainer = styled.div`
    display: flex;
    width: 85.5rem;
    height: 47.56rem;
    padding: 3.75rem 2.25rem;
    flex-direction: column;
    border-radius: 1.25rem;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.19);
    backdrop-filter: blur(10px);
`

const MypageHeader = styled.div`
    display: flex;
    width: 81rem;
    height: 5.56rem;
    flex-direction: row;
    margin-bottom: 2rem;
`

const MypageBody = styled.div`
    display: flex;
    width : 81rem;
    height : 32.44rem;
    flex-direction: row;
`

const TextBody = styled.div`
    display: flex;
    flex-direction : column;
    width : 39.75rem;
    height : 29.25rem;
    margin-left: 8.81rem;
`

const ImgBody = styled.div`
    width: 32.4375rem;
    height: 32.4375rem;
    background-color: yellow;
`

const HeaderText = styled.h1`
    width : 51.63rem;
    margin : 0%;
    color : #FFFF;
    font-family: Montserrat;
    font-size: 4rem;
    font-style: normal;
    font-weight: 700;
    line-height: 140%; /* 5.6rem */
    letter-spacing: -0.1rem;
`

const MypageButton = styled.div`
    display: flex;
    box-sizing: border-box;
    width : 13rem;
    height: 3.25rem;
    padding: 0.75rem;
    justify-content: center;
    align-items: center;
    border-radius: 3.125rem;
    background-color: #FFFF;
    margin : 1.19rem 0rem;
    margin-left: 2rem;
    color : #FF7710;
    font-family: Pretendard;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 1.75rem */
    letter-spacing: -0.03125rem;

    &:hover {
    background-color: #FF7710;
    color : #FFFF;
  }
`

const MypageText = styled.h1`
    font-family: Pretendard;
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 500;
    line-height: 140%; /* 1.575rem */
    letter-spacing: -0.02813rem;
    color : #FFFF;
    margin : 0;
`

const MypageBox =styled.div`
    display: flex;
    height: 3.25rem;
    padding: 0.75rem 2rem;
    align-items: center;
    border-radius: 3.125rem;
    box-sizing: border-box;
    margin-top: 1rem;
    margin-bottom: 1rem;
    background-color: rgba(255, 255, 255, 0.19);
    border-color: rgba(255, 255, 255, 0.19);
    color : #FFFF;

    
`


export default function MyPage(){

    const mockdata = {
        id : 1,
        user_name : "김민석",
        student_num : 202100597,
        team_id : "1팀",
        user_type : "FE"
    }

    return(
        <>
            <Header></Header>
            <PageContainer>
                <MypageContainer>
                    <MypageHeader>
                        <HeaderText>MY Page</HeaderText>
                        <MypageButton>프로필 이미지 등록</MypageButton>
                        <MypageButton>비밀번호 변경</MypageButton>
                    </MypageHeader>
                    <MypageBody>
                        <ImgBody></ImgBody>
                        <TextBody>
                            <MypageText>이름</MypageText>
                            <MypageBox>{mockdata.user_name}</MypageBox>
                            <MypageText>학번</MypageText>
                            <MypageBox>{mockdata.student_num}</MypageBox>
                            <MypageText>소속팀</MypageText>
                            <MypageBox>{mockdata.team_id}</MypageBox>
                            <MypageText>개발트랙</MypageText>
                            <MypageBox>{mockdata.user_type}</MypageBox>
                        </TextBody>
                    </MypageBody>
                </MypageContainer>
            </PageContainer>
        </>
        
    )
}