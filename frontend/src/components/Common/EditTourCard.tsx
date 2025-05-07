import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FcAddImage } from "react-icons/fc";
import SelectLocation from "../ui/SelectLocation";
import axios from "axios";
import { countryNamesInKorean } from "../../pages/Data/countryNames";
import DatePicker from "react-datepicker";
import Button from "./Button";
import imageCompression from "browser-image-compression";

interface EditTourCardProps {
  ChangeState: () => void;
  travel: TravelPlan;
}

interface TravelPlan {
  id: string;
  img: string;
  travelCode: string;
  title: string;
  founder: string;
  location: string;
  startDate: string; // 날짜 문자열
  endDate: string; // 날짜 문자열
  expense: number;
  calculate: boolean;
  participants: string[]; // 참가자 리스트 (배열)
  encryptCode: string;
  currentCurrency: number;
}
/*
배경이미지 > 파일 인풋
투어 장소 > 드롭다운 
방 이름 > 문자열 입력
시작일 > 달력
종료일  > 달력

소비 방식 > 0일경우 누적 > 숫자 입력시 한도 설정



처음 열면 기본값이 다 들어있다. 

소비 방식의 경우
0일때 한도를 입력으로 바꿀 시 > 누적되던 금액을 한도에서 뺀 값으로 표시한다. 
한도 입력에서 누적으로 바꿀 시 > 누적되던 금액으로 교체
*/
const Container = styled.div`
  padding: 10px;
  padding-bottom: 100px;
  .hidden {
    display: none;
    border-radius: 10px;
  }
  .selectFile {
    border: 2px solid #e2e2e2;
    display: block;
    text-align: center;
    padding: 20px 0;
    margin-bottom: 50px;

    svg {
      display: block;
      margin: 0 auto 20px;
    }
  }

  .fileName {
    margin: 0 auto;
    line-height: 1.2;
    width: 50%;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  color: #6f6f6f;
  margin-bottom: 5px;
  margin-top: 30px;
  align-self: flex-start;
  display: block;
`;

const InputText = styled.input`
  background-color: transparent;
  border-bottom: 1px solid grey;
  border-radius: 0;
  width: 100%;
  max-width: 768px;
  font-weight: bold;
  font-size: 18px;
  padding-left: 15px;
  margin-bottom: 0;
`;

const StyledSelection = styled.div`
  & .where-option2 {
    background-color: white;
    box-shadow: none;
    width: 100%;
    border-bottom: 1px solid grey;
    border-radius: 0;
  }
  & .dropdown-menu {
    position: absolute;
  }
`;

const DateSection = styled.div`
  & .react-datepicker-wrapper {
    width: 100%;
  }
  & .datepicker {
    width: 100%;
    border-radius: 0;
    border: none;
    border-bottom: 1px solid grey;
    text-align: left;
    padding-left: 15px;
  }
`;

const ButtonWrap = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
  margin-bottm: 100px;
`;

const StyledButton = styled(Button)`
  background-color: #e3e3e3;
  color: #121212;
