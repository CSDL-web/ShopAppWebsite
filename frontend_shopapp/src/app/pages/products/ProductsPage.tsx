import { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useParams } from "react-router-dom";

import Header from "@/components/headers/Header";
import { COLORS } from "@/styles/colors";
import Ratings from "@/components/products/Ratings";
import buildImageSrc from "@/components/UploadImg";

import { useAppDispatch, useAppSelector } from "@/stores";
import {
  actionGetProduct,
  selectProductsList,
  selectProductsLoading,
  selectProductsError,
} from "@/stores/products";

export default function ProductPage() {
  const { thumbnail } = useParams<{ thumbnail: string }>(); // ✅ NOTE
  const dispatch = useAppDispatch();

  const products = useAppSelector(selectProductsList);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(actionGetProduct({ skip: 0, limit: 1001 } as any)); // ✅ NOTE
    }
  }, [dispatch, products.length]);

  const product = products.find((p) => p.thumbnail === thumbnail);

  if (loading && !product) {
    return (
      <Box sx={{ padding: "2rem" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error && !product) {
    return (
      <Box sx={{ padding: "2rem" }}>
        <Typography color="error">{String(error)}</Typography>
      </Box>
    );
  }

  if (!product) {
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
        <Box sx={{ flex: 1, backgroundColor: COLORS.white, padding: "1rem" }}>
          <img
            src={buildImageSrc(product.thumbnail)}
            alt={product.name}
            style={{ width: "100%", maxHeight: 450, objectFit: "contain" }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/placeholder.png"; // ✅ fallback
            }}
          />
        </Box>

        {/* INFO */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={600}>
            {product.name}
          </Typography>

          <Ratings rating={{ rate: 4.5, count: 120 }} />

          <Typography variant="h6" fontWeight={800} sx={{ margin: "1rem 0" }}>
            ${Number(product.price).toFixed(2)}
          </Typography>

          <Typography sx={{ color: "text.secondary", mb: 2 }}>
            {product.description}
          </Typography>

          {/* GALLERY */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            {product.images?.slice(0, 6)?.map((img, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 8,
                  backgroundColor: "#f0f0f0",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={buildImageSrc(img.image_url)} // ✅ NOTE: dùng image_url, không phải thumbnail
                  alt={`img-${idx}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/placeholder.png"; // ✅ fallback
                  }}
                />
              </Box>
            ))}
          </Box>

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
