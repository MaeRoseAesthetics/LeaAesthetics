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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Scale, 
  UserCheck, 
  Database, 
  FileText, 
  Download,
  Upload,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Trash2,
  Archive,
  Users,
  Globe,
  Lock,
  Mail
} from 'lucide-react';

const gdprRequestSchema = z.object({
  clientEmail: z.string().email('Valid email is required'),
  requestType: z.string().min(1, 'Request type is required'),
  requestReason: z.string().min(1, 'Reason is required'),
  dataTypes: z.array(z.string()).min(1, 'At least one data type must be selected'),
});

const dataRetentionPolicySchema = z.object({
  dataType: z.string().min(1, 'Data type is required'),
  retentionPeriod: z.number().min(1, 'Retention period is required'),
  autoDelete: z.boolean(),
  reviewRequired: z.boolean(),
  legalBasis: z.string().min(1, 'Legal basis is required'),
});

type GDPRRequestFormData = z.infer<typeof gdprRequestSchema>;
type DataRetentionPolicyFormData = z.infer<typeof dataRetentionPolicySchema>;

const GDPR_REQUEST_TYPES = [
  { value: 'data_access', label: 'Data Access Request', description: 'Client requesting access to their personal data' },
  { value: 'data_portability', label: 'Data Portability', description: 'Request data in a portable format' },
  { value: 'data_rectification', label: 'Data Rectification', description: 'Correct inaccurate personal data' },
  { value: 'data_erasure', label: 'Data Erasure (Right to be Forgotten)', description: 'Delete personal data' },
  { value: 'restrict_processing', label: 'Restrict Processing', description: 'Limit how data is processed' },
  { value: 'object_processing', label: 'Object to Processing', description: 'Object to certain data processing' },
];

const DATA_TYPES = [
  { value: 'personal_info', label: 'Personal Information' },
  { value: 'contact_details', label: 'Contact Details' },
  { value: 'medical_records', label: 'Medical Records' },
  { value: 'treatment_history', label: 'Treatment History' },
  { value: 'payment_records', label: 'Payment Records' },
  { value: 'communication_logs', label: 'Communication Logs' },
  { value: 'appointment_history', label: 'Appointment History' },
  { value: 'consent_records', label: 'Consent Records' },
];

const LEGAL_BASIS_OPTIONS = [
  { value: 'consent', label: 'Consent' },
  { value: 'contract', label: 'Contract' },
  { value: 'legal_obligation', label: 'Legal Obligation' },
  { value: 'vital_interests', label: 'Vital Interests' },
  { value: 'public_task', label: 'Public Task' },
  { value: 'legitimate_interests', label: 'Legitimate Interests' },
];

// Mock data
const mockGDPRRequests = [
  {
    id: '1',
    clientEmail: 'sarah.johnson@email.com',
    clientName: 'Sarah Johnson',
    requestType: 'data_access',
    requestDate: '2024-08-20T10:30:00Z',
    status: 'pending',
    dueDate: '2024-09-19T23:59:59Z',
    dataTypes: ['personal_info', 'treatment_history', 'payment_records'],
    assignedTo: 'Data Protection Officer',
    priority: 'medium',
  },
  {
    id: '2',
    clientEmail: 'emma.williams@email.com',
    clientName: 'Emma Williams',
    requestType: 'data_erasure',
    requestDate: '2024-08-18T14:15:00Z',
    status: 'completed',
    dueDate: '2024-09-17T23:59:59Z',
    completedDate: '2024-08-22T16:30:00Z',
    dataTypes: ['personal_info', 'medical_records', 'communication_logs'],
    assignedTo: 'Data Protection Officer',
    priority: 'high',
  },
  {
    id: '3',
    clientEmail: 'james.brown@email.com',
    clientName: 'James Brown',
    requestType: 'data_portability',
    requestDate: '2024-08-22T09:45:00Z',
    status: 'in_progress',
    dueDate: '2024-09-21T23:59:59Z',
    dataTypes: ['treatment_history', 'appointment_history'],
    assignedTo: 'Data Protection Officer',
    priority: 'low',
  },
];

const mockDataRetentionPolicies = [
  {
    id: '1',
    dataType: 'medical_records',
    retentionPeriod: 2555, // 7 years in days
    autoDelete: false,
    reviewRequired: true,
    legalBasis: 'legal_obligation',
    lastUpdated: '2024-01-15T00:00:00Z',
    status: 'active',
  },
  {
    id: '2',
    dataType: 'payment_records',
    retentionPeriod: 2190, // 6 years in days
    autoDelete: true,
    reviewRequired: false,
    legalBasis: 'legal_obligation',
    lastUpdated: '2024-01-15T00:00:00Z',
    status: 'active',
  },
  {
    id: '3',
    dataType: 'communication_logs',
    retentionPeriod: 1095, // 3 years in days
    autoDelete: true,
    reviewRequired: true,
    legalBasis: 'legitimate_interests',
    lastUpdated: '2024-01-15T00:00:00Z',
    status: 'active',
  },
];

