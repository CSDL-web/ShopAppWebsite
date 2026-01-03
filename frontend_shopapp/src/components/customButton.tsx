import { Button, SxProps, Theme } from "@mui/material";
import React from "react";
import { COLORS } from "@/styles/colors";

type Props = {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function CustomButton({ children, sx, onClick }: Props) {
  return (
    <Button
      onClick={onClick}
      sx={{
        borderRadius: "1rem",
        backgroundColor: COLORS.yellow,
        color: COLORS.black,
        margin: "0.25rem 0",
        width: "100%",
        textTransform: "none",
        "&:hover": {
          backgroundColor: COLORS.darkYellow,
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}
