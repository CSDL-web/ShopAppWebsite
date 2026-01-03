import { Box, Typography } from "@mui/material";
import React from "react";

import { COLORS } from "@/styles/colors";
import { Product } from "../../stores/products";
import CustomBox from "../customBox";
import DeliveryOptions from "../DeliveryOptions";

const CheckoutItem = ({ item }: { item: Product }) => {
  return (
    <CustomBox
      sx={{
        margin: "1rem 0 1rem 3.5rem",
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      {/* ✅ thay next/image bằng img */}
      <img
        src={item.image}
        alt={item.title}
        width={70}
        height={100}
        style={{ marginRight: "2rem", objectFit: "contain" }}
      />

      <Box sx={{ width: "22rem" }}>
        <Typography sx={{ fontWeight: 700 }}>{item.title}</Typography>

        <Typography sx={{ fontWeight: 700, color: COLORS.red }}>
          ${item.price}
        </Typography>
      </Box>

      <DeliveryOptions />
    </CustomBox>
  );
};

export default CheckoutItem;
