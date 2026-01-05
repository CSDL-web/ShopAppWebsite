import { Category } from "@/stores/categories";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Props {
  categories: Category[];
}

export default function Categories({ categories }: Props) {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

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
          onClick={() =>
            navigate(`/categories/${c.name}/${encodeURIComponent(c.id)}`)
          }
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            "&:hover img": {
              transform: "scale(1.05)",
            },
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
            <img
              src={`${API_URL}/backend_shopapp/uploads/${c.id}.jpg`}
              alt={c.name}
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;

                if (!target.dataset.fallback) {
                  target.dataset.fallback = "true";
                  target.src = `${API_URL}/backend_shopapp/uploads/notfound.jpeg`;
                }
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transition: "transform 0.3s ease",
              }}
            />
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
