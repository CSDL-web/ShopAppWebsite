import {
  Avatar,
  Box,
  Container,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  Checkbox,
  Button,
  Link,
  Grid,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch } from "stores";
import { actionLoginAdmin } from "stores/authSlice";

const LoginPage = () => {
  const dispatch = useAppDispatch();

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("login", user);
    dispatch(
      actionLoginAdmin({
        usernameOrEmail: user.username,
        password: user.password,
        systemCode: "SHOP_APP",
      })
    );
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
        <Avatar
          sx={{
            mx: "auto",
            bgcolor: "secondary.main",
            textAlign: "center",
            mb: 1,
          }}
        >
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
          Sign In
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            label="Username"
            name="username"
            value={user.username}
            onChange={handleChange}
            fullWidth
            required
            autoFocus
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={user.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Sign In
          </Button>
        </Box>

        <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
          <Grid>
            <Link component={RouterLink} to="/forgot" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid>
            <Link component={RouterLink} to="/register" variant="body2">
              Sign Up
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default LoginPage;
