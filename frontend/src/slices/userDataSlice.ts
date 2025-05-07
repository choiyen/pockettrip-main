import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateProps {
  email: string;
  id: string;
  name: string;
  password: string;
  phone: string;
  profile: string;
}

const initialState: { user: initialStateProps } = {
  user: {
    email: "",
    id: "",
    name: "",
    password: "",
    phone: "",
    profile: "",
  },
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    saveUser: (state, action: PayloadAction<initialStateProps>) => {
      state.user.email = action.payload.email;
      state.user.id = action.payload.id;
      state.user.name = action.payload.name;
      state.user.password = action.payload.password;
      state.user.phone = action.payload.phone;
      state.user.profile = action.payload.profile;
    },
  },
});

export const { saveUser } = userDataSlice.actions;
export default userDataSlice.reducer;
