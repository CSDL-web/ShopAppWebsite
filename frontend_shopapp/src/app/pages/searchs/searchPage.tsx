import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Box, Pagination } from "@mui/material";
import SearchResults from "@/components/search/SearchResults";
import Header from "@/components/headers/Header";
import { Product } from "@/stores/products";
import { COLORS } from "@/styles/colors";

const PAGE_SIZE = 20;

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
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

      // 🔥 FIX CỨNG
      params.append("skip", "0");
      params.append("limit", "1001");

      const url = `http://localhost:5000/products/filter?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();

      setAllProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, [keyword, minPrice, maxPrice, categoryId, sortBy]);

  // 👉 cắt data theo trang
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return allProducts.slice(start, end);
  }, [allProducts, page]);

  const totalPages = Math.ceil(allProducts.length / PAGE_SIZE);

  return (
    <Box sx={{ backgroundColor: COLORS.lightGray, minHeight: "100vh" }}>
      <Header />
      <Container maxWidth={false}>
        <SearchResults products={paginatedProducts} loading={loading} />

        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              page={page}
              count={totalPages}
              onChange={(_, value) => {
                setSearchParams((prev) => {
                  prev.set("page", String(value));
                  return prev;
                });
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
