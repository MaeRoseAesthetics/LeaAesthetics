import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ClipboardCheck,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  Shield,
  Target,
  TrendingUp,
  AlertCircle,
  Plus,
  Settings,
} from "lucide-react";
import { format, addMonths, differenceInDays, subDays, addDays } from "date-fns";

interface AuditRecord {
  id: string;
  type: 'system' | 'user' | 'compliance' | 'treatment' | 'training';
  action: string;
  description: string;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'access' | 'data_change' | 'compliance' | 'security' | 'clinical';
  affectedResources: string[];
  metadata: Record<string, any>;
  status: 'active' | 'reviewed' | 'resolved' | 'archived';
}

interface ComplianceEvent {
  id: string;
  title: string;
  description: string;
  type: 'inspection' | 'review' | 'training' | 'incident' | 'improvement';
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  dueDate: string;
  completedDate?: string;
  evidence: Evidence[];
  actionItems: ActionItem[];
  tags: string[];
}

interface Evidence {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'link';
  url: string;
  uploadedBy: string;
  uploadedDate: string;
  size?: number;
}

interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  completedDate?: string;
  notes: string;
}

interface CqcStandard {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'safe' | 'effective' | 'caring' | 'responsive' | 'well-led';
  complianceLevel: number; // 0-100
  lastReviewed: string;
  nextReviewDate: string;
  evidence: string[];
  gaps: Gap[];
  status: 'compliant' | 'partially-compliant' | 'non-compliant' | 'under-review';
}

interface Gap {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  identifiedDate: string;
  targetResolutionDate: string;
  assignedTo: string;
  status: 'open' | 'in-progress' | 'resolved';
  resolutionNotes?: string;
}

