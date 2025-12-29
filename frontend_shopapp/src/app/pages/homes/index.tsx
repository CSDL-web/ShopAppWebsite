import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Header from "@/components/headers/Header";
import ProductCard from "@/components/products/ProductCard";
import { COLORS } from "@/styles/colors";
import { products } from "@/components/products/fakeData";

export default function HomePage() {
  return (
    <Box sx={{ backgroundColor: COLORS.lightGray, minHeight: "100vh" }}>
      <Header />

      <Box
        sx={{
          height: 300,
          background:
            "linear-gradient(180deg, #eaeded 0%, rgba(234,237,237,0) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" fontWeight={700}></Typography>
      </Box>

      <Box
        sx={{
          maxWidth: 1400,
          margin: "-150px auto 0",
          padding: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(225px, 1fr))",
          gap: "1rem",
          justifyItems: "center",
        }}
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </Box>
    </Box>
  );
}
