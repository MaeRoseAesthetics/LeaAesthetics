import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection?: 'treatments' | 'training';
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ 
  activeSection = 'treatments', 
  activeTab = 'dashboard',
  onTabChange,
  isOpen = false,
  onClose 
}: SidebarProps) {
  const isMobile = useIsMobile();
  const [localActiveTab, setLocalActiveTab] = useState('dashboard');
  
  const currentTab = activeTab || localActiveTab;

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setLocalActiveTab(tabId);
    }
    
    // Close mobile menu after selection
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Close mobile menu when clicking outside or pressing escape
  useEffect(() => {
    if (!isMobile) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      if (sidebar && !sidebar.contains(e.target as Node) && isOpen && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, isMobile, onClose]);

  const isTabActive = (tabId: string) => {
    return currentTab === tabId;
  };

  const treatmentNavItems = [
    {
      id: "dashboard",
      icon: "fas fa-tachometer-alt",
      label: "Dashboard",
      badge: null
    },
    {
      id: "bookings",
      icon: "fas fa-calendar-alt",
      label: "Bookings",
      badge: "12"
    },
    {
      id: "clients",
      icon: "fas fa-users",
      label: "Clients",
      badge: null
    },
    {
      id: "treatments",
      icon: "fas fa-file-medical",
      label: "Treatments",
      badge: null
    },
    {
      id: "inventory",
      icon: "fas fa-boxes",
      label: "Inventory",
      badge: null
    },
    {
      id: "payments",
      icon: "fas fa-credit-card",
      label: "Payments",
      badge: null
    }
  ];

  const complianceNavItems = [
    {
      id: "compliance",
      icon: "fas fa-shield-alt",
      label: "JCCP Compliance",
      badge: null,
      statusIcon: "fas fa-check-circle text-lea-clinical-blue"
    },
    {
      id: "audit",
      icon: "fas fa-clipboard-check",
      label: "CQC Audit Trail",
      badge: null
    },
    {
      id: "background",
      icon: "fas fa-user-shield",
      label: "DBS & Background",
      badge: null
    }
  ];

  const trainingNavItems = [
    {
      id: "courses",
      icon: "fas fa-graduation-cap",
      label: "Course Dashboard",
      badge: null
    },
    {
      id: "students",
      icon: "fas fa-user-graduate",
      label: "Students",
      badge: null
    },
    {
      id: "content",
      icon: "fas fa-book-open",
      label: "Course Content",
      badge: null
    },
    {
      id: "assessments",
      icon: "fas fa-tasks",
      label: "Assessments",
      badge: null
    }
  ];

  const accreditationNavItems = [
    {
      id: "ofqual",
      icon: "fas fa-certificate",
      label: "Ofqual Compliance",
      badge: null
    },
    {
      id: "cpd",
      icon: "fas fa-chart-line",
      label: "CPD Tracking",
      badge: null
    }
  ];

  // Mobile overlay
  if (isMobile && isOpen) {
    return (
      <>
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
        
        {/* Mobile Sidebar */}
        <nav 
          id="mobile-sidebar"
          className={cn(
            "fixed left-0 top-0 h-full w-72 max-w-[80vw] bg-lea-platinum-white border-r border-lea-silver-grey z-50 transform transition-transform duration-300 ease-in-out shadow-2xl overflow-hidden",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="h-full overflow-y-auto">
            <div className="p-4 pt-20">
              {activeSection === "treatments" ? (
                <div className="treatment-nav">
                  <h3 className="text-xs font-serif font-semibold text-lea-deep-charcoal uppercase tracking-wider mb-4">
                    Practice Management
                  </h3>
                  <ul className="space-y-2">
                    {treatmentNavItems.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => handleTabClick(item.id)}
                          className={cn(
                            "group flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 min-h-[48px]",
                            isTabActive(item.id)
                              ? 'bg-lea-deep-charcoal text-lea-platinum-white shadow-lea-card'
                              : 'text-lea-charcoal-grey hover:bg-lea-pearl-white hover:text-lea-deep-charcoal'
                          )}
                          data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <i className={`${item.icon} mr-3 text-base`}></i>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <Badge className="bg-lea-clinical-blue text-lea-platinum-white text-xs px-2 py-1">
                              {item.badge}
                            </Badge>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-xs font-serif font-semibold text-lea-deep-charcoal uppercase tracking-wider mt-8 mb-4">
                    Compliance
                  </h3>
                  <ul className="space-y-2">
                    {complianceNavItems.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => handleTabClick(item.id)}
                          className={cn(
                            "group flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 min-h-[48px]",
                            isTabActive(item.id)
                              ? 'bg-lea-deep-charcoal text-lea-platinum-white shadow-lea-card'
                              : 'text-lea-charcoal-grey hover:bg-lea-pearl-white hover:text-lea-deep-charcoal'
                          )}
                          data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <i className={`${item.icon} mr-3 text-base`}></i>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.statusIcon && (
                            <span className="ml-2">
                              <i className={item.statusIcon}></i>
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="training-nav">
                  <h3 className="text-xs font-serif font-semibold text-lea-deep-charcoal uppercase tracking-wider mb-4">
                    Training Management
                  </h3>
                  <ul className="space-y-2">
                    {trainingNavItems.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => handleTabClick(item.id)}
                          className={cn(
                            "group flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 min-h-[48px]",
                            isTabActive(item.id)
                              ? 'bg-lea-deep-charcoal text-lea-platinum-white shadow-lea-card'
                              : 'text-lea-charcoal-grey hover:bg-lea-pearl-white hover:text-lea-deep-charcoal'
                          )}
                          data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <i className={`${item.icon} mr-3 text-base`}></i>
                          <span className="flex-1 text-left">{item.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-xs font-serif font-semibold text-lea-deep-charcoal uppercase tracking-wider mt-8 mb-4">
                    Accreditation
                  </h3>
                  <ul className="space-y-2">
                    {accreditationNavItems.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => handleTabClick(item.id)}
                          className={cn(
                            "group flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 min-h-[48px]",
                            isTabActive(item.id)
                              ? 'bg-lea-deep-charcoal text-lea-platinum-white shadow-lea-card'
                              : 'text-lea-charcoal-grey hover:bg-lea-pearl-white hover:text-lea-deep-charcoal'
                          )}
                          data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <i className={`${item.icon} mr-3 text-base`}></i>
                          <span className="flex-1 text-left">{item.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </nav>
      </>
    );
  }

  // Desktop sidebar
  return (
    <nav className="bg-lea-platinum-white w-64 min-h-screen border-r border-lea-silver-grey">
      <div className="p-4">
        {activeSection === "treatments" ? (
          <div className="treatment-nav">
            <h3 className="text-xs font-serif font-semibold text-lea-deep-charcoal uppercase tracking-wider mb-3">
              Practice Management
            </h3>
            <ul className="space-y-1">
              {treatmentNavItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleTabClick(item.id)}
                    className={cn(
                      "group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 min-h-[40px]",
                      isTabActive(item.id)
                        ? 'bg-lea-deep-charcoal text-lea-platinum-white shadow-lea-card'
                        : 'text-lea-charcoal-grey hover:bg-lea-pearl-white hover:text-lea-deep-charcoal'
                    )}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <i className={`${item.icon} mr-3`}></i>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge className="bg-lea-clinical-blue text-lea-platinum-white text-xs px-1.5 py-0.5">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="text-xs font-serif font-semibold text-lea-deep-charcoal uppercase tracking-wider mt-8 mb-3">
              Compliance
            </h3>
            <ul className="space-y-1">
              {complianceNavItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleTabClick(item.id)}
                    className={cn(
                      "group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 min-h-[40px]",
                      isTabActive(item.id)
                        ? 'bg-lea-deep-charcoal text-lea-platinum-white shadow-lea-card'
                        : 'text-lea-charcoal-grey hover:bg-lea-pearl-white hover:text-lea-deep-charcoal'
                    )}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <i className={`${item.icon} mr-3`}></i>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.statusIcon && (
                      <span className="ml-2">
                        <i className={item.statusIcon}></i>
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="training-nav">
            <h3 className="text-xs font-serif font-semibold text-lea-deep-charcoal uppercase tracking-wider mb-3">
              Training Management
            </h3>
            <ul className="space-y-1">
              {trainingNavItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleTabClick(item.id)}
                    className={cn(
                      "group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 min-h-[40px]",
                      isTabActive(item.id)
                        ? 'bg-lea-deep-charcoal text-lea-platinum-white shadow-lea-card'
                        : 'text-lea-charcoal-grey hover:bg-lea-pearl-white hover:text-lea-deep-charcoal'
                    )}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <i className={`${item.icon} mr-3`}></i>
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="text-xs font-serif font-semibold text-lea-deep-charcoal uppercase tracking-wider mt-8 mb-3">
              Accreditation
            </h3>
            <ul className="space-y-1">
              {accreditationNavItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleTabClick(item.id)}
                    className={cn(
                      "group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 min-h-[40px]",
                      isTabActive(item.id)
                        ? 'bg-lea-deep-charcoal text-lea-platinum-white shadow-lea-card'
                        : 'text-lea-charcoal-grey hover:bg-lea-pearl-white hover:text-lea-deep-charcoal'
                    )}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <i className={`${item.icon} mr-3`}></i>
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
