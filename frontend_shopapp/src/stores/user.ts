import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import request from "@/utils/request";
import { get } from "lodash";
import qs from "qs";

export interface User {
  fullname: string;
  phone_number: string;
  password: string;
  address: string;
  date_of_birth: string;
  email: string;
  facebook_account_id?: string;
  google_account_id?: string;
  role_id: number;
}

export interface UserState {
  user: User[];
  loading: "idle" | "pending" | "success" | "error";
  error: string | null;
}

const initialState: UserState = {
  user: [],
  loading: "idle",
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
});

export const actionResgister = createAsyncThunk(
  "auth/actionResgister",
  async (data: User, { rejectWithValue }) => {
    try {
      const res = await request({
        url: "/users/register",
        method: "POST",
        data: data,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res);

      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actionResgister.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(actionResgister.fulfilled, (state, action) => {
        state.user = get(action, "payload.data");
        state.loading = "success";
      })
      .addCase(actionResgister.rejected, (state) => {
        state.loading = "error";
      });
  },
});

export const {} = userSlice.actions;

export const postRegisterUser = (state: RootState) => state.user.user;
export default userSlice.reducer;
