import * as React from "react";
import { Box, IconButton } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Sidebar, { drawerWidth } from "./Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#fff" }}>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <Box sx={{ flex: 1, ml: { md: `${drawerWidth}px` } }}>
        <Box sx={{ display: { xs: "flex", md: "none" }, p: 1 }}>
          <IconButton onClick={() => setMobileOpen(true)}>
            <MenuRoundedIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
      </Box>
    </Box>
  );
}
