import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import PageTransition from "@/components/layout/PageTransition";
import ScrollRestoration from "@/components/layout/ScrollRestoration";
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
    <LayoutGroup>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/venue/:id" element={<VenuePage />} />
          <Route path="/agregar-lugar" element={<PageTransition><AgregarLugar /></PageTransition>} />
          <Route path="/ayuda" element={<PageTransition><Ayuda /></PageTransition>} />
          <Route path="/contacto" element={<PageTransition><Contacto /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </LayoutGroup>
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
