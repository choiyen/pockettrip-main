import React, { useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import styled, { keyframes } from "styled-components";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { IoIosArrowBack } from "react-icons/io";
import { BsPersonSquare } from "react-icons/bs";
import { FaChartPie } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import OptionButton from "./OptionButton";
import LogoutBox from "./LogoutBox";
import axios from "axios";
import { ChangeLogoutState } from "../../slices/LogoutControlSlice";

interface HeaderState {
  $bgColor?: string;
  userData?: { name: string; profile: string };
  encrypted?: string;
  fromPage?: string;
  logs?: MoneyLogProps[];
}

interface MoneyLogProps {
  LogState: "plus" | "minus";
  title: string;
  detail: string;
  profile: string;
  type: "카드" | "현금";
  money: string;
}

const AccountHeader = styled.div`
  text-align: center;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;
const UserWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 17px;
    @media (min-width: 768px) {
      font-size: 20px;
    }
  }

  strong {
    font-weight: bold;
  }
`;
const MainPageWrap = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;

  img {
    align-self: flex-end;
  }

  span {
    display: block;
  }

  .month {
    font-size: 30px;
    font-weight: 900;
    margin-top: 10px;
    margin-bottom: 10px;

    @media (min-width: 768px) {
      font-size: 40px;
    }
  }
  .year {
    font-size: 24px;
    @media (min-width: 768px) {
      font-size: 30px;
    }
  }
`;
const DateWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  & svg {
    width: 80px;
    height: 60px;
    @media (min-width: 768px) {
      width: 120px;
      height: 100px;
    }
  }
  & text {
    /* x: 0px;
    y: 50px; */
    transform: translate(0px, 50px);
    font-size: 60px;
    stroke: #051e31;
    fill: none;
    stroke-width: 2;
    @media (min-width: 768px) {
      transform: translate(0px, 70px);

      font-size: 80px;
    }
  }
`;
const HeaderWrap = styled.div<{ $bgColor: string; $pathName: string }>`
  padding: 20px;
  background-color: ${(props) => props.$bgColor};
  display: flex;
  justify-content: space-between;
  box-shadow: ${(props) =>
    props.$pathName === "/" ? "0px 3px 8.1px rgba(0,0,0,0.09)" : "none"};
`;

const BackButton = styled.button`
  padding: 0;
  width: 33px;
  height: 33px;
  background-color: transparent;
  border: none;
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  button.optionButton {
    background-color: transparent;
    border: none;
    width: 40px;
  }
`;

export default function Header({
  $bgColor = "transparent",
  userData,
  encrypted,
  fromPage,
  logs = [],
}: HeaderState) {
  const [pathName, setPathName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const [isBoxVisible, setIsBoxVisible] = useState(false);

  const logoutState = useSelector(
    (state: RootState) => state.LogoutControl.logoutState
  );

  const toggleBoxVisibility = () => {
    dispatch(ChangeLogoutState());
  };

  // 글로벌 상태관리로 메인과 마이페이지 중 어디서 들어온 경로인지를 불러와서 관리
  const savePath = useSelector((state: RootState) => state.prevPath.value);

  useEffect(() => {
    setPathName(location.pathname);
  }, [location.pathname]);

  // 리덕스로 모달 상태 글로벌 참조
  const modalState = useSelector(
    (state: RootState) => state.modalControl.modalState
  );

  const handleGoToMoneyChart = () => {
    navigate(`/Tour/${encrypted}/MoneyChart`, { state: { logs } });
  };

  // 오늘 날짜 계산
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const today = new Date();
  const date = today.getDate();
  const month = months[today.getMonth()];
  const year = today.getFullYear();

  const navPath = () => {
    switch (pathName) {
      case `/Tour/${encrypted}`:
        fromPage === "/" ? navigate("/") : navigate("/mypage");
        break;
      case `/Tour/${encrypted}/accountbook`:
        navigate(`/Tour/${encrypted}`, { state: { from: savePath } });
        break;
      case `/Tour/${encrypted}/TourMembers`:
        navigate(`/Tour/${encrypted}`, { state: { from: savePath } });
        break;
      case `/Tour/${encrypted}/MoneyChart`:
        navigate(`/Tour/${encrypted}`, { state: { from: savePath } });
        break;
    }
  };

  const getFormattedDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    };
    return today.toLocaleDateString("ko-KR", options);
  };

  return (
    <HeaderWrap $bgColor={$bgColor} $pathName={pathName}>
      {/* 세부 페이지에서의 뒤로가기 버튼 설정*/}
      {pathName !== "/" && pathName !== "/mypage" && (
        <BackButton onClick={() => navPath()}>
          <IoIosArrowBack size={"25px"} />
        </BackButton>
      )}

      {/* 경로가 지갑페이지일때 */}
      {pathName === `/Tour/${encrypted}` && (
        <ButtonBox>
          <Link to={`/Tour/${encrypted}/MoneyChart`}>
            <button className="optionButton" onClick={handleGoToMoneyChart}>
              <FaChartPie size={"25px"} />
            </button>
          </Link>
          <Link to={`/Tour/${encrypted}/TourMembers`}>
            <button className="optionButton">
              <BsPersonSquare size={"25px"} />
            </button>
          </Link>
          <OptionButton remove={false} editType="editTour" />
          {/* </div> */}
          {/* <OptionButton remove={false} /> */}
        </ButtonBox>
      )}

      {/* 경로가 메인페이지일때 */}
      {pathName === "/" && (
        <MainPageWrap>
          {logoutState && <LogoutBox />}
          <UserWrap>
            <h2>
              어서오세요, <strong>{userData ? userData.name : "테스터"}</strong>
              님! ✈️
            </h2>
            <img
              src={"./" + (userData ? userData.profile : "ProfileImage.png")}
              alt="프로필 사진"
              width="50px"
              height="50px"
              onClick={toggleBoxVisibility}
            />
          </UserWrap>
          <DateWrap>
            <svg>
              <text>{+date < 10 ? "0" + date : date}</text>
            </svg>
            <div style={{ marginLeft: "10px" }}>
              <span className="month">{month}</span>
              <span className="year">{year}</span>
            </div>
          </DateWrap>
        </MainPageWrap>
      )}

      {/* 경로가 가계부일때 */}
      {pathName === `/Tour/${encrypted}/accountbook` && (
        <AccountHeader id={encrypted}>
          <span>{getFormattedDate()}</span>
        </AccountHeader>
      )}

      {/* 네비바를 숨기고 싶을 때 */}
      {pathName !== `/Tour/${encrypted}/accountbook` && <Nav />}

      {/* 필요에 따라 모달창 활성화 */}
      {modalState && <Modal />}
    </HeaderWrap>
  );
}
