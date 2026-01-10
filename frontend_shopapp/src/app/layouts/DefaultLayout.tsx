import React, { useEffect } from "react";
import { Box, Container } from "@mui/material";
import { ILayoutProps } from "models";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import "styles/page.module.css";
import Chatbot from "@/components/Chatbot/Chatbot";

export default function DefaultLayout({ children }: ILayoutProps) {
  const queryClient = useQueryClient();
  const location = useLocation();

  useEffect(() => {
    queryClient.clear();
  }, [location.pathname, queryClient]);

  return (
    <Box className="default-layout">
      <Container maxWidth="xl" className="default-layout__content">
        {children}
      </Container>
      <Chatbot />
    </Box>
    
  );
}
