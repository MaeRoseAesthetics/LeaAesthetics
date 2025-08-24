import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  Users,
  Calendar,
  Download,
  Upload,
  Settings,
  Eye,
  AlertCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { format, differenceInDays, addMonths } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ComplianceItem {
  id: string;
  type: 'jccp_registration' | 'cqc_registration' | 'insurance' | 'dbs_check' | 'cpd_training' | 'equipment_service';
  status: 'compliant' | 'warning' | 'expired' | 'missing';
  title: string;
  description: string;
  expiryDate?: string;
  lastUpdated: string;
  responsible: string;
  documents: string[];
  actions: string[];
}

interface AuditItem {
  id: string;
  userId: string;
  user?: {
    firstName: string;
    lastName: string;
    role: string;
  };
  action: string;
  tableName: string;
  recordId: string;
  oldValues?: any;
  newValues?: any;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

interface ComplianceMetrics {
  totalItems: number;
  compliant: number;
  warnings: number;
  expired: number;
  missing: number;
  complianceScore: number;
}

export default function ComplianceDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [auditFilter, setAuditFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch compliance items
  const { data: complianceItems, isLoading: loadingCompliance } = useQuery({
    queryKey: ['compliance-items'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/compliance/items');
      return response.json();
    }
  });

  // Fetch audit logs
  const { data: auditLogs, isLoading: loadingAudit } = useQuery({
    queryKey: ['audit-logs', auditFilter, dateRange],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/audit-logs', {
        params: { 
          filter: auditFilter === 'all' ? undefined : auditFilter,
          days: dateRange 
        }
      });
      return response.json();
    }
  });

  // Fetch compliance metrics
  const { data: metrics } = useQuery({
    queryKey: ['compliance-metrics'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/compliance/metrics');
      return response.json();
    }
  });

  // Update compliance item
  const updateComplianceMutation = useMutation({
    mutationFn: async (data: { id: string; status: string; expiryDate?: string; documents?: string[] }) => {
      const response = await apiRequest('PATCH', `/api/compliance/items/${data.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-items'] });
      queryClient.invalidateQueries({ queryKey: ['compliance-metrics'] });
      toast({
        title: 'Compliance Updated',
        description: 'Compliance item has been updated successfully.',
      });
    }
  });

  // Generate compliance report
  const generateReportMutation = useMutation({
    mutationFn: async (type: 'jccp' | 'cqc' | 'full') => {
      const response = await apiRequest('POST', '/api/compliance/reports/generate', { type });
      return response.blob();
    },
    onSuccess: (data, variables) => {
      // Create download link
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${variables}-compliance-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Report Generated',
        description: 'Compliance report has been generated and downloaded.',
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'missing': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'expired': return <AlertCircle className="h-4 w-4" />;
      case 'missing': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const calculateDaysUntilExpiry = (expiryDate?: string) => {
    if (!expiryDate) return null;
    return differenceInDays(new Date(expiryDate), new Date());
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Compliance Score */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6" />
            Compliance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Compliance</span>
                <span className="text-2xl font-bold text-blue-600">
                  {metrics?.complianceScore || 0}%
                </span>
              </div>
              <Progress value={metrics?.complianceScore || 0} className="h-3" />
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Target: 95%</div>
              <div className={`text-sm font-medium ${
                (metrics?.complianceScore || 0) >= 95 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {(metrics?.complianceScore || 0) >= 95 ? 'Excellent' : 'Needs Attention'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{metrics?.compliant || 0}</div>
            <div className="text-sm text-gray-600">Compliant</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{metrics?.warnings || 0}</div>
            <div className="text-sm text-gray-600">Warnings</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{metrics?.expired || 0}</div>
            <div className="text-sm text-gray-600">Expired</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{metrics?.missing || 0}</div>
            <div className="text-sm text-gray-600">Missing</div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Urgent Actions Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {complianceItems
              ?.filter((item: ComplianceItem) => item.status === 'expired' || item.status === 'warning')
              .slice(0, 5)
              .map((item: ComplianceItem) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.description}</div>
                      {item.expiryDate && (
                        <div className="text-xs text-red-600">
                          {item.status === 'expired' 
                            ? `Expired ${Math.abs(calculateDaysUntilExpiry(item.expiryDate) || 0)} days ago`
                            : `Expires in ${calculateDaysUntilExpiry(item.expiryDate)} days`
                          }
                        </div>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Update
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          className="h-16 text-left justify-start"
          onClick={() => generateReportMutation.mutate('jccp')}
          disabled={generateReportMutation.isPending}
        >
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5" />
            <div>
              <div className="font-medium">JCCP Report</div>
              <div className="text-xs opacity-75">Generate compliance report</div>
            </div>
          </div>
        </Button>
        
        <Button 
          variant="outline"
          className="h-16 text-left justify-start"
          onClick={() => generateReportMutation.mutate('cqc')}
          disabled={generateReportMutation.isPending}
        >
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5" />
            <div>
              <div className="font-medium">CQC Report</div>
              <div className="text-xs opacity-75">Generate audit trail</div>
            </div>
          </div>
        </Button>
        
        <Button 
          variant="outline"
          className="h-16 text-left justify-start"
          onClick={() => setSelectedTab('compliance')}
        >
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5" />
            <div>
              <div className="font-medium">Manage Items</div>
              <div className="text-xs opacity-75">Update compliance status</div>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );

  const renderComplianceItems = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Compliance Items</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {complianceItems?.map((item: ComplianceItem) => (
          <Card key={item.id} className="border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <Badge className={getStatusColor(item.status)}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1">{item.status}</span>
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{item.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Responsible:</span> {item.responsible}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span> {format(new Date(item.lastUpdated), 'MMM dd, yyyy')}
                    </div>
                    {item.expiryDate && (
                      <>
                        <div>
                          <span className="font-medium">Expiry Date:</span> {format(new Date(item.expiryDate), 'MMM dd, yyyy')}
                        </div>
                        <div>
                          <span className="font-medium">Days Remaining:</span> 
                          <span className={`ml-1 ${
                            (calculateDaysUntilExpiry(item.expiryDate) || 0) < 30 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {calculateDaysUntilExpiry(item.expiryDate)} days
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {item.documents.length > 0 && (
                    <div className="mt-3">
                      <span className="font-medium text-sm">Documents:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {item.documents.map((doc, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {item.actions.length > 0 && (
                    <div className="mt-3">
                      <span className="font-medium text-sm">Required Actions:</span>
                      <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                        {item.actions.map((action, index) => (
                          <li key={index}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAuditTrail = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Audit Trail</h2>
        <div className="flex gap-2">
          <select 
            value={auditFilter} 
            onChange={(e) => setAuditFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="LOGIN">Login</option>
          </select>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {auditLogs?.map((log: AuditItem) => (
          <Card key={log.id} className="border-l-4 border-l-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">{log.action}</Badge>
                    <span className="font-medium">
                      {log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {log.user?.role}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    {log.tableName && log.recordId && (
                      <span>Modified {log.tableName} record {log.recordId}</span>
                    )}
                  </div>
                  
                  {(log.oldValues || log.newValues) && (
                    <details className="mt-2">
                      <summary className="text-sm font-medium cursor-pointer">
                        View Changes
                      </summary>
                      <div className="mt-2 p-3 bg-gray-50 rounded text-xs">
                        {log.oldValues && (
                          <div className="mb-2">
                            <span className="font-medium">Old:</span>
                            <pre>{JSON.stringify(log.oldValues, null, 2)}</pre>
                          </div>
                        )}
                        {log.newValues && (
                          <div>
                            <span className="font-medium">New:</span>
                            <pre>{JSON.stringify(log.newValues, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    </details>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                    <span>IP: {log.ipAddress}</span>
                    <span>Time: {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReporting = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Compliance Reporting</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              JCCP Compliance Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Generate comprehensive JCCP compliance report including practitioner registrations, 
              qualifications, and training records.
            </p>
            <Button 
              className="w-full"
              onClick={() => generateReportMutation.mutate('jccp')}
              disabled={generateReportMutation.isPending}
            >
              <Download className="h-4 w-4 mr-2" />
              Generate JCCP Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              CQC Audit Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Generate CQC audit trail report including all system activities, 
              user actions, and compliance monitoring.
            </p>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => generateReportMutation.mutate('cqc')}
              disabled={generateReportMutation.isPending}
            >
              <Download className="h-4 w-4 mr-2" />
              Generate CQC Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Full Compliance Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Generate complete compliance report including all regulatory requirements, 
              audit trails, and performance metrics.
            </p>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => generateReportMutation.mutate('full')}
              disabled={generateReportMutation.isPending}
            >
              <Download className="h-4 w-4 mr-2" />
              Generate Full Report
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automated Reporting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Monthly JCCP Report</div>
                <div className="text-sm text-gray-600">Automatically generated on the 1st of each month</div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Weekly Compliance Check</div>
                <div className="text-sm text-gray-600">Automated compliance monitoring and alerts</div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Quarterly CQC Report</div>
                <div className="text-sm text-gray-600">Comprehensive audit trail for CQC inspections</div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loadingCompliance) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Shield className="h-8 w-8 animate-pulse mx-auto mb-2" />
          <p>Loading compliance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Compliance & Audit</h1>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Items</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>
        
        <TabsContent value="compliance" className="mt-6">
          {renderComplianceItems()}
        </TabsContent>
        
        <TabsContent value="audit" className="mt-6">
          {renderAuditTrail()}
        </TabsContent>
        
        <TabsContent value="reporting" className="mt-6">
          {renderReporting()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
