import React, { useState } from "react";
import styled from "styled-components";
import { FcFullTrash } from "react-icons/fc";
import Button from "./Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { ChangeAlertState } from "../../slices/AlertControlSlice";
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

export default function AlertBox() {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  // const DeleteFunc = async () => {
  //   try {
  //     const token = localStorage.getItem("accessToken");
  //     const response = await axios.delete(
  //       `${process.env.REACT_APP_API_BASE_URL}/plan/delete/${travelCode}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     navigate("/mypage");
  //   } catch (error) {
  //     console.error("여행 삭제 실패");
  //   }
  // };

  const CloseAlert = () => {
    dispatch(ChangeAlertState());
  };
  return (
    <BoxWrap>
      <FcFullTrash size={"80px"} />
      <h2>삭제</h2>
      <p>정말 삭제하시겠습니까?</p>
      <Button size="L" name="지우기" $bgColor="red" />
      <Button
        size="L"
        name="취소"
        $bgColor="transparent"
        onClick={() => {
          CloseAlert();
          // DeleteFunc();
        }}
      />
    </BoxWrap>
  );
}
