import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Menu from "@/components/dashBoardComponent/menu/Menu";
import Footer from "@/components/dashBoardComponent/footer/Footer";
import { ILayoutProps } from "@/models";
import { Box } from "@mui/material";
import "@/styles/global.scss";
const queryClient = new QueryClient();

export default function DashboardLayout({ children }: ILayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Box
        className="main"
        sx={{
          display: "flex",
          minHeight: "100vh",
          paddingLeft: "20px",
          paddingTop: "40px",
        }}
      >
        <Box
          sx={{
            width: "11%",
            borderRight: "1px solid #1e2a3a",
            paddingRight: "20px",
          }}
        >
          <Menu />
        </Box>

        <Box
          component="main"
          sx={{
            width: "85%",
            display: "flex",
            flexDirection: "column",
            paddingLeft: "20px",
          }}
        >
          <Box sx={{ flex: 1 }}>{children}</Box>
          <Footer />
        </Box>
      </Box>
    </QueryClientProvider>
  );
}
