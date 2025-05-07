import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useParams, useLocation } from "react-router-dom";
import Header from "../../components/Common/Header"; // Header 컴포넌트 임포트

// 카테고리, 지출 수단, 통화 데이터
const categoryList = [
  {
    name: "숙소",
    percentage: 14.2,
    amount: "68,400 KRW",
    icon: "🏨",
    color: "#A5D8FF",
  },
  {
    name: "식사",
    percentage: 9.7,
    amount: "46,740 KRW",
    icon: "🍴",
    color: "#FFD3B6",
  },
  {
    name: "투어",
    percentage: 8.3,
    amount: "39,900 KRW",
    icon: "🎡",
    color: "#FFEE93",
  },
  {
    name: "마트",
    percentage: 7.2,
    amount: "34,507.8 KRW",
    icon: "🛒",
    color: "#FFB6C1",
  },
  {
    name: "교통",
    percentage: 7.1,
    amount: "34,200 KRW",
    icon: "🚗",
    color: "#D9C2E9",
  },
];
const paymentList = [
  {
    name: "현금",
    percentage: 77.1,
    amount: "370,500 KRW",
    icon: "💵",
    color: "#4CAF50",
  },
  {
    name: "카드",
    percentage: 22.9,
    amount: "109,747.8 KRW",
    icon: "💳",
    color: "#007BFF",
  },
];
const currencyList = [
  {
    name: "VND",
    percentage: 95.2,
    amount: "10,435,480 VND",
    converted: "594,822.36 KRW",
    icon: "🇻🇳",
    color: "#D3D3D3",
  },
  {
    name: "KRW",
    percentage: 4.8,
    amount: "30,000 KRW",
    converted: "30,000 KRW",
    icon: "🇰🇷",
    color: "#BEBEBE",
  },
  {
    name: "USD",
    percentage: 3,
    amount: "30 USD",
    converted: "43,379.68 KRW",
    icon: "🇺🇸",
    color: "#F4A8A8",
  },
];

// TabMenu 컴포넌트
const TabMenu = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab: (index: number) => void;
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "20px",
      }}
    >
      {["카테고리 별", "지출수단 별", "통화 별"].map((tab, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(index)}
          style={{
            flex: 1,
            padding: "10px 20px",
            margin: "0 5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: activeTab === index ? "#f5f5f5" : "#fff",
            fontWeight: activeTab === index ? "bold" : "normal",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

// PieChart 컴포넌트
const PieChartComponent = ({
  data,
}: {
  data: { name: string; percentage: number; color: string }[];
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="percentage"
          nameKey="name"
          innerRadius="40%"
          outerRadius="70%"
          paddingAngle={5}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

// List 컴포넌트
const List = ({ list }: { list: any[] }) => {
  return (
    <div>
      {list.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "15px",
            padding: "10px",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <span style={{ fontSize: "24px", marginRight: "10px" }}>
            {item.icon}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "14px", color: "#666" }}>{item.name}</div>
            <div style={{ fontSize: "12px", color: "#999" }}>
              {item.percentage}%
            </div>
          </div>
          <div style={{ fontWeight: "bold" }}>{item.amount}</div>
          {item.converted && (
            <div style={{ fontSize: "12px", color: "#999" }}>
              ({item.converted})
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// MoneyChart 컴포넌트
const MoneyChart = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { id } = useParams();
  const { encrypted } = useParams<{ encrypted: string }>();

  const dataSets = [
    categoryList.map((item) => ({
      name: item.name,
      percentage: item.percentage,
      color: item.color || "#A5D8FF", // 기본 색상
    })),
    paymentList.map((item) => ({
      name: item.name,
      percentage: item.percentage,
      color: item.color || "#4CAF50", // 기본 색상
    })),
    currencyList.map((item) => ({
      name: item.name,
      percentage: item.percentage,
      color: item.color || "#D3D3D3", // 기본 색상
    })),
  ];

  useEffect(() => {}, [id]);

  const location = useLocation();
  const logs = location.state?.logs || [];

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        paddingBottom: "60px",
      }}
    >
      <Header $bgColor="transparent" encrypted={encrypted} />
      <TabMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      <PieChartComponent data={dataSets[activeTab]} />
      <List
        list={
          activeTab === 0
            ? categoryList
            : activeTab === 1
            ? paymentList
            : currencyList
        }
      />
      {activeTab === 2 && (
        <div
          style={{ textAlign: "center", marginTop: "20px", fontWeight: "bold" }}
        >
          총 624,822.36 원
        </div>
      )}
    </div>
  );
};

export default MoneyChart;