export default function AuditTrailManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7");
  const { toast } = useToast();

  // Mock data - replace with real API calls
  const { data: auditRecords = [] } = useQuery<AuditRecord[]>({
    queryKey: ["/api/audit/records", dateRange, filterType, filterSeverity],
    initialData: [
      {
        id: "audit-1",
        type: "treatment",
        action: "Treatment Record Created",
        description: "New botox treatment record created for client Sarah Johnson",
        userId: "user-1",
        userName: "Dr. Sarah Wilson",
        userRole: "Lead Practitioner",
        timestamp: "2024-08-24T10:30:00Z",
        ipAddress: "192.168.1.45",
        device: "Desktop - Chrome",
        location: "London Clinic",
        severity: "low",
        category: "clinical",
        affectedResources: ["client-sarah-johnson", "treatment-bot-001"],
        metadata: {
          treatmentType: "Botox",
          dosage: "20 units",
          injectionSites: ["forehead", "crow's feet"]
        },
        status: "active"
      },
      {
        id: "audit-2",
        type: "compliance",
        action: "JCCP Documentation Updated",
        description: "Updated JCCP compliance documentation for Q3 2024",
        userId: "user-2",
        userName: "Emma Thompson",
        userRole: "Compliance Officer",
        timestamp: "2024-08-23T14:15:00Z",
        ipAddress: "192.168.1.33",
        device: "Laptop - Firefox",
        location: "Admin Office",
        severity: "medium",
        category: "compliance",
        affectedResources: ["jccp-docs-q3-2024"],
        metadata: {
          documentType: "JCCP Compliance Report",
          version: "3.1",
          sections: ["staff-training", "equipment-maintenance"]
        },
        status: "reviewed"
      },
      {
        id: "audit-3",
        type: "security",
        action: "Failed Login Attempt",
        description: "Multiple failed login attempts detected from unknown IP",
        userId: "system",
        userName: "System",
        userRole: "System",
        timestamp: "2024-08-23T02:45:00Z",
        ipAddress: "203.0.113.195",
        device: "Unknown",
        location: "External",
        severity: "high",
        category: "security",
        affectedResources: ["login-system"],
        metadata: {
          attempts: 5,
          targetAccount: "admin",
          blocked: true
        },
        status: "resolved"
      },
      {
        id: "audit-4",
        type: "user",
        action: "Client Data Access",
        description: "Accessed client treatment history for consultation review",
        userId: "user-3",
        userName: "Dr. Michael Brown",
        userRole: "Practitioner",
        timestamp: "2024-08-22T16:20:00Z",
        ipAddress: "192.168.1.22",
        device: "iPad - Safari",
        location: "Consultation Room 2",
        severity: "low",
        category: "access",
        affectedResources: ["client-emma-davis"],
        metadata: {
          accessType: "read",
          duration: "15 minutes"
        },
        status: "active"
      }
    ],
  });

  const { data: complianceEvents = [] } = useQuery<ComplianceEvent[]>({
    queryKey: ["/api/audit/compliance-events"],
    initialData: [
      {
        id: "event-1",
        title: "CQC Inspection Preparation",
        description: "Prepare all documentation and evidence for upcoming CQC inspection",
        type: "inspection",
        status: "in-progress",
        priority: "high",
        assignedTo: "Emma Thompson",
        dueDate: "2024-09-15",
        evidence: [
          {
            id: "ev-1",
            name: "Staff Training Records.pdf",
            type: "document",
            url: "/evidence/staff-training.pdf",
            uploadedBy: "Emma Thompson",
            uploadedDate: "2024-08-20",
            size: 2500000
          }
        ],
        actionItems: [
          {
            id: "ai-1",
            description: "Review all staff training certificates",
            assignedTo: "HR Manager",
            dueDate: "2024-09-01",
            status: "completed",
            completedDate: "2024-08-28",
            notes: "All certificates up to date"
          },
          {
            id: "ai-2",
            description: "Update equipment maintenance logs",
            assignedTo: "Maintenance Team",
            dueDate: "2024-09-05",
            status: "in-progress",
            notes: "60% complete"
          }
        ],
        tags: ["cqc", "inspection", "urgent"]
      },
      {
        id: "event-2",
        title: "JCCP Compliance Review",
        description: "Quarterly review of JCCP compliance standards and procedures",
        type: "review",
        status: "completed",
        priority: "medium",
        assignedTo: "Dr. Sarah Wilson",
        dueDate: "2024-08-30",
        completedDate: "2024-08-28",
        evidence: [],
        actionItems: [
          {
            id: "ai-3",
            description: "Update consent forms to latest version",
            assignedTo: "Clinical Team",
            dueDate: "2024-09-15",
            status: "pending",
            notes: ""
          }
        ],
        tags: ["jccp", "quarterly", "review"]
      }
    ],
  });

  const { data: cqcStandards = [] } = useQuery<CqcStandard[]>({
    queryKey: ["/api/audit/cqc-standards"],
    initialData: [
      {
        id: "std-1",
        code: "KLOE.S1",
        title: "Safe Care and Treatment",
        description: "How do you make sure that care and treatment is safe?",
        category: "safe",
        complianceLevel: 95,
        lastReviewed: "2024-08-01",
        nextReviewDate: "2024-11-01",
        evidence: ["treatment-protocols.pdf", "safety-checklist.pdf"],
        gaps: [],
        status: "compliant"
      },
      {
        id: "std-2",
        code: "KLOE.E1",
        title: "Evidence-Based Care",
        description: "How do you make sure care and treatment achieves good outcomes?",
        category: "effective",
        complianceLevel: 88,
        lastReviewed: "2024-07-15",
        nextReviewDate: "2024-10-15",
        evidence: ["outcome-data.pdf", "treatment-effectiveness.pdf"],
        gaps: [
          {
            id: "gap-1",
            description: "Need to implement systematic outcome tracking",
            severity: "medium",
            identifiedDate: "2024-08-01",
            targetResolutionDate: "2024-10-01",
            assignedTo: "Dr. Sarah Wilson",
            status: "in-progress"
          }
        ],
        status: "partially-compliant"
      },
      {
        id: "std-3",
        code: "KLOE.C1",
        title: "Dignity and Respect",
        description: "How do you make sure people are treated with kindness, dignity and respect?",
        category: "caring",
        complianceLevel: 92,
        lastReviewed: "2024-08-10",
        nextReviewDate: "2024-11-10",
        evidence: ["patient-feedback.pdf", "dignity-policy.pdf"],
        gaps: [],
        status: "compliant"
      }
    ],
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'completed':
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'partially-compliant':
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'non-compliant':
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'under-review':
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'safe':
        return <Shield className="w-5 h-5" />;
      case 'effective':
        return <Target className="w-5 h-5" />;
      case 'caring':
        return <User className="w-5 h-5" />;
      case 'responsive':
        return <Clock className="w-5 h-5" />;
      case 'well-led':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const filteredRecords = auditRecords.filter(record => {
    const matchesSearch = record.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || record.type === filterType;
    const matchesSeverity = filterSeverity === 'all' || record.severity === filterSeverity;
    
    // Date filtering
    const recordDate = new Date(record.timestamp);
    const daysAgo = parseInt(dateRange);
    const cutoffDate = subDays(new Date(), daysAgo);
    const matchesDate = recordDate >= cutoffDate;
    
    return matchesSearch && matchesType && matchesSeverity && matchesDate;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Audit Records</p>
                <p className="text-3xl font-bold">{auditRecords.length}</p>
                <p className="text-blue-100 text-xs">Last 30 days</p>
              </div>
              <ClipboardCheck className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">CQC Compliance</p>
                <p className="text-3xl font-bold">
                  {Math.round(cqcStandards.reduce((sum, std) => sum + std.complianceLevel, 0) / cqcStandards.length)}%
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Pending Actions</p>
                <p className="text-3xl font-bold">
                  {complianceEvents.reduce((sum, event) => 
                    sum + event.actionItems.filter(ai => ai.status !== 'completed').length, 0
                  )}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">High Priority Issues</p>
                <p className="text-3xl font-bold">
                  {auditRecords.filter(r => r.severity === 'high' || r.severity === 'critical').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CQC Standards Overview */}
      <Card>
        <CardHeader>
          <CardTitle>CQC Standards Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cqcStandards.map((standard) => (
              <div key={standard.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(standard.category)}
                    <span className="font-medium text-sm">{standard.code}</span>
                  </div>
                  <Badge className={getStatusColor(standard.status)}>
                    {standard.status.replace('-', ' ')}
                  </Badge>
                </div>
                <h4 className="font-medium mb-2">{standard.title}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Compliance Level</span>
                    <span className="font-medium">{standard.complianceLevel}%</span>
                  </div>
                  <Progress value={standard.complianceLevel} className="h-2" />
                </div>
                {standard.gaps.length > 0 && (
                  <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-xs text-yellow-800">
                      {standard.gaps.length} gap(s) identified
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent High-Priority Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Recent High-Priority Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditRecords
              .filter(record => record.severity === 'high' || record.severity === 'critical')
              .slice(0, 5)
              .map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-orange-50">
                  <div>
                    <h4 className="font-medium text-gray-900">{record.action}</h4>
                    <p className="text-sm text-gray-600">{record.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getSeverityColor(record.severity)}>
                        {record.severity}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {format(new Date(record.timestamp), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setSelectedRecord(record)}>
                    Review
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAuditLog = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Audit Log</h2>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Log
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="all">All Types</option>
          <option value="treatment">Treatment</option>
          <option value="compliance">Compliance</option>
          <option value="security">Security</option>
          <option value="user">User Activity</option>
          <option value="system">System</option>
        </select>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="1">Last 24 hours</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Audit Records Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Timestamp</th>
                  <th className="text-left p-4 font-medium">Action</th>
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Severity</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-sm">
                      {format(new Date(record.timestamp), 'MMM dd, HH:mm:ss')}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-sm">{record.action}</p>
                        <p className="text-xs text-gray-600 line-clamp-1">{record.description}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <div>
                        <p className="font-medium">{record.userName}</p>
                        <p className="text-xs text-gray-600">{record.userRole}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="capitalize">
                        {record.type}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getSeverityColor(record.severity)}>
                        {record.severity}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setSelectedRecord(record)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Compliance Management</h2>
        <Button onClick={() => setShowEventDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Compliance Events */}
      <div className="space-y-4">
        {complianceEvents.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-gray-600 mt-1">{event.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`capitalize ${
                      event.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      event.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {event.priority} priority
                    </Badge>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status.replace('-', ' ')}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {event.type}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Assigned to:</p>
                  <p className="font-medium">{event.assignedTo}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Due: {format(new Date(event.dueDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>

              {/* Action Items */}
              {event.actionItems.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-3">Action Items ({event.actionItems.length})</h4>
                  <div className="space-y-2">
                    {event.actionItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{item.description}</p>
                          <p className="text-xs text-gray-600">
                            Assigned to: {item.assignedTo} • Due: {format(new Date(item.dueDate), 'MMM dd')}
                          </p>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence */}
              {event.evidence.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-3">Evidence ({event.evidence.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {event.evidence.map((evidence) => (
                      <div key={evidence.id} className="flex items-center gap-2 p-2 border border-gray-200 rounded">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{evidence.name}</p>
                          <p className="text-xs text-gray-600">
                            {evidence.uploadedBy} • {format(new Date(evidence.uploadedDate), 'MMM dd')}
                          </p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4 mr-1" />
                  Manage
                </Button>
                <Button size="sm" variant="outline">
                  <Upload className="w-4 h-4 mr-1" />
                  Add Evidence
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CQC Audit Trail</h1>
          <p className="text-gray-600 mt-1">Monitor compliance, track changes, and manage audit requirements</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audit-log">Audit Log</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="audit-log" className="mt-6">
          {renderAuditLog()}
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          {renderCompliance()}
        </TabsContent>
      </Tabs>

      {/* Record Details Dialog */}
      {selectedRecord && (
        <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Audit Record Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Action</Label>
                  <p className="font-medium">{selectedRecord.action}</p>
                </div>
                <div>
                  <Label>Timestamp</Label>
                  <p>{format(new Date(selectedRecord.timestamp), 'MMM dd, yyyy HH:mm:ss')}</p>
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <p className="text-gray-700">{selectedRecord.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>User</Label>
                  <p>{selectedRecord.userName} ({selectedRecord.userRole})</p>
                </div>
                <div>
                  <Label>Location</Label>
                  <p>{selectedRecord.location}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>IP Address</Label>
                  <p className="font-mono text-sm">{selectedRecord.ipAddress}</p>
                </div>
                <div>
                  <Label>Device</Label>
                  <p>{selectedRecord.device}</p>
                </div>
              </div>
              
              {Object.keys(selectedRecord.metadata).length > 0 && (
                <div>
                  <Label>Additional Information</Label>
                  <pre className="text-sm bg-gray-50 p-3 rounded border overflow-auto">
                    {JSON.stringify(selectedRecord.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedRecord(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Compliance Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Compliance Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Event Title</Label>
              <Input className="mt-1" placeholder="Enter event title" />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea className="mt-1" placeholder="Event description" />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Type</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="inspection">Inspection</option>
                  <option value="review">Review</option>
                  <option value="training">Training</option>
                  <option value="incident">Incident</option>
                  <option value="improvement">Improvement</option>
                </select>
              </div>
              <div>
                <Label>Priority</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" className="mt-1" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEventDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowEventDialog(false)}>
              Add Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
