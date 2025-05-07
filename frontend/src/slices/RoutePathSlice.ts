import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface prevPathState {
  value: string;
}

const initialState: prevPathState = {
  value: "/",
};

const RoutePathSlice = createSlice({
  name: "prevPath",
  initialState,
  reducers: {
    savePath(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
  },
});

export const { savePath } = RoutePathSlice.actions;
export default RoutePathSlice.reducer;
