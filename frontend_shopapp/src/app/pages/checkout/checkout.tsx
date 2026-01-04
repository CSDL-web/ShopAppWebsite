import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/stores";
import { getCart, clearCart } from "@/stores/cart";
import Header from "@/components/headers/Header";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface OrderRequest {
  fullname: string;
  email: string;
  phone_number: string;
  address: string;
  note: string;
  status: string;
  total_money: number;
  shipping_method: string;
  shipping_address: string;
  shipping_date: string;
  tracking_number: string;
  payment_method: string;
  active: boolean;
  coupon_id: number;
  cart_items: Array<{
    product_id: string | number;
    quantity: number;
    price: number;
  }>;
}

interface OrderResponse {
  id: number;
  user_id: number;
  order_date: string;
  fullname: string;
  email: string;
  phone_number: string;
  address: string;
  note: string;
  status: string;
  total_money: number;
  shipping_method: string;
  shipping_address: string;
  shipping_date: string;
  tracking_number: string;
  payment_method: string;
  active: boolean;
  coupon_id: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cart = useAppSelector(getCart);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone_number: "",
    address: "",
    note: "",
    shipping_address: "",
    shipping_method: "standard",
    payment_method: "cod",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Tính tổng tiền
  const totalMoney = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      "fullname",
      "email",
      "phone_number",
      "address",
      "shipping_address",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData].trim()) {
        setError(`Vui lòng điền đầy đủ thông tin ${field}`);
        return false;
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email không hợp lệ");
      return false;
    }

    // Validate phone number (Vietnamese format)
    const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.phone_number)) {
      setError("Số điện thoại không hợp lệ");
      return false;
    }

    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderData: OrderRequest = {
        fullname: formData.fullname,
        email: formData.email,
        phone_number: formData.phone_number,
        address: formData.address,
        note: formData.note,
        status: "pending",
        total_money: totalMoney,
        shipping_method: formData.shipping_method,
        shipping_address: formData.shipping_address || formData.address,
        shipping_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // 3 days from now
        tracking_number: `TRACK-${Date.now()}`,
        payment_method: formData.payment_method,
        active: true,
        coupon_id: 0,
        cart_items: cart.map((item) => ({
          product_id: item.product.id || item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
      };

      console.log("Submitting order:", orderData);

      const response = await axios.post(
        `${API_URL}/orders/create`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        dispatch(clearCart()); // Clear cart after successful order
        
        // Redirect to order confirmation page after 2 seconds
        setTimeout(() => {
          navigate("/order-confirmation", { 
            state: { orderId: response.data.id } 
          });
        }, 2000);
      }
    } catch (err: any) {
      console.error("Order error:", err);
      setError(
        err.response?.data?.message || 
        "Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  const handleBackToCart = () => {
    navigate("/cart");
  };

  if (cart.length === 0) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <Header />
        <Box sx={{ maxWidth: 1200, mx: "auto", p: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Giỏ hàng trống
          </Typography>
          <Button variant="contained" onClick={() => navigate("/")}>
            Tiếp tục mua sắm
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Header />

      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Thanh toán
        </Typography>

        <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
          {/* LEFT COLUMN - Form */}
          <Paper sx={{ flex: 2, p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Thông tin giao hàng
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="Họ và tên"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                required
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                />
              </Box>

              <TextField
                fullWidth
                label="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                multiline
                rows={2}
              />

              <TextField
                fullWidth
                label="Địa chỉ giao hàng (nếu khác địa chỉ trên)"
                name="shipping_address"
                value={formData.shipping_address}
                onChange={handleInputChange}
                multiline
                rows={2}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Phương thức vận chuyển</InputLabel>
                  <Select
                    name="shipping_method"
                    value={formData.shipping_method}
                    label="Phương thức vận chuyển"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="standard">Giao hàng tiêu chuẩn (3-5 ngày)</MenuItem>
                    <MenuItem value="express">Giao hàng nhanh (1-2 ngày)</MenuItem>
                    <MenuItem value="pickup">Nhận tại cửa hàng</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Phương thức thanh toán</InputLabel>
                  <Select
                    name="payment_method"
                    value={formData.payment_method}
                    label="Phương thức thanh toán"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="cod">Thanh toán khi nhận hàng (COD)</MenuItem>
                    <MenuItem value="banking">Chuyển khoản ngân hàng</MenuItem>
                    <MenuItem value="credit_card">Thẻ tín dụng</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                fullWidth
                label="Ghi chú"
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                multiline
                rows={3}
                placeholder="Ghi chú về đơn hàng, hướng dẫn giao hàng..."
              />
            </Box>
          </Paper>

          {/* RIGHT COLUMN - Order Summary */}
          <Paper sx={{ flex: 1, p: 3, borderRadius: 2, height: "fit-content" }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Đơn hàng của bạn
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Cart Items */}
            <Box sx={{ mb: 2 }}>
              {cart.map((item) => (
                <Box
                  key={item.product.id || item.product.name}
                  sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                >
                  <Typography>
                    {item.product.name} x {item.quantity}
                  </Typography>
                  <Typography fontWeight={600}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Summary */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Tạm tính:</Typography>
                <Typography>${totalMoney.toFixed(2)}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Phí vận chuyển:</Typography>
                <Typography>
                  {formData.shipping_method === "express" ? "$10.00" : "$5.00"}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" fontWeight={700}>
                  Tổng cộng:
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary">
                  ${(totalMoney + (formData.shipping_method === "express" ? 10 : 5)).toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSubmitOrder}
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "ĐẶT HÀNG NGAY"
              )}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={handleBackToCart}
              disabled={loading}
            >
              Quay lại giỏ hàng
            </Button>

            <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
              Bằng cách đặt hàng, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={success ? "success" : error ? "error" : "info"}
          sx={{ width: "100%" }}
        >
          {success
            ? "Đặt hàng thành công! Đang chuyển hướng..."
            : error || "Vui lòng kiểm tra lại thông tin"}
        </Alert>
      </Snackbar>
    </Box>
  );
}