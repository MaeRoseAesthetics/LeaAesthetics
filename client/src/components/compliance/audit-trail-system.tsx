import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  Calendar as CalendarIcon,
  Eye,
  User,
  Clock,
  Shield,
  FileText,
  CreditCard,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Monitor,
  Database,
  Lock
} from 'lucide-react';

// Mock audit trail data
const mockAuditLogs = [
  {
    id: '1',
    timestamp: '2024-08-24T10:30:00Z',
    action: 'CLIENT_CONSENT_SIGNED',
    category: 'document',
    severity: 'info',
    userId: 'user_123',
    userName: 'Sarah Johnson',
    userRole: 'client',
    targetResource: 'Botox Treatment Consent Form',
    resourceId: 'doc_456',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Chrome/127.0.0.0)',
    location: 'London, UK',
    details: {
      documentType: 'consent_form',
      clientId: 'client_789',
      practitionerId: 'prac_101',
      signatureMethod: 'digital',
    },
    changes: null,
    compliance: true,
  },
  {
    id: '2',
    timestamp: '2024-08-24T09:15:00Z',
    action: 'TREATMENT_RECORD_UPDATED',
    category: 'treatment',
    severity: 'info',
    userId: 'prac_101',
    userName: 'Dr. Michael Chen',
    userRole: 'practitioner',
    targetResource: 'Treatment Record #TR-2024-156',
    resourceId: 'treat_156',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Firefox/128.0.0)',
    location: 'London, UK',
    details: {
      clientId: 'client_789',
      treatmentType: 'botox_injection',
      dosage: '20 units',
      injectionSites: ['forehead', 'crows_feet'],
    },
    changes: [
      { field: 'notes', oldValue: 'Initial consultation', newValue: 'Initial consultation. Client responded well to treatment.' },
      { field: 'followUpDate', oldValue: null, newValue: '2024-09-24' },
    ],
    compliance: true,
  },
  {
    id: '3',
    timestamp: '2024-08-24T08:45:00Z',
    action: 'PAYMENT_PROCESSED',
    category: 'financial',
    severity: 'info',
    userId: 'system',
    userName: 'Payment System',
    userRole: 'system',
    targetResource: 'Payment #PAY-2024-1247',
    resourceId: 'pay_1247',
    ipAddress: '10.0.0.1',
    userAgent: 'Stripe-Webhook/1.0',
    location: 'System',
    details: {
      amount: 350.00,
      currency: 'GBP',
      paymentMethod: 'card_****4242',
      clientId: 'client_789',
      invoiceId: 'inv_2024_156',
    },
    changes: null,
    compliance: true,
  },
  {
    id: '4',
    timestamp: '2024-08-23T16:20:00Z',
    action: 'USER_LOGIN_FAILED',
    category: 'security',
    severity: 'warning',
    userId: 'unknown',
    userName: 'Unknown User',
    userRole: 'unknown',
    targetResource: 'User Account',
    resourceId: 'user_456',
    ipAddress: '45.76.123.45',
    userAgent: 'Mozilla/5.0 (Chrome/127.0.0.0)',
    location: 'Unknown Location',
    details: {
      attemptedUsername: 'admin@leaaesthetics.com',
      failureReason: 'invalid_credentials',
      attemptCount: 3,
    },
    changes: null,
    compliance: false,
  },
  {
    id: '5',
    timestamp: '2024-08-23T14:30:00Z',
    action: 'DATA_EXPORT_REQUESTED',
    category: 'data',
    severity: 'info',
    userId: 'admin_001',
    userName: 'System Administrator',
    userRole: 'admin',
    targetResource: 'Client Data Export',
    resourceId: 'export_789',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Safari/17.5)',
    location: 'London, UK',
    details: {
      exportType: 'gdpr_request',
      clientId: 'client_456',
      dataTypes: ['personal_info', 'treatment_history', 'payment_records'],
      requestReason: 'client_request',
    },
    changes: null,
    compliance: true,
  },
  {
    id: '6',
    timestamp: '2024-08-23T11:15:00Z',
    action: 'SYSTEM_CONFIG_CHANGED',
    category: 'system',
    severity: 'warning',
    userId: 'admin_001',
    userName: 'System Administrator',
    userRole: 'admin',
    targetResource: 'Security Settings',
    resourceId: 'config_security',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Chrome/127.0.0.0)',
    location: 'London, UK',
    details: {
      configSection: 'security_policy',
      changedBy: 'admin_001',
    },
    changes: [
      { field: 'sessionTimeout', oldValue: '30', newValue: '60' },
      { field: 'maxFailedAttempts', oldValue: '3', newValue: '5' },
    ],
    compliance: true,
  },
];

