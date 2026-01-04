import Box from "@mui/material/Box";
import Header from "@/components/headers/Header";
import { COLORS } from "@/styles/colors";
import { actionGetProduct, selectProductsData } from "@/stores/products";
import Categories from "@/components/categories/Categories";
import CategorySection from "@/components/categories/CategorySection";
import { useAppDispatch, useAppSelector } from "@/stores";
import { actionGetCategories, selectCategoriesData } from "@/stores/categories";
import { useEffect } from "react";

export default function HomePage() {
  const dispatch = useAppDispatch();

  const dataCategories = useAppSelector(selectCategoriesData);
  const product = useAppSelector(selectProductsData);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        dispatch(actionGetCategories()).unwrap(),
        dispatch(actionGetProduct({ skip: 0, limit: 1001 })).unwrap(),
      ]);
    };

    fetchData();
  }, [dispatch]);

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
          padding: "1rem",
        }}
      >
        {dataCategories.data.map((cat) => {
          const productsByCategory = product.data.filter(
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
