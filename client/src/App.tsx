import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import LandingMultiUser from "@/pages/landing-multi-user";
import AdminSetup from "@/pages/admin-setup";
import ClientPortal from "@/pages/client-portal";
import StudentPortal from "@/pages/student-portal";
import ClientRegistration from "@/pages/client-registration";
import StudentRegistration from "@/pages/student-registration";
import Dashboard from "@/pages/dashboard";
import Bookings from "@/pages/bookings";
import Clients from "@/pages/clients";
import Payments from "@/pages/payments";
import Courses from "@/pages/courses";
import Students from "@/pages/students";
import Compliance from "@/pages/compliance";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

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
      
      {/* Practitioner-specific landing and dashboard routes */}
      <Route path="/practitioner" component={Landing} />
      {isAuthenticated ? (
        <>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/bookings" component={Bookings} />
          <Route path="/clients" component={Clients} />
          <Route path="/payments" component={Payments} />
          <Route path="/courses" component={Courses} />
          <Route path="/students" component={Students} />
          <Route path="/compliance" component={Compliance} />
        </>
      ) : null}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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
