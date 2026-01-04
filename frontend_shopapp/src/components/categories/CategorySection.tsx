import Box from "@mui/material/Box";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Typography from "@mui/material/Typography";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/stores/products";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  products: Product[];
}

export default function CategorySection({ title, products }: Props) {
  const navigate = useNavigate();
  const firstProducts = products.slice(0, 4);

  
  return (
    <Box sx={{ mb: 6 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography fontSize={20} fontWeight={600}>
          {title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
            color: "#555",
            fontSize: 14,
            "&:hover": { color: "#000" },
          }}
          onClick={() =>
            navigate(
              `/categories/${title}/${encodeURIComponent(
                products[0]?.category_id
              )}`
            )
          }
        >
          <Typography fontSize={14}>Xem thêm</Typography>
          <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
        </Box>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="1rem">
        {firstProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </Box>
    </Box>
  );
}


