import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTravelData } from "../../slices/travelSlice";
import Button from "../../components/Common/Button";
import "./Where6.css";
import { useMemo, useEffect } from "react";
import axios from "axios";
import { FaRegCopy } from "react-icons/fa6";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const ClipboardButton = styled.button`
  background-color: transparent;
  border: none;
  width: 35px;
  height: 35px;
  & svg {
    font-size: 20px;
    color: #8b8b8b;
  }
  position: absolute;
  top: 50%;
  right: -40px;
  transform: translateY(-50%);
`;

export default function Where6() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const travelData = location.state || {}; // 전달받은 데이터

  const memoizedTravelData = useMemo(() => travelData, [travelData]);

  const goToIndex = async () => {
    navigate("/");
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(travelData[0].travelCode)
      .then(() => alert("코드가 클립보드에 복사되었습니다."))
      .catch((err) => console.error("클립보드 복사에 실패하였습니다.", err));
  };

  return (
    <div className="where-container6">
      <div className="where-title6">
        초대코드로
        <br />
        친구를 초대하세요!
      </div>
      <Container className="code">
        {travelData[0].travelCode}
        <ClipboardButton onClick={copyToClipboard}>
          <FaRegCopy />
        </ClipboardButton>
      </Container>
      <div className="button-container6">
        <Button size="M" name="확인" $bgColor="blue" onClick={goToIndex} />
      </div>
      <div className="code2">초대 코드는 언제든 다시 확인할 수 있습니다.</div>

      {/* 받은 travelData 확인용 (디버깅) */}
      {/* <pre>{JSON.stringify(travelData, null, 2)}</pre> */}
    </div>
  );
}
