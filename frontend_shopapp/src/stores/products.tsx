import request from "@/utils/request";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import qs from "qs";
import { RootState } from ".";

export type Product = {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  category_id: number;
  description: string;
  created_at: Date;
  updated_at: Date;
};

export interface ProductState {
  data: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  data: [],
  loading: false,
  error: null,
};


export const actionGetProduct = createAsyncThunk(
  "product/actionGetProduct",
  async (data: { skip: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await request({
        url: "/products",
        method: "GET",
        params: { skip: data.skip, limit: data.limit },
        paramsSerializer: (params) => qs.stringify(params, { allowDots: true }),
      });
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const slice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actionGetProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionGetProduct.fulfilled, (state, action) => {
        state.loading = false;

        state.data = action.payload.data.filter(
          (p: Product) => p.thumbnail !== null && p.thumbnail !== ""
        );
      })

      .addCase(actionGetProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const selectProductsData = (state: RootState): ProductState =>
  state.products;

export default slice.reducer;
