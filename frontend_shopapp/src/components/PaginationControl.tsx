import { Box, Pagination } from "@mui/material";
import { useSearchParams } from "react-router-dom";

interface PaginationControlProps {
  totalItems: number;
  pageSize?: number;
}

export default function PaginationControl({
  totalItems,
  pageSize = 20,
}: PaginationControlProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  return (
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
  );
}
