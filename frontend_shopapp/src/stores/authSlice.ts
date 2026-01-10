import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import request from "@/utils/request";

export interface User {
  id?: number;
  fullname: string;
  phone_number: string;
  address: string;
  date_of_birth?: string;
  email: string;
  facebook_account_id?: string;
  google_account_id?: string;
  role_id: number;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
  expiration: string;
  refresh_expiration_date: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: "idle" | "pending" | "success" | "error";
  error: string | null;
  registerSuccess: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: "idle",
  error: null,
  registerSuccess: false,
};

interface LoginCredentials {
  account: string;
  password: string;
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { account: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await request({
        url: "/users/login",
        method: "POST",
        data: credentials,
      });

      const {
        access_token,
        refresh_token,
        user,
        expiration,
        refresh_expiration_date,
      } = res.data;

      if (!access_token) {
        throw new Error("No access token received");
      }

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("tokenExpiration", expiration);
      localStorage.setItem("refreshTokenExpiration", refresh_expiration_date);

      return {
        accessToken: access_token,
        refreshToken: refresh_token,
        user,
        expiration,
        refreshExpiration: refresh_expiration_date,
      };
    } catch (error: any) {
      console.error("Login error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Login failed. Please check your phone number and password."
      );
    }
  }
);

// Register Async Thunk - bắt buộc phone number
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    data: {
      fullname: string;
      phone_number: string;
      password: string;
      address: string;
      date_of_birth?: string;
      email?: string;
      role_id?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const payload = {
        fullname: data.fullname,
        phone_number: data.phone_number,
        password: data.password,
        address: data.address,
        email: data.email || `${data.phone_number}@shopapp.com`, // Tạo email từ phone nếu không có
        role_id: data.role_id || 1,
      };

      if (data.date_of_birth) {
        Object.assign(payload, { date_of_birth: data.date_of_birth });
      }

      const res = await request({
        url: "/users/register",
        method: "POST",
        data: payload,
      });

      if (res.data.access_token) {
        const { access_token, refresh_token, user } = res.data;
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("tokenExpiration", res.data.expiration);
        localStorage.setItem(
          "refreshTokenExpiration",
          res.data.refresh_expiration_date
        );
      }

      return res.data;
    } catch (error: any) {
      console.error("Register error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed"
      );
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token");
      }

      const res = await request({
        url: "/users/me",
        method: "GET",
      });

      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
        return res.data;
      }

      throw new Error("No user data available");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to get user info"
      );
    }
  }
);

// Refresh Token Async Thunk
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refresh_token = localStorage.getItem("refreshToken");

      if (!refresh_token) {
        throw new Error("No refresh token");
      }

      const res = await request({
        url: "/users/refresh-token",
        method: "POST",
        data: { refresh_token },
      });

      console.log("Refresh token response:", res.data);

      const { access_token, refresh_token: new_refresh_token, user } = res.data;

      if (!access_token) {
        throw new Error("No access token received from refresh");
      }

      // Lưu token mới
      localStorage.setItem("accessToken", access_token);

      if (new_refresh_token) {
        localStorage.setItem("refreshToken", new_refresh_token);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      return {
        accessToken: access_token,
        refreshToken: new_refresh_token,
        user,
      };
    } catch (error: any) {
      console.error("Refresh token error:", error);

      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("refreshTokenExpiration");

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Token refresh failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("tokenExpiration");
  localStorage.removeItem("refreshTokenExpiration");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.registerSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setRegisterSuccess: (state, action: PayloadAction<boolean>) => {
      state.registerSuccess = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = "success";
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = "error";
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = "pending";
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = "success";
        state.registerSuccess = true;

        // Nếu register trả về token, set auth state
        if (action.payload.access_token) {
          state.accessToken = action.payload.access_token;
          state.refreshToken = action.payload.refresh_token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = "error";
        state.error = action.payload as string;
        state.registerSuccess = false;
      })

      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = "success";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = "error";
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = "success";
        state.accessToken = action.payload.accessToken;
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
        }
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = "error";
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
        state.registerSuccess = false;
        state.loading = "idle";
      });
  },
});

export const { clearAuth, clearError, setRegisterSuccess } = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectRegisterSuccess = (state: RootState) =>
  state.auth.registerSuccess;

export default authSlice.reducer;
