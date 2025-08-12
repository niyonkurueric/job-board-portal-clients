import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store/store";
import { useEffect } from "react";
import { loadUserFromStorage } from "@/store/slices/authSlice";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Applications from "./pages/Applications";
import ApplicationsList from "./pages/dashboard/ApplicationsList";
import CreateJob from "./pages/CreateJob";
import NotFound from "./pages/NotFound";
import DashboardIndex from "@/pages/dashboard/Index";
import DashboardJobs from "@/pages/dashboard/Jobs";
import DashboardJobDetailsPage from "@/pages/dashboard/JobDetails";
import ApplyJobPage from "@/pages/dashboard/ApplyJob";
import DashboardUsers from "@/pages/dashboard/Users";
import PublicLayout from "@/layouts/PublicLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";

const queryClient = new QueryClient();


const AppInit = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);
  return children;
};

const App = () => (
  <Provider store={store}>
    <AppInit>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public/Landing routes with Navbar */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Jobs />} />
                <Route path="/job/:id" element={<JobDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/create-job" element={<CreateJob />} />
              </Route>
              {/* Unified Dashboard route, role-based rendering inside Dashboard */}
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardIndex />} />
                <Route path="jobs" element={<DashboardJobs />} />
                <Route path="jobs/:id" element={<DashboardJobDetailsPage />} />
                <Route path="jobs/:id/apply" element={<ApplyJobPage />} />
                <Route path="applications" element={<ApplicationsList />} />
                <Route path="users" element={<DashboardUsers />} />
              </Route>
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AppInit>
  </Provider>
);

export default App;
