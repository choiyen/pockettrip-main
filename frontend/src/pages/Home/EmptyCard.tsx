import React from "react";
import styled from "styled-components";
import Button from "../../components/Common/Button";
import { useNavigate } from "react-router-dom";
const EmptyCardWrap = styled.div`
  text-align: center;
  height: 30vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 0;

  h2 {
    font-family: inherit;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  p {
    font-size: 16px;
    line-height: 25px;
    margin-bottom: 10px;
  }

  &::before {
    content: "?";
    font-weight: bold;
    color: #dce3e6;
    font-size: 250px;
    position: absolute;
    z-index: -1;
    font-family: inherit;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export default function EmptyCard() {
  const navigate = useNavigate();
  return (
    <EmptyCardWrap>
      <h2> 등록된 여행이 없습니다.</h2>
      <p>
        아직 떠날 준비가 안 되셨나요? <br />
        새로운 여행을 추가해보세요!
      </p>
      <Button size="S" name="여행 추가" onClick={() => navigate("/where1")} />
    </EmptyCardWrap>
  );
}
