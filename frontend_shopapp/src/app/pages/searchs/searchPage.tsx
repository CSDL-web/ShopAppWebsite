import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Box } from "@mui/material";
import SearchResults from "@/components/search/SearchResults";
import Header from "@/components/headers/Header";
import { Product } from "@/stores/products";
import { COLORS } from "@/styles/colors";
import PaginationControl from "@/components/PaginationControl";
import request from "@/utils/request";

const PAGE_SIZE = 20;

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  const keyword = searchParams.get("keyword");
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const categoryId = searchParams.get("category_id");
  const sortBy = searchParams.get("sort_by");

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const params = new URLSearchParams();
      if (keyword) params.append("keyword", keyword);
      if (minPrice) params.append("min_price", minPrice);
      if (maxPrice) params.append("max_price", maxPrice);
      if (categoryId) params.append("category_id", categoryId);
      if (sortBy) params.append("sort_by", sortBy);

      params.append("skip", "0");
      params.append("limit", "1001");

      const res = await request({ url: "/products/filter", method: "GET" });

      const data: Product[] = await res.data();

      setAllProducts(data.filter((p) => p.thumbnail?.trim()));

      setLoading(false);
    };

    fetchProducts();
  }, [keyword, minPrice, maxPrice, categoryId, sortBy]);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return allProducts.slice(start, start + PAGE_SIZE);
  }, [allProducts, page]);

  return (
    <Box sx={{ backgroundColor: COLORS.lightGray, minHeight: "100vh" }}>
      <Header />

      <Container maxWidth={false}>
        <SearchResults products={paginatedProducts} loading={loading} />

        <PaginationControl
          totalItems={allProducts.length}
          pageSize={PAGE_SIZE}
        />
      </Container>
    </Box>
  );
}
