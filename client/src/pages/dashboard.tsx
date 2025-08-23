import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import StatsCards from "@/components/dashboard/stats-cards";
import Schedule from "@/components/dashboard/schedule";
import ClientActivity from "@/components/dashboard/client-activity";
import ComplianceWidget from "@/components/dashboard/compliance-widget";
import CPDTracker from "@/components/dashboard/cpd-tracker";
import QuickActions from "@/components/dashboard/quick-actions";

// Tab Content Components
const BookingsContent = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  
  // Mock bookings data
  const bookings = [
    {
      id: '1',
      clientName: 'Sarah Johnson',
      treatment: 'Botox Consultation',
      date: '2025-08-23',
      time: '10:00',
      duration: 60,
      status: 'confirmed',
      price: '£250'
    },
    {
      id: '2',
      clientName: 'Emma Wilson',
      treatment: 'Dermal Fillers',
      date: '2025-08-23',
      time: '14:30',
      duration: 90,
      status: 'pending',
      price: '£350'
    },
    {
      id: '3',
      clientName: 'Michael Brown',
      treatment: 'Skin Assessment',
      date: '2025-08-24',
      time: '09:00',
      duration: 45,
      status: 'confirmed',
      price: '£150'
    }
  ];

  const todayBookings = bookings.filter(booking => 
    new Date(booking.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal mb-2">Bookings Management</h2>
          <p className="text-lea-charcoal-grey">Manage your appointments and schedule</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex bg-lea-platinum-white rounded-lg p-1 border border-lea-silver-grey">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'calendar' 
                  ? 'bg-lea-elegant-silver text-lea-deep-charcoal shadow-sm' 
                  : 'text-lea-charcoal-grey hover:text-lea-deep-charcoal'
              }`}
            >
              <i className="fas fa-calendar mr-2"></i>Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-lea-elegant-silver text-lea-deep-charcoal shadow-sm' 
                  : 'text-lea-charcoal-grey hover:text-lea-deep-charcoal'
              }`}
            >
              <i className="fas fa-list mr-2"></i>List
            </button>
          </div>
          <Button 
            onClick={() => setShowNewBooking(true)}
            className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal"
          >
            <i className="fas fa-plus mr-2"></i>New Booking
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Statistics Cards */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-lea-clinical-blue/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-calendar-day text-lea-clinical-blue"></i>
                </div>
                <div>
                  <p className="text-sm text-lea-charcoal-grey">Today's Bookings</p>
                  <p className="text-xl font-bold text-lea-deep-charcoal">{todayBookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-lea-elegant-silver/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-clock text-lea-elegant-silver"></i>
                </div>
                <div>
                  <p className="text-sm text-lea-charcoal-grey">Pending Confirmations</p>
                  <p className="text-xl font-bold text-lea-deep-charcoal">
                    {bookings.filter(b => b.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-check-circle text-green-600"></i>
                </div>
                <div>
                  <p className="text-sm text-lea-charcoal-grey">Confirmed</p>
                  <p className="text-xl font-bold text-lea-deep-charcoal">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-lea-deep-charcoal/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-pound-sign text-lea-deep-charcoal"></i>
                </div>
                <div>
                  <p className="text-sm text-lea-charcoal-grey">Today's Revenue</p>
                  <p className="text-xl font-bold text-lea-deep-charcoal">£600</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {viewMode === 'calendar' ? (
            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal font-serif">Appointment Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mini Calendar */}
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-lea-silver-grey mx-auto"
                  />
                  
                  {/* Selected Date Appointments */}
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-lea-deep-charcoal mb-4">
                      Appointments for {selectedDate?.toLocaleDateString()}
                    </h4>
                    <div className="space-y-3">
                      {bookings
                        .filter(booking => 
                          selectedDate && new Date(booking.date).toDateString() === selectedDate.toDateString()
                        )
                        .map(booking => (
                          <div key={booking.id} className="flex items-center justify-between p-3 bg-lea-pearl-white rounded-lg border border-lea-silver-grey">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-8 bg-lea-clinical-blue rounded-full"></div>
                              <div>
                                <p className="font-medium text-lea-deep-charcoal">{booking.clientName}</p>
                                <p className="text-sm text-lea-charcoal-grey">{booking.treatment}</p>
                                <p className="text-sm text-lea-slate-grey">{booking.time} ({booking.duration}min)</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={`${
                                booking.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800 border-green-200' 
                                  : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              }`}>
                                {booking.status}
                              </Badge>
                              <Button size="sm" variant="ghost">
                                <i className="fas fa-edit"></i>
                              </Button>
                            </div>
                          </div>
                        ))}
                      {bookings.filter(booking => 
                        selectedDate && new Date(booking.date).toDateString() === selectedDate.toDateString()
                      ).length === 0 && (
                        <p className="text-center text-lea-charcoal-grey py-4">No appointments scheduled for this date</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal font-serif">All Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-lea-silver-grey rounded-lg hover:shadow-lea-subtle transition-all duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-lea-clinical-blue/10 rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-lea-clinical-blue"></i>
                        </div>
                        <div>
                          <p className="font-medium text-lea-deep-charcoal">{booking.clientName}</p>
                          <p className="text-sm text-lea-charcoal-grey">{booking.treatment}</p>
                          <p className="text-sm text-lea-slate-grey">
                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium text-lea-deep-charcoal">{booking.price}</p>
                          <p className="text-sm text-lea-charcoal-grey">{booking.duration} mins</p>
                        </div>
                        <Badge className={`${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}>
                          {booking.status}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost">
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif text-lg">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayBookings.map(booking => (
                  <div key={booking.id} className="flex items-center space-x-3 p-2 rounded-lg bg-lea-pearl-white">
                    <div className="w-2 h-2 bg-lea-clinical-blue rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-lea-deep-charcoal">{booking.time}</p>
                      <p className="text-xs text-lea-charcoal-grey">{booking.clientName}</p>
                    </div>
                  </div>
                ))}
                {todayBookings.length === 0 && (
                  <p className="text-sm text-lea-charcoal-grey text-center py-4">No appointments today</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button size="sm" variant="ghost" className="w-full justify-start text-lea-charcoal-grey hover:text-lea-deep-charcoal">
                  <i className="fas fa-plus mr-2 text-lea-clinical-blue"></i>
                  New Appointment
                </Button>
                <Button size="sm" variant="ghost" className="w-full justify-start text-lea-charcoal-grey hover:text-lea-deep-charcoal">
                  <i className="fas fa-calendar-check mr-2 text-lea-elegant-silver"></i>
                  View Calendar
                </Button>
                <Button size="sm" variant="ghost" className="w-full justify-start text-lea-charcoal-grey hover:text-lea-deep-charcoal">
                  <i className="fas fa-clock mr-2 text-lea-deep-charcoal"></i>
                  Reschedule
                </Button>
                <Button size="sm" variant="ghost" className="w-full justify-start text-lea-charcoal-grey hover:text-lea-deep-charcoal">
                  <i className="fas fa-download mr-2 text-lea-clinical-blue"></i>
                  Export Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

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
        
        <main className={`flex-1 overflow-y-auto ${isMobile ? 'w-full mobile-main-content' : ''}`}>
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
