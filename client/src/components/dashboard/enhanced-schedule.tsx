import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, Clock, Users, MapPin, Phone, AlertCircle, CheckCircle } from "lucide-react";

interface Booking {
  id: string;
  clientId: string;
  treatmentId: string;
  scheduledDate: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  duration: number;
  clientName?: string;
  treatmentName?: string;
  notes?: string;
  room?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  booking?: Booking;
}

export default function EnhancedSchedule() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["/api/bookings", format(selectedDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      const response = await fetch(`/api/bookings?date=${format(selectedDate, 'yyyy-MM-dd')}`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    },
  });

  const { data: availability = [] } = useQuery({
    queryKey: ["/api/availability", format(selectedDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      const response = await fetch(`/api/availability?date=${format(selectedDate, 'yyyy-MM-dd')}`);
      if (!response.ok) throw new Error('Failed to fetch availability');
      return response.json();
    },
  });

  // Generate time slots for the day (9 AM to 6 PM, 30-minute intervals)
  const timeSlots = useMemo(() => {
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const booking = bookings.find((b: Booking) => {
          const bookingTime = new Date(b.scheduledDate);
          return format(bookingTime, 'HH:mm') === time && isSameDay(bookingTime, selectedDate);
        });
        
        slots.push({
          time,
          available: !booking,
          booking
        });
      }
    }
    return slots;
  }, [bookings, selectedDate]);

  // Get week view data
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 }); // Sunday
    return eachDayOfInterval({ start, end });
  }, [selectedDate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-lea-clinical-blue text-lea-platinum-white';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTimeSlotClick = (time: string, available: boolean) => {
    if (available) {
      setSelectedTimeSlot(time);
      setShowBookingDialog(true);
    }
  };

  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update booking');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({ title: "Success", description: "Booking status updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
        <CardHeader>
          <CardTitle className="text-lea-deep-charcoal font-serif">Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-lea-pearl-white rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Schedule Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal">Schedule Management</h2>
          <p className="text-lea-charcoal-grey">Manage appointments and availability</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex bg-lea-pearl-white rounded-lg p-1 border border-lea-silver-grey">
            {(['day', 'week', 'month'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  viewMode === mode
                    ? 'bg-lea-deep-charcoal text-lea-platinum-white shadow-lea-card'
                    : 'text-lea-charcoal-grey hover:text-lea-deep-charcoal'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          <Button className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal">
            <CalendarIcon className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif text-lg">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border border-lea-silver-grey"
              />
              
              {/* Quick Stats */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-lea-charcoal-grey">Today's Appointments</span>
                  <Badge className="bg-lea-clinical-blue text-lea-platinum-white">
                    {bookings.filter((b: Booking) => isSameDay(new Date(b.scheduledDate), new Date())).length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-lea-charcoal-grey">Available Slots</span>
                  <Badge variant="outline" className="border-lea-silver-grey">
                    {timeSlots.filter(slot => slot.available).length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-lea-charcoal-grey">Pending Confirmations</span>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    {bookings.filter((b: Booking) => b.status === 'pending').length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Schedule View */}
        <div className="lg:col-span-3">
          <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lea-deep-charcoal font-serif">
                  {viewMode === 'day' && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  {viewMode === 'week' && `Week of ${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}`}
                  {viewMode === 'month' && format(selectedDate, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDate(addDays(selectedDate, -1))}>
                    ←
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDate(new Date())}>
                    Today
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
                    →
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
                <TabsContent value="day" className="mt-0">
                  {/* Day View */}
                  <div className="grid gap-2">
                    {timeSlots.map((slot) => (
                      <div
                        key={slot.time}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                          slot.available
                            ? 'border-lea-silver-grey hover:border-lea-clinical-blue cursor-pointer hover:bg-lea-pearl-white'
                            : 'border-lea-silver-grey bg-lea-pearl-white'
                        }`}
                        onClick={() => handleTimeSlotClick(slot.time, slot.available)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-16 text-sm font-medium text-lea-charcoal-grey">
                            {slot.time}
                          </div>
                          {slot.booking ? (
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-lea-clinical-blue rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-lea-platinum-white" />
                              </div>
                              <div>
                                <p className="font-medium text-lea-deep-charcoal">
                                  {slot.booking.clientName || `Client ${slot.booking.clientId.substring(0, 8)}`}
                                </p>
                                <p className="text-sm text-lea-charcoal-grey">
                                  {slot.booking.treatmentName || `Treatment ${slot.booking.treatmentId.substring(0, 8)}`}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 text-lea-charcoal-grey">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">Available</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {slot.booking && (
                            <>
                              <Badge className={getStatusColor(slot.booking.status)}>
                                {slot.booking.status}
                              </Badge>
                              <div className="flex space-x-1">
                                {slot.booking.status === 'pending' && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-green-600 hover:bg-green-50"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateBookingStatus.mutate({ id: slot.booking!.id, status: 'confirmed' });
                                    }}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-lea-clinical-blue hover:bg-lea-clinical-blue/10"
                                >
                                  <Phone className="w-4 h-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="week" className="mt-0">
                  {/* Week View */}
                  <div className="grid grid-cols-8 gap-2">
                    {/* Time column */}
                    <div className="space-y-12">
                      <div className="h-8"></div>
                      {Array.from({ length: 9 }, (_, i) => (
                        <div key={i} className="text-xs text-lea-charcoal-grey h-8 flex items-center">
                          {String(9 + i).padStart(2, '0')}:00
                        </div>
                      ))}
                    </div>
                    
                    {/* Days columns */}
                    {weekDays.map((day) => (
                      <div key={day.toISOString()} className="space-y-2">
                        <div className="text-center py-2">
                          <div className="text-sm font-medium text-lea-deep-charcoal">
                            {format(day, 'EEE')}
                          </div>
                          <div className={`text-lg font-bold ${
                            isSameDay(day, new Date())
                              ? 'text-lea-clinical-blue'
                              : 'text-lea-charcoal-grey'
                          }`}>
                            {format(day, 'd')}
                          </div>
                        </div>
                        {/* Day's appointments would be rendered here */}
                        <div className="space-y-1">
                          {bookings
                            .filter((booking: Booking) => isSameDay(new Date(booking.scheduledDate), day))
                            .map((booking: Booking) => (
                              <div
                                key={booking.id}
                                className="p-2 bg-lea-clinical-blue/10 border-l-2 border-lea-clinical-blue rounded text-xs"
                              >
                                <div className="font-medium text-lea-deep-charcoal">
                                  {format(new Date(booking.scheduledDate), 'HH:mm')}
                                </div>
                                <div className="text-lea-charcoal-grey truncate">
                                  {booking.clientName || 'Client'}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="month" className="mt-0">
                  {/* Month View - Simplified calendar grid */}
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-lea-charcoal-grey mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">Month View</h3>
                    <p className="text-lea-charcoal-grey">
                      Month view with appointment overview coming soon
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lea-deep-charcoal font-serif">Quick Book Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Date & Time</Label>
              <div className="text-sm text-lea-charcoal-grey">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTimeSlot}
              </div>
            </div>
            <div>
              <Label>Client</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client1">John Doe</SelectItem>
                  <SelectItem value="client2">Jane Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Treatment</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select treatment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facial">Facial Treatment</SelectItem>
                  <SelectItem value="botox">Botox</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
                Cancel
              </Button>
              <Button className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal">
                Book Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
