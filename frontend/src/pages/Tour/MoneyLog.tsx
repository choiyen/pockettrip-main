import React from "react";
import OptionButton, { OptionWrap } from "../../components/Common/OptionButton";
import styled from "styled-components";

interface MoneyLogProps {
  LogState: "plus" | "minus";
  title: string;
  detail: string;
  profile: string;
  type: "카드" | "현금";
  money: string;
  className: string;
}

const LogWrap = styled.li`
  position: relative;
  display: flex;
  font-size: 17px;
  padding: 10px 20px;
  align-items: center;

  @media (min-width: 768px) {
    width: 70%;
    margin: 0px auto;
  }
  @media (min-width: 1024px) {
    width: 40%;
    margin: 0px auto;
  }

  .InfoBox {
    display: flex;
    flex-grow: 1;
    align-items: center;
    border-bottom: 1px solid #dedede;
    padding: 20px 0;
    justify-content: space-between;
  }

  .TitleBox {
    margin-left: 20px;
  }

  div > h2 {
    font-weight: bold;
    margin-bottom: 5px;
  }
  div > h3 {
    font-weight: normal;
  }
  .MoneyData {
    text-align: right;
    margin-left: auto;
  }
  .MoneyData > span {
    display: block;
    color: #4f4f4f;
    margin-top: 5px;
  }
`;

const MoneyData = styled.strong<{ $color: "plus" | "minus" }>`
  font-weight: 900;
  color: ${(props) => (props.$color === "plus" ? "#0077CC" : "#CC0003")};
  margin-left: auto;
`;

const StyledOptionButton = styled(OptionButton)`
  position: relative;
  top: 0;
  right: 0;
`;

export default function MoneyLog({
  LogState,
  title,
  detail,
  profile,
  type,
  money,
  className,
}: MoneyLogProps) {
  return (
    <LogWrap className={className}>
      <div>
        <img src={profile} alt="프로필 이미지" width={"40px"} />
      </div>
      <div className="InfoBox">
        <div className="TitleBox">
          <h2>{title}</h2>
          <h3>{detail}</h3>
        </div>
        <div className="MoneyData">
          <MoneyData $color={LogState}>
            {LogState === "plus" ? "+" : "-"} ₩ {money}
          </MoneyData>
          <span>{type}</span>
        </div>
        <StyledOptionButton editType="editMoneyLog" />
      </div>
    </LogWrap>
  );
}
