import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import styled from "styled-components";
import { BsFire } from "react-icons/bs";
import axios from "axios";

interface responseData {
  visitCount: number;
  visitRatio: number;
  _id: string;
}

// Chart.js 등록
ChartJS.register(ArcElement, Tooltip);

// const data = {
//   labels: ["한국", "일본", "미국"],
//   datasets: [
//     {
//       data: [35, 25, 15], // 퍼센트 데이터
//       backgroundColor: [
//         "#0085E5", //
//         "#50a6e4", // 파랑
//         "#b7cbda", // 노랑
//       ],
//     },
//   ],
// };

// const options = {
//   cutout: "50%", // 중앙 구멍 크기 조절
//   plugins: {
//     legend: {
//       display: false, // 기본 Chart.js 범례 숨기기
//     },
//   },
// };
const ChartBoxWrap = styled.div`
  width: 80%;
  margin: 0 auto;
  background-color: white;
  border-radius: 20px;
  margin-top: 20px;
  padding: 16px;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.09);

  @media (min-width: 768px) {
    width: 40vw;
    margin: 0;
  }
`;

const ChartContainer = styled.div`
  width: 45%;
`;
const LabelBox = styled.ul`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 40px;
`;

const LabelItem = styled.li<{ $index: number }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  color: #949494;
  &::before {
    content: "";
    width: 20px;
    height: 20px;
    background-color: ${(props) =>
      props.$index === 0
        ? "#FFCC00"
        : props.$index === 1
        ? "#C0C0C0"
        : "#CD7F32"};
    position: absolute;
    left: -25px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 3px;
  }
  .DataPercent {
    color: #4f4f4f;
  }
`;

const Title = styled.h2`
  margin-bottom: 10px;
`;

interface ChartProps {
  popularCountry: {
    labels: string[];
    data: number[];
  };
}
export default function DoughnutChart({ popularCountry }: ChartProps) {
  const [rankData, setRankData] = useState<{
    labels: string[];
    data: number[];
  }>({ labels: [], data: [] });

  const getData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/plan/count/location`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const totalRank = response.data.data;
      const labelsArr = totalRank
        .map((item: responseData) => item._id)
        .slice(0, 3);
      const dataArr = totalRank
        .map((item: responseData) => item.visitRatio)
        .slice(0, 3);
      setRankData({ labels: [...labelsArr], data: [...dataArr] });
    } catch (err) {
      console.error("도넛 차트 데이터 불러오기 오류", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const data = {
    labels: rankData.labels,
    datasets: [
      {
        data: rankData.data, // 퍼센트 데이터
        backgroundColor: [
          "#FFCC00", //
          "#C0C0C0", // 파랑
          "#CD7F32", // 노랑
        ],
      },
    ],
  };

  const options = {
    cutout: "50%", // 중앙 구멍 크기 조절
    plugins: {
      legend: {
        display: false, // 기본 Chart.js 범례 숨기기
      },
    },
  };

  return (
    <ChartBoxWrap>
      <Title>
        <BsFire color={"#CC0003"} /> 인기 여행지
      </Title>
      <div style={{ display: "flex" }}>
        <ChartContainer>
          <Doughnut data={data} options={options} />
        </ChartContainer>

        <LabelBox>
          {data.labels.map((label, index) => (
            <LabelItem $index={index} key={index}>
              {label}
              <span className="DataPercent">
                {data.datasets[0].data[index]}%
              </span>
            </LabelItem>
          ))}
        </LabelBox>
      </div>
    </ChartBoxWrap>
  );
}
