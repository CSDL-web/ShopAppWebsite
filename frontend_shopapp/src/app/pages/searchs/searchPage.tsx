import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@mui/material";
import SearchResults from "@/components/search/SearchResults";
import { useAppDispatch } from "@/stores";

export default function SearchPage() {
  const { query } = useParams<{ query: string }>();
  const [filteredProducts, setFilteredProducts] = useState<Array<any>>([]);

  const dispatch = useAppDispatch();

  const getFilteredProducts = async (searchQuery: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/products/search?query=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    }

    useEffect(() => {
      if (!query) return;
      getFilteredProducts(query);
    }, [query, getFilteredProducts]);

    return (
      <Container sx={{ marginTop: "2rem" }}>
        <SearchResults products={filteredProducts} />
      </Container>
    );
  };
}
