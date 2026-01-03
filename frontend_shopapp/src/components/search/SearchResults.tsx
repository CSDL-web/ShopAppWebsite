import Box from "@mui/material/Box";
import ProductCard from "../products/ProductCard";
import { Product } from "../../stores/products";

type Props = {
  products: Product[];
};

export default function SearchResults({ products }: Props) {
  if (!products?.length) {
    return <div>No products found</div>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        margin: "2rem 0",
        flexWrap: "wrap",
      }}
    >
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </Box>
  );
}
