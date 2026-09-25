import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Field, Page, PageHead, Panel, Stack } from "../components/ui";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [stunum, setStunum] = useState("");
  const [password, setPassword] = useState("");
  const [checkpw, setCheckpw] = useState("");

  const navigate = useNavigate();

  const mismatch = checkpw && password !== checkpw ? "비밀번호가 서로 다릅니다." : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://welcomekitbe.lion.it.kr/api/user/join",
        {
          name: username,
          studentNum: stunum,
          password: password,
          userType: "BABY_LION",
        }
      );

      console.log("회원가입 성공:", response.data);
      alert("회원가입이 완료되었습니다!");
    } catch (error) {
      console.error("회원가입 실패:", error.response?.data || error.message);
      alert("회원가입에 실패했습니다.");
    }

    navigate("/login");
  };

  return (
    <Page narrow>
      <PageHead title="회원가입" description="13기 아기사자 계정을 만드세요." />
      <Panel as="form" onSubmit={handleSubmit}>
        <Stack>
          <Field
            label="이름"
            autoComplete="name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Field
            label="학번"
            inputMode="numeric"
            autoComplete="username"
            value={stunum}
            onChange={(e) => setStunum(e.target.value)}
          />
          <Field
            label="비밀번호"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Field
            label="비밀번호 확인"
            type="password"
            autoComplete="new-password"
            value={checkpw}
            error={mismatch}
            onChange={(e) => setCheckpw(e.target.value)}
          />
          <Button type="submit" $block disabled={!!mismatch}>
            가입하기
          </Button>
        </Stack>
      </Panel>
    </Page>
  );
}
