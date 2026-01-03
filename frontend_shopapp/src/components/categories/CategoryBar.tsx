import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import { COLORS } from "@/styles/colors";
import { Category } from "@/stores/categories";

export default function CategoryBar({
  categories,
}: {
  categories: Category[];
}) {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  return (
    <Box
      sx={{
        backgroundColor: COLORS.white,
        borderBottom: "1px solid #eee",
        padding: "0 1rem",
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          gap: "2rem",
          overflowX: "auto",
        }}
      >
        {categories.map((cat) => {
          const active = String(cat.id) === categoryId;

          return (
            <Typography
              key={cat.id}
              onClick={() => navigate(`/cate/${cat.id}`)}
              sx={{
                padding: "1rem 0",
                cursor: "pointer",
                fontWeight: active ? 600 : 400,
                color: active ? COLORS.primary : COLORS.black,
                borderBottom: active
                  ? `3px solid ${COLORS.primary}`
                  : "3px solid transparent",
                whiteSpace: "nowrap",
              }}
            >
              {cat.name}
            </Typography>
          );
        })}
      </Box>
    </Box>
  );
}
