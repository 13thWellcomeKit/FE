import Header from "../components/Header"
import styled from "styled-components"
import { ReactComponent as mainlogo } from '../svg/mainlogo.svg'
import { useState } from "react"
import { useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

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
const SignContainer = styled.div`
    display: flex;
    width: 29rem;
    padding: 3.75rem 2.25rem;
    flex-direction: column;
    border-radius: 1.25rem;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.19);
    backdrop-filter: blur(10px);

    overflow-y: auto; /* 세로 스크롤 활성화 */
  scrollbar-width: none; /* 파이어폭스에서 스크롤바 숨김 */
  -ms-overflow-style: none; /* IE, Edge에서 스크롤바 숨김 */

  &::-webkit-scrollbar {
    display: none; /* 크롬, 사파리에서 스크롤바 숨김 */
  }
`
const TitleText = styled.h1`
    font-family: Pretendard;
    font-size: 2rem;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 2.8rem */
    letter-spacing: -0.05rem;
    margin: 0;
    margin-bottom: 0.5rem;
    color : #FFFF;
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

const SignButton = styled.div`
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

export default function SignUp(){

    const [username, setUsername] = useState("");
    const [stunum, setStunum] = useState("");
    const [password, setPassword] = useState("");
    const [checkpw , setCheckpw] = useState("");
    const [error , setError] = useState("");

    const navigate = useNavigate();


    useEffect(() => {
        if (checkpw && password !== checkpw) {
            setError("비밀번호가 틀립니다.");
        } else {
            setError("");
        }
    }, [password, checkpw]);


    const CheckMock = {
        name: username,
        studentNum: stunum,
        password: password,
        userType: "BABY_LION"
    }


    const handleSubmit = async () => {
        try {
            const response = await axios.post("https://welcomekitbe.lion.it.kr/api/user/join", {
                "name": username,
                "studentNum": stunum,
                "password": password,
                "userType": "BABY_LION"
            });

            console.log("회원가입 성공:", response.data);
            alert("회원가입이 완료되었습니다!");
        } catch (error) {
            console.error("회원가입 실패:", error.response?.data || error.message);
            alert("회원가입에 실패했습니다.");
            console.log(CheckMock);
        }

        navigate("/login")
    };

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
                <SignContainer>
                    <TitleText>회원가입</TitleText>
                    <LoginText>
                        이름
                    </LoginText>
                    <LoginInput
                    placeholder="이름을 입력해주세요."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} />
                    <LoginText>
                        학번 
                    </LoginText>
                    <LoginInput
                    placeholder="학번을 입력해주세요."
                    value={stunum}
                    onChange={(e) => setStunum(e.target.value)} />
                    <LoginText>
                        PW 
                    </LoginText>
                    <LoginInput
                    placeholder="비밀번호를 입력해주세요."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                    <LoginText>
                        PW 중복확인
                    </LoginText>
                    <LoginInput
                    placeholder="다시 한 번 비밀번호를 입력해주세요."
                    value={checkpw}
                    onChange={(e) => setCheckpw(e.target.value)} />
                    {error && <CautionText>{error}</CautionText>}
                    <ButtonContainer>
                        <SignButton onClick={handleSubmit}>회원가입</SignButton>
                    </ButtonContainer>
                </SignContainer>
            </PageContainer>
        </>
    )
}