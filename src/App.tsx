import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
