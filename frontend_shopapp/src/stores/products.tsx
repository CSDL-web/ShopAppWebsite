import request from "@/utils/request";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import qs from "qs";
import type { RootState } from ".";




export type Product = {
  name: string;
  price: string; // ✅ NOTE: backend trả string
  thumbnail: string; // ✅ NOTE: dùng thumbnail làm key
  description: string;
  category_id: number;
  images: { image_url: string }[];
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
  "products/actionGetProduct",
  async (data: { skip: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await request({
        url: "/products",
        method: "GET",
        params: { skip: data.skip, limit: data.limit },
        paramsSerializer: (params) => qs.stringify(params, { allowDots: true }),
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data ?? error);
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
      .addCase(actionGetProduct.fulfilled, (state, action: any) => {
        state.loading = false;

        const payload = action.payload;
        const list: Product[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

        state.data = list.filter((p) => p?.thumbnail !== null && p?.thumbnail !== "");
      })
      .addCase(actionGetProduct.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload?.message ??
          action.error?.message ??
          "Get products failed";
      });
  },
});

// ✅ NOTE: selectors
export const selectProductsList = (state: RootState) => state.products.data;
export const selectProductsLoading = (state: RootState) => state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;

export const selectProductsData = (state: RootState) => state.products; // ✅ legacy cho Home
export default slice.reducer;
