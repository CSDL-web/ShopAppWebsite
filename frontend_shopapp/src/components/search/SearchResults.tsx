import Box from "@mui/material/Box";
import ProductCard from "../products/ProductCard";
import { Product } from "../../stores/products";

type Props = {
  products: Product[];
  loading: boolean;
};

export default function SearchResults({ products, loading }: Props) {
  if (loading) return <div>Loading...</div>;
  if (!products.length) return <div>No products found</div>;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)", // mobile
          sm: "repeat(3, 1fr)", // tablet
          md: "repeat(4, 1fr)", // small desktop
          lg: "repeat(5, 1fr)", // desktop
        },
        gap: 3,
        mt: 3,
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Box>
  );
}
