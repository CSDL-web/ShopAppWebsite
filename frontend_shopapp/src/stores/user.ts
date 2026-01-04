import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import request from "@/utils/request";
import { get } from "lodash";

// Interface cho response đăng nhập
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
  expiration: string;
  refresh_expiration_date: string;
}

// Interface cho User
export interface User {
  id?: number;
  fullname: string;
  phone_number: string;
  password?: string;
  address: string;
  date_of_birth: string;
  email: string;
  facebook_account_id?: string;
  google_account_id?: string;
  role_id: number;
}

// Interface cho Auth State
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: "idle" | "pending" | "success" | "error";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: "idle",
  error: null,
};

// Async thunk cho đăng nhập
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await request({
        url: "/auth/login",
        method: "POST",
        data: credentials,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: LoginResponse = res.data;

      // Lưu token vào localStorage
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      localStorage.setItem("tokenExpiration", data.expiration);

      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Async thunk cho đăng ký
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: User, { rejectWithValue }) => {
    try {
      const res = await request({
        url: "/users/register",
        method: "POST",
        data: userData,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Async thunk cho refresh token
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const res = await request({
        url: "/auth/refresh",
        method: "POST",
        data: { refresh_token: refreshToken },
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = res.data;

      // Lưu token mới
      localStorage.setItem("accessToken", data.access_token);
      if (data.refresh_token) {
        localStorage.setItem("refreshToken", data.refresh_token);
      }
      if (data.expiration) {
        localStorage.setItem("tokenExpiration", data.expiration);
      }

      return data;
    } catch (error: any) {
      // Xóa token nếu refresh thất bại
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpiration");

      return rejectWithValue(
        error.response?.data?.message || "Token refresh failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Logout action
    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = "idle";
      state.error = null;

      // Xóa localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpiration");
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = "success";
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = "error";
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = "success";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = "error";
        state.error = action.payload as string;
      });

    // Refresh Token
    builder
      .addCase(refreshToken.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = "success";
        state.accessToken = action.payload.access_token;
        if (action.payload.refresh_token) {
          state.refreshToken = action.payload.refresh_token;
        }
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = "error";
        state.error = action.payload as string;

        // Tự động logout nếu refresh thất bại
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

// Export actions
export const { logoutUser, clearError } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
