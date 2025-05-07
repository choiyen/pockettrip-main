import React, { useEffect, useState } from "react";
import "./Register.css";
import Button from "../../components/Common/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface RegisterResponse {
  status: string;
  message: string;
  data?: string[];
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    emailAddr: "",
    password: "",
    passwordConfirm: "",
    phoneNumber: "",
    profile: "/ProfileImage.png",
  });
  const [errors, setErrors] = useState({
    emailAddrError: "",
    passwordConfirmError: "",
    phoneNumberError: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${name}Error`]: "",
    }));

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordConfirmError: "비밀번호가 다릅니다.",
      }));
      return;
    }
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/signup`,
        {
          name: formData.username,
          email: formData.emailAddr,
          password: formData.password,
          phone: formData.phoneNumber,
          profile: formData.profile,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          if (response.data.resultType === "success") {
            setIsSuccess(true);
          } else {
            console.warn(response.data.message);
          }
        }
      })
      .catch((error) => {
        if (error.response) {
          const errorMessage = error.response.data.message;
          console.error("Error Response:", errorMessage);
          if (errorMessage.includes("아이디 중복")) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              emailAddrError: "이미 가입된 아이디입니다.",
            }));
          } else {
            console.error("Unexpected Error:", error.response);
          }
        } else {
          console.error("Network Error:", error.message);
        }
      });
  };

  const navigate = useNavigate();

  return (
    <div className="Register-page" style={{ backgroundColor: "#ffffff" }}>
      <div className="logoSz">
        <a href="/login">
          <img
            style={{ width: "100%", height: "100%" }}
            src="/PocktetTripLogo.png"
            alt="로고위치"
          />
        </a>
      </div>

      <form
        action={`${process.env.REACT_APP_API_BASE_URL}/auth/signup`}
        method="POST"
        id="registerForm"
        onSubmit={handleSubmit}
      >
        <div className="inD">
          <label className="formLabel">이름</label>
          <input
            type="text"
            className="username"
            name="username"
            required
            placeholder="이름을 입력해 주세요"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="inD">
          <label className="formLabel">아이디</label>
          <input
            type="text"
            className="emailAddr"
            name="emailAddr"
            required
            placeholder="이메일을 입력해 주세요"
            value={formData.emailAddr}
            onChange={handleChange}
          />
          {errors.emailAddrError && (
            <span id="emailAddrError" className="error-text show">
              {errors.emailAddrError}
            </span>
          )}
        </div>

        <div className="inD">
          <label className="formLabel">비밀번호</label>
          <input
            type="password"
            className="password"
            name="password"
            required
            placeholder="비밀번호를 입력해 주세요"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="inD">
          <label className="formLabel">비밀번호확인</label>
          <input
            type="password"
            className="password_confirm"
            name="passwordConfirm"
            required
            placeholder="비밀번호를 한번 더 입력해 주세요"
            value={formData.passwordConfirm}
            onChange={handleChange}
          />
          {errors.passwordConfirmError && (
            <span id="passwordConfirmError" className="error-text show">
              {errors.passwordConfirmError}
            </span>
          )}
        </div>

        <div className="inD">
          <label className="formLabel">전화번호</label>
          <input
            type="number"
            className="phoneNumber"
            name="phoneNumber"
            required
            placeholder="전화번호를 입력해 주세요"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumberError && (
            <span id="phoneNumberError" className="error-text">
              {errors.phoneNumberError}
            </span>
          )}
        </div>

        <div className="inD">
          <Button size="L" name="회원가입" $bgColor="blue" type="submit" />
        </div>
      </form>

      <div
        id="RegistersuccessModal"
        style={{ display: isSuccess ? "block" : "none" }}
      >
        <div className="modal">
          <h2>회원가입 완료!</h2>
          <p>회원가입이 성공적으로 완료되었습니다.</p>
          <div className="modalBtBox">
            <button className="modalOffBt" onClick={() => navigate("/login")}>
              완료
            </button>
          </div>
        </div>
      </div>
      <div className="isUser">
        <p style={{ fontSize: "11px" }}>이미 계정이 있으신가요?</p>
        <a className="lostEp" href="/login">
          로그인
        </a>
      </div>
    </div>
  );
};

export default Register;
