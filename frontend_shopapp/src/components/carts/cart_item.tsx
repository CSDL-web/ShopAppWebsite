import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch } from "@/stores";
import {
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  CartItem as CartItemType,
} from "@/stores/cart";
import InStockText from "../inStockText";
import CustomHR from "../CustomHR";

const API_URL = import.meta.env.VITE_API_URL;

export default function CartItem({ item }: { item: CartItemType }) {
  const dispatch = useAppDispatch();
  const { product, quantity } = item;
  const getProductKey = (product: any) => `${product.name}_${product.price}`;

  const imageUrl = product.thumbnail
    ? `${API_URL}/backend_shopapp/uploads/${product.thumbnail}`
    : `${API_URL}/backend_shopapp/uploads/notfound.jpeg`;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          margin: "2rem 0",
        }}
      >
        {/* LEFT */}
        <Box sx={{ display: "flex" }}>
          <img
            src={imageUrl}
            alt={product.name}
            width={180}
            height={200}
            style={{ objectFit: "contain" }}
            onError={(e) => {
              e.currentTarget.src = `${API_URL}/backend_shopapp/uploads/notfound.jpeg`;
            }}
          />

          <Box sx={{ marginLeft: "2rem" }}>
            <Typography variant="h6" fontWeight={500}>
              {product.name}
            </Typography>

            <InStockText sx={{ fontWeight: 500 }} />

            <Typography sx={{ fontSize: "0.875rem" }}>
              Eligible for FREE Shipping & FREE Returns
            </Typography>

            {/* QUANTITY - truyền product.name thay vì product.id */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() =>
                  dispatch(decreaseQuantity(getProductKey(product)))
                }
              >
                -
              </Button>

              <Typography sx={{ mx: 2 }}>{quantity}</Typography>

              <Button
                size="small"
                variant="outlined"
                onClick={() =>
                  dispatch(decreaseQuantity(getProductKey(product)))
                }
              >
                +
              </Button>
            </Box>

            <Button
              size="small"
              sx={{ mt: 1, padding: 0, textTransform: "none" }}
              onClick={() => dispatch(removeItem(product.name))}
            >
              Delete
            </Button>
          </Box>
        </Box>

        {/* RIGHT */}
        <Typography sx={{ fontSize: "1.25rem", fontWeight: 700 }}>
          ${(product.price * quantity).toFixed(2)}
        </Typography>
      </Box>

      <CustomHR />
    </Box>
  );
}
