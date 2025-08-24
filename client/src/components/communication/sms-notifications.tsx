import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Smartphone, 
  Plus, 
  Send, 
  Clock, 
  Check, 
  X, 
  MessageSquare, 
  Calendar,
  Bell,
  Users,
  TrendingUp,
  AlertTriangle,
  Settings,
  Play,
  Pause,
  Edit,
  Trash2
} from 'lucide-react';

export default function SmsNotifications() {
  const [showNewSms, setShowNewSms] = useState(false);
  const [showAutomation, setShowAutomation] = useState(false);

  // Mock data for SMS campaigns
  const smsMessages = [
    {
      id: 1,
      title: 'Appointment Reminder - Today',
      type: 'appointment',
      message: 'Hi {firstName}, reminder: your {treatmentType} appointment is today at {time}. See you soon! - LEA Aesthetics',
      recipients: 23,
      sent: 23,
      delivered: 23,
      replies: 2,
      sentDate: '2025-01-24 08:00',
      status: 'completed',
      automation: true
    },
    {
      id: 2,
      title: 'Treatment Follow-up',
      type: 'follow-up',
      message: 'Hi {firstName}, how are you feeling after your {treatmentType}? Any questions? Reply or call us at 01234 567890.',
      recipients: 15,
      sent: 15,
      delivered: 15,
      replies: 7,
      sentDate: '2025-01-23 14:00',
      status: 'completed',
      automation: true
    },
    {
      id: 3,
      title: 'New Treatment Promotion',
      type: 'promotion',
      message: '🌟 New Year Special! 20% off all Botox treatments this month. Book online or call 01234 567890. T&Cs apply.',
      recipients: 456,
      sent: 456,
      delivered: 442,
      replies: 12,
      sentDate: '2025-01-22 10:00',
      status: 'completed',
      automation: false
    },
    {
      id: 4,
      title: 'Maintenance Treatment Due',
      type: 'reminder',
      message: 'Hi {firstName}, its time for your {treatmentType} maintenance. Book your appointment: {bookingLink}',
      recipients: 67,
      status: 'scheduled',
      sendDate: '2025-01-25 09:00',
      automation: true
    }
  ];

  const automationRules = [
    {
      id: 1,
      name: 'Appointment Reminder - 24h',
      trigger: 'appointment_24h_before',
      status: 'active',
      template: 'appointment-reminder',
      recipients: 'All clients with appointments',
      lastRun: '2025-01-24 08:00',
      messagesSent: 156
    },
    {
      id: 2,
      name: 'Treatment Follow-up',
      trigger: 'treatment_completed_24h',
      status: 'active',
      template: 'follow-up',
      recipients: 'Clients with completed treatments',
      lastRun: '2025-01-23 14:00',
      messagesSent: 89
    },
    {
      id: 3,
      name: 'Maintenance Due Reminder',
      trigger: 'maintenance_due_7days',
      status: 'active',
      template: 'maintenance-reminder',
      recipients: 'Clients due for maintenance',
      lastRun: '2025-01-22 09:00',
      messagesSent: 234
    },
    {
      id: 4,
      name: 'Birthday Messages',
      trigger: 'client_birthday',
      status: 'paused',
      template: 'birthday-wishes',
      recipients: 'All clients on their birthday',
      lastRun: '2025-01-20 10:00',
      messagesSent: 12
    }
  ];

  const templates = [
    { id: 1, name: 'Appointment Reminder', category: 'appointment', usage: 156 },
    { id: 2, name: 'Treatment Follow-up', category: 'follow-up', usage: 89 },
    { id: 3, name: 'Maintenance Reminder', category: 'reminder', usage: 234 },
    { id: 4, name: 'Promotional Message', category: 'promotion', usage: 45 },
    { id: 5, name: 'Birthday Wishes', category: 'special', usage: 12 }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: 'default',
      scheduled: 'secondary',
      sending: 'outline',
      failed: 'destructive'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="h-4 w-4" />;
      case 'follow-up': return <MessageSquare className="h-4 w-4" />;
      case 'promotion': return <TrendingUp className="h-4 w-4" />;
      case 'reminder': return <Bell className="h-4 w-4" />;
      default: return <Smartphone className="h-4 w-4" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-lea-deep-charcoal">SMS Notifications</h2>
          <p className="text-lea-charcoal-grey">Manage SMS campaigns and automated messages</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showAutomation} onOpenChange={setShowAutomation}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Automation Rules
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>SMS Automation Rules</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {automationRules.map((rule, index) => (
                  <div key={rule.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-lea-deep-charcoal">{rule.name}</h4>
                        <p className="text-sm text-lea-charcoal-grey">{rule.recipients}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-lea-charcoal-grey">
                          <span>Last run: {formatDateTime(rule.lastRun)}</span>
                          <span>•</span>
                          <span>{rule.messagesSent} messages sent</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Switch 
                          checked={rule.status === 'active'} 
                          onCheckedChange={() => {}}
                        />
                        <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                          {rule.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {index < automationRules.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showNewSms} onOpenChange={setShowNewSms}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New SMS
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Send New SMS</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sms-title">Campaign Title</Label>
                    <Input id="sms-title" placeholder="Enter campaign title" />
                  </div>
                  <div>
                    <Label htmlFor="sms-type">Message Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appointment">Appointment</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="promotion">Promotion</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="recipients">Recipients</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Active Clients (1,247)</SelectItem>
                      <SelectItem value="recent">Recent Treatment Clients (89)</SelectItem>
                      <SelectItem value="due">Maintenance Due (456)</SelectItem>
                      <SelectItem value="vip">VIP Clients (78)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Message Content</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Enter your message (160 characters max recommended)..." 
                    rows={4}
                    maxLength={160}
                  />
                  <p className="text-xs text-lea-charcoal-grey mt-1">
                    Available variables: {'{firstName}'}, {'{treatmentType}'}, {'{bookingLink}'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="send-time">Send Time</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Send now" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="now">Send Now</SelectItem>
                        <SelectItem value="schedule">Schedule for Later</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="template-save">Save as Template</Label>
                    <Switch />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowNewSms(false)}>
                    Save Draft
                  </Button>
                  <Button onClick={() => setShowNewSms(false)}>
                    <Send className="w-4 h-4 mr-2" />
                    Send SMS
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* SMS Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lea-deep-charcoal">2,456</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lea-deep-charcoal">98.9%</div>
            <p className="text-xs text-muted-foreground">+0.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lea-deep-charcoal">23.4%</div>
            <p className="text-xs text-muted-foreground">+3.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lea-deep-charcoal">3</div>
            <p className="text-xs text-muted-foreground">automation rules running</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent SMS Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 text-lea-elegant-silver mr-2" />
            Recent SMS Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {smsMessages.map((sms, index) => (
              <div key={sms.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(sms.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-lea-deep-charcoal">{sms.title}</h4>
                        {sms.automation && (
                          <Badge variant="outline" className="text-xs">
                            <Settings className="w-3 h-3 mr-1" />
                            Auto
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-lea-charcoal-grey mt-1 max-w-2xl">
                        {sms.message}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-lea-charcoal-grey">
                        <span>{sms.recipients} recipients</span>
                        {sms.sent && (
                          <>
                            <span>•</span>
                            <span>{sms.delivered}/{sms.sent} delivered</span>
                          </>
                        )}
                        {sms.replies > 0 && (
                          <>
                            <span>•</span>
                            <span>{sms.replies} replies</span>
                          </>
                        )}
                        {sms.sentDate && (
                          <>
                            <span>•</span>
                            <span>Sent {formatDateTime(sms.sentDate)}</span>
                          </>
                        )}
                        {sms.sendDate && (
                          <>
                            <span>•</span>
                            <span>Scheduled {formatDateTime(sms.sendDate)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Delivery Status */}
                    {sms.status === 'completed' && sms.sent && (
                      <div className="text-center">
                        <div className="text-sm font-medium text-lea-deep-charcoal">
                          {Math.round((sms.delivered / sms.sent) * 100)}%
                        </div>
                        <div className="text-xs text-lea-charcoal-grey">delivered</div>
                      </div>
                    )}

                    {/* Status Badge */}
                    {getStatusBadge(sms.status)}

                    {/* Actions */}
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {sms.status === 'scheduled' && (
                        <>
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Pause className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {index < smsMessages.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SMS Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 text-lea-elegant-silver mr-2" />
            SMS Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-lea-deep-charcoal">{template.name}</h4>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Badge variant="secondary" className="mb-2">
                  {template.category}
                </Badge>
                <p className="text-sm text-lea-charcoal-grey">
                  Used {template.usage} times
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SMS Settings & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-lea-elegant-silver mr-2" />
            SMS Settings & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-lea-deep-charcoal mb-2">Business Hours</h4>
                <p className="text-sm text-lea-charcoal-grey mb-3">
                  SMS messages will only be sent during business hours to comply with regulations.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Send messages: 9:00 AM - 6:00 PM</span>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-lea-deep-charcoal mb-2">Opt-out Management</h4>
                <p className="text-sm text-lea-charcoal-grey mb-3">
                  Automatically handle STOP requests and maintain do-not-contact lists.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto opt-out enabled</span>
                  <Switch checked />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-lea-deep-charcoal">12</div>
                <div className="text-sm text-lea-charcoal-grey">Opted out clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-lea-deep-charcoal">£0.045</div>
                <div className="text-sm text-lea-charcoal-grey">Cost per SMS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-lea-deep-charcoal">£110.52</div>
                <div className="text-sm text-lea-charcoal-grey">This month's spend</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
