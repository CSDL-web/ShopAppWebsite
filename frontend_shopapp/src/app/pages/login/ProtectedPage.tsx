import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectUser,
} from "@/stores/authSlice";
import { Box, CircularProgress } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useAppSelector } from "@/stores";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth: boolean;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth,
  adminOnly = false,
}) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const user = useAppSelector(selectUser);
  const location = useLocation();

  if (loading === "pending") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );  
  }

  if (requireAuth && !isAuthenticated) {
    enqueueSnackbar("Please login to continue", { variant: "warning" });

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAuth && adminOnly && user?.role_id !== 2) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
