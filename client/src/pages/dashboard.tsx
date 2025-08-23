import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import StatsCards from "@/components/dashboard/stats-cards";
import Schedule from "@/components/dashboard/schedule";
import ClientActivity from "@/components/dashboard/client-activity";
import ComplianceWidget from "@/components/dashboard/compliance-widget";
import CPDTracker from "@/components/dashboard/cpd-tracker";
import QuickActions from "@/components/dashboard/quick-actions";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-maerose-cream">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {/* Dashboard Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-maerose-forest" data-testid="text-page-title">
                    Practice Dashboard
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Welcome back. Here's what's happening today.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button 
                    className="bg-maerose-forest text-maerose-cream px-4 py-2 rounded-md text-sm font-medium hover:bg-maerose-forest/90 transition-colors"
                    data-testid="button-new-booking"
                  >
                    <i className="fas fa-plus mr-2"></i>New Booking
                  </button>
                  <button 
                    className="bg-white text-maerose-forest border border-maerose-gold/30 px-4 py-2 rounded-md text-sm font-medium hover:bg-maerose-cream/50 transition-colors"
                    data-testid="button-export-report"
                  >
                    <i className="fas fa-download mr-2"></i>Export Report
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Stats Cards */}
            <StatsCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <div className="lg:col-span-2 space-y-6">
                <Schedule />
                <ClientActivity />
              </div>

              <div className="space-y-6">
                <ComplianceWidget />
                <CPDTracker />
                <QuickActions />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
