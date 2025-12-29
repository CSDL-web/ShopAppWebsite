import { Box, SxProps, Typography } from "@mui/material";
import React from "react";
import CustomHR from "../CustomHR";

type CheckoutSectionProps = {
  number: number;
  title: string;
  children: React.ReactNode;
  sx?: SxProps;
};

const CheckoutSection = ({
  number,
  title,
  children,
  sx,
}: CheckoutSectionProps) => {
  return (
    <Box sx={{ marginTop: "1rem" }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", ...sx }}>
        <Box sx={{ display: "flex", minWidth: "18rem" }}>
          <Typography variant="h6" sx={{ marginRight: "1rem" }}>
            {number}
          </Typography>
          <Typography variant="h6">
            {title}
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
          {children}
        </Box>
      </Box>

      <CustomHR />
    </Box>
  );
};

export default CheckoutSection;
