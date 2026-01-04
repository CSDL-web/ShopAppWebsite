import Box from "@mui/material/Box";
import Header from "@/components/headers/Header";
import Categories from "@/components/categories/Categories";
import CategorySection from "@/components/categories/CategorySection";

import { actionGetProduct, selectProductsData } from "@/stores/products";
import {
  actionGetCategories,
  selectCategoriesData,
} from "@/stores/categories";
import { useAppDispatch, useAppSelector } from "@/stores";
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
    // 🔴 NỀN NGOÀI: ĐỎ SÁNG
    <Box sx={{ backgroundColor: "#ff3333", minHeight: "100vh" }}>
      <Header />

      {/* 🟠 PHẦN TRÊN (Categories): CAM */}
      <Box sx={{ backgroundColor: "#FF3333", py: 1.5 }}>
        <Categories categories={dataCategories.data} />
      </Box>

      {/* 📦 CÁC MỤC SẢN PHẨM */}
      <Box sx={{ maxWidth: 1400, mx: "auto", p: 3 }}>
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
