import { createContext, useState, useContext, useEffect } from "react";
import { Cookies } from "react-cookie";

// Context 생성
const AuthContext = createContext();

// AuthProvider 생성
export function AuthProvider({ children }) {
    const cookies = new Cookies();
    const [token, setToken] = useState(cookies.get("accessToken") || ""); // 쿠키에서 accessToken 가져옴

    // 로그인 후 토큰 저장 함수
    const saveToken = (newToken) => {
        setToken(newToken);
        cookies.set("accessToken", newToken, { path: "/" }); // 쿠키에도 저장
    };

    // // 로그아웃 함수
    // const logout = () => {
    //     setToken("");
    //     cookies.remove("accessToken"); // 쿠키 삭제
    // };

    // 로그아웃 기능 추가하면 넣기 

    return (
        <AuthContext.Provider value={{ token, saveToken }}>
            {children}
        </AuthContext.Provider>
    );
}

// 토큰을 쉽게 가져올 수 있도록 커스텀 훅 생성
export function useAuth() {
    return useContext(AuthContext);
}
