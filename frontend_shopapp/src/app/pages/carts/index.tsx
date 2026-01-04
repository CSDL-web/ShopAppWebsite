import Container from "@mui/material/Container";
import React from "react";
import Cart from "@/components/carts/cart";

const CartPage = () => {
  return (
<Container
  maxWidth="xl"
  sx={{
    backgroundColor: "#cccccc", // 👉 màu nền trang
    minHeight: "100vh",
    py: 4,
  }}
>
  <Cart />
</Container>

  );
};

export default CartPage;
