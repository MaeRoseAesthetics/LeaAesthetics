import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';
import { AlertTriangle, CheckCircle, XCircle, Shield, FileText, Clock, Users, AlertCircle, Download, Eye, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface ComplianceItem {
  id: string;
  category: 'JCCP' | 'CQC' | 'GDPR' | 'Safety' | 'Training';
  requirement: string;
  status: 'compliant' | 'at-risk' | 'non-compliant' | 'pending';
  lastReviewed: Date;
  nextReview: Date;
  responsible: string;
  evidence: string[];
  notes: string;
  priority: 'high' | 'medium' | 'low';
}

interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  tableName: string;
  recordId: string;
  oldValues: any;
  newValues: any;
  ipAddress: string;
  category: 'access' | 'modification' | 'deletion' | 'creation' | 'system';
  riskLevel: 'low' | 'medium' | 'high';
}

interface ComplianceReport {
  id: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'incident';
  status: 'draft' | 'pending-review' | 'approved' | 'submitted';
  createdDate: Date;
  coversPeriod: { start: Date; end: Date };
  findings: string[];
  recommendations: string[];
  attachments: string[];
}

const statusColors = {
  compliant: 'text-green-600 bg-green-100',
  'at-risk': 'text-yellow-600 bg-yellow-100',
  'non-compliant': 'text-red-600 bg-red-100',
  pending: 'text-blue-600 bg-blue-100'
};

const priorityColors = {
  high: 'text-red-600 bg-red-100',
  medium: 'text-yellow-600 bg-yellow-100',
  low: 'text-green-600 bg-green-100'
};

const complianceData = [
  { name: 'Jan', compliant: 85, atRisk: 10, nonCompliant: 5 },
  { name: 'Feb', compliant: 88, atRisk: 8, nonCompliant: 4 },
  { name: 'Mar', compliant: 92, atRisk: 6, nonCompliant: 2 },
  { name: 'Apr', compliant: 90, atRisk: 7, nonCompliant: 3 },
  { name: 'May', compliant: 94, atRisk: 4, nonCompliant: 2 },
  { name: 'Jun', compliant: 96, atRisk: 3, nonCompliant: 1 }
];

const pieData = [
  { name: 'Compliant', value: 85, color: '#10B981' },
  { name: 'At Risk', value: 10, color: '#F59E0B' },
  { name: 'Non-Compliant', value: 5, color: '#EF4444' }
];

