import { Box, Typography } from "@mui/material";
import { COLORS } from "@/styles/colors";

export default function Ratings({
  rating,
}: {
  rating: { rate: number; count: number };
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", margin: "0.5rem 0" }}>
      <Box sx={{ marginRight: "0.5rem" }}>
        {Array.from({ length: Math.round(rating.rate) }).map((_, i) => (
          <img
            key={i}
            src="/star-icon.png"
            alt="star"
            width={18}
            height={18}
            style={{ marginRight: 2 }}
          />
        ))}
      </Box>

      <Typography
        sx={{
          fontWeight: 500,
          color: COLORS.teal,
          "&:hover": { color: COLORS.orange },
        }}
      >
        {rating.count}
      </Typography>
    </Box>
  );
}
