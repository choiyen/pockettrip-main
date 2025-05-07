import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    amount: "",
    currency: "",
    currencySymbol: "",
    paymentType: "",
    date: "",
    selectedUser: { email: "" },
    img: "",
  },
};

const SpendDataSlice = createSlice({
  name: "SpendData",
  initialState,
  reducers: {
    SaveSpendData(state, action) {
      state.value = action.payload;
    },
  },
});

export const { SaveSpendData } = SpendDataSlice.actions;
export default SpendDataSlice.reducer;
