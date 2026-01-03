import * as React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, Link } from "@mui/material";


export default function CheckEmailPage() {
  const navigate = useNavigate();

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
      <Paper elevation={0} sx={{ width: "min(520px, 100%)", borderRadius: "28px", p: { xs: 3, sm: 5 }, backgroundColor: "#f5f6f7" }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Check your email</Typography>
        <Typography sx={{ color: "text.secondary", mb: 3, maxWidth: 420 }}>
          We have sent password recovery instructions to your email address.
        </Typography>

        <Typography sx={{ color: "text.secondary", mb: 3 }}>
          Didn&apos;t receive the email? Check your spam folder or try to{" "}
          <Link component="button" underline="hover" sx={{ color: "primary.main" }} onClick={() => navigate("/forgot-password")}>
            Re-send the message.
          </Link>
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/login")}
          sx={{ mt: 1, py: 1.4, borderRadius: "12px", textTransform: "none", fontWeight: 700, backgroundColor: "#6f49ff", "&:hover": { backgroundColor: "#5d3df0" } }}
        >
          Go back to Sign In
        </Button>

        <Box sx={{ mt: 3 }}>
          <Link component={RouterLink} to="/login" underline="hover" sx={{ color: "text.secondary" }}>
            Go back to Sign In.
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}
