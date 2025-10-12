import React from "react";
import { CircularProgress, Box } from "@mui/material";
import "styles/index.scss"; 

const LoadingComponent: React.FC = () => {
  return (
    <Box className="loading-container">
      <CircularProgress className="loading-spinner" />
    </Box>
  );
};

export default LoadingComponent;
