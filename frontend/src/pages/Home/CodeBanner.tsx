import React from "react";
import Button from "../../components/Common/Button";
import styled from "styled-components";

interface CodeBannerProps {
  setInputCodeVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const CodeBannerWrap = styled.div`
  line-height: 1.33;
  background: #282828 url("/airplain.png") no-repeat;
  background-size: 83px;
  background-position: 85% center;
  width: 80%;
  margin: 0 auto;
  border-radius: 20px;
  padding: 30px 16px;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.09);
  box-sizing: border-box;

  @media (min-width: 768px) {
    margin: 0;
    background-size: 130px;
    padding: 30px 20px;
    width: 40vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const Paragraph = styled.p`
  font-size: 16px;
  color: white;
  margin-bottom: 10px;

  @media (min-width: 768px) {
    font-size: 18px;
    margin-bottom: 15px;
  }
`;

const Span = styled.span`
  color: #3caeff;
`;

export default function CodeBanner({ setInputCodeVisible }: CodeBannerProps) {
  const showInputCode = () => {
    setInputCodeVisible(true);
  };
  return (
    <CodeBannerWrap>
      <Paragraph>
        코드를 입력하여 <br />
        <Span>여행에 참여</Span>해보세요!
      </Paragraph>
      <Button size="S" name="코드 입력" onClick={() => showInputCode()} />
    </CodeBannerWrap>
  );
}
