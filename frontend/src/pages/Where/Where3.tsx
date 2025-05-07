import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Where3.css";

interface Where3Props {
  travelData: {
    // isDomestic: boolean;
    location: string;
    startDate: string | null;
    endDate: string | null;
    title: string;
    expense: number;
  };
  updateTravelData: (data: any) => void;
}

const Where3: React.FC<Where3Props> = ({ travelData, updateTravelData }) => {
  // 초기값을 null로 설정하고 타입을 Date | null로 지정
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const isButtonDisabled = !startDate || !endDate;

  const navigate = useNavigate();

  const goToWhere2 = () => {
    navigate("/where2");
  };

  const goToWhere4 = () => {
    // 여행 날짜가 업데이트 되면 travelData를 업데이트
    updateTravelData({
      startDate: startDate,
      endDate: endDate,
    });
    navigate("/Where4");
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );

      setStartDate(localDate);
    }
  };
  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );

      setEndDate(localDate);
    }
  };

  return (
    <div className="where-container3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="left"
        viewBox="0 0 16 16"
        onClick={goToWhere2}
      >
        <path
          fillRule="evenodd"
          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
        />
      </svg>
      <div className="where-title3">
        여행 기간을 <br />
        선택해주세요
      </div>

      {/* 여행 기간 시작일 선택 */}
      <div className="datepicker-container">
        <div className="date-label">여행 시작일</div>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange} // 타입을 명시적으로 지정
          dateFormat="yyyy-MM-dd"
          placeholderText="시작일 선택"
          className="datepicker"
        />
      </div>

      {/* 여행 기간 종료일 선택 */}
      <div className="datepicker-container">
        <div className="date-label">여행 종료일</div>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange} // 타입을 명시적으로 지정
          dateFormat="yyyy-MM-dd"
          placeholderText="종료일 선택"
          className="datepicker"
          minDate={startDate ? startDate : undefined} // startDate가 null이면 undefined로 처리
        />
      </div>

      {/* 확인 버튼 */}
      <div className="button-container">
        <Button
          size="S"
          name="확인"
          $bgColor="blue"
          onClick={goToWhere4}
          disabled={isButtonDisabled}
        />
      </div>
    </div>
  );
};

export default Where3;
