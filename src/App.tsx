
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import TopUpPage from "./pages/TopUpPage";
import ProviderVerificationPage from "./pages/ProviderVerificationPage";
import NotFound from "./pages/NotFound";

// Admin components
import AdminRoute from "./components/auth/AdminRoute";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import VerificationsPage from "./pages/admin/VerificationsPage";
import VerificationDetailPage from "./pages/admin/VerificationDetailPage";
import UsersPage from "./pages/admin/UsersPage";

// Application-wide configuration
console.log("App: Initializing application");
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false, // Prevent refetch on window focus
    },
  },
});

const App = () => {
  console.log("App: Rendering main App component");
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner closeButton position="top-right" />
          <BrowserRouter>
            <Routes>
              {/* Admin Routes - No layout wrapper */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/verifications" 
                element={
                  <AdminRoute>
                    <VerificationsPage />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/verifications/:id" 
                element={
                  <AdminRoute>
                    <VerificationDetailPage />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <AdminRoute>
                    <UsersPage />
                  </AdminRoute>
                } 
              />
              
              {/* Main App Routes */}
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/search" element={<Layout><SearchPage /></Layout>} />
              <Route path="/service/:id" element={<Layout><ServiceDetailPage /></Layout>} />
              <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
              <Route path="/auth" element={<Layout><AuthPage /></Layout>} />
              <Route path="/topup" element={<Layout><TopUpPage /></Layout>} />
              <Route path="/provider-verification" element={<Layout><ProviderVerificationPage /></Layout>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
