import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { COLORS } from "@/styles/colors";
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
        backgroundColor: COLORS.white,
        width,
        height,
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
      }}
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={product.name}
          style={{
            width: "100%",
            height: 250,
            objectFit: "contain",
          }}
          onError={(e) => {
            e.currentTarget.src = `${API_URL}/backend_shopapp/uploads/notfound.jpeg`;
          }}
        />
      ) : (
        <img
          src={`${API_URL}/backend_shopapp/uploads/notfound.jpeg`}
          alt="not found"
          style={{
            width: "100%",
            height: 250,
            objectFit: "contain",
          }}
        />
      )}
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
