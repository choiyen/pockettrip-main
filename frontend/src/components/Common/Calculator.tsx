import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import CurrencySelector from "./CurrencySelector";

interface currencyProps {
  기준통화: string;
  통화기호: string;
  통화이름: string;
  환전구매환율: number;
  환전판매환율: number;
}

const CalculatorBody = styled.div`
  width: 100%;
  max-width: 400px;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin: 0 auto;
  position: relative;
`;

const CurrencyInfo = styled.span`
  font-size: 12px;
  position: absolute;
  color: black;
  top: 10px;
  left: 20px;
  z-index: 10;
  width: 100%;
`;

const Unit = styled.div`
  margin: 0 0 0 20px;
  font-size: 30px;
  color: gray;
`;

const Text = styled.div`
  font-size: 36px;
  margin: 0 0 0 10px;

  overflow-y: hidden;
  width: 40vw;

  & span {
    font-weight: 500;
  }
`;

const Output = styled.div`
  overflow-x: auto;
  scrollbar-width: none;
  background-color: #f4f4f4;
  width: 100%;
  height: 120px;
  border-radius: 15px;
  margin: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  /* @media (min-width: 1024px) {
    width: 50vw;
  } */
`;

const Exchange = styled.div`
  position: absolute;
  top: 120px;
  left: 50px;
  z-index: 10;
  background: #7b7b7b;
  border-radius: 100%;
  width: 30px;
  height: 30px;
  box-shadow: 5px 0px 4px 1px #00000040;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// const Output2 = styled.div`
//   background-color: #f4f4f4;
//   width: 85vw;
//   height: 120px;
//   border-radius: 15px;
//   margin: 8px;
//   display: flex;
//   align-items: center;
// `;

const InputBody = styled.div`
  /* width: 85vw; */
  display: flex;
`;

const Numbers = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;

  width: 75%;
  height: 360px;
  margin: 10px 0;

  & button {
    font-size: 36px;
    height: 70px;
    background: rgb(0, 0, 0, 0);
    border: 0;
  }

  & last-child {
    color: #0077cc;
    font-size: 48px;
  }
`;

const Operators = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;

  width: 25%;
  height: 360px;
  margin: 10px 0;

  & button {
    font-size: 48px;
    width: 60px;
    height: 60px;
    background: rgb(0, 0, 0, 0);
    border: 0;
    color: #b1b1b1;
  }
  & button:first-child {
    font-size: 35px;
  }

  & first-child {
    font-weight: 700;
    font-size: 24px;
  }
`;

const NumberButton = styled.button`
  width: 33.33%;
`;

const SelectUnitButton = styled.div`
  position: absolute;
  right: 10px;
`;