export const ComplianceAuditDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('30');

  // Mock data - would come from API
  useEffect(() => {
    setComplianceItems([
      {
        id: '1',
        category: 'JCCP',
        requirement: 'Practitioner Registration Current',
        status: 'compliant',
        lastReviewed: new Date('2024-08-01'),
        nextReview: new Date('2025-08-01'),
        responsible: 'Dr. Smith',
        evidence: ['certificate.pdf', 'renewal-receipt.pdf'],
        notes: 'Annual renewal completed successfully',
        priority: 'high'
      },
      {
        id: '2',
        category: 'CQC',
        requirement: 'Infection Control Standards',
        status: 'at-risk',
        lastReviewed: new Date('2024-07-15'),
        nextReview: new Date('2024-09-15'),
        responsible: 'Clinic Manager',
        evidence: ['cleaning-log.pdf', 'inspection-report.pdf'],
        notes: 'Minor issues identified in last inspection',
        priority: 'medium'
      },
      {
        id: '3',
        category: 'GDPR',
        requirement: 'Data Protection Impact Assessment',
        status: 'non-compliant',
        lastReviewed: new Date('2024-06-01'),
        nextReview: new Date('2024-08-01'),
        responsible: 'IT Manager',
        evidence: [],
        notes: 'DPIA overdue for new client portal features',
        priority: 'high'
      }
    ]);

    setAuditEntries([
      {
        id: '1',
        timestamp: new Date('2024-08-23T14:30:00'),
        userId: 'user123',
        userName: 'Dr. Sarah Smith',
        action: 'UPDATE',
        tableName: 'clients',
        recordId: 'client456',
        oldValues: { phone: '07123456789' },
        newValues: { phone: '07987654321' },
        ipAddress: '192.168.1.10',
        category: 'modification',
        riskLevel: 'low'
      },
      {
        id: '2',
        timestamp: new Date('2024-08-23T13:15:00'),
        userId: 'user456',
        userName: 'Admin User',
        action: 'DELETE',
        tableName: 'treatments',
        recordId: 'treatment789',
        oldValues: { name: 'Botox Treatment', price: 250 },
        newValues: null,
        ipAddress: '192.168.1.5',
        category: 'deletion',
        riskLevel: 'high'
      }
    ]);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4" />;
      case 'at-risk':
        return <AlertTriangle className="h-4 w-4" />;
      case 'non-compliant':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const generateReport = (type: string) => {
    console.log(`Generating ${type} compliance report`);
    // Implementation for report generation
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Compliance & Audit Dashboard</h2>
        <div className="flex space-x-2">
          <Badge variant="secondary" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Compliance Monitoring
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Items</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Compliance Score Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Overall Compliance</p>
                        <p className="text-3xl font-bold text-green-600">96%</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <Progress value={96} className="mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">At Risk Items</p>
                        <p className="text-3xl font-bold text-yellow-600">3</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Requires attention</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                        <p className="text-3xl font-bold text-red-600">1</p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Immediate action needed</p>
                  </CardContent>
                </Card>
              </div>

              {/* Compliance Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={complianceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="compliant" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="atRisk" stroke="#F59E0B" strokeWidth={2} />
                      <Line type="monotone" dataKey="nonCompliant" stroke="#EF4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Compliance Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Audit Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {auditEntries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-start space-x-3">
                      <div className={`p-1 rounded-full ${entry.riskLevel === 'high' ? 'bg-red-100' : entry.riskLevel === 'medium' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                        <div className={`h-2 w-2 rounded-full ${entry.riskLevel === 'high' ? 'bg-red-500' : entry.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {entry.userName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {entry.action} in {entry.tableName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {entry.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="JCCP">JCCP</SelectItem>
                      <SelectItem value="CQC">CQC</SelectItem>
                      <SelectItem value="GDPR">GDPR</SelectItem>
                      <SelectItem value="Safety">Safety</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="compliant">Compliant</SelectItem>
                      <SelectItem value="at-risk">At Risk</SelectItem>
                      <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Items Table */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(item.status)}
                          <div>
                            <h4 className="font-semibold">{item.requirement}</h4>
                            <p className="text-sm text-muted-foreground">Category: {item.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${statusColors[item.status]}`}>
                            {item.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={`${priorityColors[item.priority]}`}>
                            {item.priority.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Responsible:</p>
                          <p className="text-muted-foreground">{item.responsible}</p>
                        </div>
                        <div>
                          <p className="font-medium">Last Reviewed:</p>
                          <p className="text-muted-foreground">{item.lastReviewed.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="font-medium">Next Review:</p>
                          <p className="text-muted-foreground">{item.nextReview.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="font-medium">Evidence Files:</p>
                          <p className="text-muted-foreground">{item.evidence.length} files</p>
                        </div>
                      </div>
                      
                      {item.notes && (
                        <div className="bg-muted p-3 rounded">
                          <p className="text-sm">{item.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Evidence
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <div className="space-y-6">
            {/* Audit Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-4 gap-4">
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger>
                      <SelectValue placeholder="Time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                      <SelectItem value="365">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Action type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="create">Create</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                      <SelectItem value="delete">Delete</SelectItem>
                      <SelectItem value="login">Login</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Audit Trail Table */}
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditEntries.map((entry) => (
                    <div key={entry.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${entry.riskLevel === 'high' ? 'bg-red-100' : entry.riskLevel === 'medium' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                            <div className={`h-3 w-3 rounded-full ${entry.riskLevel === 'high' ? 'bg-red-500' : entry.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                          </div>
                          <div>
                            <h4 className="font-semibold">{entry.action} - {entry.tableName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {entry.userName} • {entry.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${entry.riskLevel === 'high' ? 'text-red-600 bg-red-100' : entry.riskLevel === 'medium' ? 'text-yellow-600 bg-yellow-100' : 'text-green-600 bg-green-100'}`}>
                          {entry.riskLevel.toUpperCase()} RISK
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Record ID:</p>
                          <p className="text-muted-foreground font-mono">{entry.recordId}</p>
                        </div>
                        <div>
                          <p className="font-medium">IP Address:</p>
                          <p className="text-muted-foreground font-mono">{entry.ipAddress}</p>
                        </div>
                      </div>
                      
                      {entry.oldValues && (
                        <div className="mt-3">
                          <p className="font-medium text-sm mb-2">Changes:</p>
                          <div className="bg-muted p-3 rounded text-sm font-mono">
                            <p className="text-red-600">- {JSON.stringify(entry.oldValues)}</p>
                            {entry.newValues && (
                              <p className="text-green-600">+ {JSON.stringify(entry.newValues)}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="space-y-6">
            {/* Report Generation */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Compliance Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button onClick={() => generateReport('monthly')} className="h-24 flex-col">
                    <FileText className="h-8 w-8 mb-2" />
                    Monthly Report
                  </Button>
                  <Button onClick={() => generateReport('quarterly')} className="h-24 flex-col" variant="outline">
                    <FileText className="h-8 w-8 mb-2" />
                    Quarterly Report
                  </Button>
                  <Button onClick={() => generateReport('annual')} className="h-24 flex-col" variant="outline">
                    <FileText className="h-8 w-8 mb-2" />
                    Annual Report
                  </Button>
                  <Button onClick={() => generateReport('custom')} className="h-24 flex-col" variant="outline">
                    <FileText className="h-8 w-8 mb-2" />
                    Custom Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Monthly Compliance Report - August 2024', date: '2024-08-23', status: 'Ready', type: 'monthly' },
                    { name: 'Quarterly Safety Review - Q2 2024', date: '2024-07-01', status: 'Approved', type: 'quarterly' },
                    { name: 'CQC Preparation Report', date: '2024-06-15', status: 'Submitted', type: 'custom' }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-muted-foreground">Generated: {report.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge>{report.status}</Badge>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            {/* Compliance Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Notification Settings</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span>Email alerts for compliance deadlines</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span>Weekly compliance summary reports</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>SMS alerts for critical compliance issues</span>
                    </label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Audit Settings</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span>Log all user actions</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span>Log data modifications</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>Log file access</span>
                    </label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Retention Policy</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Audit Log Retention (months)</Label>
                      <Input type="number" defaultValue="24" min="12" max="84" />
                    </div>
                    <div className="space-y-2">
                      <Label>Report Retention (years)</Label>
                      <Input type="number" defaultValue="7" min="5" max="10" />
                    </div>
                  </div>
                </div>

                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceAuditDashboard;
