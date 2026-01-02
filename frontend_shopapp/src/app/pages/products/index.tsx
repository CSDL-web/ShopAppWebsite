import { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { COLORS } from "@/styles/colors";
import Ratings from "@/components/products/Ratings";
import { actionGetProduct, selectProductsData } from "@/stores/products";
import Header from "@/components/headers/Header";
import { useAppDispatch, useAppSelector } from "@/stores";

export default function ProductPage() {
    const dispatch = useAppDispatch();
  
    const dataProduct = useAppSelector(selectProductsData);
  
    useEffect(() => {
      dispatch(actionGetProduct({ skip: 0, limit: 150 } as any));
    }, [dispatch]);
  
  if (!dataProduct) {
    return (
      <Box sx={{ padding: "2rem" }}>
        <Typography>Product not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: COLORS.lightGray, minHeight: "100vh" }}>
      <Header />
      <Box
        sx={{
          maxWidth: 1200,
          margin: "2rem auto",
          padding: "1rem",
          display: "flex",
          gap: "2rem",
        }}
      >
        {/* IMAGE */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: COLORS.white,
            padding: "1rem",
          }}
        >
          <img
            src={product.image}
            alt={product.title}
            style={{
              width: "100%",
              maxHeight: 450,
              objectFit: "contain",
            }}
          />
        </Box>

        {/* INFO */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={500}>
            {product.title}
          </Typography>

          <Ratings rating={{ rate: product.rating, count: 120 }} />

          <Typography variant="h6" fontWeight={700} sx={{ margin: "1rem 0" }}>
            ${product.price}
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: COLORS.orange,
              color: COLORS.black,
              "&:hover": { backgroundColor: COLORS.paleOrange },
            }}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
