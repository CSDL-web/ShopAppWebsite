import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch } from "@/stores";
import CustomHR from "../CustomHR";
import InStockText from "../inStockText";
import { Product } from "../products/fakeData";
import { removeItem } from "@/stores/cart";

export default function CartItem({ item }: { item: Product }) {
  const dispatch = useAppDispatch();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          margin: "2rem 0",
        }}
      >
        {/* LEFT */}
        <Box sx={{ display: "flex" }}>
          <img
            src={item.image}
            alt={item.title}
            width={225}
            height={257}
            style={{ objectFit: "contain" }}
          />

          <Box sx={{ marginLeft: "2rem" }}>
            <Typography variant="h6" fontWeight={500}>
              {item.title}
            </Typography>

            <InStockText sx={{ fontWeight: 500 }} />

            <Typography sx={{ fontSize: "0.875rem" }}>
              Eligible for FREE Shipping & FREE Returns
            </Typography>

            <Button
              size="small"
              sx={{ textTransform: "none", padding: 0, marginTop: "0.5rem" }}
              onClick={() => dispatch(removeItem(item))}
            >
              Delete
            </Button>
          </Box>
        </Box>

        {/* RIGHT */}
        <Typography sx={{ fontSize: "1.25rem", fontWeight: 700 }}>
          ${item.price}
        </Typography>
      </Box>

      <CustomHR />
    </Box>
  );
}
