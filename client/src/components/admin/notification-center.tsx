import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Calendar, 
  Clock, 
  AlertTriangle,
  Save,
  Plus,
  Edit,
  Trash2,
  Send,
  Copy,
  Eye,
  Settings,
  Zap,
  Users,
  FileText,
  Phone,
  Globe
} from 'lucide-react';

const emailTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Email body is required'),
  type: z.string().min(1, 'Template type is required'),
  variables: z.array(z.string()).optional(),
});

const smsSettingsSchema = z.object({
  provider: z.string().min(1, 'SMS provider is required'),
  apiKey: z.string().optional(),
  fromNumber: z.string().optional(),
  enableSMS: z.boolean(),
  enableDeliveryReports: z.boolean(),
});

const reminderSettingsSchema = z.object({
  appointmentReminders: z.boolean(),
  reminderHours: z.number().min(1),
  followUpReminders: z.boolean(),
  followUpDays: z.number().min(1),
  birthdayReminders: z.boolean(),
  marketingEmails: z.boolean(),
  urgentNotifications: z.boolean(),
});

const emergencyContactSchema = z.object({
  primaryContact: z.string().min(1, 'Primary contact is required'),
  primaryPhone: z.string().min(1, 'Primary phone is required'),
  secondaryContact: z.string().optional(),
  secondaryPhone: z.string().optional(),
  emergencyEmail: z.string().email('Valid email is required'),
  escalationTime: z.number().min(15),
});

type EmailTemplateFormData = z.infer<typeof emailTemplateSchema>;
type SMSSettingsFormData = z.infer<typeof smsSettingsSchema>;
type ReminderSettingsFormData = z.infer<typeof reminderSettingsSchema>;
type EmergencyContactFormData = z.infer<typeof emergencyContactSchema>;

const EMAIL_TEMPLATE_TYPES = [
  { value: 'appointment_confirmation', label: 'Appointment Confirmation' },
  { value: 'appointment_reminder', label: 'Appointment Reminder' },
  { value: 'appointment_cancellation', label: 'Appointment Cancellation' },
  { value: 'payment_confirmation', label: 'Payment Confirmation' },
  { value: 'follow_up', label: 'Post-Treatment Follow-up' },
  { value: 'birthday_greeting', label: 'Birthday Greeting' },
  { value: 'marketing_newsletter', label: 'Marketing Newsletter' },
  { value: 'course_enrollment', label: 'Course Enrollment' },
  { value: 'certificate_completion', label: 'Certificate Completion' },
  { value: 'welcome_new_client', label: 'Welcome New Client' },
];

const SMS_PROVIDERS = [
  { value: 'twilio', label: 'Twilio' },
  { value: 'messagebird', label: 'MessageBird' },
  { value: 'clicksend', label: 'ClickSend' },
  { value: 'textlocal', label: 'TextLocal' },
];

const TEMPLATE_VARIABLES = [
  '{{client_name}}',
  '{{appointment_date}}',
  '{{appointment_time}}',
  '{{treatment_name}}',
  '{{practitioner_name}}',
  '{{clinic_name}}',
  '{{clinic_address}}',
  '{{total_amount}}',
  '{{balance_due}}',
  '{{course_name}}',
  '{{certificate_date}}',
];

// Mock email templates
const mockEmailTemplates = [
  {
    id: '1',
    name: 'Appointment Confirmation',
    subject: 'Your appointment at {{clinic_name}} is confirmed',
    type: 'appointment_confirmation',
    status: 'active',
    lastUsed: '2024-08-24T10:30:00Z',
    usageCount: 156,
  },
  {
    id: '2',
    name: 'Appointment Reminder',
    subject: 'Reminder: {{treatment_name}} appointment tomorrow',
    type: 'appointment_reminder',
    status: 'active',
    lastUsed: '2024-08-24T09:00:00Z',
    usageCount: 89,
  },
  {
    id: '3',
    name: 'Course Welcome Email',
    subject: 'Welcome to {{course_name}} - Let\'s begin your journey!',
    type: 'course_enrollment',
    status: 'draft',
    lastUsed: null,
    usageCount: 0,
  },
];

