import * as React from "react";
import { Box, Paper } from "@mui/material";

type Props = {
  children: React.ReactNode;
  maxWidth?: number;
};

export default function AuthLayout({ children, maxWidth = 520 }: Props) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 6,
        background: `
          radial-gradient(900px 520px at 15% 80%, rgba(200,27,231,.85) 0%, transparent 55%),
          radial-gradient(900px 520px at 85% 15%, rgba(48,162,222,.85) 0%, transparent 55%),
          radial-gradient(900px 520px at 15% 10%, rgba(133,86,228,.75) 0%, transparent 55%),
          linear-gradient(135deg, #c81be7 0%, #8556e4 30%, #5b7be2 55%, #30a2de 100%)
        `,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: `min(${maxWidth}px, 100%)`,
          borderRadius: "28px",
          p: { xs: 3, sm: 5 },
          background:
            "linear-gradient(135deg, rgba(255,255,255,.30), rgba(255,255,255,.10))",
          border: "1px solid rgba(255,255,255,.35)",
          boxShadow: "0 30px 60px rgba(85,7,92,.18)",
          backdropFilter: "blur(12px)",
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}
