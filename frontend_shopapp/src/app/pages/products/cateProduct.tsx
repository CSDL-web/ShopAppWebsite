import Header from "@/components/headers/Header";
import { useAppDispatch, useAppSelector } from "@/stores";
import { actionGetProductByCategories } from "@/stores/products";
import { COLORS } from "@/styles/colors";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "@/components/products/ProductCard";
import PaginationControl from "@/components/PaginationControl";

const PAGE_SIZE = 12;

export default function CateProduct() {
  const dispatch = useAppDispatch();
  const { id, name } = useParams();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const categoryId = Number(id);

  const { data, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (!categoryId || isNaN(categoryId)) return;

    dispatch(
      actionGetProductByCategories({
        category_id: categoryId,
      })
    );
  }, [categoryId, dispatch]);

  const validProducts = useMemo(
    () => data.filter((p) => p.thumbnail && p.thumbnail.trim() !== ""),
    [data]
  );

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return validProducts.slice(start, start + PAGE_SIZE);
  }, [validProducts, page]);

  return (
    <Box sx={{ backgroundColor: "#ffffcc", minHeight: "100vh" }}>
      <Header />

      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          {name}
        </Typography>

        {loading && <Typography>Loading...</Typography>}

        {!loading && validProducts.length === 0 && (
          <Typography>No products found</Typography>
        )}

        <Grid container spacing={5}>
          {paginatedProducts.map((product) => (
            <Grid key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>

        <PaginationControl
          totalItems={validProducts.length}
          pageSize={PAGE_SIZE}
        />
      </Box>
    </Box>
  );
}
