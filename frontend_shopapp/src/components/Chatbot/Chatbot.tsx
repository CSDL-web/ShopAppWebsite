import { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Fab,
  CircularProgress,
  Avatar,
  Stack,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy"; // Icon Robot
import request from "@/utils/request";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Xin chào! Tôi là Chatbot AI. Tôi có thể giúp gì cho bạn?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hàm lấy session_id để duy trì ngữ cảnh
  const getSessionId = () => {
    let sessionId = localStorage.getItem("chat_session_id");
    if (!sessionId) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("chat_session_id", sessionId);
    }
    return sessionId;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const sessionId = getSessionId();

      const res = await request({
        url: "/chat",
        method: "POST",
        data: { 
            question: userMsg.text,
            session_id: sessionId
        },
      });

      const botText = res.data?.response || res.data?.data || "Tôi không hiểu câu hỏi.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: botText, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "Hệ thống đang bận, vui lòng thử lại sau.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Nút Chatbot (FAB) */}
      <Tooltip title={isOpen ? "Đóng Chatbot" : "Chat với AI"}>
        <Fab
          color="primary"
          onClick={() => setIsOpen(!isOpen)}
          sx={{ 
            position: "fixed", 
            bottom: 20, 
            right: 20, 
            zIndex: 9999,
            width: 60,  // Tăng nhẹ kích thước nếu cần
            height: 60
          }}
        >
          {isOpen ? (
            <CloseIcon />
          ) : (
            // Icon hiển thị rõ chữ "AI"
            <Stack alignItems="center" justifyContent="center">
                <SmartToyIcon sx={{ fontSize: 20 }} />
                <Typography variant="caption" sx={{ fontWeight: '900', lineHeight: 1 }}>AI</Typography>
            </Stack>
          )}
        </Fab>
      </Tooltip>

      {/* Cửa sổ Chat */}
      {isOpen && (
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: 350,
            height: 480, // Tăng chiều cao một chút cho thoáng
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            zIndex: 9999,
            overflow: "hidden",
            border: "1px solid #ccc",
          }}
        >
          {/* HEADER CHATBOT */}
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: "#ff9966", 
              color: "white", 
              display: "flex", 
              alignItems: "center",
              gap: 1.5,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            <Avatar sx={{ bgcolor: "white", color: "#ff9966" }}>
                <SmartToyIcon />
            </Avatar>
            <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Chatbot Hỗ trợ
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Trợ lý AI trực tuyến
                </Typography>
            </Box>
          </Box>

          {/* NỘI DUNG CHAT */}
          <Box sx={{ flex: 1, p: 2, overflowY: "auto", bgcolor: "#f5f5f5" }}>
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  mb: 1.5,
                }}
              >
                {/* Avatar nhỏ cho Bot trong tin nhắn */}
                {msg.sender === "bot" && (
                    <Avatar 
                        sx={{ width: 28, height: 28, mr: 1, bgcolor: "#ff9966" }}
                    >
                        <SmartToyIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                )}

                <Box
                  sx={{
                    maxWidth: "75%",
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: msg.sender === "user" ? "#ff9966" : "white",
                    color: msg.sender === "user" ? "white" : "black",
                    boxShadow: 1,
                    fontSize: "0.9rem",
                    borderTopLeftRadius: msg.sender === "bot" ? 0 : 2,
                    borderTopRightRadius: msg.sender === "user" ? 0 : 2,
                  }}
                >
                  {msg.text}
                </Box>
              </Box>
            ))}
            
            {/* Loading Indicator */}
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1, ml: 4 }}>
                    <Box sx={{ p: 1, bgcolor: "white", borderRadius: 2, boxShadow: 1 }}>
                        <CircularProgress size={16} sx={{ color: "#ff9966" }} />
                        <Typography variant="caption" sx={{ ml: 1, color: "gray" }}>AI đang trả lời...</Typography>
                    </Box>
                </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* INPUT CHAT */}
          <Box sx={{ p: 1.5, display: "flex", bgcolor: "white", borderTop: "1px solid #eee", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Nhập câu hỏi của bạn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
              sx={{ 
                "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    bgcolor: "#f9f9f9"
                }
              }}
            />
            <IconButton 
                color="primary" 
                onClick={handleSend} 
                disabled={!input.trim() || loading}
                sx={{ 
                    bgcolor: input.trim() ? "#ff9966" : "transparent", 
                    color: input.trim() ? "white" : "gray",
                    "&:hover": { bgcolor: "#e68a5c" }
                }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
}