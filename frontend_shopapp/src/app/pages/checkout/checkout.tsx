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
import {
  createOrder,
  selectOrderLoading,
  selectOrderError,
  selectOrderSuccess,
  clearOrderError,
  OrderItem,
} from "@/stores/orderSlice";
import Header from "@/components/headers/Header";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cart = useAppSelector(getCart);
  const loading = useAppSelector(selectOrderLoading);
  const error = useAppSelector(selectOrderError);
  const success = useAppSelector(selectOrderSuccess);

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

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [localError, setLocalError] = useState("");

  // Tính tổng tiền
  const totalMoney = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  useEffect(() => {
    if (error) {
      setOpenSnackbar(true);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      dispatch(clearCart());

      setTimeout(() => {
        navigate("/order-confirmation");
      }, 2000);
    }
  }, [success, dispatch, navigate]);

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
    setLocalError("");
    dispatch(clearOrderError());

    const requiredFields = ["fullname", "email", "phone_number", "address"];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData].trim()) {
        setLocalError(`Vui lòng điền đầy đủ thông tin ${field}`);
        return false;
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setLocalError("Email không hợp lệ");
      return false;
    }

    // Validate phone number (Vietnamese format)
    const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.phone_number)) {
      setLocalError("Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)");
      return false;
    }

    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      setOpenSnackbar(true);
      return;
    }

    // Prepare cart items for API
    const cartItems: OrderItem[] = cart.map((item) => ({
      product_id: item.product.id || item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      product_name: item.product.name,
    }));

    // Calculate shipping cost
    const shippingCost = formData.shipping_method === "express" ? 10 : 5;
    const totalWithShipping = totalMoney + shippingCost;

    // Prepare order data
    const orderData = {
      fullname: formData.fullname,
      email: formData.email,
      phone_number: formData.phone_number,
      address: formData.address,
      note: formData.note,
      status: "pending",
      total_money: totalWithShipping,
      shipping_method: formData.shipping_method,
      shipping_address: formData.shipping_address || formData.address,
      shipping_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      tracking_number: `TRACK-${Date.now()}`,
      payment_method: formData.payment_method,
      active: true,
      coupon_id: 0,
      cart_items: cartItems,
    };

    // Dispatch create order action
    dispatch(createOrder(orderData));
    setOpenSnackbar(true);
  };

  const handleBackToCart = () => {
    
    navigate("/cart");
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setLocalError("");
    dispatch(clearOrderError());
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

        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
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
                error={!!localError && !formData.fullname}
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
                  error={!!localError && !formData.email}
                />
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                  error={!!localError && !formData.phone_number}
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
                error={!!localError && !formData.address}
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
                    <MenuItem value="standard">
                      Giao hàng tiêu chuẩn (3-5 ngày) +$5.00
                    </MenuItem>
                    <MenuItem value="express">
                      Giao hàng nhanh (1-2 ngày) +$10.00
                    </MenuItem>
                    <MenuItem value="pickup">
                      Nhận tại cửa hàng (Miễn phí)
                    </MenuItem>
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
                    <MenuItem value="cod">
                      Thanh toán khi nhận hàng (COD)
                    </MenuItem>
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
            <Box sx={{ mb: 2, maxHeight: 200, overflow: "auto" }}>
              {cart.map((item) => (
                <Box
                  key={item.product.id || item.product.name}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    {item.product.name} x {item.quantity}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Summary */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Tạm tính:</Typography>
                <Typography>${totalMoney.toFixed(2)}</Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Phí vận chuyển:</Typography>
                <Typography>
                  {formData.shipping_method === "express"
                    ? "$10.00"
                    : formData.shipping_method === "standard"
                    ? "$5.00"
                    : "Miễn phí"}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" fontWeight={700}>
                  Tổng cộng:
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary">
                  $
                  {(
                    totalMoney +
                    (formData.shipping_method === "express"
                      ? 10
                      : formData.shipping_method === "standard"
                      ? 5
                      : 0)
                  ).toFixed(2)}
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
              Bằng cách đặt hàng, bạn đồng ý với Điều khoản dịch vụ và Chính
              sách bảo mật của chúng tôi.
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={
            success ? "success" : error || localError ? "error" : "info"
          }
          sx={{ width: "100%" }}
        >
          {success
            ? "Đặt hàng thành công! Đang chuyển hướng..."
            : error || localError || "Vui lòng kiểm tra lại thông tin"}
        </Alert>
      </Snackbar>
    </Box>
  );
}
