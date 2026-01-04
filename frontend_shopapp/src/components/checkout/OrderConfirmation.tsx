// OrderConfirmation.tsx
import { Box, Typography, Button, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Header from "@/components/headers/Header";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Header />

      <Box sx={{ maxWidth: 800, mx: "auto", p: 4, textAlign: "center" }}>
        <Paper sx={{ p: 6, borderRadius: 3 }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: "#4caf50", mb: 3 }} />

          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
            color="primary"
          >
            Đặt hàng thành công!
          </Typography>

          <Typography variant="h6" gutterBottom>
            Cảm ơn bạn đã mua sắm với chúng tôi
          </Typography>

          {orderId && (
            <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
              Mã đơn hàng: <strong>#{orderId}</strong>
            </Typography>
          )}

          <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
            Chúng tôi sẽ gửi email xác nhận đơn hàng và thông tin vận chuyển đến
            bạn trong thời gian sớm nhất.
          </Typography>

          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/orders")}
            >
              Xem đơn hàng của tôi
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/")}
            >
              Tiếp tục mua sắm
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
