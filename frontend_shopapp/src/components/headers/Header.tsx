import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";

import { COLORS } from "@/styles/colors";
import HeaderLink from "./HeaderLink";
import Logo from "./Logo";
import SearchBar from "./SearchBar";

export default function Header() {
  const links = [
    "Home",
    "Groceries",
    "Best Sellers",
    "Prime",
    "New Releases",
    "Books",
    "Log in",
  ];

  return (
    <Box sx={{ backgroundColor: COLORS.darkBlue, color: COLORS.white }}>
      {/* Top bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem",
        }}
      >
        <Logo />
        <SearchBar />
        <Box sx={{ display: "flex" }}>
          <HeaderLink to="/orders">
            <Typography fontSize="0.75rem">Returns</Typography>
            <Typography fontWeight={700}>& Orders</Typography>
          </HeaderLink>

          <HeaderLink
            to="/cart"
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <ShoppingCartIcon fontSize="large" />
            <Typography fontWeight={700}>Cart</Typography>
          </HeaderLink>
        </Box>
      </Box>

      {/* Bottom bar */}
      <Box
        sx={{
          backgroundColor: COLORS.mediumBlue,
          display: "flex",
          alignItems: "center",
        }}
      >
        <HeaderLink to="/all" style={{ display: "flex", alignItems: "center" }}>
          <MenuIcon sx={{ mr: "0.25rem" }} />
          <Typography fontWeight={700}>All</Typography>
        </HeaderLink>

       


        {links.map((l) => (
          <HeaderLink
            key={l}
            to={l === "Log in" ? "/login" : l === "Home" ? "/" : `/${l}`}
          >
            <Typography variant="body2">{l}</Typography>
          </HeaderLink>
        ))}


        
      </Box>
    </Box>
  );
}
