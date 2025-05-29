
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "./pages/Home";
import SearchResultsPage from "./pages/SearchResultsPage";
import FAQPage from "./pages/FAQPage";
import SchemeMatcherPage from "./pages/SchemeMatcherPage";
import SchemeMatcherResultsPage from "./pages/SchemeMatcherResultsPage";
import SchemeDetailPage from "./pages/SchemeDetailPage";
import SchemeApplicationPage from "./pages/SchemeApplicationPage";
import SchemeConfirmationPage from "./pages/SchemeConfirmationPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/scheme-matcher" element={<SchemeMatcherPage />} />
            <Route path="/scheme-matcher/results" element={<SchemeMatcherResultsPage />} />
            <Route path="/schemes/:id" element={<SchemeDetailPage />} />
            <Route path="/schemes/:id/apply" element={<SchemeApplicationPage />} />
            <Route path="/schemes/:id/confirmation" element={<SchemeConfirmationPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
