import { hideAlert } from "../../slices/AlertControlSlice";
import { AppDispatch, RootState } from "@/store";
import React, { JSX } from "react";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { HiOutlineXCircle } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const AlertWrap = styled.div`
  display: flex;
  width: 100%;
  height: 70px;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  position: absolute;
  padding: 15px 20px;
  box-sizing: border-box;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  font-size: 20px;
  padding: 0;
  line-height: 30px;
  background-color: transparent;
  border: none;
  color: #ababab;

  &:hover {
    color: black;
  }
`;

const IconWrap = styled.div`
  font-size: 35px;
`;

const TextWrap = styled.div`
  margin-left: 20px;
  color: 051e31;
  h2 {
    color: #00233b;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  p {
    font-size: 14px;
    color: #a0a0a0;
  }
`;

const StateIcon: { [key: string]: JSX.Element } = {
  success: <HiOutlineCheckCircle color="#00b84e" />,
  info: <HiOutlineExclamationCircle color="#ccbc00" />,
  error: <HiOutlineXCircle color="#cc0000" />,
};
export default function Alert() {
  const dispatch: AppDispatch = useDispatch();
  const alertType = useSelector((state: RootState) => state.AlertControl.type);
  const message = useSelector((state: RootState) => state.AlertControl.message);
  return (
    <AlertWrap>
      <IconWrap>{StateIcon[alertType]}</IconWrap>
      <TextWrap>
        <h2>{alertType}</h2>
        <p>{message}</p>
      </TextWrap>

      <CloseButton onClick={() => dispatch(hideAlert())}>
        <IoMdClose />
      </CloseButton>
    </AlertWrap>
  );
}
