import * as React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Link,
  IconButton,
  InputAdornment,
  Switch,
  FormControlLabel,
} from "@mui/material";

import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

export default function SignInPage() {
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const raw = localStorage.getItem("demo_user");
    const user = raw ? JSON.parse(raw) : null;

    if (!user) {
      setError("Chưa có tài khoản. Vui lòng đăng ký trước.");
      return;
    }

    // ✅ hỗ trợ cả user.username (mới) và user.email (cũ) để khỏi lỗi dữ liệu cũ
    const okUser =
      username.trim() === (user.username ?? "") ||
      username.trim() === (user.email ?? "");

    if (!okUser || password !== user.password) {
      setError("User hoặc mật khẩu không đúng.");
      return;
    }

    navigate("/");
  };

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
          width: "min(520px, 100%)",
          borderRadius: "28px",
          p: { xs: 3, sm: 5 },
          backgroundColor: "#f5f6f7",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Sign in
        </Typography>

        <Typography sx={{ color: "text.secondary", mb: 3, maxWidth: 380 }}>
          Log in by entering your user and password.
        </Typography>

        <Box component="form" onSubmit={onSubmit} sx={{ display: "grid", gap: 2 }}>
          <Box>
            <Typography sx={{ mb: 1, color: "text.secondary" }}>
              User
            </Typography>
            <TextField
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineRoundedIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box>
            <Typography sx={{ mb: 1, color: "text.secondary" }}>
              Password
            </Typography>
            <TextField
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      aria-label="show password"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      <VisibilityRoundedIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {error && (
            <Typography color="error" sx={{ fontSize: 14, mt: -1 }}>
              {error}
            </Typography>
          )}

          <Link
            component={RouterLink}
            to="/forgot-password"
            underline="hover"
            sx={{ color: "primary.main", mt: -1 }}
          >
            Forgot password?
          </Link>

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              mt: 1,
              py: 1.4,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              backgroundColor: "#6f49ff",
              "&:hover": { backgroundColor: "#5d3df0" },
            }}
          >
            Log in
          </Button>

          <FormControlLabel
            control={<Switch />}
            label="Remember me"
            sx={{ mt: 0.5, color: "text.secondary" }}
          />

          {/* ✅ BỎ ĐĂNG NHẬP GOOGLE: xoá luôn phần dưới nếu không cần */}
          {/* 
          <Divider sx={{ my: 1.5 }}>Or</Divider>
          <Button
            variant="outlined"
            size="large"
            sx={{
              py: 1.2,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              backgroundColor: "#fff",
            }}
          >
            Sign in with Google
          </Button>
          */}

          <Typography sx={{ color: "text.secondary" }}>
            Don&apos;t have an account?{" "}
            <Link
              component={RouterLink}
              to="/register"
              underline="hover"
              sx={{ color: "primary.main" }}
            >
              Sign up here
            </Link>
          </Typography>

          <Button
            component={RouterLink}
            to="/"
            variant="text"
            size="large"
            sx={{
              mt: 1,
              textTransform: "none",
              fontWeight: 600,
              color: "text.secondary",
            }}
          >
            ← Back to Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
