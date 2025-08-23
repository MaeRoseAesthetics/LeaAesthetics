import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import StatsCards from "@/components/dashboard/stats-cards";
import Schedule from "@/components/dashboard/schedule";
import ClientActivity from "@/components/dashboard/client-activity";
import ComplianceWidget from "@/components/dashboard/compliance-widget";
import CPDTracker from "@/components/dashboard/cpd-tracker";
import QuickActions from "@/components/dashboard/quick-actions";

// Tab Content Components
const BookingsContent = () => (
  <div className="p-4 lg:p-6">
    <div className="mb-6">
      <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal mb-2">Bookings Management</h2>
      <p className="text-lea-charcoal-grey">Manage your appointments and schedule</p>
    </div>
    <div className="bg-lea-platinum-white rounded-xl border border-lea-silver-grey p-6 text-center">
      <i className="fas fa-calendar-alt text-4xl text-lea-charcoal-grey mb-4"></i>
      <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">Bookings Dashboard</h3>
      <p className="text-lea-charcoal-grey">Comprehensive booking management coming soon</p>
    </div>
  </div>
);

const ClientsContent = () => (
  <div className="p-4 lg:p-6">
    <div className="mb-6">
      <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal mb-2">Client Management</h2>
      <p className="text-lea-charcoal-grey">Manage your client relationships and records</p>
    </div>
    <div className="bg-lea-platinum-white rounded-xl border border-lea-silver-grey p-6 text-center">
      <i className="fas fa-users text-4xl text-lea-charcoal-grey mb-4"></i>
      <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">Client Database</h3>
      <p className="text-lea-charcoal-grey">Client management system coming soon</p>
    </div>
  </div>
);

const TreatmentsContent = () => (
  <div className="p-4 lg:p-6">
    <div className="mb-6">
      <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal mb-2">Treatments</h2>
      <p className="text-lea-charcoal-grey">Manage your treatment protocols and procedures</p>
    </div>
    <div className="bg-lea-platinum-white rounded-xl border border-lea-silver-grey p-6 text-center">
      <i className="fas fa-file-medical text-4xl text-lea-charcoal-grey mb-4"></i>
      <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">Treatment Protocols</h3>
      <p className="text-lea-charcoal-grey">Treatment management system coming soon</p>
    </div>
  </div>
);

const PaymentsContent = () => (
  <div className="p-4 lg:p-6">
    <div className="mb-6">
      <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal mb-2">Payments</h2>
      <p className="text-lea-charcoal-grey">Track payments and financial reports</p>
    </div>
    <div className="bg-lea-platinum-white rounded-xl border border-lea-silver-grey p-6 text-center">
      <i className="fas fa-credit-card text-4xl text-lea-charcoal-grey mb-4"></i>
      <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">Payment Processing</h3>
      <p className="text-lea-charcoal-grey">Payment management system coming soon</p>
    </div>
  </div>
);

const ComplianceContent = () => (
  <div className="p-4 lg:p-6">
    <div className="mb-6">
      <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal mb-2">JCCP Compliance</h2>
      <p className="text-lea-charcoal-grey">Monitor your JCCP compliance status</p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ComplianceWidget />
      <div className="bg-lea-platinum-white rounded-xl border border-lea-silver-grey p-6">
        <h3 className="text-lg font-medium text-lea-deep-charcoal mb-4">Compliance Actions</h3>
        <div className="space-y-3">
          <button className="w-full p-3 text-left bg-lea-pearl-white hover:bg-lea-elegant-silver/20 rounded-lg transition-colors">
            <i className="fas fa-file-alt mr-3 text-lea-clinical-blue"></i>
            Update Documentation
          </button>
          <button className="w-full p-3 text-left bg-lea-pearl-white hover:bg-lea-elegant-silver/20 rounded-lg transition-colors">
            <i className="fas fa-check-circle mr-3 text-lea-clinical-blue"></i>
            Review Compliance
          </button>
        </div>
      </div>
    </div>
  </div>
);

const AuditContent = () => (
  <div className="p-4 lg:p-6">
    <div className="mb-6">
      <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal mb-2">CQC Audit Trail</h2>
      <p className="text-lea-charcoal-grey">Track and manage your CQC audit requirements</p>
    </div>
    <div className="bg-lea-platinum-white rounded-xl border border-lea-silver-grey p-6 text-center">
      <i className="fas fa-clipboard-check text-4xl text-lea-charcoal-grey mb-4"></i>
      <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">Audit Management</h3>
      <p className="text-lea-charcoal-grey">CQC audit trail system coming soon</p>
    </div>
  </div>
);

