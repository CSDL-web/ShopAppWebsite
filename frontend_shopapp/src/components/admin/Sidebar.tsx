import * as React from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import PieChartOutlineRoundedIcon from "@mui/icons-material/PieChartOutlineRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

export const drawerWidth = 280;

const items = [
  { label: "Dashboard", to: "/dashboard", icon: <HomeRoundedIcon /> },
  { label: "categories", to: "/dashboard/categories", icon: <FlagRoundedIcon /> },
  { label: "products", to: "/dashboard/products", icon: <PieChartOutlineRoundedIcon /> },
  { label: "users", to: "/dashboard/users", icon: <MailOutlineRoundedIcon /> },
  { label: "Settings", to: "/dashboard/setting", icon: <SettingsRoundedIcon /> },
];

function SideContent({ onClose }: { onClose?: () => void }) {
  const [q, setQ] = React.useState("");

  return (
    <Box sx={{ height: "100%", bgcolor: "#f3f3f3" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, py: 1.5 }}>
        <IconButton onClick={onClose} sx={{ display: { md: "none" } }}>
          <CloseRoundedIcon />
        </IconButton>
        <AlternateEmailRoundedIcon />
        <Typography sx={{ fontWeight: 900, fontSize: 20 }}>Your Company</Typography>
      </Box>

      <Box sx={{ px: 2, pb: 1.5 }}>
        <TextField
          fullWidth
          placeholder="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiInputBase-root": { px: 1, py: 1.2, borderRadius: 2 },
          }}
        />
      </Box>

      <List sx={{ px: 1 }}>
        {items
          .filter((it) => it.label.toLowerCase().includes(q.toLowerCase()))
          .map((it) => (
            <ListItemButton
              key={it.to}
              component={NavLink}
              to={it.to}
              sx={{
                borderRadius: 2,
                mb: 0.75,
                py: 1.6,
                "& .MuiListItemIcon-root": { minWidth: 44, color: "text.secondary" },
                "&.active": {
                  bgcolor: "#fff",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  "& .MuiListItemIcon-root": { color: "text.primary" },
                },
              }}
            >
              <ListItemIcon>{it.icon}</ListItemIcon>
              <ListItemText
                primary={it.label}
                primaryTypographyProps={{ fontWeight: 800, fontSize: 18 }}
              />
            </ListItemButton>
          ))}
      </List>
    </Box>
  );
}

export default function Sidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth, border: 0 },
        }}
      >
        <SideContent onClose={onMobileClose} />
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth, border: 0 },
        }}
      >
        <SideContent />
      </Drawer>
    </>
  );
}
