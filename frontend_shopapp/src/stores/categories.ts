// eventSlice.js
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DynamicKeyObject, RootState } from ".";
import request from "@/utils/request";
import qs from "qs";

export interface Category {
  id: number;
  name: string;
}

export interface CategoriesState {
  data: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  data: [
    {
      id: 0,
      name: "",
    },
  ],
  loading: false,
  error: null,
};

export const actionGetCategories = createAsyncThunk(
  "categories/actionGetCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request({
        url: "categories/get_all_categories",
        method: "GET",
      });
      console.log(response);
      return response as unknown as CategoriesState;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const actionPostCategories = createAsyncThunk(
  "categories/actionPostCategories",
  async (data: { id: number; name: string }, { rejectWithValue }) => {
    console.log(data);
    
    try {
      const response = await request({
        url: "categories/create_new_category",
        method: "POST",
        data,
      });
      console.log(response);
      return response as unknown as CategoriesState;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);


export const slice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actionGetCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        actionGetCategories.fulfilled,
        (state, action: PayloadAction<CategoriesState>) => {
          state.loading = false;
          state.data = action.payload.data;
        }
      )
      .addCase(actionGetCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(actionPostCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        actionPostCategories.fulfilled,
        (state, action: PayloadAction<CategoriesState>) => {
          state.loading = false;
          state.data = action.payload.data;
        }
      );
  },
});
export const selectCategoriesData = (state: RootState): CategoriesState =>
  state.categories;
export const selectPostCategoriesData = (state: RootState): CategoriesState =>
  state.categories;
export default slice.reducer;
