import { Box, Typography, Button, Paper, Alert } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAppSelector, useAppDispatch } from "@/stores";
import { selectCurrentOrder, selectOrderError, clearOrderError, resetOrderState } from "@/stores/orderSlice";
import Header from "@/components/headers/Header";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentOrder = useAppSelector(selectCurrentOrder);
  const error = useAppSelector(selectOrderError);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      dispatch(resetOrderState());
    };
  }, [dispatch]);

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <Header />
        <Box sx={{ maxWidth: 800, mx: "auto", p: 4, textAlign: "center" }}>
          <Paper sx={{ p: 6, borderRadius: 3 }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Typography variant="h6" gutterBottom>
              Có lỗi xảy ra khi xử lý đơn hàng
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 2 }}
              onClick={() => {
                dispatch(clearOrderError());
                navigate("/checkout");
              }}
            >
              Quay lại thanh toán
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Header />
      
      <Box sx={{ maxWidth: 800, mx: "auto", p: 4, textAlign: "center" }}>
        <Paper sx={{ p: 6, borderRadius: 3 }}>
          <CheckCircleIcon 
            sx={{ fontSize: 80, color: "#4caf50", mb: 3 }} 
          />
          
          <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
            Đặt hàng thành công!
          </Typography>
          
          <Typography variant="h6" gutterBottom>
            Cảm ơn bạn đã mua sắm với chúng tôi
          </Typography>
          
          {currentOrder && (
            <Box sx={{ mt: 3, mb: 4, textAlign: "left", maxWidth: 400, mx: "auto" }}>
              <Typography variant="body1">
                <strong>Mã đơn hàng:</strong> #{currentOrder.id}
              </Typography>
              <Typography variant="body1">
                <strong>Ngày đặt:</strong> {new Date(currentOrder.order_date).toLocaleDateString('vi-VN')}
              </Typography>
              <Typography variant="body1">
                <strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(currentOrder.total_money)}
              </Typography>
              <Typography variant="body1">
                <strong>Trạng thái:</strong> {currentOrder.status}
              </Typography>
            </Box>
          )}
          
          <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
            Chúng tôi sẽ gửi email xác nhận đơn hàng và thông tin vận chuyển đến bạn trong thời gian sớm nhất.
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}>
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