import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import all the portal sections
import DashboardSection from "@/components/portal/dashboard-section";
import BookingsSection from "@/components/portal/bookings-section";
import ClientsSection from "@/components/portal/clients-section";
import TreatmentsSection from "@/components/portal/treatments-section";
import InventorySection from "@/components/portal/inventory-section";
import PaymentsSection from "@/components/portal/payments-section";
import ComplianceSection from "@/components/portal/compliance-section";
import AuditSection from "@/components/portal/audit-section";
import AnalyticsSection from "@/components/portal/analytics-section";
import AdminSection from "@/components/portal/admin-section";
import CoursesSection from "@/components/portal/courses-section";
import StudentsSection from "@/components/portal/students-section";

type PortalSection = 
  | 'dashboard' 
  | 'bookings' 
  | 'clients' 
  | 'treatments' 
  | 'inventory' 
  | 'payments'
  | 'compliance'
  | 'audit'
  | 'analytics'
  | 'admin'
  | 'courses'
  | 'students';

export default function PractitionerPortal() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState<PortalSection>('dashboard');
  const [activeMode, setActiveMode] = useState<'treatments' | 'training'>('treatments');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/practitioner");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-lea-platinum-grey flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lea-elegant-silver border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lea-charcoal-grey">Loading your portal...</p>
        </div>
      </div>
    );
  }

  const treatmentSections = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', badge: null },
    { id: 'bookings', label: 'Bookings', icon: 'fas fa-calendar-alt', badge: '12' },
    { id: 'clients', label: 'Clients', icon: 'fas fa-users', badge: null },
    { id: 'treatments', label: 'Treatments', icon: 'fas fa-file-medical', badge: null },
    { id: 'inventory', label: 'Inventory', icon: 'fas fa-boxes', badge: null },
    { id: 'payments', label: 'Payments', icon: 'fas fa-credit-card', badge: null },
    { id: 'compliance', label: 'Compliance', icon: 'fas fa-shield-alt', badge: null },
    { id: 'audit', label: 'Audit', icon: 'fas fa-clipboard-check', badge: null },
    { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-bar', badge: null },
    { id: 'admin', label: 'Settings', icon: 'fas fa-cog', badge: null },
  ] as const;

  const trainingSections = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', badge: null },
    { id: 'courses', label: 'Courses', icon: 'fas fa-graduation-cap', badge: null },
    { id: 'students', label: 'Students', icon: 'fas fa-user-graduate', badge: '8' },
    { id: 'compliance', label: 'Compliance', icon: 'fas fa-certificate', badge: null },
    { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-line', badge: null },
    { id: 'admin', label: 'Settings', icon: 'fas fa-cog', badge: null },
  ] as const;

  const currentSections = activeMode === 'treatments' ? treatmentSections : trainingSections;

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection mode={activeMode} />;
      case 'bookings':
        return <BookingsSection />;
      case 'clients':
        return <ClientsSection />;
      case 'treatments':
        return <TreatmentsSection />;
      case 'inventory':
        return <InventorySection />;
      case 'payments':
        return <PaymentsSection />;
      case 'compliance':
        return <ComplianceSection mode={activeMode} />;
      case 'audit':
        return <AuditSection />;
      case 'analytics':
        return <AnalyticsSection mode={activeMode} />;
      case 'admin':
        return <AdminSection />;
      case 'courses':
        return <CoursesSection />;
      case 'students':
        return <StudentsSection />;
      default:
        return <DashboardSection mode={activeMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-lea-platinum-grey">
      {/* Header */}
      <header className="bg-lea-platinum-white border-b border-lea-silver-grey sticky top-0 z-50 shadow-lea-subtle">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center flex-1">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-lea-elegant-silver via-lea-elegant-silver to-gray-500 rounded-lg flex items-center justify-center shadow-lea-card flex-shrink-0">
                  <span className="text-lea-deep-charcoal font-bold text-lg lg:text-xl font-serif">L</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <h1 className="text-base sm:text-lg lg:text-2xl font-serif font-bold text-lea-deep-charcoal tracking-tight leading-none truncate">
                    Lea Aesthetics
                  </h1>
                  <p className="text-xs lg:text-sm font-medium text-lea-charcoal-grey tracking-wider">
                    Practitioner Portal
                  </p>
                </div>
              </div>
              
              {/* Desktop Mode Toggle */}
              <div className="ml-6 lg:ml-10 hidden sm:block">
                <div className="bg-lea-pearl-white rounded-lg p-1 flex border border-lea-silver-grey">
                  <button
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all min-h-[36px] ${
                      activeMode === 'treatments'
                        ? 'bg-lea-deep-charcoal text-lea-platinum-white shadow-lea-card'
                        : 'text-lea-deep-charcoal hover:bg-lea-elegant-silver/50'
                    }`}
                    onClick={() => setActiveMode('treatments')}
                  >
                    <i className="fas fa-spa mr-2"></i> Treatments
                  </button>
                  <button
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all min-h-[36px] ${
                      activeMode === 'training'
                        ? 'bg-lea-deep-charcoal text-lea-platinum-white shadow-lea-card'
                        : 'text-lea-deep-charcoal hover:bg-lea-elegant-silver/50'
                    }`}
                    onClick={() => setActiveMode('training')}
                  >
                    <i className="fas fa-graduation-cap mr-2"></i> Training
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Notifications */}
              <button className="p-2 lg:p-3 text-lea-charcoal-grey hover:text-lea-deep-charcoal hover:bg-lea-pearl-white rounded-lg transition-colors relative min-h-[44px] min-w-[44px] flex items-center justify-center">
                <i className="fas fa-bell text-base lg:text-lg"></i>
                <Badge className="absolute -top-1 -right-1 bg-lea-clinical-blue text-lea-platinum-white text-xs px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                  3
                </Badge>
              </button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-2 cursor-pointer hover:bg-lea-pearl-white rounded-lg p-2 min-h-[44px] transition-colors">
                    <img
                      className="h-8 w-8 lg:h-10 lg:w-10 rounded-full object-cover flex-shrink-0 ring-2 ring-lea-elegant-silver/30"
                      src={user?.profileImageUrl || "/api/placeholder/32/32"}
                      alt="Profile"
                    />
                    <div className="hidden sm:block text-left min-w-0">
                      <span className="text-sm font-medium text-lea-deep-charcoal truncate block">
                        {user?.firstName && user?.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user?.email || 'User'
                        }
                      </span>
                      <div className="text-xs text-lea-charcoal-grey">Practitioner</div>
                    </div>
                    <i className="fas fa-chevron-down text-xs text-lea-charcoal-grey hidden sm:block"></i>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-lea-platinum-white border border-lea-silver-grey shadow-lea-card">
                  <DropdownMenuItem className="hover:bg-lea-pearl-white focus:bg-lea-pearl-white">
                    <i className="fas fa-user mr-3 text-lea-charcoal-grey"></i>
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-lea-pearl-white focus:bg-lea-pearl-white">
                    <i className="fas fa-clinic-medical mr-3 text-lea-charcoal-grey"></i>
                    Practice Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-lea-silver-grey" />
                  <DropdownMenuItem className="hover:bg-lea-pearl-white focus:bg-lea-pearl-white">
                    <i className="fas fa-question-circle mr-3 text-lea-charcoal-grey"></i>
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-lea-silver-grey" />
                  <DropdownMenuItem onClick={logout} className="hover:bg-red-50 focus:bg-red-50 text-red-600">
                    <i className="fas fa-sign-out-alt mr-3"></i>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Mobile Mode Toggle */}
          <div className="pb-4 sm:hidden">
            <div className="bg-lea-pearl-white rounded-lg p-1 flex border border-lea-silver-grey">
              <button
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all min-h-[44px] ${
                  activeMode === 'treatments'
                    ? 'bg-lea-deep-charcoal text-lea-platinum-white shadow-lea-card'
                    : 'text-lea-deep-charcoal hover:bg-lea-elegant-silver/50'
                }`}
                onClick={() => setActiveMode('treatments')}
              >
                <i className="fas fa-spa mr-2"></i> Treatments
              </button>
              <button
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all min-h-[44px] ${
                  activeMode === 'training'
                    ? 'bg-lea-deep-charcoal text-lea-platinum-white shadow-lea-card'
                    : 'text-lea-deep-charcoal hover:bg-lea-elegant-silver/50'
                }`}
                onClick={() => setActiveMode('training')}
              >
                <i className="fas fa-graduation-cap mr-2"></i> Training
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Mobile Friendly */}
      <div className="bg-lea-platinum-white border-b border-lea-silver-grey sticky top-16 lg:top-20 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <ScrollArea className="w-full">
            <div className="flex space-x-1 py-3 min-w-max">
              {currentSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as PortalSection)}
                  className={`
                    flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap min-h-[44px]
                    ${activeSection === section.id
                      ? 'bg-lea-deep-charcoal text-lea-platinum-white shadow-lea-card'
                      : 'text-lea-charcoal-grey hover:text-lea-deep-charcoal hover:bg-lea-pearl-white'
                    }
                  `}
                >
                  <i className={`${section.icon} text-sm`}></i>
                  <span>{section.label}</span>
                  {section.badge && (
                    <Badge className="bg-lea-clinical-blue text-lea-platinum-white text-xs px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                      {section.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="w-full">
          {renderSectionContent()}
        </div>
      </main>
    </div>
  );
}
