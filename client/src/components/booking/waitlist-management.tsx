import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Phone,
  Mail,
  Calendar,
  Star,
  ArrowUp,
  ArrowDown,
  X
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface WaitlistEntry {
  id: string;
  clientId: string;
  client: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  treatmentId: string;
  treatment: {
    name: string;
    duration: number;
    price: string;
  };
  preferredDate: string;
  preferredTime?: string;
  alternativeDates?: string[];
  priority: number;
  status: 'waiting' | 'contacted' | 'booked' | 'expired';
  flexibleTiming: boolean;
  notifiedDate?: string;
  expiryDate: string;
  createdAt: string;
}

interface AvailabilitySlot {
  date: string;
  time: string;
  practitioner: string;
  duration: number;
}

export default function WaitlistManagement() {
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch waitlist entries
  const { data: waitlistEntries, isLoading } = useQuery({
    queryKey: ['waitlist', filterStatus],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/bookings/waitlist', {
        params: { status: filterStatus === 'all' ? undefined : filterStatus }
      });
      return response.json();
    }
  });

  // Fetch available slots
  const { data: availableSlots } = useQuery({
    queryKey: ['available-slots'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/availability/next-week');
      return response.json();
    }
  });

  // Update waitlist entry priority
  const updatePriorityMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      const response = await apiRequest('PATCH', `/api/bookings/waitlist/${id}/priority`, {
        direction
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      toast({
        title: 'Priority Updated',
        description: 'Waitlist priority has been updated.',
      });
    }
  });

  // Contact client mutation
  const contactClientMutation = useMutation({
    mutationFn: async (data: { id: string; method: 'email' | 'sms'; message: string; availableSlot?: any }) => {
      const response = await apiRequest('POST', `/api/bookings/waitlist/${data.id}/contact`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      setShowContactForm(false);
      toast({
        title: 'Client Contacted',
        description: 'Client has been notified of available slot.',
      });
    }
  });

  // Book from waitlist mutation
  const bookFromWaitlistMutation = useMutation({
    mutationFn: async (data: { waitlistId: string; slotId: string; confirm: boolean }) => {
      const response = await apiRequest('POST', `/api/bookings/waitlist/${data.waitlistId}/book`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
      toast({
        title: 'Booking Confirmed',
        description: 'Client has been booked from waitlist.',
      });
    }
  });

  // Remove from waitlist mutation
  const removeFromWaitlistMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/bookings/waitlist/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      toast({
        title: 'Removed from Waitlist',
        description: 'Entry has been removed from waitlist.',
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'booked': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'text-red-600';
    if (priority >= 5) return 'text-orange-600';
    return 'text-blue-600';
  };

  const calculateWaitTime = (createdAt: string) => {
    const days = differenceInDays(new Date(), new Date(createdAt));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day';
    return `${days} days`;
  };

  const findMatchingSlots = (entry: WaitlistEntry) => {
    if (!availableSlots) return [];
    
    return availableSlots.filter((slot: AvailabilitySlot) => {
      // Check if slot duration matches treatment
      if (slot.duration < entry.treatment.duration) return false;
      
      // Check preferred dates
      const preferredDates = [entry.preferredDate, ...(entry.alternativeDates || [])];
      const isPreferredDate = preferredDates.some(date => 
        format(new Date(date), 'yyyy-MM-dd') === slot.date
      );
      
      // If flexible timing, consider all dates within reasonable range
      if (entry.flexibleTiming) {
        const daysDiff = differenceInDays(new Date(slot.date), new Date(entry.preferredDate));
        return daysDiff >= -7 && daysDiff <= 14; // 1 week before to 2 weeks after
      }
      
      return isPreferredDate;
    });
  };

  const renderWaitlistEntry = (entry: WaitlistEntry) => {
    const matchingSlots = findMatchingSlots(entry);
    const waitTime = calculateWaitTime(entry.createdAt);
    
    return (
      <Card key={entry.id} className="border hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">
                  {entry.client.firstName} {entry.client.lastName}
                </h3>
                <Badge className={getStatusColor(entry.status)}>
                  {entry.status}
                </Badge>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(entry.priority, 5) }).map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${getPriorityColor(entry.priority)}`} fill="currentColor" />
                  ))}
                  <span className={`text-sm font-medium ${getPriorityColor(entry.priority)}`}>
                    {entry.priority}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {entry.client.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {entry.client.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Treatment: {entry.treatment.name} (£{entry.treatment.price})
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Preferred: {format(new Date(entry.preferredDate), 'MMM dd, yyyy')}
                  {entry.preferredTime && ` at ${entry.preferredTime}`}
                </div>
                {entry.flexibleTiming && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Flexible timing
                  </div>
                )}
                <div className="text-xs">
                  Waiting for: {waitTime}
                  {entry.notifiedDate && (
                    <span className="ml-2">
                      • Contacted: {format(new Date(entry.notifiedDate), 'MMM dd')}
                    </span>
                  )}
                </div>
              </div>

              {matchingSlots.length > 0 && (
                <Alert className="mb-3 bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    <strong>{matchingSlots.length} matching slot{matchingSlots.length > 1 ? 's' : ''} available!</strong>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {matchingSlots.slice(0, 4).map((slot, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {format(new Date(slot.date), 'MMM dd')} at {slot.time}
                        </Badge>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="flex flex-col gap-2 ml-4">
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updatePriorityMutation.mutate({ id: entry.id, direction: 'up' })}
                  disabled={updatePriorityMutation.isPending}
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updatePriorityMutation.mutate({ id: entry.id, direction: 'down' })}
                  disabled={updatePriorityMutation.isPending}
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>
              
              {matchingSlots.length > 0 && entry.status === 'waiting' && (
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedEntry(entry);
                    setShowContactForm(true);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Contact
                </Button>
              )}
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => removeFromWaitlistMutation.mutate(entry.id)}
                disabled={removeFromWaitlistMutation.isPending}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderContactForm = () => {
    if (!selectedEntry) return null;
    
    const matchingSlots = findMatchingSlots(selectedEntry);
    
    return (
      <Card className="border shadow-lg">
        <CardHeader>
          <CardTitle>
            Contact {selectedEntry.client.firstName} {selectedEntry.client.lastName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Available Slots:</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {matchingSlots.map((slot, index) => (
                  <div 
                    key={index}
                    className="p-2 border rounded cursor-pointer hover:bg-blue-50"
                    onClick={() => {
                      // Handle slot selection
                    }}
                  >
                    <div className="font-medium">
                      {format(new Date(slot.date), 'EEEE, MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {slot.time} • {slot.duration}min • {slot.practitioner}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Contact Options:</h4>
              <div className="space-y-2">
                <Button
                  className="w-full justify-start"
                  onClick={() => contactClientMutation.mutate({
                    id: selectedEntry.id,
                    method: 'email',
                    message: `Hi ${selectedEntry.client.firstName}, we have availability for your ${selectedEntry.treatment.name} treatment. Please contact us to confirm.`,
                    availableSlot: matchingSlots[0]
                  })}
                  disabled={contactClientMutation.isPending}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => contactClientMutation.mutate({
                    id: selectedEntry.id,
                    method: 'sms',
                    message: `Hi ${selectedEntry.client.firstName}, we have availability for your treatment. Call us to book!`,
                    availableSlot: matchingSlots[0]
                  })}
                  disabled={contactClientMutation.isPending}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Send SMS
                </Button>
                
                {matchingSlots.length > 0 && (
                  <Button
                    className="w-full justify-start bg-green-600 hover:bg-green-700"
                    onClick={() => bookFromWaitlistMutation.mutate({
                      waitlistId: selectedEntry.id,
                      slotId: matchingSlots[0].date + matchingSlots[0].time,
                      confirm: true
                    })}
                    disabled={bookFromWaitlistMutation.isPending}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Directly
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowContactForm(false);
                setSelectedEntry(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStats = () => {
    const stats = {
      total: waitlistEntries?.length || 0,
      waiting: waitlistEntries?.filter((e: WaitlistEntry) => e.status === 'waiting').length || 0,
      contacted: waitlistEntries?.filter((e: WaitlistEntry) => e.status === 'contacted').length || 0,
      matchingSlots: waitlistEntries?.reduce((acc: number, entry: WaitlistEntry) => 
        acc + findMatchingSlots(entry).length, 0) || 0
    };
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Entries</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.waiting}</div>
            <div className="text-sm text-gray-600">Waiting</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.contacted}</div>
            <div className="text-sm text-gray-600">Contacted</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.matchingSlots}</div>
            <div className="text-sm text-gray-600">Available Slots</div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading waitlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Waitlist Management</h1>
      </div>

      {renderStats()}

      <div className="mb-6">
        <Tabs value={filterStatus} onValueChange={setFilterStatus}>
          <TabsList>
            <TabsTrigger value="all">All ({waitlistEntries?.length || 0})</TabsTrigger>
            <TabsTrigger value="waiting">
              Waiting ({waitlistEntries?.filter((e: WaitlistEntry) => e.status === 'waiting').length || 0})
            </TabsTrigger>
            <TabsTrigger value="contacted">
              Contacted ({waitlistEntries?.filter((e: WaitlistEntry) => e.status === 'contacted').length || 0})
            </TabsTrigger>
            <TabsTrigger value="expired">
              Expired ({waitlistEntries?.filter((e: WaitlistEntry) => e.status === 'expired').length || 0})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {showContactForm && renderContactForm()}

      <div className="space-y-4">
        {waitlistEntries?.length === 0 ? (
          <Card className="text-center p-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No waitlist entries</h2>
            <p className="text-gray-500">When clients join the waitlist, they'll appear here.</p>
          </Card>
        ) : (
          waitlistEntries
            ?.sort((a: WaitlistEntry, b: WaitlistEntry) => b.priority - a.priority)
            .map((entry: WaitlistEntry) => renderWaitlistEntry(entry))
        )}
      </div>
    </div>
  );
}
