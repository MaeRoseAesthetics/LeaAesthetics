import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function Sidebar() {
  const [location] = useLocation();
  const [activeSection] = useState("treatments"); // treatments or training

  const isActive = (path: string) => {
    return location === path;
  };

  const treatmentNavItems = [
    {
      path: "/",
      icon: "fas fa-tachometer-alt",
      label: "Dashboard",
      badge: null
    },
    {
      path: "/bookings",
      icon: "fas fa-calendar-alt",
      label: "Bookings",
      badge: "12"
    },
    {
      path: "/clients",
      icon: "fas fa-users",
      label: "Clients",
      badge: null
    },
    {
      path: "/treatments",
      icon: "fas fa-file-medical",
      label: "Treatments",
      badge: null
    },
    {
      path: "/payments",
      icon: "fas fa-credit-card",
      label: "Payments",
      badge: null
    }
  ];

  const complianceNavItems = [
    {
      path: "/compliance",
      icon: "fas fa-shield-alt",
      label: "JCCP Compliance",
      badge: null,
      statusIcon: "fas fa-check-circle text-success"
    },
    {
      path: "/audit",
      icon: "fas fa-clipboard-check",
      label: "CQC Audit Trail",
      badge: null
    },
    {
      path: "/background",
      icon: "fas fa-user-shield",
      label: "DBS & Background",
      badge: null
    }
  ];

  const trainingNavItems = [
    {
      path: "/courses",
      icon: "fas fa-graduation-cap",
      label: "Course Dashboard",
      badge: null
    },
    {
      path: "/students",
      icon: "fas fa-user-graduate",
      label: "Students",
      badge: null
    },
    {
      path: "/content",
      icon: "fas fa-book-open",
      label: "Course Content",
      badge: null
    },
    {
      path: "/assessments",
      icon: "fas fa-tasks",
      label: "Assessments",
      badge: null
    }
  ];

  const accreditationNavItems = [
    {
      path: "/ofqual",
      icon: "fas fa-certificate",
      label: "Ofqual Compliance",
      badge: null
    },
    {
      path: "/cpd",
      icon: "fas fa-chart-line",
      label: "CPD Tracking",
      badge: null
    }
  ];

  return (
    <nav className="bg-lea-white w-64 min-h-screen border-r border-lea-mid-grey">
      <div className="p-4">
        {/* Treatment Mode Navigation */}
        {activeSection === "treatments" && (
          <div className="treatment-nav">
            <h3 className="text-xs font-serif font-semibold text-lea-charcoal uppercase tracking-wider mb-3">
              Practice Management
            </h3>
            <ul className="space-y-1">
              {treatmentNavItems.map((item) => (
                <li key={item.path}>
                  <Link href={item.path}>
                    <a
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive(item.path)
                          ? 'bg-lea-charcoal text-lea-white'
                          : 'text-lea-dark-grey hover:bg-lea-light-grey'
                      }`}
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <i className={`${item.icon} mr-3`}></i>
                      {item.label}
                      {item.badge && (
                        <Badge className="ml-auto bg-lea-soft-gold text-lea-charcoal">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-xs font-serif font-semibold text-lea-charcoal uppercase tracking-wider mt-8 mb-3">
              Compliance
            </h3>
            <ul className="space-y-1">
              {complianceNavItems.map((item) => (
                <li key={item.path}>
                  <Link href={item.path}>
                    <a
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive(item.path)
                          ? 'bg-lea-charcoal text-lea-white'
                          : 'text-lea-dark-grey hover:bg-lea-light-grey'
                      }`}
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <i className={`${item.icon} mr-3`}></i>
                      {item.label}
                      {item.statusIcon && (
                        <span className="ml-auto">
                          <i className={item.statusIcon}></i>
                        </span>
                      )}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Training Mode Navigation */}
        {activeSection === "training" && (
          <div className="training-nav">
            <h3 className="text-xs font-serif font-semibold text-lea-charcoal uppercase tracking-wider mb-3">
              Training Management
            </h3>
            <ul className="space-y-1">
              {trainingNavItems.map((item) => (
                <li key={item.path}>
                  <Link href={item.path}>
                    <a
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive(item.path)
                          ? 'bg-lea-charcoal text-lea-white'
                          : 'text-lea-dark-grey hover:bg-lea-light-grey'
                      }`}
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <i className={`${item.icon} mr-3`}></i>
                      {item.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-xs font-serif font-semibold text-lea-charcoal uppercase tracking-wider mt-8 mb-3">
              Accreditation
            </h3>
            <ul className="space-y-1">
              {accreditationNavItems.map((item) => (
                <li key={item.path}>
                  <Link href={item.path}>
                    <a
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive(item.path)
                          ? 'bg-lea-charcoal text-lea-white'
                          : 'text-lea-dark-grey hover:bg-lea-light-grey'
                      }`}
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <i className={`${item.icon} mr-3`}></i>
                      {item.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
