import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Header from "@/components/headers/Header";
import ProductCard from "@/components/products/ProductCard";
import { COLORS } from "@/styles/colors";
import { products } from "@/components/products/fakeData";
import Categories from "@/components/categories/Categories";
import CategorySection from "@/components/categories/CategorySection";
import { useAppDispatch, useAppSelector } from "@/stores";
import { actionGetCategories, selectCategoriesData } from "@/stores/categories";
import { useEffect } from "react";

export default function HomePage() {
  const dispatch = useAppDispatch();

  const dataCategories = useAppSelector(selectCategoriesData);

  useEffect(() => {
    dispatch(actionGetCategories({} as any));
  }, [dispatch]);

  return (
    <Box sx={{ backgroundColor: COLORS.lightGray, minHeight: "100vh" }}>
      <Header />
      <Categories categories={dataCategories.data} />

      <Box
        sx={{
          maxWidth: 1400,
          padding: "1rem",
        }}
      >
        {dataCategories.data.map((cat, i) => (
          <CategorySection
            key={i}
            title={cat.name}
            products={products.filter((p) => p.category === cat.name)}
          />
        ))}
      </Box>
    </Box>
  );
}
