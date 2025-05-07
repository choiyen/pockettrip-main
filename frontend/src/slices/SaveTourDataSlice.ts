import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TravelPlan {
  id: string;
  travelCode: string;
  img: string;
  title: string;
  founder: string;
  location: string;
  startDate: string; // 날짜 문자열
  endDate: string; // 날짜 문자열
  expense: number;
  calculate: boolean;
  participants: string[]; // 참가자 리스트 (배열)
  encryptCode: string;
  currentCurrency: number;
}

const initialState: { value: TravelPlan[] } = {
  value: [],
};

const SaveTourDataSlice = createSlice({
  name: "saveTourData",
  initialState,
  reducers: {
    setTravelData: (state, action: PayloadAction<TravelPlan[]>) => {
      state.value = action.payload; // 새로운 여행 데이터로 상태 업데이트
    },
  },
});

export const { setTravelData } = SaveTourDataSlice.actions;
export default SaveTourDataSlice.reducer;
