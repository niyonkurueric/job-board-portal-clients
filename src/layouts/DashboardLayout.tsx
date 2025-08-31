import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import Sidebar from "@/components/dashboard/nav/Sidebar";
import Topbar from "@/components/dashboard/nav/Topbar";
import { logout } from "@/store/slices/authSlice";

const DashboardLayout = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!user) return null;
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar userType={user.role === "admin" ? "admin" : "user"} isCollapsed={sidebarCollapsed} />
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "ml-20" : "ml-72"
        }`}
      >
        <Topbar
          onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isCollapsed={sidebarCollapsed}
          user={user}
          onLogout={handleLogout}
        />
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
