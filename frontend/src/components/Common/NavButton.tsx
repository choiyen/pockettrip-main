import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { RootState } from "../../store";
import { FaHouse } from "react-icons/fa6";
import { IoPersonCircleSharp } from "react-icons/io5";

interface NavButtonProps {
  where: string; // where는 문자열 타입
}

interface ButtonProps {
  $isSelected?: boolean;
}

const Linked = styled(Link)<ButtonProps>`
  width: 72px;
  height: 56px;
  font-size: 25px;
  text-decoration: none;
  color: ${(props) => (props.$isSelected ? "#0077CC" : "#E1E1E1")};
  text-align: center;
  font-family: GmarketSansMedium, Arial, Helvetica, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const Span = styled.span`
  font-size: 12px;
`;

export default function NavButton({ where }: NavButtonProps) {
  const value = useSelector((state: RootState) => state.currentPage.value);
  return (
    <>
      {where === "home" ? (
        <Linked to="/" $isSelected={value === "home" ? true : false}>
          <FaHouse />
          <Span>홈화면</Span>
        </Linked>
      ) : (
        <Linked to="/mypage" $isSelected={value === "mypage" ? true : false}>
          <IoPersonCircleSharp />
          <Span>내 정보</Span>
        </Linked>
      )}
    </>
  );
}
