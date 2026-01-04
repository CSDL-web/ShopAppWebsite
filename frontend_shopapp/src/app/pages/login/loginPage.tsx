import * as React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  Alert,
  CircularProgress,
} from "@mui/material";

import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import {
  loginUser,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
} from "@/stores/authSlice";
import { useAppDispatch } from "@/stores";

export default function SignInPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [localError, setLocalError] = React.useState("");

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
    console.log(isAuthenticated);
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!phoneNumber.trim()) {
      setLocalError("Phone number is required");
      return;
    }

    if (!password.trim()) {
      setLocalError("Password is required");
      return;
    }

    // Validate phone number format (10-11 digits)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      setLocalError("Please enter a valid phone number (10-11 digits)");
      return;
    }

    try {
      await dispatch(
        loginUser({ account: phoneNumber.trim(), password })
      ).unwrap();
    } catch (err) {
      console.error("Login failed:", err);
    }
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
          Log in by entering your phone number and password.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {localError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {localError}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "grid", gap: 2 }}
        >
          <Box>
            <Typography sx={{ mb: 1, color: "text.secondary" }}>
              Phone Number
            </Typography>
            <TextField
              fullWidth
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0912345678"
              disabled={loading === "pending"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIphoneRoundedIcon color="primary" />
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
              disabled={loading === "pending"}
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
                      disabled={loading === "pending"}
                    >
                      <VisibilityRoundedIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

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
            disabled={loading === "pending"}
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
            {loading === "pending" ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Log in"
            )}
          </Button>

          <FormControlLabel
            control={<Switch />}
            label="Remember me"
            sx={{ mt: 0.5, color: "text.secondary" }}
          />

          <Divider sx={{ my: 1.5 }}>Or</Divider>

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
