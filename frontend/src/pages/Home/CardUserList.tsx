import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaPlus } from "react-icons/fa6";

interface UserListProps {
  user?: string[]; // user는 반드시 string[] 배열이어야 합니다.
  className?: string;
  $size: "L" | "S";
}

const UserList = styled.ul`
  display: flex;
  gap: 1px;
  li {
    position: relative;
    border-radius: 50%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  li:nth-child(5) {
    font-size: 20px;
  }
`;
const User = styled.img<{ $size: string }>`
  border-radius: 50%;
  width: ${(props) => (props.$size === "L" ? "30px" : "20px")};
`;

export default function CardUserList({
  user = [],
  className,
  $size,
}: UserListProps) {
  // 기본값을 빈 배열로 설정
  const [overFour, setOverFour] = useState(false);
  const sliceUser = user.length >= 5 ? user.slice(0, 4) : user;

  useEffect(() => {
    setOverFour(user.length >= 5);
  }, [user]);

  return (
    <UserList className={className}>
      {sliceUser.map((item, idx) => (
        <li key={idx}>
          <User
            src={item || "/ProfileImage.png"}
            alt="프로필 이미지"
            $size={$size}
          />
        </li>
      ))}

      {/* 유저 수 5명 이상일 때는 플러스 아이콘 렌더링 */}
      {overFour && (
        <li>
          {$size === "L" ? <FaPlus size={"15px"} /> : <FaPlus size={"10px"} />}
        </li>
      )}
    </UserList>
  );
}
