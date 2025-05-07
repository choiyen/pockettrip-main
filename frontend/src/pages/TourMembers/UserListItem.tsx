import React from "react";
import styled from "styled-components";
import OptionButton from "../../components/Common/OptionButton";
import axios from "axios";
interface UserInfoProps {
  travelCode: string;
  email: string;
  profile: string;
}

const ListItem = styled.li`
  display: flex;
  padding: 10px;
  border-radius: 20px;
  margin-bottom: 10px;
  div {
    margin: 0 0 0 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #dedede;
    flex-grow: 1;
  }
  div > h2 {
    font-size: 12px;
    color: #919191;
    margin-bottom: 5px;
  }
  div > span {
    font-size: 18px;
    color: #051e31;
  }
`;

const Button1 = styled.button`
  margin-left: 10px;
  border-radius: 100%;
  border: none;
  background-color: #ff4568;
  width: 25px;
  height: 25px;
  color: white;
`;

const Button2 = styled.button`
  margin-left: 5px;
  border-radius: 100%;
  border: none;
  background-color: #5656ff;
  width: 25px;
  height: 25px;
  color: white;
`;

export default function UserListItem({
  travelCode,
  email,
  profile,
}: UserInfoProps) {
  const token = localStorage.getItem("accessToken");

  const accept = () => {
    axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/plan/check/${travelCode}`,
      email,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain",
        },
      }
    );
  };

  const refuse = () => {};

  return (
    <ListItem>
      <img src={profile} alt="프로필 사진" width="40px" height="40px" />
      <div>
        <h2>이름</h2>
        <span>{email}</span>

        <Button1 onClick={accept}>O</Button1>
        <Button2 onClick={refuse}>X</Button2>
      </div>
    </ListItem>
  );
}
