import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};
const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    plus: (state) => {
      state.value += 1;
    },
    minus: (state) => {
      state.value -= 1;
    },
    incrementByAmount(state, action: PayloadAction<number>) {
      state.value += action.payload;
    },
  },
});

export const { plus, minus, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
