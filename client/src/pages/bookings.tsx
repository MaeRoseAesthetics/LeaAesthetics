import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  Download,
  RefreshCw,
  Eye,
  MessageSquare
} from "lucide-react";

const bookingSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  treatmentId: z.string().min(1, "Treatment is required"),
  scheduledDate: z.date(),
  scheduledTime: z.string().min(1, "Time is required"),
  duration: z.number().min(15, "Duration must be at least 15 minutes"),
  notes: z.string().optional(),
  specialRequirements: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface Booking {
  id: string;
  clientId: string;
  treatmentId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  treatmentName: string;
  scheduledDate: string;
  duration: number;
  status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show";
  notes?: string;
  specialRequirements?: string;
  createdAt: string;
  updatedAt: string;
}

interface Treatment {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30"
];

export default function Bookings() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const [activeView, setActiveView] = useState<"calendar" | "list" | "timeline">("calendar");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  // Fetch data
  const { data: bookings = [], isLoading: bookingsLoading, refetch: refetchBookings } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    enabled: isAuthenticated,
  });

  const { data: treatments = [] } = useQuery<Treatment[]>({
    queryKey: ["/api/treatments"],
    enabled: isAuthenticated,
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    enabled: isAuthenticated,
  });

  // Form handling
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      duration: 60,
      scheduledDate: new Date(),
    },
  });

  const watchedTreatmentId = watch("treatmentId");

  // Auto-set duration when treatment changes
  useEffect(() => {
    if (watchedTreatmentId) {
      const treatment = treatments.find(t => t.id === watchedTreatmentId);
      if (treatment) {
        setValue("duration", treatment.duration);
      }
    }
  }, [watchedTreatmentId, treatments, setValue]);

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !searchTerm || 
      booking.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.treatmentName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get bookings for selected date
  const selectedDateBookings = filteredBookings.filter(booking =>
    isSameDay(parseISO(booking.scheduledDate), selectedDate)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddNew = useCallback(() => {
    setEditingBooking(null);
    reset({
      clientId: "",
      treatmentId: "",
      scheduledDate: selectedDate,
      scheduledTime: "10:00",
      duration: 60,
      notes: "",
      specialRequirements: "",
    });
    setIsBookingDialogOpen(true);
  }, [reset, selectedDate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lea-pearl-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-lea-elegant-silver border-t-lea-deep-charcoal rounded-full" />
          <p className="text-lea-charcoal-grey font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lea-pearl-white">
      {/* Header */}
      <div className="bg-lea-platinum-white border-b border-lea-silver-grey">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-lea-deep-charcoal">
                Bookings Management
              </h1>
              <p className="text-lea-charcoal-grey mt-1">
                Schedule and manage all treatment appointments
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => refetchBookings()}
                className="border-lea-silver-grey text-lea-charcoal-grey hover:bg-lea-pearl-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={handleAddNew}
                className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Booking
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-lea-clinical-blue rounded-lg flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5 text-lea-platinum-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-lea-charcoal-grey">Today's Bookings</p>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">
                    {bookings.filter(b => isSameDay(parseISO(b.scheduledDate), new Date())).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-lea-elegant-silver rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-lea-deep-charcoal" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-lea-charcoal-grey">Upcoming</p>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">
                    {bookings.filter(b => parseISO(b.scheduledDate) > new Date() && ['scheduled', 'confirmed'].includes(b.status)).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-lea-charcoal-grey">Completed</p>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">
                    {bookings.filter(b => b.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-lea-deep-charcoal rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-lea-platinum-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-lea-charcoal-grey">Total Clients</p>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">{clients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lea-charcoal-grey w-4 h-4" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar and Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-1 border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border border-lea-silver-grey"
              />
            </CardContent>
          </Card>

          {/* Selected Date Bookings */}
          <Card className="lg:col-span-3 border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif">
                Bookings for {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                {selectedDateBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-12 h-12 text-lea-charcoal-grey mx-auto mb-4" />
                    <p className="text-lea-charcoal-grey">No bookings scheduled for this date</p>
                    <Button onClick={handleAddNew} className="mt-4" variant="outline">
                      Schedule Appointment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateBookings
                      .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
                      .map((booking) => (
                        <Card key={booking.id} className="border border-lea-silver-grey hover:shadow-lea-card-hover transition-all duration-300">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  <div className="w-12 h-12 bg-lea-clinical-blue rounded-full flex items-center justify-center">
                                    <span className="text-lea-platinum-white font-medium text-sm">
                                      {format(parseISO(booking.scheduledDate), "HH:mm")}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium text-lea-deep-charcoal">{booking.clientName || 'Unknown Client'}</h4>
                                  <p className="text-sm text-lea-charcoal-grey">{booking.treatmentName || 'Treatment'}</p>
                                  <p className="text-xs text-lea-slate-grey flex items-center mt-1">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {booking.duration} minutes
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(booking.status)}>
                                  <span>{booking.status.replace('_', ' ')}</span>
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Form Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBooking ? "Edit Booking" : "New Booking"}
            </DialogTitle>
          </DialogHeader>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientId">Client *</Label>
                <Select onValueChange={(value) => setValue("clientId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.firstName} {client.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="treatmentId">Treatment *</Label>
                <Select onValueChange={(value) => setValue("treatmentId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select treatment" />
                  </SelectTrigger>
                  <SelectContent>
                    {treatments.map((treatment) => (
                      <SelectItem key={treatment.id} value={treatment.id}>
                        {treatment.name} ({treatment.duration} min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsBookingDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal"
              >
                {isSubmitting ? "Saving..." : editingBooking ? "Update Booking" : "Create Booking"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
