import styled from "styled-components";

interface currencyProps {
  기준통화: string;
  통화기호: string;
  통화이름: string;
  환전구매환율: number;
  환전판매환율: number;
}

interface currencyListProps {
  currencyList: currencyProps[];
  toggleState: boolean;
  onCurrencySelect: (currency: number, unit: string) => void; // Function to pass the selected currency
}

export default function CurrencySelector({
  currencyList,
  toggleState,
  onCurrencySelect,
}: currencyListProps) {
  const ChangeToNumber = (str: string) => {
    str.split(",").join("");
  };
  return (
    <>
      {toggleState && (
        <CurrencyBox>
          {currencyList.map((currencyData, index) => (
            <Currency
              key={index}
              id={currencyData.통화기호}
              onClick={() =>
                onCurrencySelect(
                  Number((currencyData.환전구매환율 + "").split(",").join("")),
                  currencyData.통화기호
                )
              } // Call the parent function when a currency is selected
            >
              {currencyData["통화이름"]}
            </Currency>
          ))}
        </CurrencyBox>
      )}
    </>
  );
}

const CurrencyBox = styled.div`
  position: absolute;
  background-color: lightgray;
  top: 80px;
  right: 0;
  border-radius: 10px;
  height: 300px;
  overflow: scroll;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  scrollbar-width: none;
`;

const Currency = styled.div`
  padding: 20px 10px;
  background-color: white;
  white-space: nowrap;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    width: 80%;
    height: 2px;
    bottom: 1px;
    background-color: #e4e4e4;
    left: 50%;
    transform: translateX(-50%);
  }
`;
