import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { SxProps, Theme } from "@mui/material/styles";
import { COLORS } from "@/styles/colors";

type Props = {
  sx?: SxProps<Theme>;
};

export default function InStockText({ sx }: Props) {
  const [inStock, setInStock] = useState<number>(0);

  useEffect(() => {
    setInStock(5);
  }, []);

  return (
    <Typography
      sx={{
        color: COLORS.red,
        fontWeight: 700,
        margin: "0.5rem 0",
        ...sx,
      }}
    >
      Only {inStock} in stock - order soon.
    </Typography>
  );
}
