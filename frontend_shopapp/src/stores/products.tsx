import request from "@/utils/request";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import qs from "qs";
import { RootState } from ".";

export type Product = {
  id: number;
  name: string;
  price: number;
  thumbnail: number;
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
      return response.data;
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
      .addCase(actionGetProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        actionGetProduct.fulfilled,
        (state, action: PayloadAction<ProductState>) => {
          state.loading = false;
          state.data = action.payload.data;
        }
      )
      .addCase(actionGetProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const selectProductsData = (state: RootState): ProductState =>
  state.products;

export default slice.reducer;

export const products: Product[] = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    thumbnail: 1,
    category_id: 1,
    description: "Description for Product 1",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: "Product 2",
    price: 150,
    thumbnail: 2,
    category_id: 2,
    description: "Description for Product 2",
    created_at: new Date(),
    updated_at: new Date(),
  },
  // Thêm các sản phẩm khác tương tự...
];
