import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/stores/products";
import { RootState } from "@/stores";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const getProductKey = (product: Product): string => {
  return `${product.name}_${product.price}`;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const productKey = getProductKey(action.payload);

      const found = state.items.find(
        (i) => getProductKey(i.product) === productKey
      );

      if (found) {
        found.quantity += 1;
      } else {
        state.items.push({
          product: action.payload,
          quantity: 1,
        });
      }
    },

    increaseQuantity: (state, action: PayloadAction<string>) => {
      // action.payload bây giờ là productKey
      const item = state.items.find(
        (i) => getProductKey(i.product) === action.payload
      );
      if (item) item.quantity += 1;
    },

    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(
        (i) => getProductKey(i.product) === action.payload
      );

      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter(
          (i) => getProductKey(i.product) !== action.payload
        );
      }
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (i) => getProductKey(i.product) !== action.payload
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart,
} = cartSlice.actions;

export const getCart = (state: RootState) => state.cart.items;

export default cartSlice.reducer;
