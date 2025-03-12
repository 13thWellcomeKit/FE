import Header from "../components/Header"
import styled from "styled-components"
import { ReactComponent as mainlogo } from '../svg/mainlogo.svg'
import { useNavigate } from "react-router-dom"
import { useState , useEffect } from "react"

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
const LoginContainer = styled.div`
    display: flex;
    width: 29rem;
    height: 40.56rem;
    padding: 3.75rem 2.25rem;
    flex-direction: column;
    border-radius: 1.25rem;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.19);
    backdrop-filter: blur(10px);
`
const TitleText = styled.h1`
    font-family: Pretendard;
    font-size: 2rem;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 2.8rem */
    letter-spacing: -0.05rem;
    margin: 0;
    margin-bottom: 0.25rem;
    color : #FFFF;
`

const MiddleText = styled.h1`
    font-family: Pretendard;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 1.75rem */
    letter-spacing: -0.03125rem;
    color : #FFFF;
    margin : 0;
    margin-top: 1rem;
    margin-bottom: 1rem;
`

const LoginText = styled.h1`
    font-family: Pretendard;
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 500;
    line-height: 140%; /* 1.575rem */
    letter-spacing: -0.02813rem;
    color : #FFFF;
    margin : 0;
    margin-top: 1rem;
    margin-bottom: 1rem;
`

const LoginInput =styled.input`
    display: flex;
    height: 3.25rem;
    padding: 0.75rem 2rem;
    align-items: center;
    border-radius: 3.125rem;
    box-sizing: border-box;
    margin-bottom: 0.5rem;
    background-color: rgba(255, 255, 255, 0.19);
    border-color: rgba(255, 255, 255, 0.19);

    &:focus {
    border-color: #FFFF;
    color: #FFFF;
  }

  &::placeholder {
    color: #9D9D9D; 
  }
`

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const LoginButton = styled.div`
    display: flex;
    width: 12.375rem;
    height: 3.25rem;
    padding: 0.75rem 2rem;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    border-radius: 3.125rem;
    background-color: #FFFF;
    font-family: Pretendard;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 1.75rem */
    letter-spacing: -0.03125rem;
    color : #FF7710;
    margin-top: 2rem;
    margin-bottom: 2rem;
    cursor: pointer;

    &:hover {
    background-color: #FF7710;
    color : #FFFF;
  }
`

const InfoContainer = styled.div`
    height : 1.37rem;
    display : flex;
    flex-direction: row;
    margin-top: 0.06rem;
    margin-bottom: 0%.06rem;
`

const InfoText = styled.h1`
    font-family: Pretendard;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 1.225rem */
    letter-spacing: -0.02188rem;
    color: #FFFF;
    margin: 0;
`

const SignText = styled.h1`
    font-family: Pretendard;
    font-size: 1rem;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 1.4rem */
    letter-spacing: -0.025rem;
    margin: 0;
    margin-left: 1rem;
    color : #FFFF;
    cursor: pointer;
`


const Circle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 41.875rem;
    height: 41.875rem;
    border-radius: 50%;
    transform: rotate(75deg);
    opacity: 0.7;
    background: linear-gradient(rgba(254, 88, 38, 0.75) 0%, rgba(0, 0, 0, 0.00) 47.5%, #200801 100%);
    overflow: hidden;
    position: relative; 
`;

const MainLogo = styled(mainlogo)`
    position: absolute; 
    width: 80%; 
    height: auto;
    transform: rotate(-75deg);

`;

const TextOverlay = styled.h1`
    font-family: Montserrat;
    font-size: 3rem;
    font-weight: 700;
    color: white;
    text-align: center;
    position: relative; 
    z-index: 2; 
    transform: rotate(-75deg);
`;


const CautionText = styled.h1`
    font-family: Pretendard;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 300;
    line-height: 140%; /* 1.225rem */
    letter-spacing: -0.02188rem;
    color : #FF7710;
    margin-left: 2rem;

`
export default function Login(){

    const [id , setId] = useState("");
    const [password , setPassword] = useState("");
    const [error , setError] = useState("");
    const [pw,setPw] = useState("abc123");
    ///임의로 받아올 비번 
    const navigate = useNavigate();

    const GotoSignup = () => {
        navigate("/signup")
        console.log(Mockdata);
        
    }

    useEffect(() => {
        if (pw && password !== pw) {
            setError("올바르지 않은 비밀번호입니다.");
        } else {
            setError("");
        }
    }, [password, pw]);


    const Mockdata = {
        student_num : id,
        password : password
    }

    /// 콘솔 확인 완료

    return(
        <>
            <Header></Header>
            <PageContainer>
                <Circle>
                    <MainLogo/>
                    <TextOverlay>
                        GROWL-TO<br/>
                        ->WORLD
                    </TextOverlay>
                </Circle>
                <LoginContainer>
                    <TitleText>로그인</TitleText>
                    <MiddleText>
                        한국외국어대학교 글로벌캠퍼스 <br/>
                        멋쟁이 사자처럼 대학 홈페이지입니다.
                    </MiddleText>
                    <LoginText>
                        ID  
                    </LoginText>
                    <LoginInput
                    placeholder="아이디를 입력해주세요."
                    value={id}
                    onChange={(e) => setId(e.target.value)}/>
                    <LoginText>
                        PW 
                    </LoginText>
                    <LoginInput
                    placeholder="비밀번호를 입력해주세요."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                    {error && <CautionText>{error}</CautionText>}
                    <ButtonContainer>
                        <LoginButton>LOGIN</LoginButton>
                        <InfoContainer>
                            <InfoText>아이디가 없으신가요?</InfoText>
                            <SignText onClick={GotoSignup}>회원가입</SignText>
                        </InfoContainer>
                    </ButtonContainer>
                </LoginContainer>
            </PageContainer>
        </>
    )
}