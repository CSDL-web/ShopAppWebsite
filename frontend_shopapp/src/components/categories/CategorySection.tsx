import Box from "@mui/material/Box";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/stores/products";

interface Props {
  title: string;
  products: Product[];
}

export default function CategorySection({ title, products }: Props) {
  const navigate = useNavigate();

  const randomProducts = useMemo(() => {
    return [...products].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [products]);

  return (
    // ✅ NỀN CAM CHO CẢ SECTION
    <Box
      sx={{
        mb: 6,
        backgroundColor: "#990000",
        borderRadius: 4,
        p: 3,
      }}
    >
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        mb={2}
        sx={{ color: "#fff" }} // chữ trắng cho nổi
      >
        <Typography fontSize={20} fontWeight={800}>
          {title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
            fontSize: 14,
            color: "#fff",
            "&:hover": { opacity: 0.85 },
          }}
          onClick={() => navigate(`/categories/${encodeURIComponent(title)}`)}
        >
          <Typography fontSize={14}>Xem thêm</Typography>
          <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
        </Box>
      </Box>

      {/* PRODUCT GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2.5,
        }}
      >
        {randomProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </Box>
    </Box>
  );
}
