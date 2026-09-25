import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axiosInstance from "../axiosInstance";
import { Button, Field, Page, PageHead, Panel, Stack } from "../components/ui";

const Row = styled.div`
  display: flex;
  gap: 0.75rem;

  & > * {
    flex: 1;
  }
`;

export default function ChangePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = "현재 비밀번호를 입력해주세요.";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "새 비밀번호를 입력해주세요.";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "새 비밀번호를 다시 입력해주세요.";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axiosInstance.post("/user/password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      alert("비밀번호를 변경했습니다.");
      navigate("/mypage");
    } catch (error) {
      if (error.response?.data?.errorCode === "PASSWORD_NOT_MATCHES") {
        setErrors({ currentPassword: "현재 비밀번호가 맞지 않습니다." });
      } else {
        setErrors({ confirmPassword: "변경하지 못했습니다. 잠시 후 다시 시도해주세요." });
      }
    }
  };

  return (
    <Page narrow>
      <PageHead title="비밀번호 변경" />
      <Panel as="form" onSubmit={handleSubmit}>
        <Stack>
          <Field
            label="현재 비밀번호"
            type="password"
            name="currentPassword"
            autoComplete="current-password"
            value={formData.currentPassword}
            onChange={handleChange}
            error={errors.currentPassword}
          />
          <Field
            label="새 비밀번호"
            type="password"
            name="newPassword"
            autoComplete="new-password"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
          />
          <Field
            label="새 비밀번호 확인"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
          <Row>
            <Button $variant="secondary" onClick={() => navigate("/mypage")}>
              취소
            </Button>
            <Button type="submit">변경하기</Button>
          </Row>
        </Stack>
      </Panel>
    </Page>
  );
}
