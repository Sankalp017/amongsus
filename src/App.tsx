import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion"; // Import motion and AnimatePresence
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GameSetup from "./pages/GameSetup";
import NameReveal from "./pages/NameReveal";
import Discussion from "./pages/Discussion";
import Results from "./pages/Results";
import HowToPlay from "./pages/HowToPlay";

const queryClient = new QueryClient();

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="w-full h-full" // Ensure it takes full space for transitions
  >
    {children}
  </motion.div>
);

const App = () => {
  const location = useLocation(); // Use useLocation hook inside BrowserRouter

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* AnimatePresence allows components to animate when they are removed from the React tree */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Index /></PageWrapper>} />
            <Route path="/setup" element={<PageWrapper><GameSetup /></PageWrapper>} />
            <Route path="/name-reveal" element={<PageWrapper><NameReveal /></PageWrapper>} />
            <Route path="/discussion" element={<PageWrapper><Discussion /></PageWrapper>} />
            <Route path="/results" element={<PageWrapper><Results /></PageWrapper>} />
            <Route path="/how-to-play" element={<PageWrapper><HowToPlay /></PageWrapper>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;