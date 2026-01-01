import { Box, Button, Typography } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchBar from "./SearchBar";
import Logo from "./Logo";

export default function Header() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        backgroundColor: "#fff",
        borderBottom: "1px solid #eee",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Logo />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          mx: 3,
        }}
      >
        <SearchBar />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <Typography sx={{ cursor: "pointer" }} onClick={() => {}}>
          Shop
        </Typography>
        <Typography sx={{ color: "#ccc" }}>|</Typography>
        <Typography sx={{ cursor: "pointer" }}>Help</Typography>

        <Button
          variant="outlined"
          startIcon={<ShoppingCartOutlinedIcon />}
          sx={{
            textTransform: "none",
            borderColor: "#000",
            color: "#000",
            borderRadius: "6px",
            px: 2,
            "&:hover": {
              borderColor: "#000",
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          Your Cart
        </Button>
      </Box>
    </Box>
  );
}
