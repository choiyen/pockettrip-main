import React from "react";
import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  ChangeModalState,
  ChangeMovingModal,
} from "../../slices/ModalControlSlice";
import Calculator from "./Calculator";
import EditProfile from "./EditProfile";
import EditTourCard from "./EditTourCard";
import { BsChevronCompactLeft } from "react-icons/bs";

const ModalBox = styled.div<{ $isActive: boolean }>`
  background-color: white;
  height: 100%;
  width: 100%;
  max-width: 768px;
  border-radius: 20px 20px 0 0;
  box-shadow: 0px -1px 3px 3px rgba(0, 0, 0, 0.2);
  position: fixed;
  left: 50%;
  z-index: 81;
  transform: ${({ $isActive }) =>
    $isActive ? "translate(-50%, 0vh)" : "translate(-50%, 100vh)"};
  transition-duration: 500ms;
  padding: 20px;
  box-sizing: border-box;
  overflow: scroll;
  scrollbar-width: none;
`;

const CloseButton = styled.button`
  width: 100%;
  font-size: 20px;
  background-color: transparent;
  border: none;
  transition-duration: 300ms;
  border-radius: 20px;
  margin-bottom: 20px;

  &:hover {
    background-color: #e1e1e1;
  }
  &:active {
    background-color: #e1e1e1;
  }
`;

export default function Modal() {
  const movingModal = useSelector(
    (state: RootState) => state.modalControl.movingModal
  );
  const setTravelData = useSelector(
    (state: RootState) => state.saveTourData.value
  );
  const editType = useSelector((state: RootState) => state.edit.type);

  // 받은 문자를 수정 타입과 코드로 나눠 사용한다.
  const [editName, travelCode] = editType?.split(":") || [];

  // 여행 리스트 중 수정할 하나의 데이터만 선택한다.
  const travel = setTravelData.filter(
    (item, index) => item.travelCode === travelCode
  )[0];

  const dispatch: AppDispatch = useDispatch();
  // 버튼 동작에 따라서 모달창이 on/off된다.
  const ChangeState = () => {
    // // 모달창이 렌더링 되어 있는 상태면 내리는 동작 이후 제거
    dispatch(ChangeMovingModal());
    setTimeout(() => {
      dispatch(ChangeModalState());
    }, 500);
  };

  return (
    <ModalBox $isActive={movingModal}>
      <CloseButton onClick={() => ChangeState()}>
        <IoIosArrowDown />
      </CloseButton>

      {editName === "calculator" && <Calculator />}
      {editName === "editProfile" && <EditProfile />}
      {editName === "editTour" && <EditProfile />}
      {editName === "editTourCard" && (
        <EditTourCard ChangeState={ChangeState} travel={travel} />
      )}
      {editName === "editTourCardList" && (
        <EditTourCard ChangeState={ChangeState} travel={travel} />
      )}
      {editName === "editMoneyLog" && <EditProfile />}
    </ModalBox>
  );
}
