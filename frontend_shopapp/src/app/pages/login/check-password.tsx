import * as React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

export default function CheckPasswordPage() {
  const navigate = useNavigate();
  const [show1, setShow1] = React.useState(false);
  const [show2, setShow2] = React.useState(false);

  const [p1, setP1] = React.useState("");
  const [p2, setP2] = React.useState("");
  const [touched, setTouched] = React.useState(false);
  const [error, setError] = React.useState("");

  const p1Err =
    touched && p1.trim().length < 8 ? "Password must be at least 8 characters." : "";

  const p2Err =
    touched && p2.trim().length === 0
      ? "Please confirm your password."
      : touched && p1 !== p2
      ? "Passwords do not match."
      : "";

  const canSubmit = p1.trim().length >= 8 && p1 === p2;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setError("");

    if (!canSubmit) return;

    // ✅ Lấy user đã tạo ở trang đăng ký
    const raw = localStorage.getItem("demo_user");
    const user = raw ? JSON.parse(raw) : null;

    if (!user) {
      setError("Không tìm thấy tài khoản vừa đăng ký. Vui lòng đăng ký lại.");
      return;
    }

    // ✅ Cập nhật password thành password đã confirm
    localStorage.setItem(
      "demo_user",
      JSON.stringify({
        ...user,
        password: p1,
        passwordSetAt: Date.now(),
      })
    );

    // ✅ xong thì về login
    navigate("/login");
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
          Confirm password
        </Typography>

        <Typography sx={{ color: "text.secondary", mb: 3, maxWidth: 420 }}>
          Please re-enter your password to confirm (minimum 8 characters).
        </Typography>

        <Box component="form" onSubmit={onSubmit} sx={{ display: "grid", gap: 2 }}>
          <Box>
            <Typography sx={{ mb: 1, color: "text.secondary" }}>Password</Typography>
            <TextField
              fullWidth
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              onBlur={() => setTouched(true)}
              error={Boolean(p1Err)}
              helperText={p1Err || " "}
              type={show1 ? "text" : "password"}
              placeholder="••••••••••••"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShow1((v) => !v)} aria-label="toggle password">
                      <VisibilityRoundedIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box>
            <Typography sx={{ mb: 1, color: "text.secondary" }}>Confirm password</Typography>
            <TextField
              fullWidth
              value={p2}
              onChange={(e) => setP2(e.target.value)}
              onBlur={() => setTouched(true)}
              error={Boolean(p2Err)}
              helperText={p2Err || " "}
              type={show2 ? "text" : "password"}
              placeholder="••••••••••••"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShow2((v) => !v)} aria-label="toggle password">
                      <VisibilityRoundedIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {error && (
            <Typography color="error" sx={{ fontSize: 14 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!canSubmit}
            sx={{
              mt: 1,
              py: 1.4,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              backgroundColor: "#6f49ff",
              "&:hover": { backgroundColor: "#5d3df0" },
              "&.Mui-disabled": {
                backgroundColor: "rgba(111,73,255,0.35)",
                color: "rgba(255,255,255,0.9)",
              },
            }}
          >
            Continue
          </Button>

          <Link component={RouterLink} to="/login" underline="hover" sx={{ mt: 1, color: "text.secondary" }}>
            Go back to Sign In.
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}
