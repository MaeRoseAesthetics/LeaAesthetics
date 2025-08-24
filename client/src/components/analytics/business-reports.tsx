import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText,
  Download,
  Calendar,
  Clock,
  BarChart3,
  Settings,
  Plus,
  Eye,
  Share,
  Filter,
  Mail,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Users,
  DollarSign,
  TrendingUp,
  Target,
  Activity,
  Award,
  Zap,
  Printer,
  Upload
} from 'lucide-react';

// Mock data for reports
const reportTemplates = [
  {
    id: '1',
    name: 'Monthly Business Summary',
    description: 'Comprehensive overview of monthly performance metrics',
    category: 'Executive',
    frequency: 'Monthly',
    lastGenerated: '2024-08-01T00:00:00Z',
    status: 'active',
    subscribers: 5,
    includes: ['Revenue', 'Client Metrics', 'Treatment Performance', 'Staff Performance'],
  },
  {
    id: '2',
    name: 'Financial Performance Report',
    description: 'Detailed financial analysis with profit margins and forecasts',
    category: 'Financial',
    frequency: 'Weekly',
    lastGenerated: '2024-08-15T00:00:00Z',
    status: 'active',
    subscribers: 3,
    includes: ['Revenue Breakdown', 'Profit Analysis', 'Cost Analysis', 'Payment Methods'],
  },
  {
    id: '3',
    name: 'Client Analytics Report',
    description: 'Client behavior, satisfaction, and retention analysis',
    category: 'Marketing',
    frequency: 'Monthly',
    lastGenerated: '2024-07-28T00:00:00Z',
    status: 'active',
    subscribers: 4,
    includes: ['Client Demographics', 'Satisfaction Scores', 'Retention Rates', 'Acquisition Sources'],
  },
  {
    id: '4',
    name: 'Treatment Success Report',
    description: 'Treatment outcomes and practitioner performance metrics',
    category: 'Clinical',
    frequency: 'Quarterly',
    lastGenerated: '2024-07-01T00:00:00Z',
    status: 'active',
    subscribers: 6,
    includes: ['Success Rates', 'Complication Rates', 'Client Satisfaction', 'Best Practices'],
  },
  {
    id: '5',
    name: 'Compliance Audit Report',
    description: 'Regulatory compliance status and audit trail summary',
    category: 'Compliance',
    frequency: 'Monthly',
    lastGenerated: '2024-08-01T00:00:00Z',
    status: 'active',
    subscribers: 2,
    includes: ['Compliance Status', 'Audit Logs', 'Certification Status', 'Risk Assessment'],
  },
  {
    id: '6',
    name: 'Inventory Management Report',
    description: 'Stock levels, usage patterns, and reorder recommendations',
    category: 'Operations',
    frequency: 'Weekly',
    lastGenerated: '2024-08-12T00:00:00Z',
    status: 'draft',
    subscribers: 3,
    includes: ['Stock Levels', 'Usage Trends', 'Expiry Alerts', 'Cost Analysis'],
  },
];

const scheduledReports = [
  {
    id: '1',
    reportId: '1',
    name: 'Monthly Business Summary',
    nextRun: '2024-09-01T09:00:00Z',
    frequency: 'Monthly',
    recipients: ['admin@leaaesthetics.com', 'manager@leaaesthetics.com'],
    format: 'PDF',
    status: 'scheduled',
  },
  {
    id: '2',
    reportId: '2',
    name: 'Financial Performance Report',
    nextRun: '2024-08-26T08:00:00Z',
    frequency: 'Weekly',
    recipients: ['finance@leaaesthetics.com'],
    format: 'Excel',
    status: 'scheduled',
  },
  {
    id: '3',
    reportId: '3',
    name: 'Client Analytics Report',
    nextRun: '2024-09-01T10:00:00Z',
    frequency: 'Monthly',
    recipients: ['marketing@leaaesthetics.com'],
    format: 'PDF',
    status: 'scheduled',
  },
];

