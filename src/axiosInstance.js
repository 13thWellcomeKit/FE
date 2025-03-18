import axios from "axios";
import { Cookies } from "react-cookie";

const axiosInstance = axios.create({
  baseURL: "https://welcomekitbe.lion.it.kr/api",
});

// 요청 인터셉터 (모든 요청에 자동으로 Authorization 헤더 추가)
axiosInstance.interceptors.request.use(
  async (config) => {
    const cookies = new Cookies();
    const accessToken = cookies.get("accessToken"); // 쿠키에서 토큰 가져옴

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`; // 헤더에 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
