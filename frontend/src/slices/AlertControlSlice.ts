import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface alertControlState {
  alertState: boolean;
  message: string;
  type: "success" | "error" | "info" | "";
  isVisible: boolean;
  travelCode: string;
}

const initialState: alertControlState = {
  alertState: false,
  message: "",
  type: "",
  isVisible: false,
  travelCode: "",
};

// 알림 바 컨트롤 글로벌 상태관리
const AlertControlSlice = createSlice({
  name: "AlertControl",
  initialState,
  reducers: {
    ChangeAlertState(state) {
      state.alertState = !state.alertState;
    },
    travelCodes(state, action: PayloadAction<{ travelCode: string }>) {
      state.travelCode = action.payload.travelCode;
    },
    showAlert(
      state,
      action: PayloadAction<{
        message: string;
        type: "success" | "error" | "info";
      }>
    ) {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.isVisible = true;
    },
    hideAlert(state) {
      state.message = "";
      state.type = "";
      state.isVisible = false;
    },
  },
});

export const { ChangeAlertState, travelCodes, showAlert, hideAlert } =
  AlertControlSlice.actions;
export default AlertControlSlice.reducer;
