// eventSlice.js
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DynamicKeyObject, RootState } from ".";
import request from "@/utils/request";
import qs from "qs";

export interface Category {
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
      name: "",
    },
  ],
  loading: false,
  error: null,
};

export const actionGetCategories = createAsyncThunk(
  "categories/actionGetCategories",
  async (data: CategoriesState, { rejectWithValue }) => {
    try {
      const response = await request({
        url: "categories/get_all_categories",
        method: "GET",
        data: qs.stringify(data, { allowDots: true }),
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
      });
  },
});
export const selectCategoriesData = (state: RootState): CategoriesState =>
  state.categories;

export default slice.reducer;
