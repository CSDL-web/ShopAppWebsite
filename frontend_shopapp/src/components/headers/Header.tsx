import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import FeedbackIcon from "@mui/icons-material/Feedback";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import SearchBar from "./SearchBar";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/stores";
import { logoutUser, selectIsAuthenticated } from "@/stores/authSlice";
import { AsyncThunkAction, AsyncThunkConfig } from "@reduxjs/toolkit";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCheckoutCart = () => {
    const token = isAuthenticated || !!localStorage.getItem("accessToken");
    if (token) {
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };
  const itemStyle = {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    borderRadius: 2,
    py: 1.2,
  };

  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = keyword.trim();
    if (!value) return;

    navigate(`/search/${encodeURIComponent(value)}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: "2rem",
        py: "1rem",
        backgroundColor: "#ff9966",
        borderBottom: "1px solid #eee",
      }}
    >
      <Typography fontWeight={600}></Typography>

      <IconButton onClick={handleOpen}>
        <Avatar sx={{ width: 40, height: 40, bgcolor: "#e0e0e0" }}>
          <PersonIcon sx={{ color: "#757575" }} />
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            width: 320,
            borderRadius: 3,
            mt: 1,
            p: 1,
            boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            cursor: "pointer",
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          <Avatar sx={{ width: 48, height: 48, bgcolor: "#e0e0e0" }}>
            <PersonIcon sx={{ color: "#757575" }} />
          </Avatar>
          <Box>
            <Typography fontWeight={600}></Typography>
            <Typography fontSize={13} color="text.secondary">
              Xem tất cả trang cá nhân
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <MenuItem sx={itemStyle}>
          <SettingsIcon />
          <Typography>Cài đặt</Typography>
        </MenuItem>

        <MenuItem sx={itemStyle}>
          <HelpOutlineIcon />
          <Typography>Trợ giúp và hỗ trợ</Typography>
        </MenuItem>

        <MenuItem
          sx={{ ...itemStyle, color: "error.main" }}
          onClick={handleLogout}
        >
          <LogoutIcon />
          <Typography>Đăng xuất</Typography>
        </MenuItem>
      </Menu>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          mx: 3,
        }}
      >
        <SearchBar />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <Typography
          onClick={() => {
            if (!isHome) {
              navigate("/");
            }
          }}
          sx={{
            cursor: isHome ? "default" : "pointer",
            fontWeight: isHome ? 600 : 400,
            color: isHome ? "text.primary" : "text.secondary",
            textDecoration: isHome ? "underline" : "none",
            pointerEvents: isHome ? "none" : "auto",
          }}
        >
          Shop
        </Typography>
        <Typography sx={{ color: "#ccc" }}>|</Typography>
        <Typography sx={{ cursor: "pointer" }}>Help</Typography>

        <Button
          variant="outlined"
          startIcon={
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartOutlinedIcon />
            </Badge>
          }
          onClick={handleCheckoutCart}
          sx={{
            textTransform: "none",
            borderColor: "#000",
            color: "#000",
            borderRadius: "6px",
            px: 2,
            "&:hover": {
              borderColor: "#000",
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          Your Cart
        </Button>
      </Box>
    </Box>
  );
}