`;
export default function EditTourCard({
  ChangeState,
  travel,
}: EditTourCardProps) {
  // const { img = "japan.jpg" } = travel;
  const startDateObj = new Date(travel.startDate);
  const endDateObj = new Date(travel.endDate);
  const [Imagefile, setImageFile] = useState<File | string>(travel.img); // 썸네일
  const [ImageURL, setImageURL] = useState<string>(travel.img); // 썸네일
  const [location, setSelectedCountry] = useState<string>(travel.location); // 나라 선택
  const [tourName, setTourName] = useState<string>(travel.title); // 여행 이름
  const [startDate, setStartDate] = useState<Date | null>(startDateObj); // 여행 시작일
  const [endDate, setEndDate] = useState<Date | null>(endDateObj); // 여행 종료일
  const [currency, setCurrency] = useState<number>(travel.currentCurrency); // 여행 예산
  const [moneyMethod, setMoneyMethod] = useState<number>(travel.expense); // 여행 예산

  const [countries, setCountries] = useState<string[]>([]); // 나라 목록
  const [search, setSearch] = useState<string>(""); // 검색어
  const [isEditing, setIsEditing] = useState<boolean>(false); // 드롭다운 활성화 여부
  const [formData, setFormData] = useState<FormData>(new FormData());
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTourName(e.target.value);
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

  const handleMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMoneyMethod(e.target.valueAsNumber);
  };

  const handleCurrentCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(e.target.valueAsNumber);
  };

  // 압축된 Blob 파일을 다시 File 형식으로 변환
  const convertBlobToFile = (blob: Blob, originalFileName: string) => {
    return new File([blob], originalFileName, {
      type: blob.type,
      lastModified: Date.now(),
    });
  };

  // 파일이 존재할 경우 압축 후 Blob된걸 File 형식으로 다시 변환
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      try {
        const compressedBlob = await imageCompression(file, options);
        const compressedFile = convertBlobToFile(compressedBlob, file.name);

        setImageFile(compressedFile);
        setImageURL(compressedFile.name);
      } catch (error) {
        console.error("이미지 압축 실패", error);
        event.target.value = "";
      }
    }
  };

  useEffect(() => {
    // 데이터가 들어있을 경우에만 실행
    if (!formData || !formData.has("location")) return;

    // 업로드 시도
    const upDateData = async () => {
      if (!formData) return;
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/plan/update/${travel.travelCode}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // 🔹 Bearer Token 추가
            },
          }
        );
        if (response.status === 200) {
          alert("변경 사항이 저장되었습니다!");
        } else {
          alert("저장에 실패했습니다.");
        }
      } catch (err) {
        console.error(err);
      }
    };
    upDateData();
  }, [formData]);

  // 저장을 위해 데이터 정리
  const handleSaveData = async () => {
    // 새 객체를 만들어 useState 업데이트 시도
    const formDatas = new FormData();
    // formData 객체에 데이터 정리
    formDatas.append("location", location);
    formDatas.append("title", tourName);
    formDatas.append(
      "startDate",
      String(new Date(String(startDate)).toISOString().split("T")[0])
    ); // ✅ YYYY-MM-DD 변환

    formDatas.append(
      "endDate",
      String(new Date(String(endDate)).toISOString().split("T")[0])
    ); // ✅ YYYY-MM-DD 변환
    formDatas.append("expense", String(moneyMethod));
    formDatas.append("founder", travel.founder);
    formDatas.append("isCalculate", "false");
    formDatas.append("travelCode", travel.travelCode);
    formDatas.append("currentCurrency", String(travel.currentCurrency));
    if (Imagefile) {
      formDatas.append("image", Imagefile);
    }
    setFormData(formDatas);
  };

  return (
    <Container>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload" className="selectFile">
        <div>
          <FcAddImage size={"100px"} />
          <span className="fileName">
            {ImageURL ? ImageURL : "파일을 선택하세요"}
          </span>
        </div>
      </label>

      <StyledSelection>
        <Label>나라 선택</Label>
        <SelectLocation
          setIsEditing={setIsEditing}
          setSearch={setSearch}
          setSelectedCountry={setSelectedCountry}
          isEditing={isEditing}
          search={search}
          filteredCountries={filteredCountries}
          location={location}
        />
      </StyledSelection>

      <Label htmlFor="username">여행 이름</Label>
      <InputText
        id="username"
        type="text"
        value={tourName}
        onChange={handleNameChange}
        placeholder="여행 이름을 입력하세요"
      />

      <DateSection>
        <Label>여행 시작일</Label>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange} // 타입을 명시적으로 지정
          dateFormat="yyyy-MM-dd"
          placeholderText="시작일 선택"
          className="datepicker"
        />
      </DateSection>

      <DateSection>
        <Label>여행 종료일</Label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange} // 타입을 명시적으로 지정
          dateFormat="yyyy-MM-dd"
          placeholderText="종료일 선택"
          className="datepicker"
          minDate={startDate ? startDate : undefined} // startDate가 null이면 undefined로 처리
        />
      </DateSection>

      <Label htmlFor="currency">현재 설정 환율(₩)</Label>
      <InputText
        id="currency"
        type="number"
        value={currency}
        onChange={handleCurrentCurrency}
        placeholder="원하는 환율값을 입력해주세요"
      />

      <Label htmlFor="moneyCount">여행 예산</Label>
      <InputText
        id="moneyCount"
        type="number"
        value={moneyMethod}
        onChange={handleMoneyChange}
        placeholder="미기입시 0부터 누적"
      />

      <ButtonWrap>
        <StyledButton
          size="S"
          name="취소"
          $bgColor="transparent"
          onClick={ChangeState}
        />
        <Button size="S" name="확인" onClick={() => handleSaveData()} />
      </ButtonWrap>
    </Container>
  );
}
