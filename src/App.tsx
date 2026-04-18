import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import Index from "./pages/Index";
import VenuePage from "./pages/VenuePage";
import AgregarLugar from "./pages/AgregarLugar";
import Ayuda from "./pages/Ayuda";
import Contacto from "./pages/Contacto";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/venue/:id" element={<VenuePage />} />
        <Route path="/agregar-lugar" element={<AgregarLugar />} />
        <Route path="/ayuda" element={<Ayuda />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LocaleProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <AnimatedRoutes />
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </LocaleProvider>
  </QueryClientProvider>
);

export default App;
