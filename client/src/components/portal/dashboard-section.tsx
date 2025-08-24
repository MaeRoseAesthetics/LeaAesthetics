import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";

interface DashboardSectionProps {
  mode: 'treatments' | 'training';
}

export default function DashboardSection({ mode }: DashboardSectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock data - in real app, this would come from API
  const mockTreatmentsData = {
    todayBookings: 8,
    weekRevenue: 2450,
    monthlyClients: 124,
    pendingConsents: 3,
    todayAppointments: [
      { time: '10:00', client: 'Sarah Johnson', treatment: 'Botox Consultation' },
      { time: '11:30', client: 'Emma Wilson', treatment: 'Dermal Fillers' },
      { time: '14:00', client: 'Michael Brown', treatment: 'Skin Assessment' },
    ]
  };

  const mockTrainingData = {
    activeStudents: 24,
    coursesRunning: 3,
    completionRate: 87,
    upcomingAssessments: 5,
    recentActivity: [
      { student: 'Alice Cooper', activity: 'Completed Module 3', time: '2 hours ago' },
      { student: 'James Wilson', activity: 'Submitted Assignment', time: '4 hours ago' },
      { student: 'Lisa Parker', activity: 'Booked OSCE Assessment', time: '6 hours ago' },
    ]
  };

  const data = mode === 'treatments' ? mockTreatmentsData : mockTrainingData;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-serif font-bold text-lea-deep-charcoal">
            {mode === 'treatments' ? 'Practice Dashboard' : 'Training Dashboard'}
          </h2>
          <p className="text-lea-charcoal-grey mt-1">
            {mode === 'treatments' 
              ? 'Welcome back! Here\'s your practice overview'
              : 'Manage your courses and track student progress'
            }
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm text-lea-charcoal-grey">Today</p>
            <p className="text-lg font-medium text-lea-deep-charcoal">
              {new Date().toLocaleDateString('en-GB', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mode === 'treatments' ? (
          <>
            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-lea-clinical-blue/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-calendar-day text-lea-clinical-blue"></i>
                  </div>
                  <div>
                    <p className="text-sm text-lea-charcoal-grey">Today</p>
                    <p className="text-xl lg:text-2xl font-bold text-lea-deep-charcoal">
                      {mockTreatmentsData.todayBookings}
                    </p>
                    <p className="text-xs text-lea-charcoal-grey">bookings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-pound-sign text-green-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-lea-charcoal-grey">This Week</p>
                    <p className="text-xl lg:text-2xl font-bold text-lea-deep-charcoal">
                      £{mockTreatmentsData.weekRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-lea-charcoal-grey">revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-lea-elegant-silver/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-users text-lea-elegant-silver"></i>
                  </div>
                  <div>
                    <p className="text-sm text-lea-charcoal-grey">This Month</p>
                    <p className="text-xl lg:text-2xl font-bold text-lea-deep-charcoal">
                      {mockTreatmentsData.monthlyClients}
                    </p>
                    <p className="text-xs text-lea-charcoal-grey">clients</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-file-signature text-amber-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-lea-charcoal-grey">Pending</p>
                    <p className="text-xl lg:text-2xl font-bold text-lea-deep-charcoal">
                      {mockTreatmentsData.pendingConsents}
                    </p>
                    <p className="text-xs text-lea-charcoal-grey">consents</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-lea-clinical-blue/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user-graduate text-lea-clinical-blue"></i>
                  </div>
                  <div>
                    <p className="text-sm text-lea-charcoal-grey">Active</p>
                    <p className="text-xl lg:text-2xl font-bold text-lea-deep-charcoal">
                      {mockTrainingData.activeStudents}
                    </p>
                    <p className="text-xs text-lea-charcoal-grey">students</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-lea-elegant-silver/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-graduation-cap text-lea-elegant-silver"></i>
                  </div>
                  <div>
                    <p className="text-sm text-lea-charcoal-grey">Running</p>
                    <p className="text-xl lg:text-2xl font-bold text-lea-deep-charcoal">
                      {mockTrainingData.coursesRunning}
                    </p>
                    <p className="text-xs text-lea-charcoal-grey">courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-chart-line text-green-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-lea-charcoal-grey">Completion</p>
                    <p className="text-xl lg:text-2xl font-bold text-lea-deep-charcoal">
                      {mockTrainingData.completionRate}%
                    </p>
                    <p className="text-xs text-lea-charcoal-grey">rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-clipboard-check text-amber-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-lea-charcoal-grey">Upcoming</p>
                    <p className="text-xl lg:text-2xl font-bold text-lea-deep-charcoal">
                      {mockTrainingData.upcomingAssessments}
                    </p>
                    <p className="text-xs text-lea-charcoal-grey">assessments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule / Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif">
                {mode === 'treatments' ? 'Today\'s Schedule' : 'Recent Activity'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mode === 'treatments' ? (
                mockTreatmentsData.todayAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-lea-pearl-white rounded-lg">
                    <div className="w-16 text-center">
                      <div className="text-lg font-bold text-lea-deep-charcoal">{appointment.time}</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-lea-deep-charcoal">{appointment.client}</div>
                      <div className="text-sm text-lea-charcoal-grey">{appointment.treatment}</div>
                    </div>
                    <Badge variant="outline" className="border-lea-clinical-blue text-lea-clinical-blue">
                      Confirmed
                    </Badge>
                  </div>
                ))
              ) : (
                mockTrainingData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-lea-pearl-white rounded-lg">
                    <div className="w-10 h-10 bg-lea-clinical-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-user-graduate text-lea-clinical-blue text-sm"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-lea-deep-charcoal">{activity.student}</div>
                      <div className="text-sm text-lea-charcoal-grey truncate">{activity.activity}</div>
                    </div>
                    <div className="text-xs text-lea-charcoal-grey whitespace-nowrap">
                      {activity.time}
                    </div>
                  </div>
                ))
              )}
              
              {mode === 'treatments' && mockTreatmentsData.todayAppointments.length === 0 && (
                <div className="text-center py-8 text-lea-charcoal-grey">
                  <i className="fas fa-calendar-day text-4xl mb-4 text-lea-elegant-silver"></i>
                  <p>No appointments scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Calendar / Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border border-lea-silver-grey mx-auto"
              />
            </CardContent>
          </Card>

          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mode === 'treatments' ? (
                <>
                  <Button className="w-full justify-start bg-lea-deep-charcoal hover:bg-lea-elegant-charcoal text-lea-platinum-white">
                    <i className="fas fa-plus mr-2"></i>New Booking
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-lea-silver-grey hover:bg-lea-pearl-white">
                    <i className="fas fa-user-plus mr-2"></i>Add Client
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-lea-silver-grey hover:bg-lea-pearl-white">
                    <i className="fas fa-file-medical mr-2"></i>New Treatment
                  </Button>
                </>
              ) : (
                <>
                  <Button className="w-full justify-start bg-lea-deep-charcoal hover:bg-lea-elegant-charcoal text-lea-platinum-white">
                    <i className="fas fa-user-graduate mr-2"></i>Enrol Student
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-lea-silver-grey hover:bg-lea-pearl-white">
                    <i className="fas fa-graduation-cap mr-2"></i>Create Course
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-lea-silver-grey hover:bg-lea-pearl-white">
                    <i className="fas fa-clipboard-check mr-2"></i>Schedule Assessment
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
