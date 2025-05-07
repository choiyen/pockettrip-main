import React from "react";
import styled from "styled-components";

interface nextTourProps {
  nextTour:
    | {
        location: string;
        startDate: string;
        endDate: string;
      }
    | boolean;
}

const BannerWrap = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  gap: 10px;
  background-color: #ede0d4;
  justify-content: space-evenly;
  padding: 30px 24px 20px;
  position: relative;
  z-index: 0;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.09);
  margin-bottom: 20px;

  @media (min-width: 768px) {
    width: 100%;
    height: 422px;
    flex-direction: column-reverse;
    align-items: center;
  }
  @media (min-width: 1024px) {
  }

  img {
    width: 90px;
    height: 64px;
    margin-top: 10px;

    @media (min-width: 768px) {
      width: 80%;
      max-width: 180px;
      height: auto;
    }
  }

  div {
    text-align: center;
  }

  div > h2 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 9px;
    @media (min-width: 768px) and (max-width: 1023px) {
      font-size: 25px;
      margin-bottom: 15px;
    }
    @media (min-width: 1024px) {
      font-size: 30px;
      margin-bottom: 20px;
    }
  }

  div > strong {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 10px;
    display: block;
    @media (min-width: 768px) and (max-width: 1023px) {
      font-size: 35px;
      margin-bottom: 15px;
    }

    @media (min-width: 1024px) {
      font-size: 40px;
      margin-bottom: 20px;
    }
  }

  .noPlan {
    margin-bottom: 0;
    margin-top: 10px;
    font-size: 20px;
    line-height: 1.2;
  }

  div > p {
    font-size: 11px;
    font-weight: 500;
    color: #575757;
    @media (min-width: 768px) and (max-width: 1023px) {
      font-size: 12px;
    }
    @media (min-width: 1024px) {
      font-size: 17px;
    }
  }

  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 40px;
    background-color: #e1c3a7;
    bottom: 0;
    @media (min-width: 768px) and (max-width: 1023px) {
      height: 80px;
    }
    @media (min-width: 1024px) {
      height: 70px;
    }
  }
`;

export default function NextTour({ nextTour }: nextTourProps) {
  let leftDate;
  if (typeof nextTour !== "boolean") {
    // D-day 계산
    const today = new Date().getTime();
    const startedDate = new Date(nextTour!.startDate).getTime();
    leftDate = new Date(startedDate - today).getDate() - 1;
  }
  return (
    <BannerWrap>
      <img src="/package.png" alt="여행가방" />
      {typeof nextTour !== "boolean" ? (
        <div>
          <h2>{nextTour.location}</h2>
          <strong>D - {leftDate}</strong>
          <p>
            {nextTour.startDate} - {nextTour.endDate}
          </p>
        </div>
      ) : (
        <div>
          <strong className="noPlan">
            여행 계획이 <br /> 없습니다!
          </strong>
        </div>
      )}
    </BannerWrap>
  );
}
