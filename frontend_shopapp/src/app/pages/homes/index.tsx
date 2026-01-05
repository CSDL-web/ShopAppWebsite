import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import Header from "@/components/headers/Header";
import Categories from "@/components/categories/Categories";
import CategorySection from "@/components/categories/CategorySection";

import { COLORS } from "@/styles/colors";
import { useAppDispatch, useAppSelector } from "@/stores";

import { actionGetCategories, selectCategoriesData } from "@/stores/categories";

import { actionGetProduct, selectProductsData } from "@/stores/products";

export default function HomePage() {
  const dispatch = useAppDispatch();

  const dataCategories = useAppSelector(selectCategoriesData);
  const products = useAppSelector(selectProductsData);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          dispatch(actionGetCategories()).unwrap(),
          dispatch(actionGetProduct({ skip: 0, limit: 1001 })).unwrap(),
        ]);
      } catch (error) {
        console.error("Fetch home page data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.lightGray,
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#ffcc33", // ✅ CHỈ ĐỔI MÀU NỀN Ở ĐÂY
        minHeight: "100vh",
      }}
    >
      <Header />

      <Categories categories={dataCategories.data} />

      <Box
        sx={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "1rem",
        }}
      >
        {dataCategories.data.map((cat) => {
          const productsByCategory = products.data.filter(
            (p) => p.category_id === cat.id
          );

          return (
            <CategorySection
              key={cat.id}
              title={cat.name}
              products={productsByCategory}
            />
          );
        })}
      </Box>
    </Box>
  );
}
