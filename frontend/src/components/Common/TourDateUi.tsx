import React from "react";
import styled from "styled-components";
import { IoAirplane } from "react-icons/io5";

interface DateUiState {
  $precent: string;
  startDate: string | Date; // startDate가 문자열이거나 날짜 객체일 수 있음
  endDate: string | Date; // endDate가 문자열이거나 날짜 객체일 수 있음
  $bgColor: string;
  $backGraphColor: string;
}

const DateWrap = styled.div`
  display: flex;
  font-family: inherit;
  justify-content: space-between;
`;

const DateNum = styled.div`
  font-size: 16px;
  font-weight: 200;

  span {
    font-size: 24px;
    font-weight: 400;
  }
`;

const StartDate = styled(DateNum)`
  text-align: left;
`;

const EndDate = styled(DateNum)`
  text-align: right;
`;

const Graph = styled.div<{ $backGraphColor: string }>`
  width: 100%;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    height: 5px;
    background-color: ${(props) => props.$backGraphColor};
    border-radius: 30px;
  }
`;

const MovingGraph = styled.div<{ $precent: string; $bgColor: string }>`
  width: ${(props) => props.$precent};
  min-width: 10%;
  transition-duration: 500ms;
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translateY(-50%);
  height: 5px;
  background-color: ${(props) => (props.$bgColor ? props.$bgColor : "white")};
  border-radius: 30px;

  svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
  }
`;

export default function TourDateUi({
  $precent,
  startDate,
  endDate,
  $bgColor = "white",
  $backGraphColor,
}: DateUiState) {
  // startDate가 Date 객체일 경우 문자열로 변환
  const startDateStr =
    startDate instanceof Date
      ? startDate.toISOString().split("T")[0]
      : startDate;
  const endDateStr =
    endDate instanceof Date ? endDate.toISOString().split("T")[0] : endDate;

  // 출발일
  const startOfArr = startDateStr.split("-");
  startOfArr[1] = startOfArr[0].slice(2) + "." + startOfArr[1];
  startOfArr.shift();

  // 도착일
  const endOfArr = endDateStr.split("-");
  endOfArr[1] = endOfArr[0].slice(2) + "." + endOfArr[1];
  endOfArr.shift();

  return (
    <DateWrap>
      <StartDate>
        <span>{startOfArr[1]}</span> <br />
        {startOfArr[0]}
      </StartDate>
      <Graph $backGraphColor={$backGraphColor}>
        <MovingGraph $precent={$precent} $bgColor={$bgColor}>
          <IoAirplane
            size="30px"
            color="black"
            style={{ transform: "translate(-3px, -50%)", opacity: "0.3" }}
          />
          <IoAirplane size="30px" />
        </MovingGraph>
      </Graph>
      <EndDate>
        <span>{endOfArr[1]}</span> <br />
        {endOfArr[0]}
      </EndDate>
    </DateWrap>
  );
}
