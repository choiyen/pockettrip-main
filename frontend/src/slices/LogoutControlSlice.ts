import { createSlice } from "@reduxjs/toolkit";
interface logoutControlState {
    logoutState: boolean;
}

const initialState: logoutControlState = {
    logoutState: false,
};
const LogoutControlSlice = createSlice({
  name: "AlertControl",
  initialState,
  reducers: {
    ChangeLogoutState(state) {
      state.logoutState = !state.logoutState;
    },
  },
});

export const { ChangeLogoutState } = LogoutControlSlice.actions;
export default LogoutControlSlice.reducer;
