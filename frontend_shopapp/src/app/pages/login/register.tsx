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
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [userAccount, setUserAccount] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // ✅ mỗi ô 1 mắt riêng
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // ✅ chỉ cần nhập đủ ô (không validate định dạng)
  const canSubmit =
    fullName.trim() !== "" &&
    phone.trim() !== "" &&
    address.trim() !== "" &&
    userAccount.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    localStorage.setItem(
      "demo_user",
      JSON.stringify({
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        userAccount: userAccount.trim(),
        password, // demo only
        confirmPassword, // demo only
        createdAt: Date.now(),
      })
    );

    navigate("/check-password");
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
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
          Create Your Account
        </Typography>

        <Box component="form" onSubmit={onSubmit} sx={{ display: "grid", gap: 2 }}>
          <TextField
            fullWidth
            label="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            helperText=" "
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineRoundedIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            helperText=" "
            placeholder="0123456789"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIphoneRoundedIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            helperText=" "
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnOutlinedIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="User account"
            value={userAccount}
            onChange={(e) => setUserAccount(e.target.value)}
            helperText=" "
            placeholder="username"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineRoundedIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText=" "
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

          <TextField
            fullWidth
            label="Confirm password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            helperText=" "
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
                    aria-label="show confirm password"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    <VisibilityRoundedIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            control={<Checkbox />}
            label="Receive news, updates and deals"
            sx={{ color: "text.secondary" }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!canSubmit}
            sx={{
              mt: 0.5,
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
            Create Account
          </Button>

          <Typography sx={{ color: "text.secondary" }}>
            Already have an account?{" "}
            <Link component={RouterLink} to="/login" underline="hover" sx={{ color: "primary.main" }}>
              Log in here
            </Link>
          </Typography>

          <Button
            component={RouterLink}
            to="/"
            variant="text"
            size="large"
            sx={{ mt: 1, textTransform: "none", fontWeight: 600, color: "text.secondary" }}
          >
            ← Back to Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
