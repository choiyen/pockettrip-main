import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";
import { setTravelData } from "../../slices/travelSlice";
import "./Where5.css";
import axios from "axios";
import { countryNamesInKorea } from "../Data/countryKoreaNames";

interface Where5Props {
  travelData: {
    location: string;
    startDate: Date | null;
    endDate: Date | null;
    title: string;
    expense: number;
    isCalculate?: boolean;
    img: string;
  };
  updateTravelData: (data: any) => void;
}

const Where5: React.FC<Where5Props> = ({ travelData, updateTravelData }) => {
  const [expense, setBudget] = useState<number>(0); // 예산 상태
  const navigate = useNavigate();
  const [images, setImages] = useState("");

  const goToWhere4 = () => {
    navigate("/where4");
  };

  // 사진 배열속 랜덤한 사진 고르는 함수
  function getRandomElement(arr: any) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // unsplash 이미지 API로 나라별 이미지 고르기
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
        const response = await axios.get(
          `https://api.unsplash.com/search/photos`,
          {
            params: {
              query: `${countryNamesInKorea[travelData.location]}`,
              per_page: 10,
            },
            headers: {
              Authorization: `Client-ID ${ACCESS_KEY}`,
            },
          }
        );
        // 나라 이미지가 없을 경우 추가 검색 실시
        if (response.data.results.length === 0) {
          const response = await axios.get(
            `https://api.unsplash.com/search/photos`,
            {
              params: {
                query: `travel`, // 여행 키워드로 이미지 검색 재실시
                per_page: 10,
              },
              headers: {
                Authorization: `Client-ID ${ACCESS_KEY}`,
              },
            }
          );
          setImages(getRandomElement(response.data.results).urls.regular);
        } else {
          setImages(getRandomElement(response.data.results).urls.regular);
        }
        //
      } catch (error) {
        console.error("Unsplash API 요청 실패:", error);
      }
    };
    fetchImages();
  }, []);

  const goToWhere6 = async () => {
    const token = localStorage.getItem("accessToken");

    updateTravelData({
      expense: Number(expense),
      isCalculate: false,
      img: images,
    }); // 상태 업데이트
    try {
      travelData.expense = Number(expense);
      travelData.img = images;
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/plan/insert`,
        travelData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Where6 페이지로 이동하면서 데이터 전달
      navigate("/Where6", { state: response.data.data[0] });
    } catch (error) {
      console.error("여행 정보 전송간 에러 발생", error);
    }
  };

  const isButtonDisabled = expense <= 0; // 예산이 0 이하이면 버튼 비활성화

  return (
    <div className="where-container5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="left"
        viewBox="0 0 16 16"
        onClick={goToWhere4}
      >
        <path
          fillRule="evenodd"
          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
        />
      </svg>
      <div className="where-title5">
        여행 예산을 <br />
        설정하시겠어요?
      </div>
      <input
        type="text"
        className="input"
        value={expense.toLocaleString()} // 숫자 포맷으로 표시
        placeholder="숫자만 입력해주세요."
        onChange={(e) => {
          const rawValue = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 추출
          setBudget(rawValue === "" ? 0 : Number(rawValue)); // 예산 상태 업데이트
        }}
      />
      <div className="button-container">
        <Button
          size="S"
          name="확인"
          $bgColor="blue"
          onClick={goToWhere6}
          disabled={isButtonDisabled} // 예산이 0이면 버튼 비활성화
        />
        <Button
          size="XL"
          name="예산 설정 없이 기록 시작"
          $bgColor="red"
          onClick={goToWhere6}
        />
      </div>
      <div className="chaGok">0부터 차곡차곡</div>
    </div>
  );
};

export default Where5;