const BackgroundContent = () => (
  <div className="p-4 lg:p-6">
    <div className="mb-6">
      <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal mb-2">DBS & Background</h2>
      <p className="text-lea-charcoal-grey">Manage background checks and certifications</p>
    </div>
    <div className="bg-lea-platinum-white rounded-xl border border-lea-silver-grey p-6 text-center">
      <i className="fas fa-user-shield text-4xl text-lea-charcoal-grey mb-4"></i>
      <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">Background Verification</h3>
      <p className="text-lea-charcoal-grey">Background check management coming soon</p>
    </div>
  </div>
);

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const isMobile = useIsMobile();
  
  // Navigation state
  const [activeSection, setActiveSection] = useState<'treatments' | 'training'>('treatments');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle mobile menu toggle
  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Handle section switching (treatments/training)
  const handleSectionSwitch = useCallback((section: 'treatments' | 'training') => {
    setActiveSection(section);
    // Reset to dashboard when switching sections
    setActiveTab(section === 'treatments' ? 'dashboard' : 'courses');
  }, []);

  // Handle tab switching
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

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
      <div className="min-h-screen flex items-center justify-center bg-lea-pearl-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-lea-elegant-silver border-t-lea-deep-charcoal rounded-full" />
          <p className="text-lea-charcoal-grey font-medium">Loading your portal...</p>
        </div>
      </div>
    );
  }

  // Function to render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
            {/* Stats Cards */}
            <div className="mb-6 lg:mb-8">
              <StatsCards />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
              <div className="lg:col-span-2 space-y-4 lg:space-y-6 order-2 lg:order-1">
                <Schedule />
                <ClientActivity />
              </div>

              <div className="space-y-4 lg:space-y-6 order-1 lg:order-2">
                <ComplianceWidget />
                <CPDTracker />
                <QuickActions />
              </div>
            </div>
          </div>
        );
      case 'bookings':
        return <BookingsContent />;
      case 'clients':
        return <ClientsContent />;
      case 'treatments':
        return <TreatmentsContent />;
      case 'payments':
        return <PaymentsContent />;
      case 'compliance':
        return <ComplianceContent />;
      case 'audit':
        return <AuditContent />;
      case 'background':
        return <BackgroundContent />;
      // Training section tabs
      case 'courses':
        return (
          <div className="p-4 lg:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal mb-2">Course Dashboard</h2>
              <p className="text-lea-charcoal-grey">Manage your training courses and programs</p>
            </div>
            <div className="bg-lea-platinum-white rounded-xl border border-lea-silver-grey p-6 text-center">
              <i className="fas fa-graduation-cap text-4xl text-lea-charcoal-grey mb-4"></i>
              <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">Course Management</h3>
              <p className="text-lea-charcoal-grey">Training course system coming soon</p>
            </div>
          </div>
        );
      case 'students':
        return (
          <div className="p-4 lg:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal mb-2">Student Management</h2>
              <p className="text-lea-charcoal-grey">Track student progress and enrollment</p>
            </div>
            <div className="bg-lea-platinum-white rounded-xl border border-lea-silver-grey p-6 text-center">
              <i className="fas fa-user-graduate text-4xl text-lea-charcoal-grey mb-4"></i>
              <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">Student Database</h3>
              <p className="text-lea-charcoal-grey">Student management system coming soon</p>
            </div>
          </div>
        );
      case 'content':
        return (
          <div className="p-4 lg:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal mb-2">Course Content</h2>
              <p className="text-lea-charcoal-grey">Manage training materials and resources</p>
            </div>
            <div className="bg-lea-platinum-white rounded-xl border border-lea-silver-grey p-6 text-center">
              <i className="fas fa-book-open text-4xl text-lea-charcoal-grey mb-4"></i>
              <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">Content Management</h3>
              <p className="text-lea-charcoal-grey">Content management system coming soon</p>
            </div>
          </div>
        );
      case 'assessments':
        return (
          <div className="p-4 lg:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal mb-2">Assessments</h2>
              <p className="text-lea-charcoal-grey">Create and manage student assessments</p>
            </div>
            <div className="bg-lea-platinum-white rounded-xl border border-lea-silver-grey p-6 text-center">
              <i className="fas fa-tasks text-4xl text-lea-charcoal-grey mb-4"></i>
              <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">Assessment Tools</h3>
              <p className="text-lea-charcoal-grey">Assessment system coming soon</p>
            </div>
          </div>
        );
      case 'ofqual':
        return (
          <div className="p-4 lg:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal mb-2">Ofqual Compliance</h2>
              <p className="text-lea-charcoal-grey">Monitor your Ofqual compliance status</p>
            </div>
            <div className="bg-lea-platinum-white rounded-xl border border-lea-silver-grey p-6 text-center">
              <i className="fas fa-certificate text-4xl text-lea-charcoal-grey mb-4"></i>
              <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">Ofqual Management</h3>
              <p className="text-lea-charcoal-grey">Ofqual compliance system coming soon</p>
            </div>
          </div>
        );
      case 'cpd':
        return (
          <div className="p-4 lg:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal mb-2">CPD Tracking</h2>
              <p className="text-lea-charcoal-grey">Track continuing professional development</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CPDTracker />
              <div className="bg-lea-platinum-white rounded-xl border border-lea-silver-grey p-6">
                <h3 className="text-lg font-medium text-lea-deep-charcoal mb-4">CPD Actions</h3>
                <div className="space-y-3">
                  <button className="w-full p-3 text-left bg-lea-pearl-white hover:bg-lea-elegant-silver/20 rounded-lg transition-colors">
                    <i className="fas fa-plus mr-3 text-lea-clinical-blue"></i>
                    Log CPD Hours
                  </button>
                  <button className="w-full p-3 text-left bg-lea-pearl-white hover:bg-lea-elegant-silver/20 rounded-lg transition-colors">
                    <i className="fas fa-certificate mr-3 text-lea-clinical-blue"></i>
                    Upload Certificate
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return renderTabContent(); // Fallback to dashboard
    }
  };

  return (
    <div className="min-h-screen bg-lea-pearl-white">
      <Header 
        onMobileModeSwitch={handleSectionSwitch}
        activeMode={activeSection}
        onMobileMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <div className="flex">
        {!isMobile && (
          <Sidebar 
            activeSection={activeSection}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        )}
        
        {/* Mobile sidebar overlay */}
        {isMobile && (
          <Sidebar 
            activeSection={activeSection}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isOpen={isMobileMenuOpen}
            onClose={closeMobileMenu}
          />
        )}
        
        <main className={`flex-1 overflow-y-auto ${isMobile ? 'w-full' : ''}`}>
          {/* Dashboard Header - only show on dashboard tab */}
          {activeTab === 'dashboard' && (
            <div className="bg-lea-platinum-grey/95 backdrop-blur-lg border-b border-lea-warm-grey shadow-lea-subtle">
              <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
                    <div className="flex items-center space-x-3 mb-3 lg:mb-0">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-lea-elegant-silver via-lea-elegant-silver to-gray-500 rounded-lg flex items-center justify-center shadow-lea-card flex-shrink-0">
                        <span className="text-lea-deep-charcoal font-bold text-lg lg:text-xl font-serif">L</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h2 className="text-xl lg:text-2xl font-serif font-bold text-lea-deep-charcoal tracking-tight leading-none" data-testid="text-page-title">
                          LEA AESTHETICS
                        </h2>
                        <p className="text-xs lg:text-sm font-medium text-lea-charcoal-grey tracking-wider">
                          Practice Management Dashboard
                        </p>
                      </div>
                    </div>
                    <div className="hidden lg:block h-8 w-px bg-lea-silver-grey"></div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-lea-charcoal-grey">
                        Welcome back, Dr. Smith
                      </p>
                      <p className="text-xs text-lea-slate-grey">
                        {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button 
                      className="bg-lea-elegant-silver text-lea-deep-charcoal px-4 lg:px-6 py-3 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all duration-300 shadow-lea-card hover:shadow-lea-card-hover flex items-center justify-center min-h-[44px]"
                      data-testid="button-new-booking"
                    >
                      <i className="fas fa-plus mr-2"></i>New Booking
                    </button>
                    <button 
                      className="bg-lea-platinum-white/80 text-lea-deep-charcoal border border-lea-silver-grey px-4 lg:px-6 py-3 rounded-lg text-sm font-medium hover:bg-lea-platinum-white transition-all duration-300 shadow-lea-card hover:shadow-lea-card-hover flex items-center justify-center min-h-[44px]"
                      data-testid="button-export-report"
                    >
                      <i className="fas fa-download mr-2"></i>Export Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="min-h-screen">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
