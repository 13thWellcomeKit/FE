import styled from "styled-components";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import axiosInstance from "../axiosInstance";
import { Button, ErrorText, Field, Page, PageHead, Panel, Stack } from "../components/ui";
import { color, size } from "../theme";

const Foot = styled.p`
  margin-top: 1.5rem;
  text-align: center;
  color: ${color.muted};
  font-size: ${size.sm};

  a {
    color: ${color.text};
    font-weight: 700;
    margin-left: 0.5rem;
  }
`;

export default function Login() {
  const { saveToken } = useAuth();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // QR을 기본 카메라로 찍고 비로그인 상태로 들어온 경우 로그인 후 /check?token= 으로 돌려보낸다.
  // 외부 주소로 튕기지 않도록 같은 사이트 경로만 허용.
  const redirect = searchParams.get("redirect");
  const afterLogin =
    redirect && redirect.startsWith("/") && !redirect.startsWith("//")
      ? redirect
      : "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/sign-in", {
        studentNum: id,
        password: password,
      });
      saveToken(response.data.accessToken);
      navigate(afterLogin);
    } catch (err) {
      console.error("로그인 실패:", err.response?.data || err.message);
      setError("학번 또는 비밀번호가 맞지 않습니다.");
    }
  };

  return (
    <Page narrow>
      <PageHead
        title="로그인"
        description={
          redirect ? "로그인하면 출석이 바로 처리됩니다." : "학번과 비밀번호로 로그인하세요."
        }
      />
      <Panel as="form" onSubmit={handleLogin}>
        <Stack>
          <Field
            label="학번"
            inputMode="numeric"
            autoComplete="username"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <Field
            label="비밀번호"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <ErrorText role="alert">{error}</ErrorText>}
          <Button type="submit" $block>
            로그인
          </Button>
        </Stack>
      </Panel>
      <Foot>
        계정이 없나요?
        <Link to="/signup">회원가입</Link>
      </Foot>
    </Page>
  );
}
