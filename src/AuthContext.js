import { createContext, useState, useContext, useEffect } from "react";
import { Cookies } from "react-cookie";
import axiosInstance from "./axiosInstance";

// Context 생성
const AuthContext = createContext();
// 렌더마다 새로 만들면 effect 의존성이 매번 바뀐다. 모듈에서 한 번만 만든다.
const cookies = new Cookies();

// AuthProvider 생성
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!cookies.get("accessToken"));
  const [token, setToken] = useState(cookies.get("accessToken") || ""); // 쿠키에서 accessToken 가져옴
  // undefined: 아직 조회 중, null: 비로그인 또는 조회 실패, "ADMIN" | "BABY_LION"
  const [userType, setUserType] = useState(undefined);

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  useEffect(() => {
    const storedToken = cookies.get("accessToken");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  // 운영진 메뉴 노출용. 권한 검사 자체는 서버가 한다.
  useEffect(() => {
    if (!token) {
      setUserType(null);
      return;
    }
    let cancelled = false;
    setUserType(undefined);
    axiosInstance
      .get("/user/info")
      .then((res) => !cancelled && setUserType(res.data?.userType ?? null))
      .catch(() => !cancelled && setUserType(null));
    return () => {
      cancelled = true;
    };
  }, [token]);

  const saveToken = (newToken) => {
    cookies.set("accessToken", newToken, { path: "/", sameSite: "Lax" }); // ✅ sameSite 추가
    setToken(newToken);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setToken("");
    cookies.remove("accessToken"); // 쿠키 삭제
    setIsLoggedIn(false);
    console.log("로그아웃 실행됨:", { token: "", isLoggedIn: false });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn,
        userType,
        isAdmin: userType === "ADMIN",
        saveToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 토큰을 쉽게 가져올 수 있도록 커스텀 훅 생성
export function useAuth() {
  return useContext(AuthContext);
}
