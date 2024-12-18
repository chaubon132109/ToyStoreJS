import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { SidebarProvider } from "@components/ui/sidebar";
import { AppSidebar } from "./SidebarAdmin";
import NotFound from "../../components/NotFound";
import { useAuth } from "context/AuthContext";
import LoginAdminForm from "./Auth/SignIn";

const AdminPage = () => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const navigate = useNavigate();

  console.log(
    "🚀 ~ AdminPage ~ user?.role:",
    !isLoggedIn,
    isLoggedIn && user?.role !== 0
  );
  if (!isLoggedIn || (isLoggedIn && user?.role !== 0)) {
    // navigate("/login/admin");
    return <LoginAdminForm />;
  }

  // Kiểm tra nếu route là `/admin/login`

  return (
    <SidebarProvider>
      <AppSidebar />
      <Box sx={{ display: "flex", width: "100%" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </SidebarProvider>
  );
};

export default AdminPage;
