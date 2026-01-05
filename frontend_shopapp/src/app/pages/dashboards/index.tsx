import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Menu from "@/components/dashBoardComponent/menu/Menu";
import Footer from "@/components/dashBoardComponent/footer/Footer";

const queryClient = new QueryClient();

export default function DashboardLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container">
        <div className="menuContainer">
          <Menu />
        </div>

        <div className="contentContainer">
          <Outlet />
        </div>
      </div>

      <Footer />
    </QueryClientProvider>
  );
}
