import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/stores";

const API_URL = import.meta.env.VITE_API_URL;

// Types
export interface OrderItem {
  product_id: string | number;
  quantity: number;
  price: number;
  product_name?: string;
}

export interface OrderRequest {
  fullname: string;
  email: string;
  phone_number: string;
  address: string;
  note: string;
  status: string;
  total_money: number;
  shipping_method: string;
  shipping_address: string;
  shipping_date: string;
  tracking_number: string;
  payment_method: string;
  active: boolean;
  coupon_id: number;
  cart_items: OrderItem[];
}

export interface Order {
  id: number;
  user_id: number;
  order_date: string;
  fullname: string;
  email: string;
  phone_number: string;
  address: string;
  note: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total_money: number;
  shipping_method: string;
  shipping_address: string;
  shipping_date: string;
  tracking_number: string;
  payment_method: string;
  active: boolean;
  coupon_id: number;
  items?: OrderItem[];
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  success: false,
};

// Async Thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData: OrderRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/orders/create`, orderData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order"
      );
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/orders/my-orders`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async (orderId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearOrderSuccess: (state) => {
      state.success = false;
    },
    resetOrderState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.success = true;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload); // Add to beginning of array
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // Fetch User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrderError, clearOrderSuccess, resetOrderState } = orderSlice.actions;

// Selectors
export const selectOrders = (state: RootState) => state.order.orders;
export const selectCurrentOrder = (state: RootState) => state.order.currentOrder;
export const selectOrderLoading = (state: RootState) => state.order.loading;
export const selectOrderError = (state: RootState) => state.order.error;
export const selectOrderSuccess = (state: RootState) => state.order.success;

export default orderSlice.reducer;