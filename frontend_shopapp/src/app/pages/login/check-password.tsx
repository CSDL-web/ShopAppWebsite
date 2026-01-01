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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call API set new password
    navigate("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2, py: 6, background: "#fff" }}>
      <Paper elevation={0} sx={{ width: "min(520px, 100%)", borderRadius: "28px", p: { xs: 3, sm: 5 }, backgroundColor: "#f5f6f7" }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>New password</Typography>
        <Typography sx={{ color: "text.secondary", mb: 3, maxWidth: 420 }}>
          Your new password must be different from previously used one, and must have at least 8 characters.
        </Typography>

        <Box component="form" onSubmit={onSubmit} sx={{ display: "grid", gap: 2 }}>
          <Box>
            <Typography sx={{ mb: 1, color: "text.secondary" }}>New password</Typography>
            <TextField
              fullWidth
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
                    <IconButton edge="end" onClick={() => setShow1(v => !v)} aria-label="toggle password">
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
                    <IconButton edge="end" onClick={() => setShow2(v => !v)} aria-label="toggle password">
                      <VisibilityRoundedIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 1, py: 1.4, borderRadius: "12px", textTransform: "none", fontWeight: 700, backgroundColor: "#6f49ff", "&:hover": { backgroundColor: "#5d3df0" } }}
          >
            Reset Password
          </Button>

          <Link component={RouterLink} to="/login" underline="hover" sx={{ mt: 1, color: "text.secondary" }}>
            Go back to Sign In.
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}
