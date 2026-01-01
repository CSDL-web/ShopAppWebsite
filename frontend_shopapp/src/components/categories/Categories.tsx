import { useAppDispatch, useAppSelector } from "@/stores";
import {
  actionGetCategories,
  Category,
  selectCategoriesData,
} from "@/stores/categories";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  categories: Category[];
}

export default function Categories({ categories }: Props) {
  return (
    <Box
      sx={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "2rem 1rem",
        display: "flex",
        justifyContent: "space-between",
        gap: "1.5rem",
      }}
    >
      {categories.map((c: any) => (
        <Box
          key={c.id}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Box
            sx={{
              width: 160,
              height: 160,
              border: "2px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {c.image ? (
              <img
                src={c.image}
                alt={c.name}
                style={{ width: "70%", objectFit: "contain" }}
              />
            ) : (
              <Box
                sx={{
                  width: 60,
                  height: 40,
                  backgroundColor: "#eee",
                  borderRadius: "6px",
                }}
              />
            )}
          </Box>

          <Typography
            sx={{
              marginTop: "0.75rem",
              fontWeight: 500,
            }}
          >
            {c.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
