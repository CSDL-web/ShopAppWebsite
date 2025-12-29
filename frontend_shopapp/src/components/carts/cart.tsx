import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from 'stores';
import CartItem from "./cart_item";
import { COLORS } from "@/styles/colors";
import CustomHR from "../CustomHR";
import { Product } from "../products/fakeData";
import ProductLinkText from "../productLinkText";
import Subtotal from "./subTotal";
import CustomButton from "../customButton";
import { getCart } from "@/stores/cart";

export default function Cart() {
  const cart = useAppSelector(getCart);
  const navigate = useNavigate();

  const total = cart.reduce((sum: number, item: Product) => sum + (item.price ?? 0),0);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        margin: "3rem 0",
        gap: "2rem",
      }}
    >
      {/* LEFT: CART ITEMS */}
      <Box
        sx={{
          backgroundColor: COLORS.white,
          padding: "2rem",
          width: "55vw",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4" fontWeight={700}>
            Shopping Cart
          </Typography>
          <Typography>Price</Typography>
        </Box>

        <CustomHR />

        {cart.map((item: Product) => (
          <CartItem key={item.id} item={item} />
        ))}

        <Subtotal
          items={cart.length}
          price={total}
          sx={{ textAlign: "right" }}
        />
      </Box>

      {/* RIGHT: SUMMARY */}
      <Box
        sx={{
          backgroundColor: COLORS.white,
          padding: "1rem",
          width: "15vw",
          height: "fit-content",
        }}
      >
        <Typography
          sx={{
            color: COLORS.green,
            display: "flex",
            alignItems: "center",
            fontSize: "0.875rem",
          }}
        >
          <CheckCircleIcon sx={{ marginRight: "0.25rem" }} />
          Your order qualifies for FREE Shipping.
        </Typography>

        <Typography sx={{ marginLeft: "1.8rem", fontSize: "0.875rem" }}>
          Choose this option at checkout.{" "}
          <ProductLinkText>See details</ProductLinkText>
        </Typography>

        <Subtotal items={cart.length} price={total} />

        <CustomButton onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </CustomButton>
      </Box>
    </Box>
  );
}
