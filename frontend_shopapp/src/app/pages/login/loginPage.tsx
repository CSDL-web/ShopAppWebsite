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

import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

function GoogleIcon() {
  return (
    <Box component="span" sx={{ display: "inline-flex", mr: 1 }} aria-hidden>
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path
          fill="#FFC107"
          d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.8 4.1 29.7 2 24 2 12.9 2 4 10.9 4 22s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-1.5z"
        />
        <path
          fill="#FF3D00"
          d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.8 4.1 29.7 2 24 2 16.3 2 9.7 6.3 6.3 14.7z"
        />
        <path
          fill="#4CAF50"
          d="M24 42c5.2 0 10-2 13.6-5.2l-6.3-5.3c-1.9 1.5-4.3 2.5-7.3 2.5-5.3 0-9.8-3.4-11.4-8.2l-6.7 5.2C9.4 37.8 16.2 42 24 42z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.2-4.6 5.5l.1.1 6.3 5.3C39.5 36.6 44 32 44 22c0-1.3-.1-2.7-.4-1.5z"
        />
      </svg>
    </Box>
  );
}

export default function SignInPage() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
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

    if (email.trim() !== user.email || password !== user.password) {
      setError("Email hoặc mật khẩu không đúng.");
      return;
    }

    // ✅ đăng nhập thành công -> về Home
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
          abc
        </Typography>
        <Typography sx={{ color: "red", fontWeight: 900 }}>
  THIS IS MY LOGIN PAGE
</Typography>


        <Typography sx={{ color: "text.secondary", mb: 3, maxWidth: 380 }}>
          Log in by entering your email address and password.
        </Typography>

        {/* ✅ form để Enter cũng login được */}
        <Box component="form" onSubmit={onSubmit} sx={{ display: "grid", gap: 2 }}>
          <Box>
            <Typography sx={{ mb: 1, color: "text.secondary" }}>
              Email address
            </Typography>
            <TextField
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@address.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineRoundedIcon color="primary" />
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
            <GoogleIcon />
            Sign in with Google
          </Button>

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

          <Typography sx={{ color: "red", fontWeight: 900 }}>
  THIS IS MY LOGIN PAGE
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
