import styled from "styled-components"
import { useState } from "react"

const BoardContainer = styled.div`
    width : 42rem;
    height : 52rem;
    display : flex;
    flex-direction: column;
    background-color: red;
    overflow-y: auto;
    ::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }
`

const BoardTitle = styled.div`
    width : 42rem;
    height : 4rem;
    background-color: #F4F5F6;
    display: flex;
    flex-direction: row;
`

const TitleBox = styled.div`
    width : 10.5rem;
    height : 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    border: 1px solid #9D9D9D ;
    font-family: Pretendard;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 1.75rem */
    letter-spacing: -0.03125rem;
    color : black;
`

const BoardRow = styled.div`
    width : 42rem;
    height : 4rem;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: row;
`
const RowBox = styled.div`
    width : 10.5rem;
    height : 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    border: 1px solid #9D9D9D ;
    font-family: Pretendard;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 1.4rem */
    letter-spacing: -0.025rem;
`
const FixBox = styled.div`
    width : 10.5rem;
    height : 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    border: 1px solid #9D9D9D ;
    font-family: Pretendard;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 1.4rem */
    letter-spacing: -0.025rem;
    gap: 2.47rem 0.86rem;
    cursor: pointer;
`

const FixButton = styled.div`
    display: flex;
    width: 5.5625rem;
    height : 2.38rem;
    justify-content: center;
    align-items: center;
    border: 1px solid #FF7710;
    color : #FF7710;
    font-family: Pretendard;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 1.4rem */
    letter-spacing: -0.025rem;

`


/// api연동으로 불러오기 
/// 어느정도 만들고 목데이터 연결 
export default function CheckBoard(){

    const [Atd , setAtd] = useState(0);

////부모로 부터 받아온 목데이터터
    const mockdata = {
        id : 1,
        user_name : "김민석",
        student_num : 202100597,
        team_id : "1팀",
        user_type : "FE",
        attendance : Atd
    }

    const HandleAttendance = () => {
        setAtd(prev => (prev === 1 ? 0 : 1));
    }

    return(
        <BoardContainer>
            <BoardTitle>
                <TitleBox>팀</TitleBox>
                <TitleBox>이름</TitleBox>
                <TitleBox>출석</TitleBox>
                <TitleBox>출석수정</TitleBox>
            </BoardTitle>
            <BoardRow>
                <RowBox>{mockdata.team_id}</RowBox>
                <RowBox>{mockdata.user_name}</RowBox>
                <RowBox>{mockdata.attendance === 1 ? "출석" : "결석"}</RowBox>
                <FixBox>
                    <FixButton onClick={HandleAttendance}>출석수정</FixButton>
                </FixBox>
            </BoardRow>
        </BoardContainer>
    )
}