import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/headers/Header";
import { COLORS } from "@/styles/colors";
import { Product } from "@/stores/products";
import { useAppDispatch } from "@/stores";
import { addToCart } from "@/stores/cart";
import { useState } from "react";

export default function ProductPage() {
  const API_URL = import.meta.env.VITE_API_URL;

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [openToast, setOpenToast] = useState(false);

  const product = location.state as Product | null;

  console.log("PRODUCT PAGE STATE:", product);
  if (!product) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Product not found</Typography>
        <Button onClick={() => navigate(-1)}>Go back</Button>
      </Box>
    );
  }

  const buildImageUrl = (img?: string | null) => {
    if (!img) {
      return `${API_URL}/backend_shopapp/uploads/notfound.jpeg`;
    }
    return img.startsWith("http")
      ? img
      : `${API_URL}/backend_shopapp/uploads/${img}`;
  };

  const getMainImage = () => {
    if (product.thumbnail) return product.thumbnail;

    if (product.images?.length) {
      const first = product.images[0];
      if (typeof first === "string") return first;
      if (first.url) return first.url;
    }

    return null;
  };

  const handleAddToCart = () => {
    console.log("Adding product to cart:", product.name);

    if (!product.name) {
      console.error("Product has no name!");
      return;
    }

    dispatch(addToCart(product));
    setOpenToast(true);
  };

  const mainImage = getMainImage();

  return (
    <Box sx={{ backgroundColor: COLORS.lightGray, minHeight: "100vh" }}>
      <Header />

      <Box
        sx={{
          maxWidth: 1200,
          margin: "2rem auto",
          display: "flex",
          gap: 4,
          backgroundColor: "#fff",
          p: 3,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <img
            src={buildImageUrl(mainImage)}
            alt={product.name}
            style={{ width: "100%", maxHeight: 450, objectFit: "contain" }}
            onError={(e) => {
              e.currentTarget.src = `${API_URL}/backend_shopapp/uploads/notfound.jpeg`;
            }}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={600}>
            {product.name}
          </Typography>

          <Typography sx={{ my: 2 }}>
            {product.description || "No description available."}
          </Typography>

          <Typography variant="h6" fontWeight={700} my={2}>
            ${product.price}
          </Typography>

          <Button
            variant="contained"
            onClick={handleAddToCart}
            sx={{
              backgroundColor: COLORS.orange,
              color: COLORS.black,
              mt: 2,
              "&:hover": { backgroundColor: COLORS.orange, opacity: 0.9 },
            }}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>

      {/* 🔥 TOAST */}
      <Snackbar
        open={openToast}
        autoHideDuration={2000}
        onClose={() => setOpenToast(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" variant="filled">
          Added to cart successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}
