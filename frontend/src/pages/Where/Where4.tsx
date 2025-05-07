import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";
import "./Where4.css";

interface Where4Props {
  travelData: {
    // isDomestic: boolean;
    location: string;
    startDate: Date | null;
    endDate: Date | null;
    title: string;
    expense: number;
  };
  updateTravelData: (data: any) => void;
}

const Where4: React.FC<Where4Props> = ({ travelData, updateTravelData }) => {
  const [title, setTitle] = useState<string>("");
  const navigate = useNavigate();

  const goToWhere3 = () => {
    navigate("/where3");
  };

  const goToWhere5 = () => {
    // 지갑 이름을 travelData에 추가하여 업데이트
    updateTravelData({
      title: title, // 지갑 이름 업데이트
    });
    // Where5 페이지로 이동
    navigate("/Where5");
  };

  const isButtonDisabled = title.trim() === ""; // 이름이 없으면 버튼 비활성화

  return (
    <div className="where-container4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="left"
        viewBox="0 0 16 16"
        onClick={goToWhere3}
      >
        <path
          fillRule="evenodd"
          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
        />
      </svg>
      <div className="where-title4">
        여행 지갑에 <br />
        이름을 붙여주세요!
      </div>
      <input
        type="text"
        className="inputValue"
        value={title}
        onChange={(e) => setTitle(e.target.value)} // 이름 입력 추적
      />
      <div className="button-container">
        <Button
          size="S"
          name="확인"
          $bgColor="blue"
          onClick={goToWhere5}
          disabled={isButtonDisabled}
        />
      </div>
    </div>
  );
};
export default Where4;
