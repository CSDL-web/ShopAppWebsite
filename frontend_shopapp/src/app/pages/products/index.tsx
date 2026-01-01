import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { COLORS } from "@/styles/colors";
import Ratings from "@/components/products/Ratings";
import { Product, products } from "@/components/products/fakeData";
import Header from "@/components/headers/Header";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;

    // 👉 mock version
    const found = products.find((p) => p.id === Number(id));
    setProduct(found ?? null);

    // 👉 API version (sau này)
    // getSingleProduct(Number(id)).then(setProduct);
  }, [id]);

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
