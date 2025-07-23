import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GameSetup from "./pages/GameSetup";
import NameReveal from "./pages/NameReveal";
import Discussion from "./pages/Discussion";
import Voting from "./pages/Voting";
import Results from "./pages/Results";
import HowToPlay from "./pages/HowToPlay"; // Import the new HowToPlay component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/setup" element={<GameSetup />} />
          <Route path="/name-reveal" element={<NameReveal />} />
          <Route path="/discussion" element={<Discussion />} />
          <Route path="/voting" element={<Voting />} />
          <Route path="/results" element={<Results />} />
          <Route path="/how-to-play" element={<HowToPlay />} /> {/* New route for HowToPlay */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;