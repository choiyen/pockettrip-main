import React from "react";
import styled from "styled-components";
import OptionButton from "../../components/Common/OptionButton";
import CardUserList from "../Home/CardUserList";
import { Link } from "react-router-dom";

interface TravelPlan {
  travel: {
    id: string;
    encryptCode: string;
    travelCode: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    expense: number;
    profiles: string[];
    img: string;
  };
  formattedBudget: string[];
  index: number;
}
const TrvelWrap = styled.div`
  width: 50%;
  margin: 0 auto;
  position: relative;

  @media (max-width: 767px) {
    width: auto;
  }
  @media (min-width: 1024px) {
    max-width: 450px;
    width: 45%;
  }
  .travelButton {
    position: absolute;
    z-index: 1;
    top: 10px;
    right: 10px;
    margin: 10px 0;

    & button svg {
      fill: white;
    }

    & ul li button svg {
      fill: currentColor;
    }
  }
`;

const Travel = styled(Link)<{ $bgImg?: string }>`
  width: 85vw;
  /* background-color: #0077cc; */
  height: 300px;
  background: ${(props) =>
    props.$bgImg
      ? `linear-gradient(
      to top,
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0.6) 100%
    ),url(${props.$bgImg})`
      : "#5a6974"};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  /* background-color: #5a6974; */
  border-radius: 15px;
  margin: 15px 0;
  /* position: relative; */
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  color: white;

  @media (min-width: 768px) {
    width: auto;
  }
  /* 
  @media (min-width: 768px) and (max-width: 1023px) {
    width: 85vw;
  }


  @media (min-width: 1440px) {
    width: 53vw;
  } */
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  @media (min-width: 1024px) {
    font-size: 24px;
    line-height: 30px;
  }
`;

const Duration = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: white;
  line-height: 1.5;
  margin: 5px 0 20px;

  @media (min-width: 1024px) {
    font-size: 15px;
  }
`;

const Expense = styled.strong`
  font-size: 25px;
  font-weight: 500;
  margin: 10px 0;
`;

const Location = styled.div``;

const SmallUserBox = styled(CardUserList)`
  /* transform: scale(0.8); */
`;

export default function TourCardList({
  travel,
  formattedBudget,
  index,
}: TravelPlan) {
  return (
    <TrvelWrap>
      <Travel
        to={`/Tour/${travel.encryptCode}`}
        $bgImg={travel.img ? travel.img : "/japan.jpg"}
        state={{ from: "/mypage" }}
      >
        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "flex-end",
          }}
        >
          <Title>{travel.title}</Title>
          <Duration>
            {travel.startDate} - {travel.endDate}
          </Duration>
          <Expense>{formattedBudget[index]}₩</Expense>
          {/* 백엔드 수정 후 user 추가 */}
          <SmallUserBox $size={"S"} />

          <Location>{travel.location}</Location>
        </div>
      </Travel>
      <OptionButton
        className="travelButton"
        editType="editTourCardList"
        travelCode={travel.travelCode}
      />
    </TrvelWrap>
  );
}