export default function NotificationCenter() {
  const [activeTab, setActiveTab] = useState('templates');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templateForm = useForm<EmailTemplateFormData>({
    resolver: zodResolver(emailTemplateSchema),
  });

  const smsForm = useForm<SMSSettingsFormData>({
    resolver: zodResolver(smsSettingsSchema),
    defaultValues: {
      provider: 'twilio',
      enableSMS: true,
      enableDeliveryReports: true,
    },
  });

  const reminderForm = useForm<ReminderSettingsFormData>({
    resolver: zodResolver(reminderSettingsSchema),
    defaultValues: {
      appointmentReminders: true,
      reminderHours: 24,
      followUpReminders: true,
      followUpDays: 3,
      birthdayReminders: true,
      marketingEmails: false,
      urgentNotifications: true,
    },
  });

  const emergencyForm = useForm<EmergencyContactFormData>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: {
      primaryContact: 'Sarah Johnson',
      primaryPhone: '+44 20 7123 4567',
      secondaryContact: 'Dr. Michael Chen',
      secondaryPhone: '+44 161 987 6543',
      emergencyEmail: 'emergency@leaaesthetics.com',
      escalationTime: 30,
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates" className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Email Templates</span>
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>SMS Settings</span>
          </TabsTrigger>
          <TabsTrigger value="reminders" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Reminders</span>
          </TabsTrigger>
          <TabsTrigger value="emergency" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Emergency</span>
          </TabsTrigger>
        </TabsList>

        {/* Email Templates Tab */}
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Email Templates
                  </CardTitle>
                  <CardDescription>
                    Create and manage automated email templates for your clinic communications
                  </CardDescription>
                </div>
                <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                      <Plus className="h-4 w-4 mr-2" />
                      New Template
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Template Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Templates</p>
                        <p className="text-2xl font-bold text-lea-deep-charcoal">12</p>
                      </div>
                      <FileText className="h-8 w-8 text-lea-sage-green" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active</p>
                        <p className="text-2xl font-bold text-green-600">8</p>
                      </div>
                      <Send className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Sent This Month</p>
                        <p className="text-2xl font-bold text-blue-600">1,247</p>
                      </div>
                      <Mail className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Open Rate</p>
                        <p className="text-2xl font-bold text-purple-600">78%</p>
                      </div>
                      <Eye className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Templates List */}
              <div className="space-y-4">
                {mockEmailTemplates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        {getStatusBadge(template.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{template.subject}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Used {template.usageCount} times</span>
                        {template.lastUsed && (
                          <span>Last used: {new Date(template.lastUsed).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS Settings Tab */}
        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                SMS Configuration
              </CardTitle>
              <CardDescription>
                Configure SMS provider settings and messaging options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={smsForm.handleSubmit((data) => console.log('SMS Settings:', data))} className="space-y-6">
                {/* SMS Provider */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="provider">SMS Provider</Label>
                    <Select 
                      value={smsForm.watch('provider')} 
                      onValueChange={(value) => smsForm.setValue('provider', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SMS_PROVIDERS.map((provider) => (
                          <SelectItem key={provider.value} value={provider.value}>
                            {provider.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fromNumber">From Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input {...smsForm.register('fromNumber')} className="pl-10" placeholder="+44 20 1234 5678" />
                    </div>
                  </div>
                </div>

                {/* API Configuration */}
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input 
                    type="password" 
                    {...smsForm.register('apiKey')} 
                    placeholder="Enter your SMS provider API key"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Your API key will be encrypted and stored securely
                  </p>
                </div>

                {/* SMS Features */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">SMS Features</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Enable SMS notifications</Label>
                        <p className="text-sm text-muted-foreground">Send automated SMS messages to clients</p>
                      </div>
                      <Switch 
                        checked={smsForm.watch('enableSMS')}
                        onCheckedChange={(checked) => smsForm.setValue('enableSMS', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Delivery reports</Label>
                        <p className="text-sm text-muted-foreground">Track SMS delivery status</p>
                      </div>
                      <Switch 
                        checked={smsForm.watch('enableDeliveryReports')}
                        onCheckedChange={(checked) => smsForm.setValue('enableDeliveryReports', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Test SMS */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Test Configuration</h4>
                  <div className="flex space-x-4">
                    <Input placeholder="Test phone number" className="flex-1" />
                    <Button type="button" variant="outline">
                      <Send className="h-4 w-4 mr-2" />
                      Send Test SMS
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                  <Save className="h-4 w-4 mr-2" />
                  Save SMS Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reminder Settings Tab */}
        <TabsContent value="reminders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Automated Reminders
              </CardTitle>
              <CardDescription>
                Configure automatic notification schedules and reminder settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={reminderForm.handleSubmit((data) => console.log('Reminder Settings:', data))} className="space-y-6">
                {/* Appointment Reminders */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Appointment Reminders</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Send appointment reminders</Label>
                        <p className="text-sm text-muted-foreground">Automatically remind clients of upcoming appointments</p>
                      </div>
                      <Switch 
                        checked={reminderForm.watch('appointmentReminders')}
                        onCheckedChange={(checked) => reminderForm.setValue('appointmentReminders', checked)}
                      />
                    </div>
                    
                    {reminderForm.watch('appointmentReminders') && (
                      <div className="ml-4">
                        <Label htmlFor="reminderHours">Reminder timing (hours before appointment)</Label>
                        <div className="flex items-center space-x-2">
                          <Input 
                            type="number" 
                            min="1"
                            {...reminderForm.register('reminderHours', { valueAsNumber: true })}
                            className="w-32"
                          />
                          <span className="text-sm text-muted-foreground">hours before</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Follow-up Reminders */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Follow-up Communications</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Send follow-up reminders</Label>
                        <p className="text-sm text-muted-foreground">Automatically follow up with clients after treatments</p>
                      </div>
                      <Switch 
                        checked={reminderForm.watch('followUpReminders')}
                        onCheckedChange={(checked) => reminderForm.setValue('followUpReminders', checked)}
                      />
                    </div>
                    
                    {reminderForm.watch('followUpReminders') && (
                      <div className="ml-4">
                        <Label htmlFor="followUpDays">Follow-up timing (days after appointment)</Label>
                        <div className="flex items-center space-x-2">
                          <Input 
                            type="number" 
                            min="1"
                            {...reminderForm.register('followUpDays', { valueAsNumber: true })}
                            className="w-32"
                          />
                          <span className="text-sm text-muted-foreground">days after</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Special Occasion Reminders */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Special Occasions</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Birthday reminders</Label>
                        <p className="text-sm text-muted-foreground">Send birthday greetings and special offers</p>
                      </div>
                      <Switch 
                        checked={reminderForm.watch('birthdayReminders')}
                        onCheckedChange={(checked) => reminderForm.setValue('birthdayReminders', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Marketing emails</Label>
                        <p className="text-sm text-muted-foreground">Send promotional content and newsletters</p>
                      </div>
                      <Switch 
                        checked={reminderForm.watch('marketingEmails')}
                        onCheckedChange={(checked) => reminderForm.setValue('marketingEmails', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Urgent Notifications */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Urgent Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Enable urgent notifications</Label>
                        <p className="text-sm text-muted-foreground">Send immediate alerts for urgent situations</p>
                      </div>
                      <Switch 
                        checked={reminderForm.watch('urgentNotifications')}
                        onCheckedChange={(checked) => reminderForm.setValue('urgentNotifications', checked)}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                  <Save className="h-4 w-4 mr-2" />
                  Save Reminder Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Contacts Tab */}
        <TabsContent value="emergency">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Emergency Contact Protocols
              </CardTitle>
              <CardDescription>
                Configure emergency contacts and escalation procedures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={emergencyForm.handleSubmit((data) => console.log('Emergency Settings:', data))} className="space-y-6">
                {/* Primary Contact */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Primary Emergency Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="primaryContact">Contact Name</Label>
                      <Input {...emergencyForm.register('primaryContact')} />
                    </div>
                    <div>
                      <Label htmlFor="primaryPhone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input {...emergencyForm.register('primaryPhone')} className="pl-10" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Contact */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Secondary Emergency Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="secondaryContact">Contact Name</Label>
                      <Input {...emergencyForm.register('secondaryContact')} />
                    </div>
                    <div>
                      <Label htmlFor="secondaryPhone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input {...emergencyForm.register('secondaryPhone')} className="pl-10" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Email */}
                <div>
                  <Label htmlFor="emergencyEmail">Emergency Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input {...emergencyForm.register('emergencyEmail')} className="pl-10" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Emergency notifications will be sent to this email address
                  </p>
                </div>

                {/* Escalation Settings */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Escalation Settings</h4>
                  <div>
                    <Label htmlFor="escalationTime">Escalation Time (minutes)</Label>
                    <Input 
                      type="number" 
                      min="15"
                      {...emergencyForm.register('escalationTime', { valueAsNumber: true })}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Time to wait before escalating to secondary contact
                    </p>
                  </div>
                </div>

                {/* Emergency Procedures */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Emergency Procedures</h4>
                  <Card className="p-4 bg-red-50 border-red-200">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="space-y-2">
                        <h5 className="font-medium text-red-900">In case of emergency:</h5>
                        <ul className="text-sm text-red-800 space-y-1">
                          <li>1. Contact primary emergency contact immediately</li>
                          <li>2. If no response within {emergencyForm.watch('escalationTime')} minutes, contact secondary</li>
                          <li>3. Send emergency notification to {emergencyForm.watch('emergencyEmail')}</li>
                          <li>4. Document the incident in the system</li>
                          <li>5. Follow up with all relevant parties</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Test Emergency System */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Test Emergency System</h4>
                  <div className="flex space-x-4">
                    <Button type="button" variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
                      <Zap className="h-4 w-4 mr-2" />
                      Test Emergency Alert
                    </Button>
                    <Button type="button" variant="outline">
                      <Send className="h-4 w-4 mr-2" />
                      Send Test Notification
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Test the emergency notification system to ensure it's working properly
                  </p>
                </div>

                <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                  <Save className="h-4 w-4 mr-2" />
                  Save Emergency Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Email Template Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Email Template</DialogTitle>
          </DialogHeader>
          <form onSubmit={templateForm.handleSubmit((data) => console.log('Template:', data))} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input {...templateForm.register('name')} />
              </div>
              <div>
                <Label htmlFor="type">Template Type</Label>
                <Select onValueChange={(value) => templateForm.setValue('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMAIL_TEMPLATE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="subject">Email Subject</Label>
              <Input {...templateForm.register('subject')} />
            </div>
            
            <div>
              <Label htmlFor="body">Email Body</Label>
              <Textarea 
                {...templateForm.register('body')}
                rows={10}
                placeholder="Enter your email template content here. Use variables like {{client_name}}, {{appointment_date}}, etc."
              />
            </div>
            
            <div>
              <Label>Available Variables</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {TEMPLATE_VARIABLES.map((variable) => (
                  <Badge key={variable} variant="outline" className="cursor-pointer hover:bg-lea-sage-green hover:text-white">
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowTemplateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                Create Template
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
