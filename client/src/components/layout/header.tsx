import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [activeMode, setActiveMode] = useState<'treatments' | 'training'>('treatments');

  const handleModeSwitch = (mode: 'treatments' | 'training') => {
    setActiveMode(mode);
    // TODO: Implement mode switching logic
  };

  if (!isAuthenticated) return null;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-serif font-bold text-maerose-gold tracking-wide" data-testid="text-app-title">
                MaeRose
              </h1>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {/* Mode Toggle */}
                <div className="bg-maerose-cream rounded-lg p-1 flex border border-maerose-gold/20">
                  <button
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      activeMode === 'treatments'
                        ? 'bg-maerose-forest text-maerose-cream'
                        : 'text-maerose-forest hover:text-maerose-burgundy'
                    }`}
                    onClick={() => handleModeSwitch('treatments')}
                    data-testid="button-switch-treatments"
                  >
                    <i className="fas fa-rose mr-1"></i> Treatments
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      activeMode === 'training'
                        ? 'bg-maerose-forest text-maerose-cream'
                        : 'text-maerose-forest hover:text-maerose-burgundy'
                    }`}
                    onClick={() => handleModeSwitch('training')}
                    data-testid="button-switch-training"
                  >
                    <i className="fas fa-graduation-cap mr-1"></i> Training
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button 
              className="p-2 text-gray-400 hover:text-gray-500 relative"
              data-testid="button-notifications"
            >
              <i className="fas fa-bell"></i>
              <Badge className="absolute -top-1 -right-1 bg-maerose-burgundy text-white text-xs px-1.5 py-0.5">
                3
              </Badge>
              <span className="sr-only">Notifications</span>
            </button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-md p-2">
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={user?.profileImageUrl || "/api/placeholder/32/32"}
                    alt="Profile"
                    data-testid="img-profile"
                  />
                  <div className="hidden md:block text-left">
                    <span className="text-sm font-medium text-gray-900" data-testid="text-user-name">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.email || 'User'
                      }
                    </span>
                    <div className="text-xs text-gray-500">Practitioner</div>
                  </div>
                  <i className="fas fa-chevron-down text-xs text-gray-400"></i>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem data-testid="menu-profile">
                  <i className="fas fa-user mr-2"></i>
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-practice">
                  <i className="fas fa-clinic-medical mr-2"></i>
                  Practice Settings
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-notifications">
                  <i className="fas fa-bell mr-2"></i>
                  Notification Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-testid="menu-compliance">
                  <i className="fas fa-shield-alt mr-2"></i>
                  Compliance Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-help">
                  <i className="fas fa-question-circle mr-2"></i>
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/api/logout" data-testid="menu-logout">
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Sign Out
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
