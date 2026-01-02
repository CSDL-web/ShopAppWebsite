import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { COLORS } from "@/styles/colors";
import { Product } from "../../stores/products";

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

  return (
    <Box
      onClick={() => navigate(`/product/${product.id}`)}
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
      {/* <img
        src={product.image}
        alt={product.title}
        style={{ width: "100%", height: 250, objectFit: "contain" }}
      /> */}
      <Typography fontWeight={500} color={COLORS.black}>
        {product.title.slice(0, 40)}...
      </Typography>
      <Typography fontWeight={700} color={COLORS.black}>
        ${product.price}
      </Typography>
    </Box>
  );
};

export default ProductCard;
