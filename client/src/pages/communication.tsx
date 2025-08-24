import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  MessageSquare, 
  Smartphone, 
  History, 
  FileText,
  TrendingUp,
  Users,
  Clock,
  Send,
  Eye,
  MousePointer,
  Phone,
  MessageCircle,
  Plus
} from 'lucide-react';
import EmailCampaigns from '@/components/communication/email-campaigns';
import SmsNotifications from '@/components/communication/sms-notifications';
import InAppMessaging from '@/components/communication/in-app-messaging';
import CommunicationHistory from '@/components/communication/communication-history';
import TemplateLibrary from '@/components/communication/template-library';

export default function Communication() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for overview metrics
  const overviewMetrics = {
    totalMessages: 12847,
    emailsSent: 8934,
    smsCount: 2456,
    inAppMessages: 1457,
    deliveryRate: 98.7,
    openRate: 34.2,
    clickRate: 8.9,
    responseRate: 12.5
  };

  const recentActivity = [
    {
      id: 1,
      type: 'email',
      title: 'Monthly Newsletter',
      recipients: 1247,
      status: 'delivered',
      timestamp: '2 hours ago',
      metrics: { opens: 427, clicks: 89 }
    },
    {
      id: 2,
      type: 'sms',
      title: 'Appointment Reminder',
      recipients: 34,
      status: 'delivered',
      timestamp: '4 hours ago',
      metrics: { delivered: 34, replies: 5 }
    },
    {
      id: 3,
      type: 'in-app',
      title: 'Treatment Follow-up',
      recipients: 12,
      status: 'read',
      timestamp: '6 hours ago',
      metrics: { read: 10, replied: 3 }
    },
    {
      id: 4,
      type: 'email',
      title: 'Treatment Promotion',
      recipients: 892,
      status: 'sent',
      timestamp: '1 day ago',
      metrics: { opens: 234, clicks: 45 }
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <Smartphone className="w-4 h-4" />;
      case 'in-app': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      delivered: 'default',
      sent: 'secondary',
      read: 'outline',
      failed: 'destructive'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-lea-pearl-white">
      {/* Header */}
      <div className="bg-white border-b border-lea-elegant-silver">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-lea-deep-charcoal">Communication Center</h1>
              <p className="text-lea-charcoal-grey mt-1">Manage emails, SMS, and in-app messaging</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <History className="w-4 h-4 mr-2" />
                View History
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="email">Email Campaigns</TabsTrigger>
            <TabsTrigger value="sms">SMS Notifications</TabsTrigger>
            <TabsTrigger value="messaging">In-App Messages</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                  <Send className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-lea-deep-charcoal">
                    {overviewMetrics.totalMessages.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-lea-deep-charcoal">
                    {overviewMetrics.deliveryRate}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +0.3% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-lea-deep-charcoal">
                    {overviewMetrics.openRate}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +2.1% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-lea-deep-charcoal">
                    {overviewMetrics.clickRate}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +0.8% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Communication Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Mail className="h-5 w-5 text-lea-elegant-silver mr-2" />
                  <CardTitle className="text-sm font-medium">Email Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-lea-deep-charcoal">
                    {overviewMetrics.emailsSent.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">messages sent</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Smartphone className="h-5 w-5 text-lea-elegant-silver mr-2" />
                  <CardTitle className="text-sm font-medium">SMS Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-lea-deep-charcoal">
                    {overviewMetrics.smsCount.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">messages sent</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <MessageSquare className="h-5 w-5 text-lea-elegant-silver mr-2" />
                  <CardTitle className="text-sm font-medium">In-App Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-lea-deep-charcoal">
                    {overviewMetrics.inAppMessages.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">messages sent</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 text-lea-elegant-silver mr-2" />
                  Recent Communication Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {getTypeIcon(activity.type)}
                          </div>
                          <div>
                            <p className="font-medium text-lea-deep-charcoal">{activity.title}</p>
                            <p className="text-sm text-lea-charcoal-grey">
                              {activity.recipients} recipients • {activity.timestamp}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {activity.type === 'email' && (
                            <div className="text-sm text-lea-charcoal-grey">
                              {activity.metrics.opens} opens • {activity.metrics.clicks} clicks
                            </div>
                          )}
                          {activity.type === 'sms' && (
                            <div className="text-sm text-lea-charcoal-grey">
                              {activity.metrics.delivered} delivered • {activity.metrics.replies} replies
                            </div>
                          )}
                          {activity.type === 'in-app' && (
                            <div className="text-sm text-lea-charcoal-grey">
                              {activity.metrics.read} read • {activity.metrics.replied} replied
                            </div>
                          )}
                          {getStatusBadge(activity.status)}
                        </div>
                      </div>
                      {index < recentActivity.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Individual Module Tabs */}
          <TabsContent value="email">
            <EmailCampaigns />
          </TabsContent>
          
          <TabsContent value="sms">
            <SmsNotifications />
          </TabsContent>
          
          <TabsContent value="messaging">
            <InAppMessaging />
          </TabsContent>
          
          <TabsContent value="history">
            <CommunicationHistory />
          </TabsContent>
          
          <TabsContent value="templates">
            <TemplateLibrary />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
