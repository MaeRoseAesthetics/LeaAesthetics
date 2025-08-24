import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Repeat, 
  AlertCircle, 
  CheckCircle, 
  CreditCard,
  MapPin,
  User
} from 'lucide-react';
import { format, addDays, addWeeks, addMonths, isSameDay } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const bookingSchema = z.object({
  clientId: z.string().min(1, 'Client selection is required'),
  treatmentId: z.string().min(1, 'Treatment selection is required'),
  practitionerId: z.string().optional(),
  scheduledDate: z.date({ required_error: 'Date is required' }),
  scheduledTime: z.string().min(1, 'Time is required'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes'),
  notes: z.string().optional(),
  
  // Group booking
  isGroupBooking: z.boolean().default(false),
  groupSize: z.number().min(1).max(8).optional(),
  groupMembers: z.array(z.string()).optional(),
  
  // Recurring booking
  isRecurring: z.boolean().default(false),
  recurrencePattern: z.enum(['weekly', 'biweekly', 'monthly']).optional(),
  recurrenceEnd: z.date().optional(),
  numberOfSessions: z.number().min(1).max(12).optional(),
  
  // Waitlist
  joinWaitlist: z.boolean().default(false),
  preferredDates: z.array(z.date()).optional(),
  flexibleTiming: z.boolean().default(false),
  
  // Payment
  paymentMethod: z.enum(['card', 'cash', 'account']).optional(),
  requiresDeposit: z.boolean().default(false),
  depositAmount: z.number().optional(),
  
  // Special requirements
  accessibility: z.string().optional(),
  allergies: z.string().optional(),
  specialInstructions: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingSystemProps {
  clientId?: string;
  treatmentId?: string;
  onBookingComplete?: (booking: any) => void;
}

export default function EnhancedBookingSystem({ 
  clientId, 
  treatmentId, 
  onBookingComplete 
}: BookingSystemProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookingType, setBookingType] = useState<'single' | 'group' | 'recurring'>('single');
  const [showWaitlist, setShowWaitlist] = useState(false);
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      clientId: clientId || '',
      treatmentId: treatmentId || '',
      isGroupBooking: false,
      isRecurring: false,
      joinWaitlist: false,
      requiresDeposit: false,
      flexibleTiming: false,
      groupSize: 1,
      numberOfSessions: 1
    }
  });

  // Fetch available treatments
  const { data: treatments } = useQuery({
    queryKey: ['treatments'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/treatments');
      return response.json();
    }
  });

  // Fetch clients for selection
  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/clients');
      return response.json();
    }
  });

  // Fetch available time slots
  const { data: availability } = useQuery({
    queryKey: ['availability', selectedDate, form.watch('treatmentId')],
    queryFn: async () => {
      if (!selectedDate || !form.watch('treatmentId')) return [];
      
      const response = await apiRequest('GET', `/api/availability`, {
        params: {
          date: format(selectedDate, 'yyyy-MM-dd'),
          treatmentId: form.watch('treatmentId')
        }
      });
      return response.json();
    },
    enabled: !!selectedDate && !!form.watch('treatmentId')
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const endpoint = data.joinWaitlist ? '/api/bookings/waitlist' : '/api/bookings';
      const response = await apiRequest('POST', endpoint, {
        ...data,
        scheduledDate: data.scheduledDate.toISOString(),
        recurrenceEnd: data.recurrenceEnd?.toISOString(),
        preferredDates: data.preferredDates?.map(date => date.toISOString())
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: form.watch('joinWaitlist') ? 'Added to Waitlist' : 'Booking Confirmed',
        description: form.watch('joinWaitlist') 
          ? 'You\'ve been added to the waitlist. We\'ll contact you when a slot becomes available.'
          : `Your ${form.watch('isRecurring') ? 'recurring ' : ''}booking has been confirmed.`,
      });
      onBookingComplete?.(data);
    },
    onError: (error: Error) => {
      // Check if it's a slot unavailable error
      if (error.message.includes('slot not available')) {
        setShowWaitlist(true);
        toast({
          title: 'Slot Unavailable',
          description: 'This time slot is no longer available. Would you like to join the waitlist?',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Booking Failed',
          description: error.message,
          variant: 'destructive',
        });
      }
    },
  });

  const onSubmit = (data: BookingFormData) => {
    createBookingMutation.mutate(data);
  };

  const generateRecurringDates = (startDate: Date, pattern: string, sessions: number) => {
    const dates = [startDate];
    let currentDate = new Date(startDate);
    
    for (let i = 1; i < sessions; i++) {
      switch (pattern) {
        case 'weekly':
          currentDate = addWeeks(currentDate, 1);
          break;
        case 'biweekly':
          currentDate = addWeeks(currentDate, 2);
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, 1);
          break;
      }
      dates.push(new Date(currentDate));
    }
    
    return dates;
  };

  const calculateTotalCost = () => {
    const treatment = treatments?.find((t: any) => t.id === form.watch('treatmentId'));
    if (!treatment) return 0;

    let basePrice = parseFloat(treatment.price);
    let multiplier = 1;

    // Group booking discount
    if (form.watch('isGroupBooking') && form.watch('groupSize')) {
      multiplier = form.watch('groupSize')! * 0.85; // 15% discount for groups
    }

    // Recurring sessions discount
    if (form.watch('isRecurring') && form.watch('numberOfSessions')) {
      const sessions = form.watch('numberOfSessions')!;
      if (sessions >= 6) multiplier *= 0.9; // 10% discount for 6+ sessions
    }

    return basePrice * multiplier;
  };

  const renderSingleBooking = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients?.map((client: any) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.firstName} {client.lastName} - {client.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="treatmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treatment</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select treatment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {treatments?.map((treatment: any) => (
                    <SelectItem key={treatment.id} value={treatment.id}>
                      {treatment.name} - £{treatment.price} ({treatment.duration}min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="scheduledDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Date</FormLabel>
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    if (date) {
                      field.onChange(date);
                      setSelectedDate(date);
                    }
                  }}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="scheduledTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Times</FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  {availability?.availableSlots?.map((slot: string) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={field.value === slot ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => field.onChange(slot)}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {slot}
                    </Button>
                  ))}
                </div>
                {availability?.availableSlots?.length === 0 && selectedDate && (
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No slots available for this date. Would you like to join the waitlist?
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="ml-2"
                        onClick={() => setShowWaitlist(true)}
                      >
                        Join Waitlist
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes (Optional)</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Any special requirements or notes..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderGroupBooking = () => (
    <div className="space-y-6">
      {renderSingleBooking()}
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Group Booking Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="groupSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Size</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select group size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[2, 3, 4, 5, 6, 7, 8].map(size => (
                      <SelectItem key={size} value={size.toString()}>
                        {size} people
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Maximum 8 people per group. Groups of 2+ receive a 15% discount.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Alert className="mt-4 bg-blue-50 border-blue-200">
          <Users className="h-4 w-4" />
          <AlertDescription className="text-blue-800">
            <strong>Group Booking Benefits:</strong><br />
            • 15% discount on total price<br />
            • Same practitioner for all participants<br />
            • Flexible scheduling for multiple treatments<br />
            • Shared aftercare session included
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );

  const renderRecurringBooking = () => (
    <div className="space-y-6">
      {renderSingleBooking()}
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Repeat className="h-5 w-5 mr-2" />
          Recurring Appointment Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="recurrencePattern"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Every 2 weeks</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfSessions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Sessions</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sessions" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({length: 12}, (_, i) => i + 1).map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} session{num > 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  6+ sessions receive a 10% discount
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {form.watch('recurrencePattern') && form.watch('numberOfSessions') && selectedDate && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Scheduled Dates Preview:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {generateRecurringDates(
                selectedDate, 
                form.watch('recurrencePattern')!, 
                form.watch('numberOfSessions')!
              ).map((date, index) => (
                <Badge key={index} variant="outline" className="justify-center py-2">
                  {format(date, 'MMM dd, yyyy')}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Alert className="mt-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-green-800">
            <strong>Recurring Booking Benefits:</strong><br />
            • Guaranteed same time slot each session<br />
            • 10% discount for 6+ sessions<br />
            • Priority rescheduling if needed<br />
            • Treatment plan progress tracking
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );

  const renderWaitlist = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <AlertCircle className="h-12 w-12 text-orange-500 mx-auto" />
        <h2 className="text-2xl font-bold">Join Waitlist</h2>
        <p className="text-gray-600">
          Your preferred slot isn't available. Join our waitlist to be notified when slots open up.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients?.map((client: any) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.firstName} {client.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="treatmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treatment</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select treatment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {treatments?.map((treatment: any) => (
                    <SelectItem key={treatment.id} value={treatment.id}>
                      {treatment.name} - £{treatment.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <Label>Preferred Dates (Select multiple)</Label>
        <Calendar
          mode="multiple"
          selected={form.watch('preferredDates')}
          onSelect={(dates) => form.setValue('preferredDates', dates)}
          disabled={(date) => date < new Date()}
          className="rounded-md border"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="flexibleTiming"
            checked={form.watch('flexibleTiming')}
            onCheckedChange={(checked) => form.setValue('flexibleTiming', checked as boolean)}
          />
          <Label htmlFor="flexibleTiming">I'm flexible with timing (increases chances of booking)</Label>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-blue-800">
          <strong>Waitlist Information:</strong><br />
          • You'll be contacted within 24 hours if a slot opens<br />
          • Priority given to flexible timing preferences<br />
          • No charge until booking is confirmed<br />
          • You can cancel waitlist anytime
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderPaymentSection = () => {
    const totalCost = calculateTotalCost();
    const depositRequired = form.watch('requiresDeposit');
    const depositAmount = depositRequired ? totalCost * 0.2 : 0; // 20% deposit

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Information
        </h3>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Treatment Cost:</span>
              <span>£{totalCost.toFixed(2)}</span>
            </div>
            {depositRequired && (
              <>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Deposit (20%):</span>
                  <span>£{depositAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Due Today:</span>
                  <span>£{depositAmount.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="cash">Cash (on arrival)</SelectItem>
                  <SelectItem value="account">Account Holder</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2">
          <Checkbox
            id="requiresDeposit"
            checked={form.watch('requiresDeposit')}
            onCheckedChange={(checked) => form.setValue('requiresDeposit', checked as boolean)}
          />
          <Label htmlFor="requiresDeposit">Secure booking with 20% deposit</Label>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-6 w-6" />
            Book Appointment
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {!showWaitlist && (
                <Tabs value={bookingType} onValueChange={(value: any) => setBookingType(value)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="single" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Single Booking
                    </TabsTrigger>
                    <TabsTrigger value="group" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Group Booking
                    </TabsTrigger>
                    <TabsTrigger value="recurring" className="flex items-center gap-2">
                      <Repeat className="h-4 w-4" />
                      Recurring
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="single">
                    {renderSingleBooking()}
                  </TabsContent>
                  
                  <TabsContent value="group">
                    {renderGroupBooking()}
                  </TabsContent>
                  
                  <TabsContent value="recurring">
                    {renderRecurringBooking()}
                  </TabsContent>
                </Tabs>
              )}

              {showWaitlist && renderWaitlist()}

              {!showWaitlist && !form.watch('joinWaitlist') && renderPaymentSection()}

              <div className="flex justify-between pt-6 border-t">
                {showWaitlist && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowWaitlist(false)}
                  >
                    Back to Booking
                  </Button>
                )}
                
                <div className="ml-auto space-x-3">
                  {showWaitlist && (
                    <Button
                      type="submit"
                      disabled={createBookingMutation.isPending}
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => form.setValue('joinWaitlist', true)}
                    >
                      {createBookingMutation.isPending ? 'Adding to Waitlist...' : 'Join Waitlist'}
                    </Button>
                  )}
                  
                  {!showWaitlist && (
                    <Button
                      type="submit"
                      disabled={createBookingMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {createBookingMutation.isPending ? 'Processing...' : 
                       form.watch('requiresDeposit') ? `Book with £${(calculateTotalCost() * 0.2).toFixed(2)} Deposit` :
                       'Confirm Booking'
                      }
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
