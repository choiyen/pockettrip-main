import styled from "styled-components"

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

export default function CurrencySelector({currencyList, toggleState, onCurrencySelect}: currencyListProps){
    return (
        <>
        {toggleState && <CurrencyBox>
          {currencyList.map((currencyData, index) => (
              <Currency
                key={index}
                id={currencyData.통화기호}
                onClick={() => onCurrencySelect(currencyData.환전구매환율, currencyData.통화기호)} // Call the parent function when a currency is selected
              >
                {currencyData.통화기호}
              </Currency>
            ))}
        </CurrencyBox>}
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
    width: 100px;
    text-align: center;
`;

const Currency = styled.div`
    padding: 10px;
    border: 1px solid white;
`;