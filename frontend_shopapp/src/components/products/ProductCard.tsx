import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { Product } from "../../stores/products";
import buildImageSrc from "../UploadImg";

const API_URL = import.meta.env.VITE_API_URL;

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
  const imgSrc = buildImageSrc(product.thumbnail);

  return (
    <Box
      onClick={() =>
        navigate(`/product/${product.name}`, {
          state: product,
        })
      }
      sx={{
        backgroundColor: "#F00000", // 🔴 nền tổng
        border: "3px solid #f00000",
        borderRadius: 2,
        width,
        height,
        cursor: "pointer",
        overflow: "hidden", // 👈 để bo góc đẹp
        display: "flex",
        flexDirection: "column",
        transition: "0.25s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        },
      }}
    >
      {/* ===== IMAGE (2/3 - RED) ===== */}
      <Box
        sx={{
          flex: 2,
          padding: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={imgSrc}
          alt={product.name}
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.fallback) {
              target.dataset.fallback = "true";
              target.src = `${API_URL}/backend_shopapp/uploads/notfound.jpeg`;
            }
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: 8,
          }}
        />
      </Box>

      {/* ===== INFO (1/3 - WHITE) ===== */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#fff", // ⚪ nền trắng
          padding: "0.75rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography fontWeight={500} color="#000">
          {product.name.slice(0, 40)}...
        </Typography>

        <Typography fontWeight={700} color="#F00000">
          ${product.price}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProductCard;
