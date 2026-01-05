import { useState } from "react";
import ProductFilter, { FilterParams } from "./ProductFilter";
import SearchResults from "./SearchResults";
import { Product } from "../../stores/products";

export default function ProductSearchContainer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFilter = async (params: FilterParams) => {
    setLoading(true);

    const query = new URLSearchParams({
      ...params,
      skip: "0",
      limit: "20",
    } as any).toString();

    const res = await fetch(`http://localhost:5000/products/filter?${query}`);

    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  return (
    <>
      <ProductFilter onFilter={handleFilter} />
      <SearchResults products={products} loading={loading} />
    </>
  );
}
