import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2, ease: "easeInOut" }} // Shorter duration for a quicker fade
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

const App = () => {
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Index /></PageWrapper>} />
            <Route path="/setup" element={<PageWrapper><GameSetup /></PageWrapper>} />
            <Route path="/name-reveal" element={<PageWrapper><NameReveal /></PageWrapper>} />
            <Route path="/discussion" element={<PageWrapper><Discussion /></PageWrapper>} />
            <Route path="/results" element={<PageWrapper><Results /></PageWrapper>} />
            <Route path="/how-to-play" element={<PageWrapper><HowToPlay /></PageWrapper>} />
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