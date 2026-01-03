import { Box, SxProps, Theme } from "@mui/material";
import React from "react";
import { COLORS } from "@/styles/colors"; // 👉 sửa path cho Vite

type Props = {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export default function CustomBox({ children, sx }: Props) {
  return (
    <Box
      sx={{
        border: `1px solid ${COLORS.lightGray}`,
        borderRadius: "0.5rem",
        padding: "1rem",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
