import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { COLORS } from "@/styles/colors";
import { Product } from "../../stores/products";

const API_URL = import.meta.env.VITE_API_URL;

export const buildImageUrl = (img?: string | null): string => {
  if (!img) return `${API_URL}/backend_shopapp/uploads/notfound.jpeg`;
  return img.startsWith("http")
    ? img
    : `${API_URL}/backend_shopapp/uploads/${img}`;
};

export const getMainImage = (product: Product): string | null => {
  if (product.images?.length) {
    const first = product.images[0];
    if (typeof first === "string") return first;
    if (first.image_url) return first.image_url;
  }
  if (product.thumbnail) return product.thumbnail;

  return null;
};

const ProductCard = ({
  product,
  size = "normal",
}: {
  product: Product;
  size?: "small" | "normal" | "large";
}) => {
  const navigate = useNavigate();

  const width = size === "large" ? 400 : 225;
  const height = size === "large" ? 500 : 420;

  const mainImage = getMainImage(product);
  const imgSrc = buildImageUrl(mainImage);

  return (
    <Box
      onClick={() =>
        navigate(`/product/${product.name}`, {
          state: product,
        })
      }
      sx={{
        backgroundColor: COLORS.white,
        width,
        height,
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        border: "1px solid #ff9966",
borderRadius: "8px",

      }}
    >
      <img
        src={imgSrc}
        alt={product.name}
        onError={(e) => {
          e.currentTarget.src = `${API_URL}/backend_shopapp/uploads/notfound.jpeg`;
        }}
        style={{
          width: "100%",
          height: 250,
          objectFit: "contain",
        }}
      />

      <Typography fontWeight={500} color={COLORS.black}>
        {product.name.slice(0, 40)}...
      </Typography>

      <Typography fontWeight={700} color={COLORS.black}>
        ${product.price}
      </Typography>
    </Box>
  );
};

export default ProductCard;
