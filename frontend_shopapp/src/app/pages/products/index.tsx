import { useEffect } from "react";
import { Box, Typography } from "@mui/material";

import Header from "@/components/headers/Header";
import { COLORS } from "@/styles/colors";

import { useAppDispatch, useAppSelector } from "@/stores";
import {
  actionGetProduct,
  selectProductsList,
  selectProductsLoading,
  selectProductsError,
} from "@/stores/products";

import ProductCard from "@/components/products/ProductCard";

export default function ProductsPage() {
  const dispatch = useAppDispatch();

  const products = useAppSelector(selectProductsList);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);

  useEffect(() => {
    dispatch(actionGetProduct({ skip: 0, limit: 1001 } as any)); // ✅ NOTE
  }, [dispatch]);

  return (
    <Box sx={{ backgroundColor: COLORS.lightGray, minHeight: "100vh" }}>
      <Header />

      <Box sx={{ maxWidth: 1400, mx: "auto", p: 2 }}>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
          Products
        </Typography>

        {loading ? <Typography>Loading...</Typography> : null}
        {error ? <Typography color="error">{String(error)}</Typography> : null}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 2,
          }}
        >
          {products.map((p) => (
            <ProductCard key={p.thumbnail} product={p} /> // ✅ NOTE
          ))}
        </Box>
      </Box>
    </Box>
  );
}
