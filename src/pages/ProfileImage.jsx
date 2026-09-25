import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axiosInstance from "../axiosInstance";
import DefaultImage from "../image/Logo.png";
import { Button, ErrorText, Muted, Page, PageHead, Panel, Stack } from "../components/ui";
import { color } from "../theme";

const Avatar = styled.button`
  align-self: center;
  width: 12rem;
  height: 12rem;
  padding: 0;
  border-radius: 50%;
  border: 2px dashed ${color.line};
  background: ${color.raised};
  overflow: hidden;
  cursor: pointer;

  &:hover {
    border-color: ${color.brand};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 0.75rem;

  & > * {
    flex: 1;
  }
`;

export default function ProfileImage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("먼저 사진을 골라주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axiosInstance.post("/user/uploadProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("프로필 사진을 바꿨습니다.");
      navigate("/mypage");
    } catch (error) {
      setError("업로드하지 못했습니다. 잠시 후 다시 시도해주세요.");
      console.error("Error uploading profile image:", error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("5MB 이하의 사진만 올릴 수 있습니다.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("이미지 파일만 올릴 수 있습니다.");
        return;
      }
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setError("");
    }
  };

  const fetchMyProfile = async () => {
    try {
      const response = await axiosInstance.get("/user/profileImage", {
        responseType: "blob",
      });
      setPreviewImage(URL.createObjectURL(response.data));
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  return (
    <Page narrow>
      <PageHead title="프로필 사진" />
      <Panel>
        <Stack>
          <Avatar onClick={() => fileInputRef.current.click()} aria-label="사진 고르기">
            <img src={previewImage || DefaultImage} alt="" />
          </Avatar>
          <Muted style={{ textAlign: "center" }}>
            원을 눌러 사진을 고르세요. 5MB 이하 이미지.
          </Muted>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            hidden
          />
          {error && <ErrorText role="alert">{error}</ErrorText>}
          <Row>
            <Button $variant="secondary" onClick={() => navigate("/mypage")}>
              취소
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedFile}>
              저장하기
            </Button>
          </Row>
        </Stack>
      </Panel>
    </Page>
  );
}
