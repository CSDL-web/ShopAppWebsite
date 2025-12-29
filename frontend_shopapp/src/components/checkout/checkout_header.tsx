import { COLORS } from "@/styles/colors";
import { Box, Container, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import Logo from "../headers/Logo";

type CheckoutHeaderProps = {
  items: number;
};

const CheckoutHeader = ({ items }: CheckoutHeaderProps) => {
  return (
    <Box sx={{ backgroundColor: COLORS.lightGray }}>
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2rem 0 0.5rem",
        }}
      >
        <Logo/>

        <Typography sx={{ fontSize: "1.75rem", fontWeight: 500 }}>
          Checkout{" "}
          (<span style={{ color: COLORS.teal }}>{items} items</span>)
        </Typography>

        <LockIcon />
      </Container>
    </Box>
  );
};

export default CheckoutHeader;
