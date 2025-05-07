import { createSlice } from "@reduxjs/toolkit";
interface modalControlState {
  movingModal: boolean;
  modalState: boolean;
}

const initialState: modalControlState = {
  movingModal: false,
  modalState: false,
};
const modalControlSlice = createSlice({
  name: "modalControl",
  initialState,
  reducers: {
    ChangeMovingModal(state) {
      state.movingModal = !state.movingModal;
    },
    ChangeModalState(state) {
      state.modalState = !state.modalState;
    },
  },
});

export const { ChangeMovingModal, ChangeModalState } =
  modalControlSlice.actions;
export default modalControlSlice.reducer;
