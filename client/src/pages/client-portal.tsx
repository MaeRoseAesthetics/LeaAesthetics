import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export default function ClientPortal() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTreatment, setSelectedTreatment] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  // Mock client data
  const clientData = {
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+44 123 456789",
    nextAppointment: "2025-08-25T10:00:00.000Z",
    consentStatus: "signed"
  };

  const { data: treatments = [] } = useQuery({
    queryKey: ["/api/treatments"],
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["/api/bookings"],
  });

  const availableTimes = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  const handleBooking = () => {
    console.log("Booking:", { selectedDate, selectedTreatment, selectedTime });
    setShowBookingDialog(false);
    // Handle booking logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-maerose-cream via-white to-maerose-cream/50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-serif font-bold text-maerose-gold tracking-wide">MaeRose Client Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, {clientData.name}</span>
              <Button variant="outline" size="sm">
                <i className="fas fa-sign-out-alt mr-2"></i>Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-rose text-maerose-burgundy mr-3"></i>
                  Welcome to Your Treatment Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Book treatments, view your history, and manage your aesthetic journey with ease.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button onClick={() => setShowBookingDialog(true)} className="h-12">
                    <i className="fas fa-calendar-plus mr-2"></i>
                    Book New Treatment
                  </Button>
                  <Button variant="outline" className="h-12">
                    <i className="fas fa-history mr-2"></i>
                    View Treatment History
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Available Treatments */}
            <Card>
              <CardHeader>
                <CardTitle>Available Treatments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {treatments.map((treatment: any) => (
                    <Card key={treatment.id} className="border hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{treatment.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">{treatment.description}</p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-lg font-bold text-maerose-forest">£{treatment.price}</span>
                          <span className="text-sm text-gray-500">{treatment.duration} mins</span>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            setSelectedTreatment(treatment.id);
                            setShowBookingDialog(true);
                          }}
                        >
                          Book This Treatment
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Treatment #{booking.treatmentId}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.scheduledDate).toLocaleDateString()} at{' '}
                          {new Date(booking.scheduledDate).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-16 h-16 bg-maerose-burgundy rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-user text-maerose-cream text-xl"></i>
                </div>
                <h3 className="font-semibold text-lg">{clientData.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{clientData.email}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Consent Status:</span>
                    <Badge variant="default">
                      <i className="fas fa-check mr-1"></i>Signed
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Age Verified:</span>
                    <Badge variant="default">
                      <i className="fas fa-check mr-1"></i>Verified
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            {/* Next Appointment */}
            {clientData.nextAppointment && (
              <Card>
                <CardHeader>
                  <CardTitle>Next Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-maerose-gold rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="fas fa-calendar text-maerose-cream"></i>
                    </div>
                    <p className="font-medium">
                      {new Date(clientData.nextAppointment).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(clientData.nextAppointment).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <div className="mt-4 space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        Reschedule
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full text-red-600">
                        Cancel Appointment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <i className="fas fa-file-medical mr-2"></i>
                  Medical History
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <i className="fas fa-file-signature mr-2"></i>
                  Consent Forms
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <i className="fas fa-credit-card mr-2"></i>
                  Payment Methods
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <i className="fas fa-envelope mr-2"></i>
                  Messages
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Book Your Treatment</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Select Treatment</h4>
              <Select value={selectedTreatment} onValueChange={setSelectedTreatment}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a treatment" />
                </SelectTrigger>
                <SelectContent>
                  {treatments.map((treatment: any) => (
                    <SelectItem key={treatment.id} value={treatment.id}>
                      {treatment.name} - £{treatment.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <h4 className="font-medium mb-3 mt-6">Select Time</h4>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h4 className="font-medium mb-3">Select Date</h4>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBooking}
              disabled={!selectedTreatment || !selectedDate || !selectedTime}
            >
              Book Appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
