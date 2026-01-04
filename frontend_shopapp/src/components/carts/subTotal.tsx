import { Typography, SxProps, Theme } from "@mui/material";

export default function Subtotal({
  items,
  price,
  sx,
}: {
  items: number;
  price: number;
  sx?: SxProps<Theme>;
}) {
  return (
    <Typography
      sx={{ fontSize: "1.25rem", fontWeight: 500, margin: "1rem 0", ...sx }}
    >
      Subtotal ({items} items):{" "}
      <span style={{ fontWeight: 700 }}>${price.toFixed(2)}</span>
    </Typography>
  );
}
