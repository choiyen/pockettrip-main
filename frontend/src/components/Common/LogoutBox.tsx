import React, { useState } from "react";
import styled from "styled-components";
import { FcFullTrash } from "react-icons/fc";
import Button from "./Button";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { ChangeLogoutState } from "../../slices/LogoutControlSlice";
import axios from "axios";

const BoxWrap = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
  z-index: 10;

  h2 {
    margin-top: 30px;
    text-align: center;
    line-height: 1.5;
    font-size: 20px;
    font-weight: bold;
  }

  p {
    margin: 10px 0 20px 0;
    color: #a5a5a5;
  }

  button {
    margin-bottom: 10px;
  }
`;

export default function LogoutBox() {
  const dispatch: AppDispatch = useDispatch();
  const [isBoxVisible, setIsBoxVisible] = useState(true);
  const CloseLogout = () => {
    dispatch(ChangeLogoutState());
    setIsBoxVisible(false);
  };
  const handleLogout = () => {
    axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/auth/signout`, {
        withCredentials: true,
      })
      .then((res) => {
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");

        window.location.reload();
      })
      .catch((error) => {
        console.error("로그아웃 실패:", error);
      });
    dispatch(ChangeLogoutState()); // 로그아웃 후 박스 닫기
  };
  return (
    <BoxWrap>
      <FcFullTrash size={"80px"} />
      <h2>로그아웃</h2>
      <p>정말 로그아웃하시겠습니까?</p>
      <Button size="L" name="로그아웃" $bgColor="red" onClick={handleLogout} />
      <Button
        size="L"
        name="취소"
        $bgColor="transparent"
        onClick={() => CloseLogout()}
      />
    </BoxWrap>
  );
}
