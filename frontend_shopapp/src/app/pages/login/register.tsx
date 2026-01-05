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
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
} from "@mui/material";

import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CakeRoundedIcon from "@mui/icons-material/CakeRounded";

import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  selectAuthLoading,
  selectAuthError,
  selectRegisterSuccess,
} from "@/stores/authSlice";
import { useAppDispatch } from "@/stores";

export default function SignUpPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const registerSuccess = useSelector(selectRegisterSuccess);

  const [fullname, setFullname] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [touched, setTouched] = React.useState({
    fullname: false,
    phoneNumber: false,
    password: false,
    confirmPassword: false,
    address: false,
  });
  const [agreeTerms, setAgreeTerms] = React.useState(false);

  // Validation functions
  const isValidFullname = (v: string) => v.trim().length >= 2;
  const isValidPhoneNumber = (v: string) => /^[0-9]{10,11}$/.test(v);
  const isValidPassword = (v: string) => v.length >= 8;
  const passwordsMatch = password === confirmPassword;
  const isValidAddress = (v: string) => v.trim().length >= 5;

  // Error messages
  const fullnameErr =
    touched.fullname && !isValidFullname(fullname)
      ? "Full name must be at least 2 characters"
      : "";

  const phoneErr =
    touched.phoneNumber && !isValidPhoneNumber(phoneNumber)
      ? "Please enter a valid phone number (10-11 digits)"
      : "";

  const passwordErr =
    touched.password && !isValidPassword(password)
      ? "Password must be at least 8 characters"
      : "";

  const confirmPasswordErr =
    touched.confirmPassword && !passwordsMatch ? "Passwords do not match" : "";

  const addressErr =
    touched.address && !isValidAddress(address)
      ? "Address must be at least 5 characters"
      : "";

  const canSubmit =
    isValidFullname(fullname) &&
    isValidPhoneNumber(phoneNumber) &&
    isValidPassword(password) &&
    passwordsMatch &&
    isValidAddress(address) &&
    agreeTerms;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTouched({
      fullname: true,
      phoneNumber: true,
      password: true,
      confirmPassword: true,
      address: true,
    });

    if (!canSubmit) return;

    const payload = {
      fullname: fullname.trim(),
      phone_number: phoneNumber.trim(),
      password: password,
      address: address.trim(),
      date_of_birth: dateOfBirth || undefined,
      email: `${phoneNumber.trim()}@shopapp.com`,
      role_id: 1,
    };

    try {
      const result = await dispatch(registerUser(payload)).unwrap();

      if (result.access_token) {
        navigate("/", { replace: true });
      } else {
        navigate("/login", {
          replace: true,
          state: { message: "Registration successful! Please log in." },
        });
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  React.useEffect(() => {
    if (registerSuccess && !error) {
      navigate("/login", {
        state: { message: "Registration successful! Please log in." },
      });
    }
  }, [registerSuccess, error, navigate]);

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
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
          Create Your Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "grid", gap: 2 }}
        >
          <Box>
            <Typography sx={{ mb: 1, color: "text.secondary" }}>
              Full Name
            </Typography>
            <TextField
              fullWidth
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, fullname: true }))}
              error={Boolean(fullnameErr)}
              helperText={fullnameErr || " "}
              placeholder="John Doe"
              disabled={loading === "pending"}
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
              Phone Number
            </Typography>
            <TextField
              fullWidth
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, phoneNumber: true }))}
              error={Boolean(phoneErr)}
              helperText={phoneErr || " "}
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
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              error={Boolean(passwordErr)}
              helperText={passwordErr || " "}
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

          <Box>
            <Typography sx={{ mb: 1, color: "text.secondary" }}>
              Confirm Password
            </Typography>
            <TextField
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() =>
                setTouched((t) => ({ ...t, confirmPassword: true }))
              }
              error={Boolean(confirmPasswordErr)}
              helperText={confirmPasswordErr || " "}
              type={showConfirmPassword ? "text" : "password"}
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
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      disabled={loading === "pending"}
                    >
                      <VisibilityRoundedIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box>
            <Typography sx={{ mb: 1, color: "text.secondary" }}>
              Address
            </Typography>
            <TextField
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, address: true }))}
              error={Boolean(addressErr)}
              helperText={addressErr || " "}
              placeholder="123 Main Street, City, Country"
              disabled={loading === "pending"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HomeRoundedIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              InputLabelProps={{ shrink: true }}
              disabled={loading === "pending"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CakeRoundedIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <FormControlLabel
            control={
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={loading === "pending"}
              />
            }
            label={
              <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                I agree to the{" "}
                <Link href="#" underline="hover">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" underline="hover">
                  Privacy Policy
                </Link>
              </Typography>
            }
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!canSubmit || loading === "pending"}
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
            {loading === "pending" ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Account"
            )}
          </Button>

          <Typography sx={{ color: "text.secondary" }}>
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              sx={{ color: "primary.main" }}
            >
              Log in here
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
