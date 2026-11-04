import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ScrollManager } from "@/components/ScrollManager";
import Index from "./pages/Index";
import Calculator from "./pages/Calculator";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ApiDocs from "./pages/ApiDocs";
import NotFound from "./pages/NotFound";
import FtaFinder from "./pages/FtaFinder";
import RulesOfOrigin from "./pages/RulesOfOrigin";
import MarketOpportunities from "./pages/MarketOpportunities";
import MpExportStrength from "./pages/MpExportStrength";
import VyaparSetu from "./pages/VyaparSetu";
import ExportMap from "./pages/ExportMap";
import Compliance from "./pages/Compliance";
import Buyers from "./pages/Buyers";
import RestrictedPartyScreening from './pages/RestrictedPartyScreening';
import ExportReadiness from "./pages/ExportReadiness";
import GovDashboard from "./pages/GovDashboard";
import Assistant from "./pages/Assistant";
import Agreements from "./pages/Agreements";
import AgreementDetail from "./pages/AgreementDetail";
import Knowledge from "./pages/Knowledge";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollManager />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/fta-benefit-finder" element={<FtaFinder />} />
              {/* Global Duty Calculator is the only module that requires sign-in */}
              <Route path="/tariff-savings-calculator" element={<Calculator />} />
              <Route path="/tariff-savings-calculator/api-docs" element={<Navigate to="/tariff-savings-calculator" replace />} />
              <Route path="/calculator" element={<Navigate to="/tariff-savings-calculator" replace />} />
              <Route path="/api-docs" element={<Navigate to="/tariff-savings-calculator" replace />} />
              <Route path="/rules-of-origin" element={<RulesOfOrigin />} />
              <Route path="/market-opportunities" element={<Navigate to="/" replace />} />
              <Route path="/mp-export-intelligence" element={<ExportMap />} />
              <Route path="/mp-export-strength" element={<MpExportStrength />} />
              <Route path="/vyapar-setu" element={<VyaparSetu />} />
              <Route path="/compliance-navigator" element={<Compliance />} />
              <Route path="/buyer-tender-intelligence" element={<Buyers />} />
              <Route path="/restricted-party-screening" element={<RestrictedPartyScreening />} />
              <Route path="/export-readiness" element={<ExportReadiness />} />
              <Route path="/government-dashboard" element={<Navigate to="/" replace />} />
              <Route path="/fta-alerts" element={<Navigate to="/" replace />} />
              <Route path="/trade-assistant" element={<Navigate to="/" replace />} />
              <Route path="/trade-agreements" element={<Agreements />} />
              <Route path="/trade-agreements/:id" element={<AgreementDetail />} />
              <Route path="/knowledge-support" element={<Knowledge />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
