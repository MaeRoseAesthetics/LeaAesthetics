import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar as CalendarIcon,
  Clock,
  Star,
  Download,
  Upload,
  MessageCircle,
  CreditCard,
  FileText,
  Phone,
  Mail,
  MapPin,
  Heart,
  Shield,
  Camera,
  User,
  Settings,
  Bell,
  History,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Plus,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";

interface Treatment {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

interface Booking {
  id: string;
  treatmentId: string;
  treatment: Treatment;
  scheduledDate: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  practitionerName: string;
  beforePhotos: string[];
  afterPhotos: string[];
  satisfactionRating?: number;
  followUpDate?: string;
}

interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  profileImageUrl?: string;
  membershipTier: 'basic' | 'premium' | 'vip';
  totalSpent: number;
  loyaltyPoints: number;
  nextAppointment?: Booking;
  consentStatus: string;
  ageVerified: boolean;
  preferredPractitioner?: string;
  communicationPreferences: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface TreatmentPlan {
  id: string;
  name: string;
  treatments: Treatment[];
  totalCost: number;
  estimatedSessions: number;
  progress: number;
  startDate: string;
  targetCompletionDate: string;
  status: 'active' | 'paused' | 'completed';
}

export default function EnhancedClientPortal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTreatment, setSelectedTreatment] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showMessagingDialog, setShowMessagingDialog] = useState(false);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data - replace with real API calls
  const clientData: ClientData = {
    id: "client-123",
    firstName: "Emma",
    lastName: "Thompson",
    email: "emma.thompson@email.com",
    phone: "+44 7700 900123",
    dateOfBirth: "1990-05-15",
    membershipTier: "premium",
    totalSpent: 3450.00,
    loyaltyPoints: 345,
    consentStatus: "signed",
    ageVerified: true,
    preferredPractitioner: "Dr. Sarah Wilson",
    communicationPreferences: ["email", "sms"],
    emergencyContact: {
      name: "James Thompson",
      phone: "+44 7700 900124",
      relationship: "Spouse"
    }
  };

  const { data: treatments = [] } = useQuery<Treatment[]>({
    queryKey: ["/api/treatments"],
    initialData: [
      {
        id: "1",
        name: "Botox Consultation & Treatment",
        description: "Anti-wrinkle injections for forehead and crow's feet",
        price: 350,
        duration: 60,
        category: "Anti-aging"
      },
      {
        id: "2", 
        name: "Dermal Fillers - Lips",
        description: "Lip enhancement with hyaluronic acid fillers",
        price: 450,
        duration: 75,
        category: "Enhancement"
      },
      {
        id: "3",
        name: "Chemical Peel",
        description: "Professional skin resurfacing treatment",
        price: 180,
        duration: 45,
        category: "Skin Care"
      }
    ]
  });

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    initialData: [
      {
        id: "booking-1",
        treatmentId: "1",
        treatment: treatments[0],
        scheduledDate: addDays(new Date(), 7).toISOString(),
        status: "confirmed",
        practitionerName: "Dr. Sarah Wilson",
        beforePhotos: [],
        afterPhotos: []
      },
      {
        id: "booking-2", 
        treatmentId: "2",
        treatment: treatments[1],
        scheduledDate: subDays(new Date(), 30).toISOString(),
        status: "completed",
        practitionerName: "Dr. Sarah Wilson",
        satisfactionRating: 5,
        beforePhotos: ["/api/photos/before-1.jpg"],
        afterPhotos: ["/api/photos/after-1.jpg"]
      }
    ]
  });

  const { data: treatmentPlans = [] } = useQuery<TreatmentPlan[]>({
    queryKey: ["/api/treatment-plans"],
    initialData: [
      {
        id: "plan-1",
        name: "Complete Facial Rejuvenation",
        treatments: treatments.slice(0, 2),
        totalCost: 1200,
        estimatedSessions: 4,
        progress: 50,
        startDate: new Date().toISOString(),
        targetCompletionDate: addDays(new Date(), 90).toISOString(),
        status: "active"
      }
    ]
  });

  const availableTimes = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  const upcomingBookings = bookings.filter(b => new Date(b.scheduledDate) > new Date() && b.status !== 'cancelled');
  const pastBookings = bookings.filter(b => new Date(b.scheduledDate) < new Date() || b.status === 'completed');

  const handleBooking = useCallback(() => {
    if (!selectedTreatment || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select treatment, date, and time",
        variant: "destructive",
      });
      return;
    }

    // Mock booking creation
    toast({
      title: "Booking Request Sent!",
      description: "We'll confirm your appointment within 2 hours",
    });
    
    setShowBookingDialog(false);
    // Reset form
    setSelectedTreatment("");
    setSelectedDate(new Date());
    setSelectedTime("");
  }, [selectedTreatment, selectedDate, selectedTime, toast]);

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim()) return;

    // Mock message sending
    toast({
      title: "Message Sent",
      description: "Your message has been sent to your practitioner",
    });
    
    setNewMessage("");
    setShowMessagingDialog(false);
  }, [newMessage, toast]);

  const handleDocumentUpload = useCallback(() => {
    if (!selectedFiles) return;

    // Mock document upload
    toast({
      title: "Documents Uploaded",
      description: `${selectedFiles.length} file(s) uploaded successfully`,
    });
    
    setSelectedFiles(null);
    setShowDocumentDialog(false);
  }, [selectedFiles, toast]);

  const getMembershipBadge = () => {
    switch (clientData.membershipTier) {
      case 'vip':
        return <Badge className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white">VIP Member</Badge>;
      case 'premium':
        return <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Premium Member</Badge>;
      default:
        return <Badge variant="outline">Basic Member</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-purple-600 bg-purple-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lea-pearl-white to-lea-platinum-grey/30">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-lea-silver-grey shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-lea-clinical-blue to-lea-elegant-silver rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold text-lea-deep-charcoal">
                  LEA AESTHETICS
                </h1>
                <p className="text-sm text-lea-charcoal-grey">Client Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </Button>
              
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-lea-deep-charcoal">
                    {clientData.firstName} {clientData.lastName}
                  </p>
                  <div className="flex items-center gap-2">
                    {getMembershipBadge()}
                  </div>
                </div>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={clientData.profileImageUrl} />
                  <AvatarFallback className="bg-lea-clinical-blue text-white">
                    {clientData.firstName[0]}{clientData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Enhanced Navigation */}
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-lg border-0 p-2 rounded-xl">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-lea-clinical-blue data-[state=active]:to-lea-elegant-silver data-[state=active]:text-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="bookings" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-lea-clinical-blue data-[state=active]:to-lea-elegant-silver data-[state=active]:text-white"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger 
              value="treatments"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-lea-clinical-blue data-[state=active]:to-lea-elegant-silver data-[state=active]:text-white"
            >
              <Heart className="w-4 h-4 mr-2" />
              Treatments
            </TabsTrigger>
            <TabsTrigger 
              value="progress"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-lea-clinical-blue data-[state=active]:to-lea-elegant-silver data-[state=active]:text-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger 
              value="documents"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-lea-clinical-blue data-[state=state=active]:to-lea-elegant-silver data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger 
              value="profile"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-lea-clinical-blue data-[state=active]:to-lea-elegant-silver data-[state=active]:text-white"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Loyalty Points</p>
                      <p className="text-3xl font-bold">{clientData.loyaltyPoints}</p>
                    </div>
                    <Star className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Total Spent</p>
                      <p className="text-3xl font-bold">£{clientData.totalSpent}</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Treatments</p>
                      <p className="text-3xl font-bold">{pastBookings.length}</p>
                    </div>
                    <Heart className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100 text-sm">Upcoming</p>
                      <p className="text-3xl font-bold">{upcomingBookings.length}</p>
                    </div>
                    <Clock className="w-8 h-8 text-amber-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Next Appointment */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <Card className="lg:col-span-2 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lea-deep-charcoal font-serif flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-lea-clinical-blue" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => setShowBookingDialog(true)}
                      className="h-24 flex flex-col items-center justify-center bg-gradient-to-br from-lea-clinical-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                    >
                      <Plus className="w-6 h-6 mb-2" />
                      Book Treatment
                    </Button>
                    
                    <Button 
                      onClick={() => setShowMessagingDialog(true)}
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center hover:bg-lea-pearl-white"
                    >
                      <MessageCircle className="w-6 h-6 mb-2" />
                      Message Clinic
                    </Button>
                    
                    <Button 
                      onClick={() => setActiveTab("progress")}
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center hover:bg-lea-pearl-white"
                    >
                      <Camera className="w-6 h-6 mb-2" />
                      View Progress
                    </Button>
                    
                    <Button 
                      onClick={() => setShowDocumentDialog(true)}
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center hover:bg-lea-pearl-white"
                    >
                      <Upload className="w-6 h-6 mb-2" />
                      Upload Documents
                    </Button>
                    
                    <Button 
                      onClick={() => setActiveTab("profile")}
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center hover:bg-lea-pearl-white"
                    >
                      <Settings className="w-6 h-6 mb-2" />
                      Update Profile
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center hover:bg-lea-pearl-white"
                    >
                      <Download className="w-6 h-6 mb-2" />
                      Download Forms
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Next Appointment */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lea-deep-charcoal font-serif">Next Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-lea-clinical-blue/10 rounded-xl">
                        <CalendarIcon className="w-12 h-12 text-lea-clinical-blue mx-auto mb-2" />
                        <p className="font-bold text-lea-deep-charcoal text-lg">
                          {format(new Date(upcomingBookings[0].scheduledDate), 'MMM dd')}
                        </p>
                        <p className="text-lea-charcoal-grey">
                          {format(new Date(upcomingBookings[0].scheduledDate), 'h:mm a')}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="font-medium text-lea-deep-charcoal">
                          {upcomingBookings[0].treatment?.name}
                        </p>
                        <p className="text-sm text-lea-charcoal-grey">
                          with {upcomingBookings[0].practitionerName}
                        </p>
                        <Badge className={getStatusColor(upcomingBookings[0].status)}>
                          {upcomingBookings[0].status}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          Reschedule
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:bg-red-50">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="w-12 h-12 text-lea-charcoal-grey mx-auto mb-4" />
                      <p className="text-lea-charcoal-grey mb-4">No upcoming appointments</p>
                      <Button 
                        onClick={() => setShowBookingDialog(true)}
                        className="bg-lea-clinical-blue hover:bg-blue-600"
                      >
                        Book Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Treatment Plans */}
            {treatmentPlans.length > 0 && (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lea-deep-charcoal font-serif">Active Treatment Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {treatmentPlans.map((plan) => (
                      <div key={plan.id} className="border border-lea-silver-grey rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-lea-deep-charcoal">{plan.name}</h4>
                            <p className="text-sm text-lea-charcoal-grey">
                              £{plan.totalCost} • {plan.estimatedSessions} sessions
                            </p>
                          </div>
                          <Badge className="bg-lea-clinical-blue/10 text-lea-clinical-blue">
                            {plan.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-lea-charcoal-grey">Progress</span>
                            <span className="font-medium">{plan.progress}%</span>
                          </div>
                          <Progress value={plan.progress} className="h-2" />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            Schedule Next
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Other tabs would go here... */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Enhanced booking management interface would go here...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional tab content... */}
        </Tabs>
      </div>

      {/* Enhanced Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lea-deep-charcoal font-serif text-xl">
              Book Your Next Treatment
            </DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6 py-6">
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Select Treatment</Label>
                <Select value={selectedTreatment} onValueChange={setSelectedTreatment}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose your treatment" />
                  </SelectTrigger>
                  <SelectContent>
                    {treatments.map((treatment) => (
                      <SelectItem key={treatment.id} value={treatment.id}>
                        <div className="flex flex-col">
                          <span>{treatment.name}</span>
                          <span className="text-sm text-gray-500">£{treatment.price} • {treatment.duration}min</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">Preferred Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select time slot" />
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
                <Label className="text-base font-medium">Special Requirements</Label>
                <Textarea 
                  placeholder="Any special requirements or notes for your appointment..."
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-lg border border-lea-silver-grey mt-2"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setShowBookingDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBooking}
              disabled={!selectedTreatment || !selectedDate || !selectedTime}
              className="bg-lea-clinical-blue hover:bg-blue-600"
            >
              Request Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Messaging Dialog */}
      <Dialog open={showMessagingDialog} onOpenChange={setShowMessagingDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message Your Practitioner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Message</Label>
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="mt-2"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowMessagingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>
              Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Upload Dialog */}
      <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Select Files</Label>
              <Input
                type="file"
                multiple
                onChange={(e) => setSelectedFiles(e.target.files)}
                className="mt-2"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <p className="text-sm text-lea-charcoal-grey mt-1">
                Accepted formats: PDF, JPG, PNG (max 10MB each)
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDocumentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDocumentUpload}>
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
