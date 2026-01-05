import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./index";
import request from "@/utils/request";

// Types
export interface User {
  id: number;
  fullname: string;
  phone_number: string;
  address: string;
  date_of_birth: string;
  email: string;
  facebook_account_id: string;
  google_account_id: string;
  role_id: number;
  is_active: boolean;
}

export interface UpdateProfilePayload {
  fullname?: string;
  address?: string;
  date_of_birth?: string;
  facebook_account_id?: string;
  google_account_id?: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password?: string;
}

export interface GetUsersParams {
  skip?: number;
  limit?: number;
}

// Initial state
interface UsersState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  totalUsers: number;
  updateSuccess: boolean;
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  totalUsers: 0,
  updateSuccess: false,
};

export const updateUserProfile = createAsyncThunk(
  "users/updateUserProfile",
  async (userData: UpdateProfilePayload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token");
      }

      const res = await request({
        url: "/users/details",
        method: "PUT",
        data: userData,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
        return res.data;
      }

      throw new Error("Failed to update profile");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.data?.detail ||
          "Failed to update profile"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "users/changePassword",
  async (passwordData: ChangePasswordPayload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token");
      }

      const res = await request({
        url: "/users/password",
        method: "PUT",
        data: passwordData,
      });

      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.data?.detail ||
          "Failed to change password"
      );
    }
  }
);

// Lỗi ở dòng 114 có thể là do hàm này - đã sửa thứ tự tham số
export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (
    { skip = 0, limit = 50 }: GetUsersParams = {},
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token");
      }

      const res = await request({
        url: "/users",
        method: "GET",
        params: {
          skip,
          limit,
        },
      });

      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.data?.detail ||
          "Failed to get users list"
      );
    }
  }
);

export const blockUnblockUser = createAsyncThunk(
  "users/blockUnblockUser",
  async (
    { user_id, active }: { user_id: number; active: boolean },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token");
      }

      const res = await request({
        url: `/users/admin/block/${user_id}/${active}`,
        method: "PUT",
      });

      return { data: res.data, userId: user_id, active };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.data?.detail ||
          "Failed to update user status"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (user_id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token");
      }

      const res = await request({
        url: `/users/admin/delete/${user_id}`,
        method: "DELETE",
      });

      return { data: res.data, userId: user_id };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.data?.detail ||
          "Failed to delete user"
      );
    }
  }
);

// Slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Update User Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.totalUsers = action.payload.length;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Block/Unblock User
      .addCase(blockUnblockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(blockUnblockUser.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, active } = action.payload;

        // Update user in users list
        const userIndex = state.users.findIndex((user) => user.id === userId);
        if (userIndex !== -1) {
          state.users[userIndex].is_active = active;
        }

        // Update current user if it's the same user
        if (state.currentUser && state.currentUser.id === userId) {
          state.currentUser.is_active = active;
        }
      })
      .addCase(blockUnblockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const { userId } = action.payload;

        // Remove user from users list
        state.users = state.users.filter((user) => user.id !== userId);
        state.totalUsers = state.users.length;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectUsers = (state: RootState) => state.users.users;
export const selectCurrentUser = (state: RootState) => state.users.currentUser;
export const selectUsersLoading = (state: RootState) => state.users.loading;
export const selectUsersError = (state: RootState) => state.users.error;
export const selectTotalUsers = (state: RootState) => state.users.totalUsers;
export const selectUpdateSuccess = (state: RootState) =>
  state.users.updateSuccess;

export const selectUserById = (userId: number) => (state: RootState) =>
  state.users.users.find((user) => user.id === userId);

export const selectActiveUsers = (state: RootState) =>
  state.users.users.filter((user) => user.is_active);

export const selectInactiveUsers = (state: RootState) =>
  state.users.users.filter((user) => !user.is_active);

// Actions
export const { clearUsersError, clearUpdateSuccess, setCurrentUser } =
  usersSlice.actions;

export default usersSlice.reducer;
