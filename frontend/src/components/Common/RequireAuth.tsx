import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { replace, useNavigate } from "react-router-dom";

export default function RequireAuth({ children }: any) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("토큰 없음 -> 로그인 페이지 이동");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded: any = token && jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.warn("토큰 만료됨 -> 로그인 페이지 이동");
        navigate("/login", { replace: true });
        localStorage.removeItem("accessToken");
      } else {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("JWT 디코딩 오류");
      localStorage.removeItem("accessToken");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  if (isAuthenticated === null) {
    return <p>로그인 정보 확인 중...</p>;
  }
  return children;
}
