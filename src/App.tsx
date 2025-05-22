import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import HowItWorksPage from "./pages/HowItWorksPage";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import BranchPrivacyPolicy from "./pages/BranchPrivacyPolicy";
import BranchTerms from "./pages/BranchTerms";
import CancellationsAndRefunds from "./pages/CancellationsAndRefunds";
import ShippingPolicy from "./pages/ShippingPolicy";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AuthGuard from "./components/AuthGuard";
import { useEffect } from "react";
import config from "./config/config";

const queryClient = new QueryClient();

// Helper component to check for existing session and redirect if needed
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Check if we have a valid token when accessing admin routes
    const accessToken = localStorage.getItem(config.auth.tokenStorageKey);
    const tokenExpiry = localStorage.getItem(config.auth.tokenExpiryKey);
    
    if (accessToken && tokenExpiry) {
      const expiryDate = new Date(tokenExpiry);
      // If token is still valid, we're good
      if (expiryDate > new Date()) {
        console.log('Valid admin session found');
        return;
      }
    }
  }, []);
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthGuard>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/faqs" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/branch/privacy-policy" element={<BranchPrivacyPolicy />} />
            <Route path="/branch/terms" element={<BranchTerms />} />
            <Route path="/cancellations-and-refunds" element={<CancellationsAndRefunds />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthGuard>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
