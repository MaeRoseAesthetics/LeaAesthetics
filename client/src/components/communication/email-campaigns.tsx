import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Mail, 
  Plus, 
  Send, 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  MousePointer, 
  Users, 
  Calendar,
  Target,
  BarChart3,
  FileText,
  Settings,
  Play,
  Pause,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function EmailCampaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showNewCampaign, setShowNewCampaign] = useState(false);

  // Mock data for email campaigns
  const campaigns = [
    {
      id: 1,
      name: 'Monthly Newsletter - January',
      status: 'sent',
      subject: 'New Year, New You - Special Treatment Offers',
      recipients: 1247,
      sentDate: '2025-01-15',
      openRate: 34.2,
      clickRate: 8.9,
      opens: 427,
      clicks: 111,
      bounces: 12,
      unsubscribes: 3,
      template: 'newsletter',
      segment: 'All Active Clients'
    },
    {
      id: 2,
      name: 'Botox Promotion',
      status: 'scheduled',
      subject: '20% Off Botox Treatments This Month',
      recipients: 634,
      sendDate: '2025-01-28',
      template: 'promotion',
      segment: 'Previous Botox Clients'
    },
    {
      id: 3,
      name: 'Follow-up Sequence - Part 1',
      status: 'active',
      subject: 'How was your recent treatment?',
      recipients: 89,
      sentDate: '2025-01-20',
      openRate: 67.4,
      clickRate: 23.6,
      opens: 60,
      clicks: 21,
      template: 'follow-up',
      segment: 'Recent Treatment Clients'
    },
    {
      id: 4,
      name: 'Treatment Reminder Campaign',
      status: 'draft',
      subject: 'Time for your next maintenance treatment',
      recipients: 456,
      template: 'reminder',
      segment: 'Due for Treatment'
    }
  ];

  const templates = [
    { id: 1, name: 'Newsletter Template', category: 'newsletter', usage: 12 },
    { id: 2, name: 'Promotion Template', category: 'promotion', usage: 8 },
    { id: 3, name: 'Follow-up Template', category: 'follow-up', usage: 15 },
    { id: 4, name: 'Welcome Series', category: 'welcome', usage: 6 },
    { id: 5, name: 'Treatment Reminder', category: 'reminder', usage: 22 }
  ];

  const segments = [
    { id: 1, name: 'All Active Clients', count: 1247 },
    { id: 2, name: 'Previous Botox Clients', count: 634 },
    { id: 3, name: 'Recent Treatment Clients', count: 89 },
    { id: 4, name: 'Due for Treatment', count: 456 },
    { id: 5, name: 'VIP Clients', count: 78 },
    { id: 6, name: 'New Clients (Last 30 days)', count: 156 }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      sent: 'default',
      scheduled: 'secondary',
      active: 'outline',
      draft: 'destructive'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-lea-deep-charcoal">Email Campaigns</h2>
          <p className="text-lea-charcoal-grey">Create and manage email marketing campaigns</p>
        </div>
        <Dialog open={showNewCampaign} onOpenChange={setShowNewCampaign}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Email Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input id="campaign-name" placeholder="Enter campaign name" />
                </div>
                <div>
                  <Label htmlFor="template">Template</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(template => (
                        <SelectItem key={template.id} value={template.id.toString()}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject Line</Label>
                <Input id="subject" placeholder="Enter email subject" />
              </div>
              <div>
                <Label htmlFor="segment">Recipient Segment</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {segments.map(segment => (
                      <SelectItem key={segment.id} value={segment.id.toString()}>
                        {segment.name} ({segment.count} recipients)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="content">Email Content</Label>
                <Textarea 
                  id="content" 
                  placeholder="Enter email content..." 
                  rows={6}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewCampaign(false)}>
                  Save as Draft
                </Button>
                <Button onClick={() => setShowNewCampaign(false)}>
                  Schedule Campaign
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaign Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lea-deep-charcoal">24</div>
            <p className="text-xs text-muted-foreground">+3 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lea-deep-charcoal">42.8%</div>
            <p className="text-xs text-muted-foreground">+2.4% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lea-deep-charcoal">12.3%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lea-deep-charcoal">8,934</div>
            <p className="text-xs text-muted-foreground">+156 new subscribers</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 text-lea-elegant-silver mr-2" />
            Recent Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign, index) => (
              <div key={campaign.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Mail className="h-5 w-5 text-lea-elegant-silver" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-lea-deep-charcoal">{campaign.name}</h4>
                      <p className="text-sm text-lea-charcoal-grey">{campaign.subject}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-lea-charcoal-grey">
                        <span>{campaign.recipients} recipients</span>
                        <span>•</span>
                        <span>{campaign.segment}</span>
                        {campaign.sentDate && (
                          <>
                            <span>•</span>
                            <span>Sent {formatDate(campaign.sentDate)}</span>
                          </>
                        )}
                        {campaign.sendDate && (
                          <>
                            <span>•</span>
                            <span>Scheduled {formatDate(campaign.sendDate)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Campaign Performance */}
                    {campaign.status === 'sent' || campaign.status === 'active' ? (
                      <div className="text-sm">
                        <div className="flex items-center space-x-2">
                          <Eye className="h-3 w-3" />
                          <span>{campaign.openRate}%</span>
                          <MousePointer className="h-3 w-3 ml-2" />
                          <span>{campaign.clickRate}%</span>
                        </div>
                        <div className="text-xs text-lea-charcoal-grey mt-1">
                          {campaign.opens} opens • {campaign.clicks} clicks
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-lea-charcoal-grey">
                        {campaign.status === 'scheduled' && <Clock className="h-4 w-4" />}
                        {campaign.status === 'draft' && <FileText className="h-4 w-4" />}
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(campaign.status)}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      {campaign.status === 'scheduled' && (
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Performance Progress Bars */}
                {(campaign.status === 'sent' || campaign.status === 'active') && (
                  <div className="mt-3 ml-9 space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Open Rate</span>
                        <span>{campaign.openRate}%</span>
                      </div>
                      <Progress value={campaign.openRate} className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Click Rate</span>
                        <span>{campaign.clickRate}%</span>
                      </div>
                      <Progress value={campaign.clickRate} className="h-1" />
                    </div>
                  </div>
                )}

                {index < campaigns.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Templates & Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 text-lea-elegant-silver mr-2" />
              Email Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {templates.map((template, index) => (
                <div key={template.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-lea-deep-charcoal">{template.name}</p>
                      <p className="text-sm text-lea-charcoal-grey">
                        {template.category} • Used {template.usage} times
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {index < templates.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recipient Segments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 text-lea-elegant-silver mr-2" />
              Recipient Segments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {segments.map((segment, index) => (
                <div key={segment.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-lea-deep-charcoal">{segment.name}</p>
                      <p className="text-sm text-lea-charcoal-grey">
                        {segment.count.toLocaleString()} recipients
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {index < segments.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
