import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/stores";
import { getCart } from "@/stores/cart";
import CartItem from "./cart_item";
import Subtotal from "./subTotal";
import { COLORS } from "@/styles/colors";
import CustomButton from "@/components/customButton";

export default function Cart() {
  const cart = useAppSelector(getCart);
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Box sx={{ display: "flex", gap: "2rem", margin: "3rem 0" }}>
      {/* LEFT */}
      <Box
        sx={{ backgroundColor: COLORS.white, padding: "2rem", width: "60%" }}
      >
        <Typography variant="h4" fontWeight={700}>
          Shopping Cart
        </Typography>

        {cart.length === 0 && (
          <Typography sx={{ mt: 2 }}>Your cart is empty</Typography>
        )}

        {cart.map((item) => (
          <CartItem key={item.product.id} item={item} />
        ))}

        <Subtotal
          items={totalItems}
          price={total}
          sx={{ textAlign: "right" }}
        />
      </Box>

      {/* RIGHT */}
      <Box
        sx={{ backgroundColor: COLORS.white, padding: "1.5rem", width: "25%" }}
      >
        <Typography
          sx={{
            color: COLORS.green,
            display: "flex",
            alignItems: "center",
            fontSize: "0.875rem",
          }}
        >
          <CheckCircleIcon sx={{ mr: 0.5 }} />
          Your order qualifies for FREE Shipping.
        </Typography>

        <Subtotal items={totalItems} price={total} />

        <CustomButton onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </CustomButton>
      </Box>
    </Box>
  );
}
