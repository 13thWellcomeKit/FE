import styled from "styled-components"
import { ReactComponent as TitleLogo } from '../svg/TitleLogo.svg'
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const HeaderContainer = styled.div`
    display: flex;
    width: 100%;
    height: 4.87rem;
    padding: 0.8125rem 2.25rem;
    flex-direction: row;
    align-items: center;
    background: var(--Bold-Black, #1C1B1A);
    box-sizing: border-box;
`

const MenuContainer = styled.div`
    width : 26.5rem;
    height : 1.75rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-left: 10.63rem;
`

const LoginContainer = styled.div`
    width : 12.06rem;
    height : 3.25rem;
    display: inline-flex;
    padding: 0.75rem 1rem;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    margin-left: 18.47rem;
`

const HeaderText = styled.h1`
    color: ${(props) => (props.active ? "#ffffff" : "#9D9D9D")};
    /* 헤더/20px */
    font-family: Pretendard;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 1.75rem */
    letter-spacing: -0.03125rem;
    cursor: pointer;
`

const Logo = styled(TitleLogo)`
    justify-content: flex-start;
`
export default function Header(){

    const location = useLocation();
    const navigate = useNavigate();
    
    const HandleNavigate = (path) => {
        navigate(path)
    }

/// 새로운 페이지 경로만 추가해서 넣기 /// 
    return(
        <HeaderContainer>
            <Logo />
            <MenuContainer>
                <HeaderText active={location.pathname === "/main"} onClick={() => HandleNavigate("/main")}>HOME</HeaderText>
                <HeaderText active={location.pathname === "/introduce"} onClick={() =>HandleNavigate("/introduce")}>INTRODUCE</HeaderText>
                <HeaderText active={location.pathname === "/check"} onClick={() => HandleNavigate("/check")}>ATTENDANCE</HeaderText>
                <HeaderText active={location.pathname === "/bingo"} onClick={() => HandleNavigate("/bingo")}>BINGO</HeaderText>
            </MenuContainer>
            <LoginContainer>
                <HeaderText active={location.pathname === "/login"} onClick={() => HandleNavigate("/login")}>LOGIN</HeaderText>
                <HeaderText active={location.pathname === "/mypage"} onClick={() => HandleNavigate("/mypage")}>MYPAGE</HeaderText>
            </LoginContainer>
        </HeaderContainer>
    )
}