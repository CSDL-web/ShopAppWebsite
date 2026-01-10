import { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Fab,
  CircularProgress,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import request from "@/utils/request";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Xin chào! Tôi có thể giúp gì cho bạn?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      const res = await request({
        url: "/chat",
        method: "POST",
        data: { message: userMsg.text },
      });

      const botText = res.data?.data || res.data?.message || "Tôi không hiểu câu hỏi.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: botText, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "Lỗi kết nối server.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Fab
        color="primary"
        onClick={() => setIsOpen(!isOpen)}
        sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      {isOpen && (
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: 350,
            height: 450,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            zIndex: 9999,
            overflow: "hidden",
            border: "1px solid #ccc",
          }}
        >
          <Box sx={{ p: 2, bgcolor: "#ff9966", color: "white" }}>
            <Typography variant="h6" fontSize={16} fontWeight="bold">Hỗ trợ khách hàng</Typography>
          </Box>

          <Box sx={{ flex: 1, p: 2, overflowY: "auto", bgcolor: "#f5f5f5" }}>
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    maxWidth: "75%",
                    p: 1,
                    borderRadius: 2,
                    bgcolor: msg.sender === "user" ? "#ff9966" : "white",
                    color: msg.sender === "user" ? "white" : "black",
                    boxShadow: 1,
                    fontSize: "0.9rem"
                  }}
                >
                  {msg.text}
                </Box>
              </Box>
            ))}
            {loading && <CircularProgress size={20} />}
            <div ref={messagesEndRef} />
          </Box>

          <Box sx={{ p: 1, display: "flex", bgcolor: "white", borderTop: "1px solid #eee" }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
            />
            <IconButton color="primary" onClick={handleSend} disabled={!input.trim() || loading}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
}