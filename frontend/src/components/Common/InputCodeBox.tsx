import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FcConferenceCall } from "react-icons/fc";
import Button from "./Button";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { ChangeAlertState } from "../../slices/AlertControlSlice";
import axios from "axios";

interface InputCodeProps {
  setInputCodeVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const BoxWrap = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  box-sizing: border-box;
  text-align: center;

  h2 {
    margin-top: 30px;
    text-align: center;
    line-height: 1.5;
    font-size: 20px;
    font-weight: bold;
  }

  p {
    margin: 10px 0 20px 0;
    color: #a5a5a5;
  }

  button {
    margin-bottom: 10px;
  }
`;

const InputWrap = styled.div`
  display: flex;
  gap: 5px;

  input {
    width: 40px;
    height: 40px;
    font-size: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    text-align: center;
    font-weight: 700;
  }
`;

export default function InputCodeBox({ setInputCodeVisible }: InputCodeProps) {
  // 코드 입력 값 6자리 배열로 관리
  const [values, setValues] = useState(Array(6).fill(""));
  // ref 참조에 배열속에 6개 input에 대한 current 참조를 각각 담아 정리한다.
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // 취소 버튼
  const closeInputCode = () => {
    setInputCodeVisible(false);
  };

  // 코드 입력시 작동
  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // 정규 표현식으로 숫자, 영문만 받도록 설정한다.
    if (!/^[0-9a-zA-Z]$/.test(e.target.value)) return;

    // 현재 코드 state 펼쳐서 값 갱신
    const newValue = [...values];
    newValue[index] = e.target.value;
    setValues(newValue);

    // 입력되면 다음 input으로 자동으로 포커스 넘어간다.
    if (e.target.value) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // 글자 지우면 자동으로 focus 뒤로 이동한다.
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      const newValues = [...values];

      if (newValues[index]) {
        newValues[index] = "";
      } else if (index > 0) {
        newValues[index - 1] = "";
        inputsRef.current[index - 1]?.focus();
      }

      setValues(newValues);
    }
  };

  const submitCode = () => {
    const token = localStorage.getItem("accessToken");
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/apply/insert/${values.join("")}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.resultType === "success") {
          closeInputCode();
        }
      });
  };

  return (
    <BoxWrap>
      <FcConferenceCall size={"80px"} />
      <h2>코드 입력</h2>
      <p>초대 코드를 입력해주세요!</p>
      <InputWrap>
        {values.map((value, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
        ))}
      </InputWrap>

      <Button
        size="S"
        name="취소"
        $bgColor="transparent"
        onClick={() => closeInputCode()}
      />
      <Button size="S" name="입력" onClick={() => submitCode()} />
    </BoxWrap>
  );
}
