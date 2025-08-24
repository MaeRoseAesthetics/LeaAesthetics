import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Calendar, Clock, Users, Repeat, Template, AlertCircle, Bell, CreditCard } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface RecurringBooking {
  id: string;
  type: 'weekly' | 'biweekly' | 'monthly';
  frequency: number;
  endDate?: Date;
  maxOccurrences?: number;
  dayOfWeek?: number;
  dayOfMonth?: number;
}

interface GroupBooking {
  id: string;
  maxParticipants: number;
  currentParticipants: number;
  groupDiscount?: number;
  requiresGroupLeader: boolean;
  participants: Array<{
    clientId: string;
    name: string;
    status: 'confirmed' | 'pending' | 'cancelled';
  }>;
}

interface BookingTemplate {
  id: string;
  name: string;
  treatmentId: string;
  duration: number;
  defaultNotes: string;
  requiredEquipment: string[];
  practitionerId?: string;
  isPublic: boolean;
}

interface CancellationPolicy {
  id: string;
  name: string;
  minimumNotice: number; // hours
  refundPercentage: number;
  adminFee: number;
  restrictions: string[];
}

export const AdvancedBookingFeatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState('recurring');
  const [recurringBooking, setRecurringBooking] = useState<Partial<RecurringBooking>>({});
  const [groupBooking, setGroupBooking] = useState<Partial<GroupBooking>>({});
  const [bookingTemplate, setBookingTemplate] = useState<Partial<BookingTemplate>>({});
  const [cancellationPolicy, setCancellationPolicy] = useState<Partial<CancellationPolicy>>({});
  
  const [reminderSettings, setReminderSettings] = useState({
    emailReminder: true,
    smsReminder: false,
    reminderTimes: [24, 2], // hours before appointment
    customMessage: ''
  });

  const handleRecurringBookingSubmit = () => {
    console.log('Creating recurring booking:', recurringBooking);
    // Implementation for creating recurring booking
  };

  const handleGroupBookingSubmit = () => {
    console.log('Creating group booking:', groupBooking);
    // Implementation for creating group booking
  };

  const handleTemplateSubmit = () => {
    console.log('Creating booking template:', bookingTemplate);
    // Implementation for creating booking template
  };

  const handlePolicySubmit = () => {
    console.log('Creating cancellation policy:', cancellationPolicy);
    // Implementation for creating cancellation policy
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Advanced Booking Management</h2>
        <div className="flex space-x-2">
          <Badge variant="secondary" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Booking System
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="recurring" className="flex items-center gap-2">
            <Repeat className="h-4 w-4" />
            Recurring
          </TabsTrigger>
          <TabsTrigger value="group" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Group
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Template className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Policies
          </TabsTrigger>
          <TabsTrigger value="reminders" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Reminders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recurring">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Repeat className="h-5 w-5" />
                Recurring Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Recurrence Type</Label>
                  <Select
                    value={recurringBooking.type}
                    onValueChange={(value: 'weekly' | 'biweekly' | 'monthly') =>
                      setRecurringBooking({ ...recurringBooking, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={recurringBooking.frequency || ''}
                    onChange={(e) =>
                      setRecurringBooking({ ...recurringBooking, frequency: parseInt(e.target.value) })
                    }
                    placeholder="Every X weeks/months"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>End Date (Optional)</Label>
                  <Input
                    type="date"
                    onChange={(e) =>
                      setRecurringBooking({ ...recurringBooking, endDate: new Date(e.target.value) })
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Max Occurrences</Label>
                  <Input
                    type="number"
                    min="1"
                    max="52"
                    value={recurringBooking.maxOccurrences || ''}
                    onChange={(e) =>
                      setRecurringBooking({ ...recurringBooking, maxOccurrences: parseInt(e.target.value) })
                    }
                    placeholder="Maximum number of appointments"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <Switch id="allow-modifications" />
                <Label htmlFor="allow-modifications">Allow individual appointment modifications</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="auto-reschedule" />
                <Label htmlFor="auto-reschedule">Auto-reschedule on conflicts</Label>
              </div>

              <Button onClick={handleRecurringBookingSubmit} className="w-full">
                Create Recurring Booking Series
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="group">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Group Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Maximum Participants</Label>
                  <Input
                    type="number"
                    min="2"
                    max="20"
                    value={groupBooking.maxParticipants || ''}
                    onChange={(e) =>
                      setGroupBooking({ ...groupBooking, maxParticipants: parseInt(e.target.value) })
                    }
                    placeholder="Max group size"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Group Discount (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={groupBooking.groupDiscount || ''}
                    onChange={(e) =>
                      setGroupBooking({ ...groupBooking, groupDiscount: parseInt(e.target.value) })
                    }
                    placeholder="Discount percentage"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="group-leader"
                    checked={groupBooking.requiresGroupLeader}
                    onCheckedChange={(checked) =>
                      setGroupBooking({ ...groupBooking, requiresGroupLeader: checked })
                    }
                  />
                  <Label htmlFor="group-leader">Require designated group leader</Label>
                </div>

                <div className="space-y-2">
                  <Label>Payment Policy</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual payments</SelectItem>
                      <SelectItem value="group-leader">Group leader pays all</SelectItem>
                      <SelectItem value="split">Split payment options</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Minimum Participants Required</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Minimum to proceed with booking"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Current Participants (0/0)</h4>
                <div className="border rounded-lg p-4 min-h-[100px] flex items-center justify-center text-muted-foreground">
                  No participants added yet
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    Add Existing Client
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Send Invitation Link
                  </Button>
                </div>
              </div>

              <Button onClick={handleGroupBookingSubmit} className="w-full">
                Create Group Booking
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Template className="h-5 w-5" />
                Booking Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Template Name</Label>
                  <Input
                    value={bookingTemplate.name || ''}
                    onChange={(e) =>
                      setBookingTemplate({ ...bookingTemplate, name: e.target.value })
                    }
                    placeholder="e.g., Standard Botox Treatment"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    min="15"
                    max="480"
                    value={bookingTemplate.duration || ''}
                    onChange={(e) =>
                      setBookingTemplate({ ...bookingTemplate, duration: parseInt(e.target.value) })
                    }
                    placeholder="Treatment duration"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Treatment Type</Label>
                <Select
                  value={bookingTemplate.treatmentId}
                  onValueChange={(value) =>
                    setBookingTemplate({ ...bookingTemplate, treatmentId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select treatment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="botox">Botox Treatment</SelectItem>
                    <SelectItem value="dermal-fillers">Dermal Fillers</SelectItem>
                    <SelectItem value="chemical-peel">Chemical Peel</SelectItem>
                    <SelectItem value="laser-treatment">Laser Treatment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Default Notes</Label>
                <Textarea
                  value={bookingTemplate.defaultNotes || ''}
                  onChange={(e) =>
                    setBookingTemplate({ ...bookingTemplate, defaultNotes: e.target.value })
                  }
                  placeholder="Standard notes for this treatment type"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Required Equipment</Label>
                <div className="flex flex-wrap gap-2">
                  {['Injection Gun', 'Sterilizer', 'LED Light', 'Magnifying Glass'].map((equipment) => (
                    <Badge key={equipment} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {equipment}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Practitioner</Label>
                <Select
                  value={bookingTemplate.practitionerId}
                  onValueChange={(value) =>
                    setBookingTemplate({ ...bookingTemplate, practitionerId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any available practitioner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Available</SelectItem>
                    <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                    <SelectItem value="dr-jones">Dr. Jones</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="public-template"
                  checked={bookingTemplate.isPublic}
                  onCheckedChange={(checked) =>
                    setBookingTemplate({ ...bookingTemplate, isPublic: checked })
                  }
                />
                <Label htmlFor="public-template">Make template available to all staff</Label>
              </div>

              <Button onClick={handleTemplateSubmit} className="w-full">
                Save Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Cancellation Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Policy Name</Label>
                <Input
                  value={cancellationPolicy.name || ''}
                  onChange={(e) =>
                    setCancellationPolicy({ ...cancellationPolicy, name: e.target.value })
                  }
                  placeholder="e.g., Standard 24hr Policy"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Notice (hours)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="168"
                    value={cancellationPolicy.minimumNotice || ''}
                    onChange={(e) =>
                      setCancellationPolicy({ ...cancellationPolicy, minimumNotice: parseInt(e.target.value) })
                    }
                    placeholder="Hours before appointment"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Refund Percentage</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={cancellationPolicy.refundPercentage || ''}
                    onChange={(e) =>
                      setCancellationPolicy({ ...cancellationPolicy, refundPercentage: parseInt(e.target.value) })
                    }
                    placeholder="% of payment refunded"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Administration Fee (£)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={cancellationPolicy.adminFee || ''}
                  onChange={(e) =>
                    setCancellationPolicy({ ...cancellationPolicy, adminFee: parseFloat(e.target.value) })
                  }
                  placeholder="Fixed admin fee"
                />
              </div>

              <div className="space-y-4">
                <Label>Policy Restrictions</Label>
                <div className="space-y-2">
                  {[
                    'No refunds for same-day cancellations',
                    'Medical emergencies excluded',
                    'Third cancellation incurs full charge',
                    'Rescheduling counts as cancellation'
                  ].map((restriction, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Switch />
                      <Label className="text-sm">{restriction}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Policy Preview</h4>
                <p className="text-sm text-muted-foreground">
                  Cancellations must be made at least {cancellationPolicy.minimumNotice || 24} hours in advance 
                  to receive a {cancellationPolicy.refundPercentage || 100}% refund minus 
                  a £{cancellationPolicy.adminFee || 0} administration fee.
                </p>
              </div>

              <Button onClick={handlePolicySubmit} className="w-full">
                Save Cancellation Policy
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Automated Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Reminder Methods</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="email-reminder"
                      checked={reminderSettings.emailReminder}
                      onCheckedChange={(checked) =>
                        setReminderSettings({ ...reminderSettings, emailReminder: checked })
                      }
                    />
                    <Label htmlFor="email-reminder">Email reminders</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sms-reminder"
                      checked={reminderSettings.smsReminder}
                      onCheckedChange={(checked) =>
                        setReminderSettings({ ...reminderSettings, smsReminder: checked })
                      }
                    />
                    <Label htmlFor="sms-reminder">SMS reminders</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Reminder Schedule</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">First Reminder (hours before)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="168"
                      value={reminderSettings.reminderTimes[0]}
                      onChange={(e) => {
                        const newTimes = [...reminderSettings.reminderTimes];
                        newTimes[0] = parseInt(e.target.value);
                        setReminderSettings({ ...reminderSettings, reminderTimes: newTimes });
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Second Reminder (hours before)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="24"
                      value={reminderSettings.reminderTimes[1]}
                      onChange={(e) => {
                        const newTimes = [...reminderSettings.reminderTimes];
                        newTimes[1] = parseInt(e.target.value);
                        setReminderSettings({ ...reminderSettings, reminderTimes: newTimes });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Custom Message</Label>
                <Textarea
                  value={reminderSettings.customMessage}
                  onChange={(e) =>
                    setReminderSettings({ ...reminderSettings, customMessage: e.target.value })
                  }
                  placeholder="Add a personal message to reminders (optional)"
                  rows={3}
                />
              </div>

              <Separator />

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Reminder Preview</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>24 hours before:</strong> "Hi [Client Name], this is a reminder of your [Treatment] appointment tomorrow at [Time]. {reminderSettings.customMessage}"</p>
                  <p><strong>2 hours before:</strong> "Hi [Client Name], your [Treatment] appointment is in 2 hours at [Time]. Please arrive 10 minutes early."</p>
                </div>
              </div>

              <Button className="w-full">
                Save Reminder Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedBookingFeatures;
