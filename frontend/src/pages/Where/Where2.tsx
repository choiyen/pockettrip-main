import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Common/Button";
import "./Where2.css";
import { countryNamesInKorean } from "../Data/countryNames";
import { countryCurrencies } from "../Data/countryMoney";
import styled from "styled-components";
import SelectLocation from "../../components/ui/SelectLocation";
import ExchangeRate from "../../components/ui/ExchangeRate";

interface Where2Props {
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

const Buttons = styled(Button)`
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #0056b3;
  }
`;

const Where2: React.FC<Where2Props> = ({ travelData, updateTravelData }) => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<string[]>([]); // 나라 목록
  const [search, setSearch] = useState<string>(""); // 검색어
  const [location, setSelectedCountry] = useState<string>(""); // 선택된 나라
  const [isEditing, setIsEditing] = useState<boolean>(false); // 드롭다운 활성화 여부
  const isButtonDisabled = !location;
  const [pound, setPound] = useState<string>("$");
  const [currencyValue, SetCurrencyValue] = useState<number>(0);

  // 페이지 이동 함수
  const goToWhere1 = () => {
    navigate("/where1");
  };
  const goToWhere3 = () => {
    if (!currencyValue) return;
    // 나라가 선택되면 travelData 업데이트
    updateTravelData({
      location: location,
      currentCurrency: currencyValue,
    });
    navigate("/Where3");
  };

  useEffect(() => {
    if (!location) {
      return;
    }
    const englishName = Object.entries(countryNamesInKorean).filter(
      (item) => item[1] === location
    )[0][0];
    const pound = Object.entries(countryCurrencies)
      .filter((item) => item[0] === englishName)[0][1]
      .split(",")[1];

    setPound(pound);
  }, [location]);

  // API 호출로 나라 목록 불러오기
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countryNames = response.data.map((country: any) => {
          const englishName: string = country.name.common;
          return countryNamesInKorean[englishName] || englishName;
        });
        setCountries(countryNames); // 나라 목록 상태 업데이트
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
      }
    };

    fetchCountries();
  }, []);

  // 검색어로 필터링된 나라 목록
  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(search.toLowerCase())
  );

  // 한글 순으로 정렬
  const sortedCountries = filteredCountries.sort((a, b) =>
    a.localeCompare(b, "ko")
  );

  return (
    <div className="where-container2">
      {/* 뒤로가기 화살표 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="left"
        viewBox="0 0 16 16"
        onClick={goToWhere1}
      >
        <path
          fillRule="evenodd"
          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
        />
      </svg>

      <div className="where-title2">
        어느 나라로 <br />
        떠날 계획인가요?
      </div>

      <SelectLocation
        setIsEditing={setIsEditing}
        setSearch={setSearch}
        setSelectedCountry={setSelectedCountry}
        isEditing={isEditing}
        search={search}
        filteredCountries={filteredCountries}
        location={location}
      />

      <ExchangeRate
        pound={pound}
        SetCurrencyValue={SetCurrencyValue}
        currencyValue={currencyValue}
      />

      {/* 확인 버튼 */}
      <div className="button-container">
        <Buttons
          size="S"
          name="확인"
          $bgColor="blue"
          onClick={goToWhere3}
          disabled={!location}
        />
      </div>
    </div>
  );
};

export default Where2;