const recentReports = [
  {
    id: '1',
    name: 'Weekly Financial Summary',
    type: 'Financial',
    generatedDate: '2024-08-20T10:30:00Z',
    size: '2.4 MB',
    format: 'PDF',
    downloads: 12,
    status: 'completed',
  },
  {
    id: '2',
    name: 'Client Satisfaction Analysis',
    type: 'Marketing',
    generatedDate: '2024-08-19T14:15:00Z',
    size: '1.8 MB',
    format: 'Excel',
    downloads: 8,
    status: 'completed',
  },
  {
    id: '3',
    name: 'Treatment Performance Q3',
    type: 'Clinical',
    generatedDate: '2024-08-18T16:45:00Z',
    size: '3.1 MB',
    format: 'PDF',
    downloads: 15,
    status: 'completed',
  },
  {
    id: '4',
    name: 'Compliance Audit Aug 2024',
    type: 'Compliance',
    generatedDate: '2024-08-17T11:20:00Z',
    size: '4.2 MB',
    format: 'PDF',
    downloads: 6,
    status: 'completed',
  },
];

export default function BusinessReports() {
  const [activeTab, setActiveTab] = useState('templates');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Draft</Badge>;
      case 'generating':
        return <Badge className="bg-blue-100 text-blue-800"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Generating</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Executive':
        return <Award className="h-5 w-5 text-purple-600" />;
      case 'Financial':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'Marketing':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'Clinical':
        return <Activity className="h-5 w-5 text-red-600" />;
      case 'Compliance':
        return <CheckCircle className="h-5 w-5 text-orange-600" />;
      case 'Operations':
        return <Settings className="h-5 w-5 text-gray-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Executive':
        return 'bg-purple-100 text-purple-800';
      case 'Financial':
        return 'bg-green-100 text-green-800';
      case 'Marketing':
        return 'bg-blue-100 text-blue-800';
      case 'Clinical':
        return 'bg-red-100 text-red-800';
      case 'Compliance':
        return 'bg-orange-100 text-orange-800';
      case 'Operations':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        {/* Report Templates */}
        <TabsContent value="templates">
          <div className="space-y-6">
            {/* Template Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Templates</p>
                      <p className="text-2xl font-bold text-lea-deep-charcoal">{reportTemplates.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-lea-sage-green" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Reports</p>
                      <p className="text-2xl font-bold text-green-600">
                        {reportTemplates.filter(r => r.status === 'active').length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Scheduled Reports</p>
                      <p className="text-2xl font-bold text-blue-600">{scheduledReports.length}</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Subscribers</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {reportTemplates.reduce((sum, r) => sum + r.subscribers, 0)}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report Templates List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Report Templates
                    </CardTitle>
                    <CardDescription>
                      Pre-configured report templates for automated generation
                    </CardDescription>
                  </div>
                  <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Template
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-gray-100 rounded-lg">
                            {getCategoryIcon(template.category)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-lea-deep-charcoal text-lg mb-1">
                              {template.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {template.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {template.frequency}
                              </span>
                              <span className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {template.subscribers} subscribers
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                Last: {new Date(template.lastGenerated).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getCategoryColor(template.category)}>
                            {template.category}
                          </Badge>
                          {getStatusBadge(template.status)}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-lea-deep-charcoal mb-2">Includes:</p>
                        <div className="flex flex-wrap gap-2">
                          {template.includes.map((item) => (
                            <Badge key={item} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4 mr-1" />
                            Configure
                          </Button>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                            <Download className="w-4 h-4 mr-1" />
                            Generate Now
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scheduled Reports */}
        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Scheduled Reports
              </CardTitle>
              <CardDescription>
                Automated report generation schedule and delivery settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-lea-deep-charcoal">{report.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center">
                            <RefreshCw className="w-3 h-3 mr-1" />
                            {report.frequency}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Next: {new Date(report.nextRun).toLocaleDateString()} at {new Date(report.nextRun).toLocaleTimeString()}
                          </span>
                          <span className="flex items-center">
                            <FileText className="w-3 h-3 mr-1" />
                            {report.format}
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium text-lea-deep-charcoal mb-2">Recipients:</p>
                      <div className="flex flex-wrap gap-2">
                        {report.recipients.map((email) => (
                          <Badge key={email} variant="outline" className="text-xs">
                            <Mail className="w-3 h-3 mr-1" />
                            {email}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Will be delivered as {report.format} to {report.recipients.length} recipients
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Run Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Reports */}
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Recent Reports
              </CardTitle>
              <CardDescription>
                Recently generated reports available for download
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-lea-deep-charcoal">{report.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(report.generatedDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <FileText className="w-3 h-3 mr-1" />
                              {report.size}
                            </span>
                            <span className="flex items-center">
                              <Download className="w-3 h-3 mr-1" />
                              {report.downloads} downloads
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className={getCategoryColor(report.type)}>
                          {report.format}
                        </Badge>
                        {getStatusBadge(report.status)}
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Reports */}
        <TabsContent value="custom">
          <div className="space-y-6">
            {/* Custom Report Builder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Custom Report Builder
                </CardTitle>
                <CardDescription>
                  Create custom reports with specific metrics and date ranges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Report Configuration */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reportName">Report Name</Label>
                      <Input id="reportName" placeholder="Enter report name..." />
                    </div>
                    
                    <div>
                      <Label htmlFor="dateRange">Date Range</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7d">Last 7 days</SelectItem>
                          <SelectItem value="30d">Last 30 days</SelectItem>
                          <SelectItem value="90d">Last 3 months</SelectItem>
                          <SelectItem value="1y">Last year</SelectItem>
                          <SelectItem value="custom">Custom range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="format">Export Format</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF Report</SelectItem>
                          <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                          <SelectItem value="csv">CSV Data</SelectItem>
                          <SelectItem value="powerpoint">PowerPoint Presentation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Report Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="executive">Executive Summary</SelectItem>
                          <SelectItem value="financial">Financial Analysis</SelectItem>
                          <SelectItem value="marketing">Marketing Insights</SelectItem>
                          <SelectItem value="clinical">Clinical Performance</SelectItem>
                          <SelectItem value="compliance">Compliance Review</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Metrics Selection */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Include Metrics</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Select the metrics to include in your custom report
                      </p>
                      
                      <div className="space-y-3">
                        {[
                          { id: 'revenue', label: 'Revenue Analysis', description: 'Total revenue, trends, and forecasts' },
                          { id: 'clients', label: 'Client Metrics', description: 'New clients, retention, satisfaction' },
                          { id: 'treatments', label: 'Treatment Performance', description: 'Success rates, popularity, outcomes' },
                          { id: 'staff', label: 'Staff Performance', description: 'Practitioner metrics and productivity' },
                          { id: 'compliance', label: 'Compliance Status', description: 'Regulatory compliance and audit data' },
                          { id: 'inventory', label: 'Inventory Analysis', description: 'Stock levels, usage, and costs' },
                        ].map((metric) => (
                          <div key={metric.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                            <input 
                              type="checkbox" 
                              id={metric.id}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <Label htmlFor={metric.id} className="font-medium cursor-pointer">
                                {metric.label}
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                {metric.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Report will be generated based on selected metrics and date range
                    </div>
                    <div className="flex space-x-3">
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                        <Download className="w-4 h-4 mr-2" />
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Report Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Report Actions</CardTitle>
                <CardDescription>
                  Generate common reports with pre-configured settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Daily Summary', icon: Activity, description: 'Yesterday\'s key metrics', color: 'bg-blue-100 text-blue-800' },
                    { name: 'Weekly Financial', icon: DollarSign, description: 'Weekly revenue analysis', color: 'bg-green-100 text-green-800' },
                    { name: 'Client Satisfaction', icon: Users, description: 'Recent feedback summary', color: 'bg-purple-100 text-purple-800' },
                    { name: 'Treatment Outcomes', icon: Target, description: 'Success rate analysis', color: 'bg-red-100 text-red-800' },
                    { name: 'Compliance Check', icon: CheckCircle, description: 'Current compliance status', color: 'bg-orange-100 text-orange-800' },
                    { name: 'Performance Dashboard', icon: BarChart3, description: 'Executive overview', color: 'bg-gray-100 text-gray-800' },
                  ].map((action) => (
                    <Card key={action.name} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 ${action.color}`}>
                          <action.icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-medium text-lea-deep-charcoal mb-1">{action.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-1" />
                          Generate
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Report Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="templateName">Template Name</Label>
                <Input id="templateName" placeholder="Enter template name..." />
              </div>
              <div>
                <Label htmlFor="templateCategory">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="executive">Executive</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="clinical">Clinical</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="templateDescription">Description</Label>
              <Input id="templateDescription" placeholder="Describe what this report will include..." />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="frequency">Generation Frequency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="format">Default Format</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="powerpoint">PowerPoint</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                Create Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
