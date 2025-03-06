import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  value: UserState;
};

export enum Roles {
  USER = "USER",
  WORKER = "WORKER",
  ADMIN = "ADMIN",
  NULL = "NULL",
}

type UserState = {
  id: string;
  login: string;
  role: Roles[];
};

const initialState = {
  value: {
    id: "",
    login: "",
    role: [Roles.NULL],
  } as UserState,
} as InitialState;

export const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<UserState>) => {
      console.log(action.payload);
      state.value = action.payload;
    },
  },
});

export const { logIn } = user.actions;
export default user.reducer;
