import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectAuthLoading } from "@/stores/authSlice";
import { Box, CircularProgress } from "@mui/material";
import { enqueueSnackbar } from "notistack";

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
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const location = useLocation();

  const roleId = Number(localStorage.getItem("user_role"));

  useEffect(() => {
    if (requireAuth && isAuthenticated) {
      const tokenExpiration = localStorage.getItem("refresh_expiration_date");
      if (tokenExpiration) {
        const expirationTime = new Date(tokenExpiration).getTime();
        const currentTime = new Date().getTime();

        if (currentTime > expirationTime) {
          enqueueSnackbar("Your session has expired. Please login again.", {
            variant: "warning",
          });
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user_role");
          localStorage.removeItem("tokenExpiration");
          localStorage.removeItem("refresh_expiration_date");
          window.location.href = "/login";
        }
      }
    }
  }, [isAuthenticated, requireAuth, location]);

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

  if (requireAuth && adminOnly && roleId == 2) {
    enqueueSnackbar("Access denied. Admin only.", { variant: "error" });
    return <Navigate to="/dashboard" replace />;
  }

  if (
    !requireAuth &&
    isAuthenticated &&
    (location.pathname === "/login" || location.pathname === "/register")
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
