import React from "react";
import styled from "styled-components";
import NavButton from "./NavButton";
import { MdCurrencyExchange } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  ChangeModalState,
  ChangeMovingModal,
} from "../../slices/ModalControlSlice";
import Modal from "./Modal";
import { setEditType } from "../../slices/editSlice";

const Navbar = styled.div`
  max-width: 768px;
  height: 56px;
  background-color: white;
  position: fixed;
  z-index: 90;
  width: 100%;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 15px 15px 0 0;
  box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: space-around;
`;

const CalcButton = styled.button`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: none;
  background-color: #0077cc;
  color: white;
  font-size: 25px;
  transform: translateY(-10px);
  display: flex;
  justify-content: center;
  align-items: center;

  &:active {
    background-color: #005fa2;
  }
`;

export default function Nav() {
  const dispatch: AppDispatch = useDispatch();
  const modalState = useSelector(
    (state: RootState) => state.modalControl.modalState
  );

  // 버튼 동작에 따라서 모달창이 on/off된다.
  const ChangeState = () => {
    // 모달창이 렌더링 되기 전이면 렌더링 후 등장
    if (modalState === false) {
      dispatch(ChangeModalState());
      dispatch(setEditType("calculator"));
      setTimeout(() => {
        dispatch(ChangeMovingModal());
      }, 50);
    } else {
      // // 모달창이 렌더링 되어 있는 상태면 내리는 동작 이후 제거
      dispatch(ChangeMovingModal());
      setTimeout(() => {
        dispatch(ChangeModalState());
      }, 500);
    }
  };
  return (
    <Navbar>
      <NavButton where="home" />
      <CalcButton onClick={() => ChangeState()}>
        <MdCurrencyExchange />
      </CalcButton>
      <NavButton where="mypage" />
      {/* {modalState && <Modal />} */}
    </Navbar>
  );
}
