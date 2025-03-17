import styled from "styled-components"
import { ReactComponent as TitleLogo } from '../svg/TitleLogo.svg'
import { ReactComponent as Menu } from '../svg/Menu.svg'
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import media from "styled-media-query";
import { useState } from "react";


const HeaderContainer = styled.div`
    display: flex;
    width: 100%;
    height: 4.87rem;
    padding: 0.8125rem 2.25rem;
    flex-direction: row;
    align-items: center;
    background: var(--Bold-Black, #1C1B1A);
    box-sizing: border-box;
    ${media.lessThan("medium")`
        justify-content: center;
        position: relative; 
  `}
    
`

const MenuContainer = styled.div`
    width : 26.5rem;
    height : 1.75rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-left: 10.63rem;
    ${media.lessThan("medium")`
    display: none; /* 모바일 화면에서 숨기기 */
  `}
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
    ${media.lessThan("medium")`
    display: none; /* 모바일 화면에서 숨기기 */
  `}
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

    ${media.lessThan("medium")`
        font-family: Pretendard;
        font-size: 1.5rem;
        font-style: normal;
        font-weight: 600;
        line-height: 140%; /* 2.1rem */
        letter-spacing: -0.0375rem;
        margin-bottom : 1.25rem;
  `}
`

const WebLogo = styled(TitleLogo)`
    justify-content: flex-start;
    ${media.lessThan("medium")`
        width: 8.6875rem;
        height: 1.38338rem;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 8.6875rem;
        height: 1.38338rem;
  `}
`
///App menu 좋은 방법 생각해보자////

const AppMenu = styled(Menu)`
    width: 1.3125rem;
    height: 0.9375rem;
    position: absolute;
    left: 22.23rem;
    transform: translateX(-50%);
    ${media.greaterThan("medium")`
        display : none;
  `}
`

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999; /* 화면 최상위 */
`;

const MenuModal = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 22.375rem;
    padding: 3.75rem 2.25rem;
    border-radius: 1.25rem;
    background: var(--, rgba(255, 255, 255, 0.19));
    backdrop-filter: blur(10px);
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
`;
export default function Header(){

    const location = useLocation();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const HandleNavigate = (path) => {
        navigate(path)
    }


/// 새로운 페이지 경로만 추가해서 넣기 /// 

return (
    <>
    <HeaderContainer>
                <WebLogo />
                <AppMenu onClick={() => setIsModalOpen((prev) => !prev)} />
                <MenuContainer>
                    <HeaderText active={location.pathname === "/main"} onClick={() => HandleNavigate("/main")}>HOME</HeaderText>
                    <HeaderText active={location.pathname === "/introduce"} onClick={() => HandleNavigate("/introduce")}>INTRODUCE</HeaderText>
                    <HeaderText active={location.pathname === "/check"} onClick={() => HandleNavigate("/check")}>ATTENDANCE</HeaderText>
                    <HeaderText active={location.pathname === "/bingo"} onClick={() => HandleNavigate("/bingo")}>BINGO</HeaderText>
                </MenuContainer>
                <LoginContainer>
                    <HeaderText active={location.pathname === "/login"} onClick={() => HandleNavigate("/login")}>LOGIN</HeaderText>
                    <HeaderText active={location.pathname === "/mypage"} onClick={() => HandleNavigate("/mypage")}>MYPAGE</HeaderText>
                </LoginContainer>
    </HeaderContainer>


    {isModalOpen && (
                <ModalOverlay onClick={() => setIsModalOpen(false)}>
                    <MenuModal onClick={(e) => e.stopPropagation()}>
                        <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
                        <HeaderText active={location.pathname === "/login"} onClick={() => HandleNavigate("/login")}>LOGIN</HeaderText>
                        <HeaderText active={location.pathname === "/introduce"} onClick={() => HandleNavigate("/introduce")}>INTRODUCE</HeaderText>
                        <HeaderText active={location.pathname === "/mypage"} onClick={() => HandleNavigate("/mypage")}>MY PAGE</HeaderText>
                        <HeaderText active={location.pathname === "/check"} onClick={() => HandleNavigate("/check")}>QR 출석체크</HeaderText>
                        <HeaderText active={location.pathname === "/bingo"} onClick={() => HandleNavigate("/bingo")}>Let's BINGO</HeaderText>
                    </MenuModal>
                </ModalOverlay>
            )}
    </>
);
}