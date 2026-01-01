// ForgotPasswordPage.tsx
import * as React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
} from "@mui/material";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [touched, setTouched] = React.useState(false);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const emailErr =
    touched && email.trim().length === 0
      ? "Email is required."
      : touched && !isValidEmail(email)
      ? "Please enter a valid email address."
      : "";

  const canSubmit = isValidEmail(email);

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      backgroundColor: "#fff",
      transition: "0.15s ease",
      "& fieldset": { borderColor: "rgba(111,73,255,0.18)" },
      "&:hover fieldset": { borderColor: "rgba(111,73,255,0.45)" },
      "&.Mui-focused fieldset": { borderColor: "#6f49ff" },
    },
    "& .MuiFormHelperText-root": { marginLeft: 0 },
  } as const;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: call API gửi email reset
    navigate("/check-email");
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
          border: "1px solid rgba(0,0,0,0.04)",
          boxShadow: `
            0 20px 40px rgba(17,24,39,0.08),
            0 8px 16px rgba(111,73,255,0.12)
          `,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Forgot password?
        </Typography>

        <Typography sx={{ color: "text.secondary", mb: 3, maxWidth: 380 }}>
          Enter your email and we&apos;ll send you a link to reset your password.
        </Typography>

        <Box component="form" onSubmit={onSubmit} sx={{ display: "grid", gap: 2 }}>
          <Box>
            <Typography sx={{ mb: 1, color: "text.secondary" }}>Email address</Typography>
            <TextField
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              error={Boolean(emailErr)}
              helperText={emailErr || " "}
              placeholder="email@address.com"
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineRoundedIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

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
              boxShadow: "0 10px 22px rgba(111,73,255,0.22)",
              "&:hover": { backgroundColor: "#5d3df0" },
              "&.Mui-disabled": {
                backgroundColor: "rgba(111,73,255,0.35)",
                color: "rgba(255,255,255,0.9)",
              },
            }}
          >
            Reset Password
          </Button>

          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            sx={{ mt: 0.5, color: "text.secondary" }}
          >
            Go back to Sign In.
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}
