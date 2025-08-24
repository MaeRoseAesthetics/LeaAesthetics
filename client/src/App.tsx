import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { setupGlobalErrorHandling } from "../../lib/monitoring";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import LandingMultiUser from "@/pages/landing-multi-user";
import AdminSetup from "@/pages/admin-setup";
import ClientPortal from "@/pages/client-portal";
import StudentPortal from "@/pages/student-portal";
import ClientRegistration from "@/pages/client-registration";
import StudentRegistration from "@/pages/student-registration";
import PractitionerPortal from "@/pages/practitioner-portal";
import Background from "@/pages/background";

// Protected Route Component
function ProtectedRoute({ component: Component, ...props }: { component: React.ComponentType<any> }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lea-pearl-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-lea-elegant-silver border-t-lea-deep-charcoal rounded-full" />
          <p className="text-lea-charcoal-grey font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Redirect to="/practitioner" />;
  }
  
  return <Component {...props} />;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lea-pearl-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-lea-elegant-silver border-t-lea-deep-charcoal rounded-full" />
          <p className="text-lea-charcoal-grey font-medium">Loading your portal...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Main entry point - Multi-user landing page */}
      <Route path="/" component={LandingMultiUser} />
      
      {/* Public portal routes */}
      <Route path="/client-portal" component={ClientPortal} />
      <Route path="/student-portal" component={StudentPortal} />
      <Route path="/client-registration" component={ClientRegistration} />
      <Route path="/student-registration" component={StudentRegistration} />
      
      {/* Admin setup route */}
      <Route path="/admin-setup" component={AdminSetup} />
      
      {/* Practitioner-specific landing */}
      <Route path="/practitioner" component={Landing} />
      
      {/* Public pages accessible to all */}
      <Route path="/background" component={Background} />
      
      {/* Unified Practitioner Portal - Single protected route for all practitioner functions */}
      <Route path="/dashboard" component={() => <ProtectedRoute component={PractitionerPortal} />} />
      
      {/* Catch all unmatched routes */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize error monitoring in production
  if (process.env.NODE_ENV === 'production') {
    setupGlobalErrorHandling();
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
