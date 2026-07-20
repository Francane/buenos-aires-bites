import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import PageTransition from "@/components/layout/PageTransition";
import ScrollRestoration from "@/components/layout/ScrollRestoration";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import VenuePage from "./pages/VenuePage";
import AgregarLugar from "./pages/AgregarLugar";
import Ayuda from "./pages/Ayuda";
import Contacto from "./pages/Contacto";
import Auth from "./pages/Auth";
import Perfil from "./pages/Perfil";
import Listas from "./pages/Listas";
import ListaDetalle from "./pages/ListaDetalle";
import Barrio from "./pages/Barrio";
import OAuthConsent from "./pages/OAuthConsent";
import OnboardingModal from "./components/onboarding/OnboardingModal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <LayoutGroup>
      <ScrollRestoration />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/venue/:id" element={<VenuePage />} />
          <Route path="/barrio/:slug" element={<PageTransition><Barrio /></PageTransition>} />
          <Route path="/agregar-lugar" element={<PageTransition><AgregarLugar /></PageTransition>} />
          <Route path="/ayuda" element={<PageTransition><Ayuda /></PageTransition>} />
          <Route path="/contacto" element={<PageTransition><Contacto /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
          <Route path="/perfil" element={<PageTransition><Perfil /></PageTransition>} />
          <Route path="/listas" element={<PageTransition><Listas /></PageTransition>} />
          <Route path="/lista/:id" element={<PageTransition><ListaDetalle /></PageTransition>} />
          <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
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
          <AuthProvider>
            <ErrorBoundary>
              <AnimatedRoutes />
              <OnboardingModal />
            </ErrorBoundary>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </LocaleProvider>
  </QueryClientProvider>
);

export default App;
