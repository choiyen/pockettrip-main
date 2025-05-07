import React, { useEffect, useState } from "react";
import "./styles/reset.css";
import "./styles/global.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/Home/MainPage";
import MyPage from "./pages/Mypage/MyPage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Find from "./pages/Find/Find";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import AlertBox from "./components/Common/AlertBox";
import Where1 from "./pages/Where/Where1";
import Where2 from "./pages/Where/Where2";
import Where3 from "./pages/Where/Where3";
import Where4 from "./pages/Where/Where4";
import Where5 from "./pages/Where/Where5";
import Where6 from "./pages/Where/Where6";
import Tour from "./pages/Tour/Tour";
import Categories from "./pages/Tour/Categories";
// import AccountBook from "./pages/Tour/AccountBook";
import TourMembers from "./pages/TourMembers/TourMembers";
import MoneyChart from "./pages/MoneyChart/MoneyChart";
import RequireAuth from "./components/Common/RequireAuth";
import { socketService } from "./pages/Tour/socketService";
import Alert from "./components/Common/Alert";
import { hideAlert } from "./slices/AlertControlSlice";

function App() {
  // 알림창 관련 로직
  // 리덕스로 알림창 상태 관리
  const dispatch: AppDispatch = useDispatch();
  const alertState = useSelector(
    (state: RootState) => state.AlertControl.alertState
  );
  const isVisible = useSelector(
    (state: RootState) => state.AlertControl.isVisible
  );
  // const [alertMessage, setAlertMessage] = useState("");
  // const [alertType, setAlertType] = useState<"success" | "error" | "info">(
  //   "success"
  // );

  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    socketService.connect(token);

    return () => {
      socketService.disconnect();
    };
  }, []);

  // 2초 후 다시 알림창을 끈다.
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideAlert());
        console.log("알림 닫힘");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // travelData 상태 정의
  const [travelData, setTravelData] = useState({
    // isDomestic: true, // 국내/해외 여부
    location: "", // 선택한 나라
    startDate: null, // 여행 시작 날짜
    endDate: null, // 여행 종료 날짜
    title: "", // 여행지갑 이름
    expense: 0, // 예산
    img: "",
  });

  // 상태를 업데이트하는 함수
  const updateTravelData = (data: any) => {
    setTravelData((prevData) => ({ ...prevData, ...data }));
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Login/Register" element={<Register />} />
          <Route path="/Login/Find" element={<Find />} />
          <Route path="/" element={<RequireAuth>{<MainPage />}</RequireAuth>} />
          <Route
            path="/mypage"
            element={<RequireAuth>{<MyPage />}</RequireAuth>}
          />
          <Route
            path="/Where1"
            element={
              <RequireAuth>
                <Where1 updateTravelData={updateTravelData} />
              </RequireAuth>
            }
          />
          <Route
            path="/Where2"
            element={
              <RequireAuth>
                <Where2
                  travelData={travelData}
                  updateTravelData={updateTravelData}
                />
              </RequireAuth>
            }
          />
          <Route
            path="/Where3"
            element={
              <RequireAuth>
                <Where3
                  travelData={travelData}
                  updateTravelData={updateTravelData}
                />
              </RequireAuth>
            }
          />
          <Route
            path="/Where4"
            element={
              <RequireAuth>
                <Where4
                  travelData={travelData}
                  updateTravelData={updateTravelData}
                />
              </RequireAuth>
            }
          />
          <Route
            path="/Where5"
            element={
              <RequireAuth>
                <Where5
                  travelData={travelData}
                  updateTravelData={updateTravelData}
                />
              </RequireAuth>
            }
          />
          <Route
            path="/Where6"
            element={
              <RequireAuth>
                <Where6 />
              </RequireAuth>
            }
          />
          <Route
            path="/Tour/:encrypted"
            element={
              <RequireAuth>
                <Tour />
              </RequireAuth>
            }
          />
          <Route
            path="/Tour/:encrypted/TourMembers"
            element={
              <RequireAuth>
                <TourMembers />
              </RequireAuth>
            }
          />
          <Route
            path="/Tour/:encrypted/MoneyChart"
            element={
              <RequireAuth>
                <MoneyChart />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
      {alertState && <AlertBox />}
      {isVisible && <Alert />}
    </div>
  );
}

export default App;
