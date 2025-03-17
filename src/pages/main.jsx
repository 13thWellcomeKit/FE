import Header from "../components/Header"
import CheckBoard from "../components/Board"
import styled from "styled-components"
import { IoIosArrowRoundForward } from "react-icons/io";
import { ReactComponent as mainlogo } from '../svg/mainlogo.svg'
import { useNavigate } from "react-router-dom";
import media from "styled-media-query";



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


    ${media.lessThan("medium")`
        justify-content: center;
  `}
`

const TextContainer = styled.div`
    display: flex;
    width: 35.8125rem;
    height : 28.88rem;
    flex-direction: column;
    margin-top : 6.44rem;

    ${media.lessThan("medium")`
        width: 16.75rem;
        height : 13.12rem;
        margin-top : 25.13rem;
  `}
`

const TitleText = styled.h1`
    font-family: Montserrat;
    font-size: 6rem;
    font-style: normal;
    font-weight: 700;
    line-height: 140%; /* 8.4rem */
    letter-spacing: -0.15rem;
    color: #FFFF;
    margin: 0;
    margin-bottom: 1.5rem;
    ${media.lessThan("medium")`
            text-align: center;
            font-family: Montserrat;
            font-size: 1.5rem;
            font-style: normal;
            font-weight: 700;
            line-height: 140%; /* 2.1rem */
            letter-spacing: -0.0375rem;
    `}

`
const MiddleContainer = styled.div`
    display: flex;
    width: 35.875rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 3rem; /* 간격 조정 */
    height: 28.88rem; /* 높이 자동 조정 */

    ${media.lessThan("medium")`
        width: 16.75rem;
        height : 13.12rem;
        align-items:center;
  `}
`;

const MiddleText = styled.h1`
    width : 33.8rem;
    font-family: Pretendard;
    font-size: 2.25rem;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 줄 간격 유지 */
    letter-spacing: -0.05625rem;
    color: #FFFF;
    margin: 0;

    ${media.lessThan("medium")`
    width: 16.75rem;
    font-family: Pretendard;
    font-size: 1rem;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 1.4rem */
    letter-spacing: -0.025rem;
    text-align: center;
    `}
`;

const IntroButton = styled.div`
    width: 14.2625rem;
    height: 3.5625rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap : 0.75rem;
    border: 1.5px solid #FFFF;
    cursor: pointer;

    ${media.lessThan("medium")`
        width: 8.75rem;
        height: 3rem;
    `}
`

const ButtonText = styled.h1`
    font-family: Pretendard;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 2.1rem */
    letter-spacing: -0.0375rem;
    margin-left: 0.5rem;
    color : #FFFF;

    ${media.lessThan("medium")`
        text-align: center;
        font-family: Pretendard;
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 600;
        line-height: 140%; /* 1.225rem */
        letter-spacing: -0.02188rem;
        margin-left: 0rem;
    `}
`

const Arrow = styled(IoIosArrowRoundForward)`
    width: 1.5rem;
    height: 1.5rem;
    margin-left: 0.72rem;
    color : #FFFF;

    ${media.lessThan("medium")`
        margin-left: 0rem;
    `}
`
const Circle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 41.875rem;
    height: 41.875rem;
    border-radius: 50%;
    transform: rotate(-75deg);
    opacity: 0.7;
    background: linear-gradient(rgba(254, 88, 38, 0.75) 0%, rgba(0, 0, 0, 0.00) 47.5%, #200801 100%);
    overflow: hidden;
    position: relative; 

    ${media.lessThan("medium")`
        position: absolute;
        left: 50%;
        top : 8rem;
        transform: translateX(-50%) rotate(-75deg); /* 가로 중앙 정렬 */
        width: 15.6155rem;
        height: 15.6155rem;
        z-index: 1; /* 텍스트보다 뒤에 배치 */
    `}
`;

const MainLogo = styled(mainlogo)`
    position: absolute; 
    width: 80%; 
    height: auto;
    transform: rotate(75deg);

    ${media.lessThan("medium")`
        width: 11.65338rem;
        height: 11.65338rem;
    `}
`;

const TextOverlay = styled.h1`
    font-family: Montserrat;
    font-size: 3rem;
    font-weight: 700;
    color: white;
    text-align: center;
    position: relative; 
    z-index: 2; 
    transform: rotate(75deg);

    ${media.lessThan("medium")`
        font-family: Montserrat;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 700;
    line-height: 140%; /* 2.1rem */
    letter-spacing: -0.0375rem;
    `}
`;


export default function Main(){

    const navigate = useNavigate();

    const GotoIntro = () => {
        navigate("/Introduce")
    }

    return(
        <>
            <Header></Header>
            <PageContainer>
                <TextContainer>
                    <TitleText>WELCOME</TitleText>
                    <MiddleContainer>
                        <MiddleText>
                        한국외대 글로벌캠퍼스<br/>
                        멋쟁이사자처럼입니다.
                        </MiddleText>
                        <MiddleText>
                            13기 아기사자 여러분,환영합니다!
                        </MiddleText>
                        <IntroButton onClick={GotoIntro}>
                            <ButtonText>
                                멋사 알아보기
                            </ButtonText>
                            <Arrow />
                        </IntroButton>
                    </MiddleContainer>
                </TextContainer>
                <Circle>
                    <MainLogo/>
                    <TextOverlay>
                        GROWL-TO<br/>
                        ->WORLD
                    </TextOverlay>
                </Circle>
            </PageContainer>
        </>
    )
        
    
}