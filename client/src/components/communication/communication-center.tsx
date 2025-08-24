import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  MessageSquare, 
  Mail, 
  Smartphone, 
  Bell, 
  Send, 
  Users, 
  Calendar,
  FileText,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Archive,
  Star,
  Paperclip,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  subject: string;
  content: string;
  type: 'internal' | 'email' | 'sms';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  sentDate: Date;
  readDate?: Date;
  attachments: string[];
  isStarred: boolean;
  isArchived: boolean;
  threadId?: string;
}

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'notification';
  category: 'appointment' | 'reminder' | 'marketing' | 'follow-up' | 'general';
  subject?: string;
  content: string;
  variables: Array<{
    key: string;
    label: string;
    type: 'text' | 'date' | 'number';
    defaultValue?: string;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    event: 'booking_created' | 'booking_cancelled' | 'treatment_completed' | 'assessment_submitted' | 'custom';
    conditions: Array<{
      field: string;
      operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
      value: string;
    }>;
  };
  actions: Array<{
    type: 'send_email' | 'send_sms' | 'create_notification' | 'create_task';
    templateId?: string;
    delay?: number; // minutes
    recipientType: 'client' | 'practitioner' | 'admin' | 'custom';
    customRecipient?: string;
  }>;
  isActive: boolean;
  lastTriggered?: Date;
  executionCount: number;
}

interface Notification {
  id: string;
  recipientId: string;
  recipientName: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'appointment' | 'system' | 'compliance' | 'marketing';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionLabel?: string;
}

