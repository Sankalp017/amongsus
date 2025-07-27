import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GameSetup from "./pages/GameSetup";
import NameReveal from "./pages/NameReveal";
import Discussion from "./pages/Discussion";
import Results from "./pages/Results";
import HowToPlay from "./pages/HowToPlay";
import CustomWordPacks from "./pages/CustomWordPacks";

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/setup" element={<GameSetup />} />
          <Route path="/name-reveal" element={<NameReveal />} />
          <Route path="/discussion" element={<Discussion />} />
          <Route path="/results" element={<Results />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/custom-packs" element={<CustomWordPacks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
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