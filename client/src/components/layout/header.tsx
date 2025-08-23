import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMobileModeSwitch?: (mode: 'treatments' | 'training') => void;
  activeMode?: 'treatments' | 'training';
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export default function Header({ 
  onMobileModeSwitch, 
  activeMode = 'treatments', 
  onMobileMenuToggle,
  isMobileMenuOpen = false 
}: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const isMobile = useIsMobile();
  const [localActiveMode, setLocalActiveMode] = useState<'treatments' | 'training'>('treatments');

  const currentMode = activeMode || localActiveMode;

  const handleModeSwitch = (mode: 'treatments' | 'training') => {
    if (onMobileModeSwitch) {
      onMobileModeSwitch(mode);
    } else {
      setLocalActiveMode(mode);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <header className="bg-lea-platinum-white border-b border-lea-silver-grey sticky top-0 z-50 shadow-lea-subtle">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <div className="flex items-center flex-1">
            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={onMobileMenuToggle}
                className="p-3 mr-3 text-lea-deep-charcoal hover:bg-lea-pearl-white rounded-lg transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                data-testid="mobile-menu-toggle"
                aria-label="Toggle navigation menu"
              >
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
                <span className="sr-only">Toggle menu</span>
              </button>
            )}
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-lea-elegant-silver via-lea-elegant-silver to-gray-500 rounded-lg flex items-center justify-center shadow-lea-card flex-shrink-0">
                <span className="text-lea-deep-charcoal font-bold text-lg lg:text-xl font-serif">L</span>
              </div>
              <div className="flex flex-col min-w-0">
                <h1 className="text-base sm:text-lg lg:text-2xl font-serif font-bold text-lea-deep-charcoal tracking-tight leading-none truncate" data-testid="text-app-title">
                  {isMobile ? "LEA AESTHETICS" : "Lea Aesthetics Clinic Academy"}
                </h1>
                <p className="text-xs lg:text-sm font-medium text-lea-charcoal-grey tracking-wider hidden sm:block">
                  Practitioner Portal
                </p>
              </div>
            </div>
            
            {/* Desktop Mode Toggle */}
            {!isMobile && (
              <div className="ml-10">
                <div className="bg-lea-pearl-white rounded-lg p-1 flex border border-lea-silver-grey">
                  <button
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all min-h-[44px] ${
                      currentMode === 'treatments'
                        ? 'bg-lea-deep-charcoal text-lea-platinum-white shadow-lea-card'
                        : 'text-lea-deep-charcoal hover:bg-lea-elegant-silver/50'
                    }`}
                    onClick={() => handleModeSwitch('treatments')}
                    data-testid="button-switch-treatments"
                  >
                    <i className="fas fa-spa mr-2"></i> Treatments
                  </button>
                  <button
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all min-h-[44px] ${
                      currentMode === 'training'
                        ? 'bg-lea-deep-charcoal text-lea-platinum-white shadow-lea-card'
                        : 'text-lea-deep-charcoal hover:bg-lea-elegant-silver/50'
                    }`}
                    onClick={() => handleModeSwitch('training')}
                    data-testid="button-switch-training"
                  >
                    <i className="fas fa-graduation-cap mr-2"></i> Training
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Notifications */}
            <button 
              className="p-2 lg:p-3 text-lea-charcoal-grey hover:text-lea-deep-charcoal hover:bg-lea-pearl-white rounded-lg transition-colors relative min-h-[44px] min-w-[44px] flex items-center justify-center"
              data-testid="button-notifications"
            >
              <i className="fas fa-bell text-base lg:text-lg"></i>
              <Badge className="absolute -top-1 -right-1 bg-lea-clinical-blue text-lea-platinum-white text-xs px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                3
              </Badge>
              <span className="sr-only">Notifications</span>
            </button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer hover:bg-lea-pearl-white rounded-lg p-2 min-h-[44px] transition-colors">
                  <img
                    className="h-8 w-8 lg:h-10 lg:w-10 rounded-full object-cover flex-shrink-0 ring-2 ring-lea-elegant-silver/30"
                    src={user?.profileImageUrl || "/api/placeholder/32/32"}
                    alt="Profile"
                    data-testid="img-profile"
                  />
                  <div className="hidden sm:block text-left min-w-0">
                    <span className="text-sm font-medium text-lea-deep-charcoal truncate block" data-testid="text-user-name">
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
                <DropdownMenuItem data-testid="menu-profile" className="hover:bg-lea-pearl-white focus:bg-lea-pearl-white">
                  <i className="fas fa-user mr-3 text-lea-charcoal-grey"></i>
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-practice" className="hover:bg-lea-pearl-white focus:bg-lea-pearl-white">
                  <i className="fas fa-clinic-medical mr-3 text-lea-charcoal-grey"></i>
                  Practice Settings
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-notifications" className="hover:bg-lea-pearl-white focus:bg-lea-pearl-white">
                  <i className="fas fa-bell mr-3 text-lea-charcoal-grey"></i>
                  Notification Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-lea-silver-grey" />
                <DropdownMenuItem data-testid="menu-compliance" className="hover:bg-lea-pearl-white focus:bg-lea-pearl-white">
                  <i className="fas fa-shield-alt mr-3 text-lea-charcoal-grey"></i>
                  Compliance Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-help" className="hover:bg-lea-pearl-white focus:bg-lea-pearl-white">
                  <i className="fas fa-question-circle mr-3 text-lea-charcoal-grey"></i>
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-lea-silver-grey" />
                <DropdownMenuItem onClick={logout} data-testid="menu-logout" className="hover:bg-lea-error-red/10 focus:bg-lea-error-red/10 text-lea-error-red">
                  <i className="fas fa-sign-out-alt mr-3"></i>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Mobile Mode Toggle */}
        {isMobile && (
          <div className="pb-4">
            <div className="bg-lea-pearl-white rounded-lg p-1 flex border border-lea-silver-grey">
              <button
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all min-h-[44px] ${
                  currentMode === 'treatments'
                    ? 'bg-lea-deep-charcoal text-lea-platinum-white shadow-lea-card'
                    : 'text-lea-deep-charcoal hover:bg-lea-elegant-silver/50'
                }`}
                onClick={() => handleModeSwitch('treatments')}
                data-testid="button-mobile-switch-treatments"
              >
                <i className="fas fa-spa mr-2"></i> Treatments
              </button>
              <button
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all min-h-[44px] ${
                  currentMode === 'training'
                    ? 'bg-lea-deep-charcoal text-lea-platinum-white shadow-lea-card'
                    : 'text-lea-deep-charcoal hover:bg-lea-elegant-silver/50'
                }`}
                onClick={() => handleModeSwitch('training')}
                data-testid="button-mobile-switch-training"
              >
                <i className="fas fa-graduation-cap mr-2"></i> Training
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
