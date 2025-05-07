import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface CounterState {
  value: string;
}

const initialState: CounterState = {
  value: "home",
};
const currentPageSlice = createSlice({
  name: "currentPage",
  initialState,
  reducers: {
    ChangeCurrentPage(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
  },
});

export const { ChangeCurrentPage } = currentPageSlice.actions;
export default currentPageSlice.reducer;
