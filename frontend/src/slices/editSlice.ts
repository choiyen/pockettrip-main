import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface editState {
  type: null | string;
}

const initialState: editState = {
  type: null,
};

const editSlice = createSlice({
  name: "edit",
  initialState,
  reducers: {
    setEditType(state, action: PayloadAction<string | null>) {
      state.type = action.payload;
    },
  },
});
export const { setEditType } = editSlice.actions;
export default editSlice.reducer;