export const CommunicationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState<Message[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [showNewTemplateDialog, setShowNewTemplateDialog] = useState(false);
  
  const [newMessage, setNewMessage] = useState({
    recipientId: '',
    type: 'email' as 'internal' | 'email' | 'sms',
    subject: '',
    content: '',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent'
  });

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'email' as 'email' | 'sms' | 'notification',
    category: 'general' as 'appointment' | 'reminder' | 'marketing' | 'follow-up' | 'general',
    subject: '',
    content: ''
  });

  // Mock data - would come from API
  useEffect(() => {
    setMessages([
      {
        id: '1',
        senderId: 'practitioner1',
        senderName: 'Dr. Sarah Smith',
        recipientId: 'client1',
        recipientName: 'Emma Johnson',
        subject: 'Appointment Confirmation',
        content: 'Your appointment for Botox treatment has been confirmed for tomorrow at 2:00 PM.',
        type: 'email',
        status: 'delivered',
        priority: 'normal',
        sentDate: new Date('2024-08-23T10:30:00'),
        readDate: new Date('2024-08-23T11:15:00'),
        attachments: [],
        isStarred: false,
        isArchived: false
      },
      {
        id: '2',
        senderId: 'system',
        senderName: 'System',
        recipientId: 'client2',
        recipientName: 'Michael Chen',
        subject: '',
        content: 'Reminder: Your consultation is in 2 hours. Please arrive 10 minutes early.',
        type: 'sms',
        status: 'delivered',
        priority: 'high',
        sentDate: new Date('2024-08-23T12:00:00'),
        attachments: [],
        isStarred: true,
        isArchived: false
      }
    ]);

    setTemplates([
      {
        id: '1',
        name: 'Appointment Confirmation',
        type: 'email',
        category: 'appointment',
        subject: 'Appointment Confirmation - {{treatment_name}}',
        content: 'Dear {{client_name}},\n\nYour appointment for {{treatment_name}} has been confirmed for {{appointment_date}} at {{appointment_time}}.\n\nPlease arrive 10 minutes early and bring a valid ID.\n\nBest regards,\nLea Aesthetics Team',
        variables: [
          { key: 'client_name', label: 'Client Name', type: 'text' },
          { key: 'treatment_name', label: 'Treatment Name', type: 'text' },
          { key: 'appointment_date', label: 'Appointment Date', type: 'date' },
          { key: 'appointment_time', label: 'Appointment Time', type: 'text' }
        ],
        isActive: true,
        createdAt: new Date('2024-08-01'),
        updatedAt: new Date('2024-08-20')
      },
      {
        id: '2',
        name: 'SMS Reminder',
        type: 'sms',
        category: 'reminder',
        content: 'Reminder: {{client_name}}, your {{treatment_name}} appointment is in {{time_until}}. Location: {{clinic_address}}',
        variables: [
          { key: 'client_name', label: 'Client Name', type: 'text' },
          { key: 'treatment_name', label: 'Treatment Name', type: 'text' },
          { key: 'time_until', label: 'Time Until Appointment', type: 'text' },
          { key: 'clinic_address', label: 'Clinic Address', type: 'text' }
        ],
        isActive: true,
        createdAt: new Date('2024-07-15'),
        updatedAt: new Date('2024-08-10')
      }
    ]);

    setAutomationRules([
      {
        id: '1',
        name: '24-Hour Appointment Reminder',
        description: 'Send email reminder 24 hours before appointment',
        trigger: {
          event: 'booking_created',
          conditions: [
            { field: 'status', operator: 'equals', value: 'confirmed' }
          ]
        },
        actions: [
          {
            type: 'send_email',
            templateId: '1',
            delay: 1440, // 24 hours
            recipientType: 'client'
          }
        ],
        isActive: true,
        lastTriggered: new Date('2024-08-23T09:00:00'),
        executionCount: 45
      },
      {
        id: '2',
        name: '2-Hour SMS Reminder',
        description: 'Send SMS reminder 2 hours before appointment',
        trigger: {
          event: 'booking_created',
          conditions: [
            { field: 'status', operator: 'equals', value: 'confirmed' }
          ]
        },
        actions: [
          {
            type: 'send_sms',
            templateId: '2',
            delay: 120, // 2 hours
            recipientType: 'client'
          }
        ],
        isActive: true,
        lastTriggered: new Date('2024-08-23T12:00:00'),
        executionCount: 38
      }
    ]);

    setNotifications([
      {
        id: '1',
        recipientId: 'practitioner1',
        recipientName: 'Dr. Sarah Smith',
        title: 'New Booking',
        message: 'Emma Johnson has booked a Botox treatment for tomorrow at 2:00 PM',
        type: 'info',
        category: 'appointment',
        isRead: false,
        createdAt: new Date('2024-08-23T14:30:00'),
        actionUrl: '/bookings/123',
        actionLabel: 'View Booking'
      },
      {
        id: '2',
        recipientId: 'admin1',
        recipientName: 'Admin User',
        title: 'Compliance Alert',
        message: 'Client consent form for Michael Chen expires in 3 days',
        type: 'warning',
        category: 'compliance',
        isRead: true,
        createdAt: new Date('2024-08-23T13:15:00'),
        actionUrl: '/compliance/client/456',
        actionLabel: 'Review Consent'
      }
    ]);
  }, []);

  const sendMessage = () => {
    console.log('Sending message:', newMessage);
    setShowNewMessageDialog(false);
    setNewMessage({
      recipientId: '',
      type: 'email',
      subject: '',
      content: '',
      priority: 'normal'
    });
    // Implementation for sending message
  };

  const createTemplate = () => {
    console.log('Creating template:', newTemplate);
    setShowNewTemplateDialog(false);
    setNewTemplate({
      name: '',
      type: 'email',
      category: 'general',
      subject: '',
      content: ''
    });
    // Implementation for creating template
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'read':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'normal':
        return 'text-blue-600 bg-blue-100';
      case 'low':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Communication Center</h2>
        <div className="flex space-x-2">
          <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
            <DialogTrigger asChild>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </DialogTrigger>
          </Dialog>
          
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message List */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Messages</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                          selectedMessage?.id === message.id ? 'border-primary bg-muted' : ''
                        }`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {message.type === 'email' ? (
                              <Mail className="h-4 w-4 text-blue-500" />
                            ) : message.type === 'sms' ? (
                              <Smartphone className="h-4 w-4 text-green-500" />
                            ) : (
                              <MessageSquare className="h-4 w-4 text-purple-500" />
                            )}
                            {getStatusIcon(message.status)}
                            {message.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(message.sentDate, 'MMM dd, HH:mm')}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{message.recipientName}</span>
                            <Badge className={`text-xs ${getPriorityColor(message.priority)}`}>
                              {message.priority.toUpperCase()}
                            </Badge>
                          </div>
                          
                          {message.subject && (
                            <p className="text-sm font-medium truncate">{message.subject}</p>
                          )}
                          
                          <p className="text-sm text-muted-foreground truncate">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {selectedMessage.type === 'email' ? (
                          <Mail className="h-5 w-5 text-blue-500" />
                        ) : selectedMessage.type === 'sms' ? (
                          <Smartphone className="h-5 w-5 text-green-500" />
                        ) : (
                          <MessageSquare className="h-5 w-5 text-purple-500" />
                        )}
                        <div>
                          <CardTitle className="text-lg">
                            {selectedMessage.subject || 'SMS Message'}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            To: {selectedMessage.recipientName} • 
                            From: {selectedMessage.senderName} • 
                            {format(selectedMessage.sentDate, 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(selectedMessage.priority)}>
                          {selectedMessage.priority.toUpperCase()}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(selectedMessage.status)}
                        <span className="text-sm capitalize">{selectedMessage.status}</span>
                      </div>
                      
                      {selectedMessage.readDate && (
                        <span className="text-sm text-muted-foreground">
                          Read: {format(selectedMessage.readDate, 'MMM dd, HH:mm')}
                        </span>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-sm">{selectedMessage.content}</div>
                    </div>
                    
                    {selectedMessage.attachments.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Attachments</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedMessage.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                              <Paperclip className="h-4 w-4" />
                              <span className="text-sm">{attachment}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Reply
                      </Button>
                      <Button variant="outline" size="sm">
                        Forward
                      </Button>
                      <Button variant="outline" size="sm">
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Select a message to view details</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="space-y-6">
            {/* Template Management Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Message Templates</CardTitle>
                  <Dialog open={showNewTemplateDialog} onOpenChange={setShowNewTemplateDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Template
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardHeader>
            </Card>

            {/* Template Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {template.type === 'email' ? (
                          <Mail className="h-5 w-5 text-blue-500" />
                        ) : template.type === 'sms' ? (
                          <Smartphone className="h-5 w-5 text-green-500" />
                        ) : (
                          <Bell className="h-5 w-5 text-purple-500" />
                        )}
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <p className="text-sm text-muted-foreground capitalize">
                            {template.category} • {template.type}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={template.isActive ? "default" : "secondary"}>
                          {template.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {template.subject && (
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Subject:</h4>
                        <p className="text-sm text-muted-foreground">{template.subject}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Content Preview:</h4>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {template.content}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Variables ({template.variables.length}):</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.slice(0, 3).map((variable) => (
                          <Badge key={variable.key} variant="outline" className="text-xs">
                            {variable.label}
                          </Badge>
                        ))}
                        {template.variables.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.variables.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Send className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="automation">
          <div className="space-y-6">
            {/* Automation Rules Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Rules</p>
                      <p className="text-2xl font-bold">{automationRules.filter(r => r.isActive).length}</p>
                    </div>
                    <Settings className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Messages Sent Today</p>
                      <p className="text-2xl font-bold">47</p>
                    </div>
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold">96.2%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Automation Rules List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Automation Rules</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automationRules.map((rule) => (
                    <div key={rule.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Switch checked={rule.isActive} />
                          <div>
                            <h4 className="font-semibold">{rule.name}</h4>
                            <p className="text-sm text-muted-foreground">{rule.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {rule.executionCount} executions
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-medium mb-2">Trigger:</h5>
                          <div className="bg-muted p-2 rounded">
                            <p>Event: <span className="font-mono">{rule.trigger.event}</span></p>
                            {rule.trigger.conditions.map((condition, index) => (
                              <p key={index}>
                                {condition.field} {condition.operator} "{condition.value}"
                              </p>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">Actions:</h5>
                          <div className="bg-muted p-2 rounded space-y-1">
                            {rule.actions.map((action, index) => (
                              <p key={index}>
                                {action.type.replace('_', ' ')} to {action.recipientType}
                                {action.delay && ` (after ${action.delay} min)`}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {rule.lastTriggered && (
                        <p className="text-xs text-muted-foreground">
                          Last triggered: {format(rule.lastTriggered, 'MMM dd, yyyy HH:mm')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="space-y-6">
            {/* Notification Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold">{notifications.length}</p>
                    </div>
                    <Bell className="h-6 w-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Unread</p>
                      <p className="text-2xl font-bold text-red-600">
                        {notifications.filter(n => !n.isRead).length}
                      </p>
                    </div>
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Appointments</p>
                      <p className="text-2xl font-bold">
                        {notifications.filter(n => n.category === 'appointment').length}
                      </p>
                    </div>
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Compliance</p>
                      <p className="text-2xl font-bold">
                        {notifications.filter(n => n.category === 'compliance').length}
                      </p>
                    </div>
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notifications List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border rounded-lg flex items-start space-x-3 ${
                        !notification.isRead ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm">{notification.title}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs capitalize">
                              {notification.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(notification.createdAt, 'MMM dd, HH:mm')}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          To: {notification.recipientName}
                        </p>
                        
                        <p className="text-sm mb-3">{notification.message}</p>
                        
                        {notification.actionUrl && (
                          <Button variant="outline" size="sm">
                            {notification.actionLabel || 'View Details'}
                          </Button>
                        )}
                      </div>
                      
                      {!notification.isRead && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            {/* Communication Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Messages Sent</p>
                      <p className="text-2xl font-bold">1,247</p>
                      <div className="text-xs text-green-600">↗ 12% vs last month</div>
                    </div>
                    <Send className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Delivery Rate</p>
                      <p className="text-2xl font-bold">98.4%</p>
                      <div className="text-xs text-green-600">↗ 2.1% vs last month</div>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                      <p className="text-2xl font-bold">34.2%</p>
                      <div className="text-xs text-yellow-600">↘ 3.2% vs last month</div>
                    </div>
                    <MessageSquare className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Automation Success</p>
                      <p className="text-2xl font-bold">96.8%</p>
                      <div className="text-xs text-green-600">↗ 1.5% vs last month</div>
                    </div>
                    <Settings className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Channel Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Communication Channel Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Email</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Sent</span>
                        <span className="font-medium">847</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivered</span>
                        <span className="font-medium">834 (98.5%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Opened</span>
                        <span className="font-medium">567 (68.0%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Clicked</span>
                        <span className="font-medium">198 (34.9%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">SMS</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Sent</span>
                        <span className="font-medium">265</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivered</span>
                        <span className="font-medium">262 (98.9%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Read</span>
                        <span className="font-medium">241 (92.0%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Replied</span>
                        <span className="font-medium">45 (18.7%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Internal Messages</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Sent</span>
                        <span className="font-medium">135</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivered</span>
                        <span className="font-medium">135 (100%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Read</span>
                        <span className="font-medium">128 (94.8%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Replied</span>
                        <span className="font-medium">89 (69.5%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* New Message Dialog */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send New Message</DialogTitle>
          <DialogDescription>
            Send a message to clients, staff, or students.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Recipient</Label>
              <Select
                value={newMessage.recipientId}
                onValueChange={(value) => setNewMessage({ ...newMessage, recipientId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client1">Emma Johnson (Client)</SelectItem>
                  <SelectItem value="client2">Michael Chen (Client)</SelectItem>
                  <SelectItem value="staff1">Dr. Sarah Smith (Staff)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Message Type</Label>
              <Select
                value={newMessage.type}
                onValueChange={(value: 'internal' | 'email' | 'sms') =>
                  setNewMessage({ ...newMessage, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="internal">Internal Message</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {newMessage.type !== 'sms' && (
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  placeholder="Message subject"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={newMessage.priority}
                onValueChange={(value: 'low' | 'normal' | 'high' | 'urgent') =>
                  setNewMessage({ ...newMessage, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              value={newMessage.content}
              onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
              placeholder="Type your message here..."
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewMessageDialog(false)}>
            Cancel
          </Button>
          <Button onClick={sendMessage}>
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* New Template Dialog */}
      <Dialog open={showNewTemplateDialog} onOpenChange={setShowNewTemplateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Message Template</DialogTitle>
            <DialogDescription>
              Create a reusable template for common messages.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="e.g., Appointment Reminder"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={newTemplate.type}
                  onValueChange={(value: 'email' | 'sms' | 'notification') =>
                    setNewTemplate({ ...newTemplate, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={newTemplate.category}
                onValueChange={(value: 'appointment' | 'reminder' | 'marketing' | 'follow-up' | 'general') =>
                  setNewTemplate({ ...newTemplate, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appointment">Appointment</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newTemplate.type === 'email' && (
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                  placeholder="Email subject with variables like {{client_name}}"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                placeholder="Template content with variables like {{client_name}}, {{appointment_date}}, etc."
                rows={6}
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Available variables:</p>
              <div className="flex flex-wrap gap-2">
                {['client_name', 'appointment_date', 'appointment_time', 'treatment_name', 'practitioner_name', 'clinic_address'].map((variable) => (
                  <Badge key={variable} variant="outline" className="text-xs">
                    {`{{${variable}}}`}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTemplateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createTemplate}>
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunicationCenter;
