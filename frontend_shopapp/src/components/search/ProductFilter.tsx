import { Box, TextField, MenuItem, Button } from "@mui/material";
import { useState } from "react";

export type FilterParams = {
  keyword?: string;
  min_price?: number;
  max_price?: number;
  category_id?: number;
  sort_by?: string;
};

type Props = {
  onFilter: (params: FilterParams) => void;
};

export default function ProductFilter({ onFilter }: Props) {
  const [filters, setFilters] = useState<FilterParams>({});

  const handleChange = (key: keyof FilterParams, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto",
        gap: 2,
        mb: 3,
      }}
    >
      <TextField
        label="Từ khóa"
        size="small"
        onChange={(e) => handleChange("keyword", e.target.value)}
      />

      <TextField
        label="Giá từ"
        type="number"
        size="small"
        onChange={(e) => handleChange("min_price", e.target.value)}
      />

      <TextField
        label="Giá đến"
        type="number"
        size="small"
        onChange={(e) => handleChange("max_price", e.target.value)}
      />

      <TextField
        select
        label="Danh mục"
        size="small"
        onChange={(e) => handleChange("category_id", e.target.value)}
      >
        <MenuItem value="">Tất cả</MenuItem>
        <MenuItem value="1">Chair</MenuItem>
        <MenuItem value="2">Table</MenuItem>
        <MenuItem value="3">Shirt</MenuItem>
      </TextField>

      <TextField
        select
        label="Sắp xếp"
        size="small"
        onChange={(e) => handleChange("sort_by", e.target.value)}
      >
        <MenuItem value="">Mặc định</MenuItem>
        <MenuItem value="price_asc">Giá tăng</MenuItem>
        <MenuItem value="price_desc">Giá giảm</MenuItem>
        <MenuItem value="newest">Mới nhất</MenuItem>
        <MenuItem value="best_selling">Bán chạy</MenuItem>
      </TextField>

      <Button variant="contained" onClick={() => onFilter(filters)}>
        Lọc
      </Button>
    </Box>
  );
}
