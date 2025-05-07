import React, { useState } from "react";
import axios from "axios";
import "./Find.css";
import { useNavigate } from "react-router-dom";

const Find: React.FC = () => {
  const [usernameId, setUsernameId] = useState<string>("");
  const [phoneNumberId, setPhoneNumberId] = useState<string>("");
  const [usernamePw, setUsernamePw] = useState<string>("");
  const [phoneNumberPw, setPhoneNumberPw] = useState<string>("");
  const [emailAddrPw, setEmailAddrPw] = useState<string>("");
  const [errorMessages, setErrorMessages] = useState<any>({});
  const [emailModalState, setEmailModalState] = useState({
    result: false,
    error: false,
  });
  const [passwordModalState, setPasswordModalState] = useState({
    result: false,
    error: false,
  });
  const [userInfo, setUserInfo] = useState<any>(null); // 사용자 정보를 저장할 상태 추가
  const [tempPassword, setTempPassword] = useState<string>(""); // 임시 비밀번호 상태 추가

  const navigate = useNavigate();

  // 아이디 찾기 요청 함수
  const findEmail = async () => {
    try {
      // const response = await axios.post("http://localhost:9000/auth/findID", {
      //   name: usernameId,
      //   phone: phoneNumberId,
      // });
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/findID`,
        {
          name: usernameId,
          phone: phoneNumberId,
        }
      );

      if (response.data.resultType === "success") {
        // 응답 데이터를 파싱하여 이메일을 추출
        const email = JSON.parse(response.data.data[0]).email;
        setUserInfo(email); // 이메일만 상태에 저장
        setEmailModalState({ result: true, error: false }); // 이메일 모달 띄우기
      } else {
        setEmailModalState({ error: true, result: false }); // 실패 시 오류 모달
      }
    } catch (error) {
      console.error("아이디 찾기 오류:", error);
      setEmailModalState({ error: true, result: false }); // 오류 발생 시 오류 모달
    }
  };

  // 비밀번호 찾기 요청 함수 (임시 비밀번호 발급)
  const requestPasswordReset = async () => {
    try {
      // const response = await axios.post("http://localhost:9000/auth/findPW", {
      //   email: emailAddrPw,
      //   phone: phoneNumberPw,
      // });
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/findPW`,
        {
          email: emailAddrPw,
          phone: phoneNumberPw,
        }
      );

      if (response.data.resultType === "success") {
        const data = response.data.data[0]; // 응답에서 첫 번째 데이터 가져오기

        if (data) {
          setTempPassword(data); // 임시 비밀번호 상태에 저장
          setPasswordModalState({ result: true, error: false }); // 비밀번호 모달 띄우기
        } else {
          setPasswordModalState({ error: true, result: false }); // 비밀번호 없음
        }
      } else {
        setPasswordModalState({ error: true, result: false }); // 실패 시 오류 모달
      }
    } catch (error) {
      console.error("비밀번호 찾기 오류:", error);
      setPasswordModalState({ error: true, result: false }); // 오류 발생 시 오류 모달
    }
  };

  return (
    <div>
      <div className="logoSz">
        <a href="/login">
          <img
            style={{ width: "100%", height: "100%" }}
            src="/PocktetTripLogo.png"
            alt="로고위치"
          />
        </a>
      </div>

      <div className="findD">
        {/* 아이디 찾기 폼 */}
        <form className="findForm">
          <h2 style={{ marginBottom: "20px" }}>아이디 찾기</h2>
          <input
            type="text"
            placeholder="이름을 입력해 주세요"
            value={usernameId}
            onChange={(e) => setUsernameId(e.target.value)}
          />
          <span className="error-text">{errorMessages.usernameIdError}</span>

          <input
            type="number"
            placeholder="전화번호를 입력해 주세요"
            value={phoneNumberId}
            onChange={(e) => setPhoneNumberId(e.target.value)}
          />
          <span className="error-text">{errorMessages.phoneNumberIdError}</span>
        </form>
        <button className="findBt" type="button" onClick={findEmail}>
          아이디 찾기
        </button>

        {/* 비밀번호 찾기 폼 */}
        <form className="findForm">
          <h2 style={{ marginBottom: "20px" }}>비밀번호 찾기</h2>
          <input
            type="number"
            placeholder="전화번호를 입력해 주세요"
            value={phoneNumberPw}
            onChange={(e) => setPhoneNumberPw(e.target.value)}
          />
          <span className="error-text">{errorMessages.phoneNumberPwError}</span>

          <input
            type="text"
            placeholder="이메일을 입력해 주세요"
            value={emailAddrPw}
            onChange={(e) => setEmailAddrPw(e.target.value)}
          />
          <span className="error-text">{errorMessages.emailAddrPwError}</span>
        </form>
        <button className="findBt" type="button" onClick={requestPasswordReset}>
          비밀번호 찾기
        </button>
      </div>

      <div className="isUser">
        <p style={{ fontSize: "11px" }}>이미 계정이 있으신가요?</p>
        <a className="lostEp" href="/login">
          로그인
        </a>
      </div>

      {/* 이메일 확인 모달 */}
      {emailModalState.result && (
        <div className="modal">
          <div className="modalContent">
            <p>아이디</p>
            {userInfo ? (
              <div>
                <p>{userInfo}</p> {/* 이메일만 출력 */}
              </div>
            ) : (
              <p>사용자 정보를 찾을 수 없습니다.</p>
            )}
            <button
              onClick={() =>
                setEmailModalState({ ...emailModalState, result: false })
              }
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 비밀번호 확인 모달 */}
      {passwordModalState.result && (
        <div className="modal">
          <div className="modalContent">
            <p>비밀번호</p>
            {tempPassword ? (
              <div>
                <p>{tempPassword}</p> {/* 임시 비밀번호 출력 */}
              </div>
            ) : (
              <p>비밀번호를 찾을 수 없습니다.</p>
            )}
            <button
              onClick={() =>
                setPasswordModalState({ ...passwordModalState, result: false })
              }
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 오류 모달 */}
      {emailModalState.error || passwordModalState.error ? (
        <div className="modal">
          <div className="modalContent">
            <p>잘못된 형식입니다.</p>
            <button
              onClick={() => {
                setEmailModalState({ ...emailModalState, error: false });
                setPasswordModalState({ ...passwordModalState, error: false });
              }}
            >
              닫기
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Find;
