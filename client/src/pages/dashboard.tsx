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
    <div className="min-h-screen bg-lea-pearl-white">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto scrollbar-medical">
          {/* Dashboard Header */}
          <div className="bg-lea-platinum-grey/95 backdrop-blur-lg border-b border-lea-warm-grey shadow-lea-subtle">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-lea-elegant-silver via-lea-elegant-silver to-gray-500 rounded-lg flex items-center justify-center shadow-lea-card">
                      <span className="text-lea-deep-charcoal font-bold text-xl font-serif">L</span>
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal tracking-tight leading-none" data-testid="text-page-title">
                        LEA AESTHETICS
                      </h2>
                      <p className="text-sm font-medium text-lea-charcoal-grey tracking-wider">
                        Practice Management Dashboard
                      </p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-lea-silver-grey"></div>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-lea-charcoal-grey">
                      Welcome back, Dr. Smith
                    </p>
                    <p className="text-xs text-lea-slate-grey">
                      {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    className="bg-lea-elegant-silver text-lea-deep-charcoal px-6 py-3 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all duration-300 shadow-lea-card hover:shadow-lea-card-hover flex items-center"
                    data-testid="button-new-booking"
                  >
                    <i className="fas fa-plus mr-2"></i>New Booking
                  </button>
                  <button 
                    className="bg-lea-platinum-white/80 text-lea-deep-charcoal border border-lea-silver-grey px-6 py-3 rounded-lg text-sm font-medium hover:bg-lea-platinum-white transition-all duration-300 shadow-lea-card hover:shadow-lea-card-hover flex items-center"
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