export default function Calculator() {
  const [result, setResult] = useState(0);
  const [input1, setInput1] = useState(0);
  const [input2, setInput2] = useState(0);
  const [operator, setOperator] = useState("");
  const [isDecimal, setIsDecimal] = useState(false);
  const [decimalPosition, setDecimalPosition] = useState(0);
  const [unit, setUnit] = useState("₩");
  const [currencyList, setCurrencyList] = useState<currencyProps[]>([]);
  const [currency, setCurrency] = useState(1);
  const [toggleState, setToggleState] = useState(false);

  const output2 = result * currency;

  const numbersElements = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    ".",
    "0",
    "=",
  ];
  const operatorElements = ["AC", "/", "*", "-", "+"];

  const showNumber = (number: string) => {
    if (number === ".") {
      setIsDecimal(true);
      setDecimalPosition(-1);
      return;
    }

    // When not in decimal mode
    if (!isDecimal) {
      const n = Number(number);
      setInput2((prevInput2) => {
        const newInput2 = prevInput2 * 10 + n;
        setResult(newInput2); // Set result immediately
        return newInput2;
      });
    } else {
      const n = Number(number);
      setInput2((prevInput2) => {
        const newInput2 = prevInput2 + n * Math.pow(10, decimalPosition);
        setResult(parseFloat(newInput2.toFixed(10))); // Set result immediately
        return parseFloat(newInput2.toFixed(10));
      });
      setDecimalPosition((prevDecimalPosition) => prevDecimalPosition - 1);
    }
  };

  const operate = (element: string) => {
    if (element === "AC") {
      setResult(0);
      setInput1(0);
      setInput2(0);
      setDecimalPosition(0);
      setIsDecimal(false);
      setOperator("");
      return;
    }

    if (element !== "=") {
      setOperator(element);
      setInput1(result); // Use result as input1
      setInput2(0);
      //   setResult(0);
      setIsDecimal(false);
      setDecimalPosition(0);
    } else {
      let newResult = 0;
      switch (operator) {
        case "+":
          newResult = input1 + input2;
          break;
        case "-":
          newResult = input1 - input2;
          break;
        case "*":
          newResult = input1 * input2;
          break;
        case "/":
          newResult = input1 / input2;
          break;
        default:
          break;
      }

      if (newResult < 0) newResult = 0;

      setResult(parseFloat(newResult.toFixed(10))); // Limit the result to 10 decimal places
      setInput1(parseFloat(newResult.toFixed(10))); // Update input1 with the result of the operation
      setInput2(0);
    }
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/rate`)
      .then((res) => {
        setCurrencyList(res.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleCurrencySelect = (currency: number, unit: string) => {
    setCurrency(currency);
    setUnit(unit);
    setToggleState(false); // Close the dropdown after selection
  };

  // const selectUnitButton = (
  //   <div
  //     style={{ margin: "30px" }}
  //     onClick={() => setToggleState(!toggleState)}
  //   >
  //     <svg
  //       width="30"
  //       height="30"
  //       viewBox="0 0 30 30"
  //       fill="none"
  //       xmlns="http://www.w3.org/2000/svg"
  //     >
  //       <g id="chevron-down 1">
  //         <path
  //           id="Vector"
  //           fill-rule="evenodd"
  //           clip-rule="evenodd"
  //           d="M3.08597 8.71125C3.17306 8.62394 3.27651 8.55467 3.39041 8.50741C3.50431 8.46015 3.62641 8.43582 3.74972 8.43582C3.87304 8.43582 3.99514 8.46015 4.10904 8.50741C4.22293 8.55467 4.32639 8.62394 4.41347 8.71125L14.9997 19.2994L25.586 8.71125C25.6731 8.62408 25.7766 8.55494 25.8905 8.50777C26.0044 8.46059 26.1265 8.43631 26.2497 8.43631C26.373 8.43631 26.4951 8.46059 26.6089 8.50777C26.7228 8.55494 26.8263 8.62408 26.9135 8.71125C27.0006 8.79841 27.0698 8.90189 27.117 9.01578C27.1641 9.12966 27.1884 9.25173 27.1884 9.375C27.1884 9.49827 27.1641 9.62033 27.117 9.73422C27.0698 9.8481 27.0006 9.95158 26.9135 10.0387L15.6635 21.2887C15.5764 21.3761 15.4729 21.4453 15.359 21.4926C15.2451 21.5398 15.123 21.5642 14.9997 21.5642C14.8764 21.5642 14.7543 21.5398 14.6404 21.4926C14.5265 21.4453 14.4231 21.3761 14.336 21.2887L3.08597 10.0387C2.99867 9.95166 2.9294 9.84821 2.88214 9.73431C2.83487 9.62041 2.81055 9.49831 2.81055 9.375C2.81055 9.25168 2.83487 9.12958 2.88214 9.01568C2.9294 8.90179 2.99867 8.79833 3.08597 8.71125Z"
  //           fill="#0095FF"
  //         />
  //       </g>
  //     </svg>
  //   </div>
  // );

  return (
    <CalculatorBody>
      <Output>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Unit>{unit}</Unit>
          <Text>{result}</Text>
        </div>
        <CurrencyInfo>
          {unit}1 = ₩{currency}
        </CurrencyInfo>
        <SelectUnitButton onClick={() => setToggleState(!toggleState)}>
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="chevron-down 1">
              <path
                id="Vector"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.08597 8.71125C3.17306 8.62394 3.27651 8.55467 3.39041 8.50741C3.50431 8.46015 3.62641 8.43582 3.74972 8.43582C3.87304 8.43582 3.99514 8.46015 4.10904 8.50741C4.22293 8.55467 4.32639 8.62394 4.41347 8.71125L14.9997 19.2994L25.586 8.71125C25.6731 8.62408 25.7766 8.55494 25.8905 8.50777C26.0044 8.46059 26.1265 8.43631 26.2497 8.43631C26.373 8.43631 26.4951 8.46059 26.6089 8.50777C26.7228 8.55494 26.8263 8.62408 26.9135 8.71125C27.0006 8.79841 27.0698 8.90189 27.117 9.01578C27.1641 9.12966 27.1884 9.25173 27.1884 9.375C27.1884 9.49827 27.1641 9.62033 27.117 9.73422C27.0698 9.8481 27.0006 9.95158 26.9135 10.0387L15.6635 21.2887C15.5764 21.3761 15.4729 21.4453 15.359 21.4926C15.2451 21.5398 15.123 21.5642 14.9997 21.5642C14.8764 21.5642 14.7543 21.5398 14.6404 21.4926C14.5265 21.4453 14.4231 21.3761 14.336 21.2887L3.08597 10.0387C2.99867 9.95166 2.9294 9.84821 2.88214 9.73431C2.83487 9.62041 2.81055 9.49831 2.81055 9.375C2.81055 9.25168 2.83487 9.12958 2.88214 9.01568C2.9294 8.90179 2.99867 8.79833 3.08597 8.71125Z"
                fill="#0095FF"
              />
            </g>
          </svg>
        </SelectUnitButton>
      </Output>
      {/* <Exchange>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_512_91)">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.78397 12.5682C9.88945 12.5682 9.99062 12.5263 10.0652 12.4517C10.1398 12.3771 10.1817 12.2759 10.1817 12.1705V2.78966L12.6842 5.29295C12.7589 5.36764 12.8602 5.40959 12.9658 5.40959C13.0714 5.40959 13.1727 5.36764 13.2474 5.29295C13.3221 5.21827 13.364 5.11698 13.364 5.01136C13.364 4.90575 13.3221 4.80445 13.2474 4.72977L10.0656 1.54795C10.0286 1.51091 9.98473 1.48153 9.93641 1.46148C9.88809 1.44143 9.83629 1.43111 9.78397 1.43111C9.73166 1.43111 9.67985 1.44143 9.63153 1.46148C9.58321 1.48153 9.53932 1.51091 9.50238 1.54795L6.32056 4.72977C6.24588 4.80445 6.20392 4.90575 6.20392 5.01136C6.20392 5.11698 6.24588 5.21827 6.32056 5.29295C6.39524 5.36764 6.49654 5.40959 6.60215 5.40959C6.70777 5.40959 6.80906 5.36764 6.88374 5.29295L9.38624 2.78966V12.1705C9.38624 12.2759 9.42815 12.3771 9.50273 12.4517C9.57732 12.5263 9.67849 12.5682 9.78397 12.5682ZM4.21579 1.43182C4.32127 1.43182 4.42244 1.47372 4.49703 1.54831C4.57161 1.6229 4.61352 1.72406 4.61352 1.82954V11.2103L7.11602 8.70705C7.1907 8.63236 7.29199 8.59041 7.39761 8.59041C7.50322 8.59041 7.60452 8.63236 7.6792 8.70705C7.75388 8.78173 7.79584 8.88302 7.79584 8.98864C7.79584 9.09425 7.75388 9.19555 7.6792 9.27023L4.49738 12.452C4.46044 12.4891 4.41655 12.5185 4.36823 12.5385C4.31991 12.5586 4.2681 12.5689 4.21579 12.5689C4.16347 12.5689 4.11167 12.5586 4.06335 12.5385C4.01503 12.5185 3.97114 12.4891 3.9342 12.452L0.752381 9.27023C0.677698 9.19555 0.635742 9.09425 0.635742 8.98864C0.635742 8.88302 0.677698 8.78173 0.752381 8.70705C0.827063 8.63236 0.928355 8.59041 1.03397 8.59041C1.13959 8.59041 1.24088 8.63236 1.31556 8.70705L3.81806 11.2103V1.82954C3.81806 1.72406 3.85997 1.6229 3.93455 1.54831C4.00914 1.47372 4.11031 1.43182 4.21579 1.43182Z" fill="#424242" />
                    </g>
                    <defs>
                        <clipPath id="clip0_512_91">
                            <rect width="12.7273" height="12.7273" fill="white" transform="translate(0.636719 0.63636)" />
                        </clipPath>
                    </defs>
                </svg>
            </Exchange> */}
      <Output>
        <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
          <Unit>₩</Unit>
          <Text>
            {output2 == undefined ? 0 : parseFloat(output2.toFixed(10))}
          </Text>
        </div>
        {/* {selectUnitButton} */}
      </Output>
      <InputBody>
        <Numbers>
          {numbersElements.map((element) => {
            return (
              <NumberButton
                key={element}
                onClick={() => {
                  if (element === "=") {
                    operate(element);
                  } else {
                    showNumber(element);
                  }
                }}
              >
                {element}
              </NumberButton>
            );
          })}
        </Numbers>
        <Operators>
          {operatorElements.map((element) => {
            return (
              <button key={element} onClick={() => operate(element)}>
                {element}
              </button>
            );
          })}
        </Operators>
      </InputBody>
      <CurrencySelector
        currencyList={currencyList}
        toggleState={toggleState}
        onCurrencySelect={handleCurrencySelect}
      />
    </CalculatorBody>
  );
}