const AUDIT_CATEGORIES = [
  { value: 'all', label: 'All Categories', icon: Activity },
  { value: 'document', label: 'Document Management', icon: FileText },
  { value: 'treatment', label: 'Treatment Records', icon: Shield },
  { value: 'financial', label: 'Financial Transactions', icon: CreditCard },
  { value: 'security', label: 'Security Events', icon: Lock },
  { value: 'data', label: 'Data Access', icon: Database },
  { value: 'system', label: 'System Changes', icon: Settings },
];

const SEVERITY_LEVELS = [
  { value: 'all', label: 'All Severities' },
  { value: 'info', label: 'Information' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
  { value: 'critical', label: 'Critical' },
];

export default function AuditTrailSystem() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [showFilters, setShowFilters] = useState(false);

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetResource.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'critical':
        return <Badge className="bg-red-200 text-red-900">Critical</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryConfig = AUDIT_CATEGORIES.find(cat => cat.value === category);
    const IconComponent = categoryConfig?.icon || Activity;
    return <IconComponent className="h-4 w-4" />;
  };

  const formatAction = (action: string) => {
    return action
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const getComplianceStatus = (compliance: boolean) => {
    return compliance 
      ? <CheckCircle className="h-4 w-4 text-green-600" />
      : <XCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Audit Trail Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold text-lea-deep-charcoal">24,567</p>
              </div>
              <Activity className="h-8 w-8 text-lea-sage-green" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold text-blue-600">156</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security Events</p>
                <p className="text-2xl font-bold text-orange-600">12</p>
              </div>
              <Lock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold text-green-600">99.8%</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Audit Trail
              </CardTitle>
              <CardDescription>
                Comprehensive logging of all system activities and compliance events
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Log
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search audit logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AUDIT_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center">
                            <category.icon className="h-4 w-4 mr-2" />
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Severity</Label>
                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SEVERITY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                          ) : (
                            dateRange.from.toLocaleDateString()
                          )
                        ) : (
                          'Select date range'
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            {/* Audit Log Entries */}
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 bg-lea-sage-green/10 rounded-lg">
                        {getCategoryIcon(log.category)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium">{formatAction(log.action)}</h4>
                          {getSeverityBadge(log.severity)}
                          {getComplianceStatus(log.compliance)}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          Target: <span className="font-medium">{log.targetResource}</span>
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {log.userName} ({log.userRole})
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <Monitor className="w-3 h-3 mr-1" />
                            {log.ipAddress}
                          </span>
                          <span>{log.location}</span>
                        </div>
                        
                        {log.changes && log.changes.length > 0 && (
                          <div className="mt-2 p-2 bg-blue-50 rounded border-l-2 border-blue-200">
                            <p className="text-xs font-medium text-blue-900 mb-1">Changes Made:</p>
                            {log.changes.map((change, index) => (
                              <div key={index} className="text-xs text-blue-800">
                                <span className="font-medium">{change.field}:</span>{' '}
                                <span className="text-red-600">{change.oldValue || 'null'}</span> →{' '}
                                <span className="text-green-600">{change.newValue}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {log.details && (
                          <div className="mt-2 text-xs text-gray-600">
                            <details>
                              <summary className="cursor-pointer hover:text-gray-800">View Details</summary>
                              <div className="mt-1 pl-4">
                                {Object.entries(log.details).map(([key, value]) => (
                                  <div key={key}>
                                    <span className="font-medium">{key}:</span>{' '}
                                    {Array.isArray(value) ? value.join(', ') : String(value)}
                                  </div>
                                ))}
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No audit logs match your current filters</p>
              </div>
            )}
            
            {/* Load More */}
            {filteredLogs.length > 0 && (
              <div className="text-center">
                <Button variant="outline">
                  Load More Events
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Reports</CardTitle>
          <CardDescription>
            Generate detailed audit and compliance reports for regulatory bodies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex-col">
              <FileText className="h-5 w-5 mb-2" />
              <span>CQC Audit Report</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Shield className="h-5 w-5 mb-2" />
              <span>GDPR Compliance Report</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Database className="h-5 w-5 mb-2" />
              <span>Data Access Log</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
