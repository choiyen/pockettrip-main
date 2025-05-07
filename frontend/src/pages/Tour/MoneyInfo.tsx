import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Common/Button";
import styled from "styled-components";

interface TravelData {
  id: string;
  encryptCode: string;
  travelCode: string;
  title: string; // 여행지갑 이름
  location: string; // 여행지 이름
  expense: number; // 현재 누적 금액 (통화 단위 포함)
  ImgArr?: string[]; // 참여 인원들의 프로필 이미지 경로 배열
  startDate: string; // 여행 시작일 (ISO 날짜 형식)
  endDate: string; // 여행 종료일 (ISO 날짜 형식)
  bgImg?: string;
}
interface TourCardProps {
  Tourdata: TravelData; // props 타입 정의
  ChangeState: () => void;
  totalMoney: number;
}

const MoneyInfoWrap = styled.div`
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  h2 {
    font-size: 16px;
    color: #919191;
    margin-bottom: 15px;
  }
  strong {
    font-size: 40px;
    color: #051e31;
    font-weight: bold;
    position: relative;
    margin-bottom: 30px;
    @media (min-width: 1024px) {
      font-size: 50px;
    }

    &::before {
      content: "₩";
      color: #7e7e7e;
      font-size: 36px;
      position: absolute;
      left: -10px;
      transform: translateX(-100%);
      font-weight: 400;

      @media (min-width: 1024px) {
        transform: translate(-100%, 25%);
      }
    }
  }
`;

const StyledButton = styled(Button)`
  width: clamp(120px, 50vw, 300px);
  height: 50px;
`;

export default function MoneyInfo({
  Tourdata,
  ChangeState,
  totalMoney,
}: TourCardProps) {
  const navigate = useNavigate();
  const { encrypted } = useParams<{ encrypted: string }>();

  const goToAccountBook = () => {
    navigate(`/Tour/${encrypted}/accountbook`, {
      state: { location: Tourdata.location, encrypted: encrypted }, // location을 state로 전달
    });
  };

  // expense을 쉼표 구분 형식으로 변환
  const formattedBudget = new Intl.NumberFormat().format(
    Tourdata.expense - totalMoney
  );
  const initialBudget = new Intl.NumberFormat().format(Tourdata.expense);

  return (
    <MoneyInfoWrap>
      <h2>현재예산 (초기값 : {initialBudget})</h2>
      <strong>{formattedBudget}</strong>
      <StyledButton size="M" name="가계부 작성" onClick={ChangeState} />
    </MoneyInfoWrap>
  );
}