const mockAgeVerifications = [
  {
    id: '1',
    clientName: 'Sarah Johnson',
    clientEmail: 'sarah.johnson@email.com',
    verificationDate: '2024-08-20T10:30:00Z',
    method: 'photo_id',
    status: 'verified',
    documentType: 'passport',
    verifiedBy: 'Dr. Michael Chen',
    age: 28,
    treatmentRequested: 'Botox Treatment',
  },
  {
    id: '2',
    clientName: 'Emma Williams',
    clientEmail: 'emma.williams@email.com',
    verificationDate: '2024-08-18T14:15:00Z',
    method: 'photo_id',
    status: 'verified',
    documentType: 'driving_license',
    verifiedBy: 'Sarah Johnson',
    age: 24,
    treatmentRequested: 'Dermal Fillers',
  },
  {
    id: '3',
    clientName: 'Alex Thompson',
    clientEmail: 'alex.thompson@email.com',
    verificationDate: '2024-08-22T09:45:00Z',
    method: 'photo_id',
    status: 'pending',
    documentType: 'passport',
    verifiedBy: null,
    age: null,
    treatmentRequested: 'Botox Treatment',
  },
];

export default function RegulatoryCompliance() {
  const [activeTab, setActiveTab] = useState('gdpr');
  const [showGDPRDialog, setShowGDPRDialog] = useState(false);
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);

  const gdprForm = useForm<GDPRRequestFormData>({
    resolver: zodResolver(gdprRequestSchema),
    defaultValues: {
      dataTypes: [],
    },
  });

  const policyForm = useForm<DataRetentionPolicyFormData>({
    resolver: zodResolver(dataRetentionPolicySchema),
    defaultValues: {
      autoDelete: false,
      reviewRequired: true,
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Overdue</Badge>;
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gdpr" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>GDPR</span>
          </TabsTrigger>
          <TabsTrigger value="age-verification" className="flex items-center space-x-2">
            <UserCheck className="h-4 w-4" />
            <span>Age Verification</span>
          </TabsTrigger>
          <TabsTrigger value="data-retention" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Data Retention</span>
          </TabsTrigger>
          <TabsTrigger value="reporting" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Reporting</span>
          </TabsTrigger>
        </TabsList>

        {/* GDPR Compliance Tab */}
        <TabsContent value="gdpr">
          <div className="space-y-6">
            {/* GDPR Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Requests</p>
                      <p className="text-2xl font-bold text-lea-deep-charcoal">12</p>
                    </div>
                    <Scale className="h-8 w-8 text-lea-sage-green" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold text-green-600">847</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Response Time</p>
                      <p className="text-2xl font-bold text-blue-600">18d</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Compliance Score</p>
                      <p className="text-2xl font-bold text-green-600">98%</p>
                    </div>
                    <Shield className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* GDPR Requests */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Scale className="h-5 w-5 mr-2" />
                      GDPR Data Subject Requests
                    </CardTitle>
                    <CardDescription>
                      Manage and track data subject requests under GDPR
                    </CardDescription>
                  </div>
                  <Dialog open={showGDPRDialog} onOpenChange={setShowGDPRDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                        <Mail className="w-4 h-4 mr-2" />
                        New Request
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockGDPRRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium">{request.clientName}</h4>
                            {getStatusBadge(request.status)}
                            {getPriorityBadge(request.priority)}
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {GDPR_REQUEST_TYPES.find(type => type.value === request.requestType)?.label}
                          </p>
                          
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              Requested: {new Date(request.requestDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              Due: {new Date(request.dueDate).toLocaleDateString()}
                              {request.status === 'pending' && (
                                <span className="ml-1 text-orange-600">
                                  ({getDaysRemaining(request.dueDate)} days remaining)
                                </span>
                              )}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Data types:</span>
                            <div className="flex flex-wrap gap-1">
                              {request.dataTypes.map((type) => (
                                <Badge key={type} variant="outline" className="text-xs">
                                  {DATA_TYPES.find(dt => dt.value === type)?.label}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {request.status === 'completed' && request.completedDate && (
                            <p className="text-sm text-green-600">
                              Completed: {new Date(request.completedDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
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

        {/* Age Verification Tab */}
        <TabsContent value="age-verification">
          <div className="space-y-6">
            {/* Age Verification Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Verifications</p>
                      <p className="text-2xl font-bold text-lea-deep-charcoal">1,247</p>
                    </div>
                    <UserCheck className="h-8 w-8 text-lea-sage-green" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">This Month</p>
                      <p className="text-2xl font-bold text-blue-600">89</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-orange-600">3</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold text-green-600">99.2%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Age Verification Records */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2" />
                  Age Verification Records
                </CardTitle>
                <CardDescription>
                  Track age verification compliance for all treatments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAgeVerifications.map((verification) => (
                    <div key={verification.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium">{verification.clientName}</h4>
                            {getStatusBadge(verification.status)}
                            {verification.age && (
                              <Badge variant="outline">Age: {verification.age}</Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            Treatment: <span className="font-medium">{verification.treatmentRequested}</span>
                          </p>
                          
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(verification.verificationDate).toLocaleDateString()}
                            </span>
                            <span className="capitalize">
                              Method: {verification.method.replace('_', ' ')}
                            </span>
                            <span className="capitalize">
                              Document: {verification.documentType.replace('_', ' ')}
                            </span>
                            {verification.verifiedBy && (
                              <span>Verified by: {verification.verifiedBy}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {verification.status === 'pending' && (
                            <Button size="sm" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                              Verify
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Retention Tab */}
        <TabsContent value="data-retention">
          <div className="space-y-6">
            {/* Data Retention Policies */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Database className="h-5 w-5 mr-2" />
                      Data Retention Policies
                    </CardTitle>
                    <CardDescription>
                      Manage data retention periods and automated deletion
                    </CardDescription>
                  </div>
                  <Dialog open={showPolicyDialog} onOpenChange={setShowPolicyDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                        <Database className="w-4 h-4 mr-2" />
                        New Policy
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDataRetentionPolicies.map((policy) => (
                    <div key={policy.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium capitalize">
                              {policy.dataType.replace('_', ' ')}
                            </h4>
                            {getStatusBadge(policy.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Retention Period:</span>
                              <span className="ml-2 font-medium">
                                {Math.round(policy.retentionPeriod / 365)} years
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Legal Basis:</span>
                              <span className="ml-2 font-medium capitalize">
                                {policy.legalBasis.replace('_', ' ')}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Last Updated:</span>
                              <span className="ml-2 font-medium">
                                {new Date(policy.lastUpdated).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <span className="text-sm text-muted-foreground mr-2">Auto-delete:</span>
                              {policy.autoDelete ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm text-muted-foreground mr-2">Review Required:</span>
                              {policy.reviewRequired ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Data Cleanup Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Data Cleanup Actions</CardTitle>
                <CardDescription>
                  Review and manage data scheduled for deletion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-16 flex-col">
                    <Archive className="h-5 w-5 mb-2" />
                    <span>Schedule Cleanup</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Trash2 className="h-5 w-5 mb-2" />
                    <span>Review Deletions</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Download className="h-5 w-5 mb-2" />
                    <span>Export Before Delete</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Regulatory Reporting Tab */}
        <TabsContent value="reporting">
          <div className="space-y-6">
            {/* Compliance Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Regulatory Reports
                </CardTitle>
                <CardDescription>
                  Generate compliance reports for regulatory bodies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-8 w-8 text-lea-sage-green mx-auto mb-3" />
                      <h3 className="font-medium mb-2">GDPR Compliance Report</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Complete GDPR compliance assessment
                      </p>
                      <Button size="sm" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                        Generate
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Scale className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                      <h3 className="font-medium mb-2">CQC Audit Report</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Care Quality Commission audit trail
                      </p>
                      <Button size="sm" variant="outline">
                        Generate
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <UserCheck className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                      <h3 className="font-medium mb-2">Age Verification Report</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Client age verification compliance
                      </p>
                      <Button size="sm" variant="outline">
                        Generate
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Database className="h-8 w-8 text-green-600 mx-auto mb-3" />
                      <h3 className="font-medium mb-2">Data Processing Report</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Data processing activities summary
                      </p>
                      <Button size="sm" variant="outline">
                        Generate
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Lock className="h-8 w-8 text-red-600 mx-auto mb-3" />
                      <h3 className="font-medium mb-2">Security Incident Report</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Security events and breach notifications
                      </p>
                      <Button size="sm" variant="outline">
                        Generate
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Globe className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                      <h3 className="font-medium mb-2">International Transfers</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Cross-border data transfer compliance
                      </p>
                      <Button size="sm" variant="outline">
                        Generate
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Compliance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">GDPR Compliance</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={98} className="w-32" />
                      <span className="text-green-600 font-medium">98%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Age Verification</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={100} className="w-32" />
                      <span className="text-green-600 font-medium">100%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Data Retention</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={95} className="w-32" />
                      <span className="text-green-600 font-medium">95%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Documentation</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={92} className="w-32" />
                      <span className="text-green-600 font-medium">92%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* GDPR Request Dialog */}
      <Dialog open={showGDPRDialog} onOpenChange={setShowGDPRDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New GDPR Data Subject Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={gdprForm.handleSubmit((data) => console.log('GDPR Request:', data))} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="clientEmail">Client Email</Label>
                <Input {...gdprForm.register('clientEmail')} type="email" />
              </div>
              <div>
                <Label htmlFor="requestType">Request Type</Label>
                <Select onValueChange={(value) => gdprForm.setValue('requestType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    {GDPR_REQUEST_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Data Types Requested</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {DATA_TYPES.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      value={type.value}
                      {...gdprForm.register('dataTypes')}
                      className="rounded border-gray-300"
                    />
                    <Label className="text-sm">{type.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="requestReason">Reason for Request</Label>
              <Textarea 
                {...gdprForm.register('requestReason')}
                placeholder="Please provide details about the request..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowGDPRDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                Create Request
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
