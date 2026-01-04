import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Avatar,
  Button,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { selectUser } from "@/stores/authSlice";
import { Edit, ArrowBack } from "@mui/icons-material";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3, textTransform: "none" }}
      >
        Back
      </Button>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: "#6f49ff",
              fontSize: "2.5rem",
              fontWeight: 600,
              mr: 3,
            }}
          >
            {user?.fullname?.charAt(0) || user?.phone_number?.charAt(0) || "U"}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {user?.fullname || "User"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.phone_number || "No phone number"}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              sx={{ mt: 2, textTransform: "none" }}
              onClick={() => navigate("/profile/edit")}
            >
              Edit Profile
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* User Information */}
        <Grid container spacing={4}>
          <Grid>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid>
                    <Typography variant="body2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1">
                      {user?.fullname || "Not provided"}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="text.secondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1">
                      {user?.phone_number || "Not provided"}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {user?.email || "Not provided"}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1">
                      {user?.address || "Not provided"}
                    </Typography>
                  </Grid>
                  {user?.date_of_birth && (
                    <Grid>
                      <Typography variant="body2" color="text.secondary">
                        Date of Birth
                      </Typography>
                      <Typography variant="body1">
                        {user.date_of_birth}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Account Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid>
                    <Typography variant="body2" color="text.secondary">
                      Account Type
                    </Typography>
                    <Typography variant="body1">
                      {user?.role_id === 2 ? "Administrator" : "User"}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="text.secondary">
                      Member Since
                    </Typography>
                    <Typography variant="body1">
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ justifyContent: "flex-start", textTransform: "none" }}
                    onClick={() => navigate("/cart")}
                  >
                    View Shopping Cart
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ justifyContent: "flex-start", textTransform: "none" }}
                    onClick={() => navigate("/orders")}
                  >
                    View Order History
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ justifyContent: "flex-start", textTransform: "none" }}
                    onClick={() => navigate("/addresses")}
                  >
                    Manage Addresses
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
