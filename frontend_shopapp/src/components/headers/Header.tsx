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
    { label: "Home", to: "/" },
    { label: "Groceries", to: "/groceries" },
    { label: "Best Sellers", to: "/best-sellers" },
    { label: "Prime", to: "/prime" },
    { label: "New Releases", to: "/new-releases" },
    { label: "Books", to: "/books" },
    { label: "Log in", to: "/login" }, // ✅ cái bạn cần
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
            <Box>
              <Typography fontSize="0.75rem">Returns</Typography>
              <Typography fontWeight={700}>& Orders</Typography>
            </Box>
          </HeaderLink>

          <HeaderLink to="/cart">
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
          flexWrap: "wrap",
        }}
      >
        <HeaderLink to="/all">
          <MenuIcon sx={{ mr: "0.25rem" }} />
          <Typography fontWeight={700}>All</Typography>
        </HeaderLink>

        {links.map((l) => (
          <HeaderLink key={l.label} to={l.to}>
            <Typography variant="body2">{l.label}</Typography>
          </HeaderLink>
        ))}
      </Box>
    </Box>
  );
}
