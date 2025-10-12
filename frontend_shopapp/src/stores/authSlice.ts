import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { get } from 'lodash';
import { RootState } from './index';
import request from '../utils/request';

export interface IUser {
  accessToken: string;
  deptCode: string;
  deptName: string;
  tokenType: string;
  userName: string;
}

interface AuthState {
  isLogin: boolean;
  user: IUser;
  loadingLoginAdmin: 'idle' | 'pending' | 'success' | 'error';
}

const initUser: IUser = {
  accessToken: '',
  deptCode: '',
  deptName: '',
  tokenType: '',
  userName: '',
};

const initialState: AuthState = {
  isLogin: false,
  user: initUser,
  loadingLoginAdmin: 'idle',
};

export interface PayloadLoginAdmin {
  usernameOrEmail: string;
  password: string;
  systemCode: string;
}

export const actionLoginAdmin = createAsyncThunk(
  'auth/actionLoginAdmin',
  async (data: PayloadLoginAdmin, { rejectWithValue }) => {
    try {
      return await request({
        url: '/common/auth/signin',
        method: 'POST',
        data,
        headers: { ...data },
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    actionLogout(state) {
      state.isLogin = false;
      state.user = initUser;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actionLoginAdmin.pending, (state) => {
        state.loadingLoginAdmin = 'pending';
      })
      .addCase(actionLoginAdmin.fulfilled, (state, action) => {
        state.isLogin = true;
        state.user = get(action, 'payload.data');
        state.loadingLoginAdmin = 'success';
      })
      .addCase(actionLoginAdmin.rejected, (state) => {
        state.loadingLoginAdmin = 'error';
      });
  },
});

export const { actionLogout } = slice.actions;

// selectors
export const selectIsLogin = (state: RootState) => state.auth.isLogin;
export const selectUser = (state: RootState) => state.auth.user;
export const selectLoadingLoginAdmin = (state: RootState) => state.auth.loadingLoginAdmin;

export default slice.reducer;
