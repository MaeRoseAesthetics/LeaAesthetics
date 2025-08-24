import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

export default function BookingsSection() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const bookings = [
    {
      id: '1',
      clientName: 'Sarah Johnson',
      treatment: 'Botox Consultation',
      date: '2025-08-24',
      time: '10:00',
      duration: 60,
      status: 'confirmed',
      price: '£250'
    },
    {
      id: '2',
      clientName: 'Emma Wilson',
      treatment: 'Dermal Fillers',
      date: '2025-08-24',
      time: '14:30',
      duration: 90,
      status: 'pending',
      price: '£350'
    },
    {
      id: '3',
      clientName: 'Michael Brown',
      treatment: 'Skin Assessment',
      date: '2025-08-25',
      time: '09:00',
      duration: 45,
      status: 'confirmed',
      price: '£150'
    }
  ];

  const todayBookings = bookings.filter(booking => 
    new Date(booking.date).toDateString() === new Date().toDateString()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-serif font-bold text-lea-deep-charcoal">
            Bookings Management
          </h2>
          <p className="text-lea-charcoal-grey mt-1">
            Manage your appointments and schedule
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex bg-lea-platinum-white rounded-lg p-1 border border-lea-silver-grey">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 min-h-[36px] ${
                viewMode === 'calendar' 
                  ? 'bg-lea-elegant-silver text-lea-deep-charcoal shadow-sm' 
                  : 'text-lea-charcoal-grey hover:text-lea-deep-charcoal'
              }`}
            >
              <i className="fas fa-calendar mr-2"></i>Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 min-h-[36px] ${
                viewMode === 'list' 
                  ? 'bg-lea-elegant-silver text-lea-deep-charcoal shadow-sm' 
                  : 'text-lea-charcoal-grey hover:text-lea-deep-charcoal'
              }`}
            >
              <i className="fas fa-list mr-2"></i>List
            </button>
          </div>
          <Button className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal">
            <i className="fas fa-plus mr-2"></i>New Booking
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-yellow-600"></i>
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
                <p className="text-xl font-bold text-lea-deep-charcoal">£750</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Booking List/Calendar */}
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
                        .map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-4 bg-lea-pearl-white rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="text-center min-w-[60px]">
                                <div className="font-bold text-lea-deep-charcoal">{booking.time}</div>
                                <div className="text-xs text-lea-charcoal-grey">{booking.duration}min</div>
                              </div>
                              <div>
                                <div className="font-medium text-lea-deep-charcoal">{booking.clientName}</div>
                                <div className="text-sm text-lea-charcoal-grey">{booking.treatment}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <div className="font-medium text-lea-deep-charcoal">{booking.price}</div>
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status}
                                </Badge>
                              </div>
                              <Button size="sm" variant="outline" className="border-lea-silver-grey">
                                <i className="fas fa-edit"></i>
                              </Button>
                            </div>
                          </div>
                        ))
                      }
                      
                      {bookings.filter(booking => 
                        selectedDate && new Date(booking.date).toDateString() === selectedDate.toDateString()
                      ).length === 0 && (
                        <div className="text-center py-8 text-lea-charcoal-grey">
                          <i className="fas fa-calendar-day text-4xl mb-4 text-lea-elegant-silver"></i>
                          <p>No appointments scheduled for this date</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="text-lea-deep-charcoal font-serif">All Bookings</CardTitle>
                  <Input
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm border-lea-silver-grey"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookings
                    .filter(booking =>
                      booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      booking.treatment.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-lea-pearl-white rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-center min-w-[80px]">
                            <div className="font-medium text-lea-deep-charcoal">{new Date(booking.date).toLocaleDateString()}</div>
                            <div className="text-sm text-lea-charcoal-grey">{booking.time}</div>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-lea-deep-charcoal">{booking.clientName}</div>
                            <div className="text-sm text-lea-charcoal-grey">{booking.treatment}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="font-medium text-lea-deep-charcoal">{booking.price}</div>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          <Button size="sm" variant="outline" className="border-lea-silver-grey">
                            <i className="fas fa-edit"></i>
                          </Button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-lea-deep-charcoal hover:bg-lea-elegant-charcoal text-lea-platinum-white">
                <i className="fas fa-plus mr-2"></i>New Booking
              </Button>
              <Button variant="outline" className="w-full justify-start border-lea-silver-grey hover:bg-lea-pearl-white">
                <i className="fas fa-calendar-alt mr-2"></i>View Calendar
              </Button>
              <Button variant="outline" className="w-full justify-start border-lea-silver-grey hover:bg-lea-pearl-white">
                <i className="fas fa-download mr-2"></i>Export Bookings
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-lea-charcoal-grey">Sarah Johnson confirmed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-lea-charcoal-grey">New booking request</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-lea-charcoal-grey">Schedule updated</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
