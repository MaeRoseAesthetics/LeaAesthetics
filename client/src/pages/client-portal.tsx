import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useState, useCallback } from "react";

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

  // Handle button clicks to prevent navigation
  const handleTreatmentBooking = useCallback((treatmentId: string) => {
    console.log('Book treatment:', treatmentId);
    setSelectedTreatment(treatmentId);
    setShowBookingDialog(true);
  }, []);

  const handleQuickAction = useCallback((action: string) => {
    console.log('Quick action:', action);
    // Add your quick action logic here
  }, []);

  return (
    <div className="min-h-screen bg-lea-pearl-white">
      {/* Header */}
      <header className="bg-lea-platinum-grey/95 backdrop-blur-lg border-b border-lea-warm-grey shadow-lea-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-lea-elegant-silver via-lea-elegant-silver to-gray-500 rounded-lg flex items-center justify-center">
                <span className="text-lea-deep-charcoal font-bold text-lg font-serif">L</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-serif font-bold text-lea-deep-charcoal tracking-tight leading-none">
                  LEA AESTHETICS
                </h1>
                <p className="text-xs font-medium text-lea-charcoal-grey tracking-wider uppercase">
                  Client Portal
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-lea-deep-charcoal">Welcome back, {clientData.name}</p>
                <p className="text-xs text-lea-charcoal-grey">Your aesthetic journey continues</p>
              </div>
              <Button variant="outline" size="sm" className="border-lea-deep-charcoal text-lea-deep-charcoal hover:bg-lea-deep-charcoal hover:text-lea-platinum-white transition-all duration-300">
                <i className="fas fa-sign-out-alt mr-2"></i>Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8 order-2 lg:order-1">
            {/* Welcome Section */}
            <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-lea-elegant-silver rounded-lg flex items-center justify-center">
                    <i className="fas fa-sparkles text-lea-deep-charcoal text-sm"></i>
                  </div>
                  <CardTitle className="text-lea-deep-charcoal font-serif text-xl">
                    Your Aesthetic Journey
                  </CardTitle>
                </div>
                <div className="h-px bg-gradient-to-r from-lea-elegant-silver/30 to-transparent w-32"></div>
              </CardHeader>
              <CardContent>
                <p className="text-lea-charcoal-grey mb-6 leading-relaxed">
                  Experience seamless treatment booking and personalized care management. Your journey to aesthetic excellence begins here.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button onClick={() => setShowBookingDialog(true)} className="h-12 md:h-14 bg-lea-elegant-silver text-lea-deep-charcoal hover:bg-opacity-90 transition-all duration-300 font-medium">
                    <i className="fas fa-calendar-plus mr-2 md:mr-3"></i>
                    <span className="text-sm md:text-base">Schedule Treatment</span>
                  </Button>
                  <Button variant="outline" className="h-12 md:h-14 border-lea-silver-grey text-lea-charcoal-grey hover:bg-lea-pearl-white transition-all duration-300">
                    <i className="fas fa-history mr-2 md:mr-3"></i>
                    <span className="text-sm md:text-base">Treatment History</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Available Treatments */}
            <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-lea-clinical-blue rounded-lg flex items-center justify-center">
                    <i className="fas fa-spa text-lea-platinum-white text-sm"></i>
                  </div>
                  <CardTitle className="text-lea-deep-charcoal font-serif text-xl">
                    Premium Treatments
                  </CardTitle>
                </div>
                <div className="h-px bg-gradient-to-r from-lea-clinical-blue/30 to-transparent w-32"></div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {treatments.map((treatment: any) => (
                    <Card key={treatment.id} className="border border-lea-silver-grey hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base md:text-lg text-lea-deep-charcoal font-serif">{treatment.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-lea-charcoal-grey mb-4 leading-relaxed">{treatment.description}</p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xl md:text-2xl font-bold text-lea-elegant-silver">£{treatment.price}</span>
                          <span className="text-xs md:text-sm text-lea-slate-grey bg-lea-pearl-white px-2 md:px-3 py-1 rounded-full">{treatment.duration} mins</span>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal transition-all duration-300 font-medium"
                          onClick={() => handleTreatmentBooking(treatment.id)}
                        >
                          Reserve Treatment
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Appointments */}
            <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-lea-deep-charcoal rounded-lg flex items-center justify-center">
                    <i className="fas fa-clock text-lea-platinum-white text-sm"></i>
                  </div>
                  <CardTitle className="text-lea-deep-charcoal font-serif text-xl">
                    Recent Appointments
                  </CardTitle>
                </div>
                <div className="h-px bg-gradient-to-r from-lea-deep-charcoal/30 to-transparent w-32"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking: any) => (
                    <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-lea-pearl-white rounded-xl border border-lea-silver-grey hover:shadow-lea-subtle transition-all duration-300 gap-3 sm:gap-0">
                      <div>
                        <p className="font-medium text-lea-deep-charcoal">Treatment #{booking.treatmentId}</p>
                        <p className="text-sm text-lea-charcoal-grey">
                          {new Date(booking.scheduledDate).toLocaleDateString()} at{' '}
                          {new Date(booking.scheduledDate).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <Badge 
                        variant={booking.status === 'completed' ? 'default' : 'secondary'}
                        className={`${booking.status === 'completed' ? 'bg-lea-elegant-silver text-lea-deep-charcoal' : 'bg-lea-silver-grey text-lea-charcoal-grey'} sm:flex-shrink-0`}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
            {/* Profile Card */}
            <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
              <CardHeader>
                <CardTitle className="text-center text-lea-deep-charcoal font-serif">Client Profile</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-16 h-16 bg-lea-elegant-silver rounded-full flex items-center justify-center mx-auto mb-4 shadow-lea-card">
                  <i className="fas fa-user text-lea-deep-charcoal text-xl"></i>
                </div>
                <h3 className="font-semibold text-lg text-lea-deep-charcoal">{clientData.name}</h3>
                <p className="text-lea-charcoal-grey text-sm mb-4">{clientData.email}</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-lea-charcoal-grey">Consent Status:</span>
                    <Badge className="bg-lea-elegant-silver/20 text-lea-deep-charcoal border-lea-elegant-silver/30">
                      <i className="fas fa-check mr-1"></i>Verified
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lea-charcoal-grey">Age Verified:</span>
                    <Badge className="bg-lea-elegant-silver/20 text-lea-deep-charcoal border-lea-elegant-silver/30">
                      <i className="fas fa-check mr-1"></i>Confirmed
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-6 w-full border-lea-silver-grey text-lea-charcoal-grey hover:bg-lea-pearl-white transition-all duration-300"
                  onClick={() => handleQuickAction('update-profile')}
                >
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            {/* Next Appointment */}
            {clientData.nextAppointment && (
              <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
                <CardHeader>
                  <CardTitle className="text-center text-lea-deep-charcoal font-serif">Next Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-14 h-14 bg-lea-clinical-blue rounded-full flex items-center justify-center mx-auto mb-4 shadow-lea-card">
                      <i className="fas fa-calendar text-lea-platinum-white text-lg"></i>
                    </div>
                    <p className="font-bold text-lea-deep-charcoal text-lg">
                      {new Date(clientData.nextAppointment).toLocaleDateString()}
                    </p>
                    <p className="text-lea-charcoal-grey">
                      {new Date(clientData.nextAppointment).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <div className="mt-6 space-y-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-lea-silver-grey text-lea-charcoal-grey hover:bg-lea-pearl-white transition-all duration-300"
                        onClick={() => handleQuickAction('reschedule-appointment')}
                      >
                        Reschedule
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-lea-error-red hover:bg-lea-error-red/10 transition-all duration-300"
                        onClick={() => handleQuickAction('cancel-appointment')}
                      >
                        Cancel Appointment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal font-serif">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-lea-charcoal-grey hover:bg-lea-pearl-white hover:text-lea-deep-charcoal transition-all duration-300"
                  onClick={() => handleQuickAction('medical-history')}
                >
                  <i className="fas fa-file-medical mr-3 text-lea-clinical-blue"></i>
                  Medical History
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-lea-charcoal-grey hover:bg-lea-pearl-white hover:text-lea-deep-charcoal transition-all duration-300"
                  onClick={() => handleQuickAction('consent-forms')}
                >
                  <i className="fas fa-file-signature mr-3 text-lea-elegant-silver"></i>
                  Consent Forms
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-lea-charcoal-grey hover:bg-lea-pearl-white hover:text-lea-deep-charcoal transition-all duration-300"
                  onClick={() => handleQuickAction('payment-methods')}
                >
                  <i className="fas fa-credit-card mr-3 text-lea-deep-charcoal"></i>
                  Payment Methods
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-lea-charcoal-grey hover:bg-lea-pearl-white hover:text-lea-deep-charcoal transition-all duration-300"
                  onClick={() => handleQuickAction('messages')}
                >
                  <i className="fas fa-envelope mr-3 text-lea-clinical-blue"></i>
                  Messages
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-2xl mx-4 md:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lea-deep-charcoal font-serif">Book Your Treatment</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-lea-deep-charcoal">Select Treatment</h4>
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

              <h4 className="font-medium mb-3 mt-6 text-lea-deep-charcoal">Select Time</h4>
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
              <h4 className="font-medium mb-3 text-lea-deep-charcoal">Select Date</h4>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border border-lea-silver-grey"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowBookingDialog(false)}
              className="order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBooking}
              disabled={!selectedTreatment || !selectedDate || !selectedTime}
              className="order-1 sm:order-2 bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal"
            >
              Book Appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
