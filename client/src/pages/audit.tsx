import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Calendar, 
  FileText, 
  Users, 
  Award,
  Clock,
  Download,
  Eye,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ComplianceItem {
  id: string;
  category: "JCCP" | "CQC" | "GDPR" | "Insurance" | "Training";
  title: string;
  description: string;
  status: "compliant" | "warning" | "overdue" | "pending";
  dueDate: string;
  lastReviewed?: string;
  assignedTo?: string;
  documents: string[];
  priority: "high" | "medium" | "low";
}

interface AuditRecord {
  id: string;
  type: "Internal" | "External" | "Self-Assessment";
  date: string;
  auditor: string;
  score: number;
  maxScore: number;
  status: "passed" | "conditional" | "failed";
  findings: number;
  actions: number;
  completedActions: number;
}

export default function Audit() {
  const { user, isAuthenticated } = useAuth();
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  useEffect(() => {
    const mockCompliance: ComplianceItem[] = [
      {
        id: "1",
        category: "JCCP",
        title: "Practitioner Registration",
        description: "All practitioners must be registered with JCCP",
        status: "compliant",
        dueDate: "2025-12-31",
        lastReviewed: "2024-01-15",
        assignedTo: "Admin Team",
        documents: ["JCCP_Registration_2024.pdf", "Practitioner_Certificates.pdf"],
        priority: "high"
      },
      {
        id: "2",
        category: "CQC",
        title: "Annual CQC Self-Assessment",
        description: "Complete annual self-assessment questionnaire",
        status: "warning",
        dueDate: "2025-03-31",
        lastReviewed: "2024-02-15",
        assignedTo: "Quality Manager",
        documents: ["CQC_Self_Assessment_2023.pdf"],
        priority: "high"
      },
      {
        id: "3",
        category: "GDPR",
        title: "Data Protection Impact Assessment",
        description: "Review and update DPIA for client data processing",
        status: "overdue",
        dueDate: "2024-12-01",
        lastReviewed: "2023-11-20",
        assignedTo: "Data Protection Officer",
        documents: ["DPIA_Template.pdf"],
        priority: "high"
      },
      {
        id: "4",
        category: "Insurance",
        title: "Professional Indemnity Insurance",
        description: "Maintain current professional indemnity coverage",
        status: "compliant",
        dueDate: "2025-06-30",
        lastReviewed: "2024-06-15",
        assignedTo: "Finance Team",
        documents: ["Insurance_Certificate_2024.pdf"],
        priority: "medium"
      },
      {
        id: "5",
        category: "Training",
        title: "CPD Requirements",
        description: "Ensure all staff complete minimum CPD hours",
        status: "pending",
        dueDate: "2025-04-30",
        assignedTo: "Training Coordinator",
        documents: ["CPD_Records_2024.xlsx"],
        priority: "medium"
      }
    ];

    const mockAudits: AuditRecord[] = [
      {
        id: "1",
        type: "External",
        date: "2024-10-15",
        auditor: "CQC Inspector",
        score: 92,
        maxScore: 100,
        status: "passed",
        findings: 3,
        actions: 5,
        completedActions: 4
      },
      {
        id: "2",
        type: "Internal",
        date: "2024-07-20",
        auditor: "Quality Manager",
        score: 88,
        maxScore: 100,
        status: "passed",
        findings: 5,
        actions: 8,
        completedActions: 8
      },
      {
        id: "3",
        type: "Self-Assessment",
        date: "2024-04-10",
        auditor: "Admin Team",
        score: 85,
        maxScore: 100,
        status: "conditional",
        findings: 7,
        actions: 12,
        completedActions: 10
      }
    ];

    setComplianceItems(mockCompliance);
    setAuditRecords(mockAudits);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant": case "passed": return "bg-green-100 text-green-800";
      case "warning": case "conditional": return "bg-yellow-100 text-yellow-800";
      case "overdue": case "failed": return "bg-red-100 text-red-800";
      case "pending": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant": case "passed": return <CheckCircle className="w-4 h-4" />;
      case "warning": case "conditional": return <AlertTriangle className="w-4 h-4" />;
      case "overdue": case "failed": return <XCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const complianceStats = {
    compliant: complianceItems.filter(item => item.status === "compliant").length,
    warning: complianceItems.filter(item => item.status === "warning").length,
    overdue: complianceItems.filter(item => item.status === "overdue").length,
    pending: complianceItems.filter(item => item.status === "pending").length,
  };

  const overallCompliance = Math.round((complianceStats.compliant / complianceItems.length) * 100);

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-lea-deep-charcoal mb-2">Compliance & Audit</h1>
          <p className="text-lea-charcoal-grey">Monitor regulatory compliance and audit activities</p>
        </div>
        <Button className="bg-lea-deep-charcoal hover:bg-lea-elegant-charcoal">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="audits">Audits</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Compliance Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">{overallCompliance}%</p>
                  <p className="text-sm text-lea-charcoal-grey">Overall Compliance</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">{complianceStats.compliant}</p>
                  <p className="text-sm text-lea-charcoal-grey">Compliant</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mr-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">{complianceStats.warning}</p>
                  <p className="text-sm text-lea-charcoal-grey">Warnings</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mr-4">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">{complianceStats.overdue}</p>
                  <p className="text-sm text-lea-charcoal-grey">Overdue</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">{complianceStats.pending}</p>
                  <p className="text-sm text-lea-charcoal-grey">Pending</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Priority Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Priority Alerts</CardTitle>
              <CardDescription>Items requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceItems.filter(item => item.status === "overdue" || (item.status === "warning" && item.priority === "high")).map((item) => (
                  <Alert key={item.id} className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">{item.title}</AlertTitle>
                    <AlertDescription className="text-red-700">
                      {item.description} - Due: {new Date(item.dueDate).toLocaleDateString()}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Audits */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Activity</CardTitle>
              <CardDescription>Latest audit results and scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditRecords.slice(0, 3).map((audit) => (
                  <div key={audit.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getStatusColor(audit.status)}`}>
                        {getStatusIcon(audit.status)}
                      </div>
                      <div>
                        <p className="font-medium">{audit.type} Audit</p>
                        <p className="text-sm text-muted-foreground">
                          {audit.auditor} • {new Date(audit.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{audit.score}/{audit.maxScore}</p>
                      <p className="text-sm text-muted-foreground">
                        {audit.completedActions}/{audit.actions} actions completed
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Tracking</CardTitle>
              <CardDescription>Monitor all regulatory compliance requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Requirement</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(item.status)}
                            <span className="capitalize">{item.status}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{new Date(item.dueDate).toLocaleDateString()}</p>
                          {item.lastReviewed && (
                            <p className="text-sm text-muted-foreground">
                              Last: {new Date(item.lastReviewed).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.assignedTo}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit History</CardTitle>
              <CardDescription>Track all internal and external audits</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Auditor</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditRecords.map((audit) => (
                    <TableRow key={audit.id}>
                      <TableCell>
                        <Badge variant="outline">{audit.type}</Badge>
                      </TableCell>
                      <TableCell>{new Date(audit.date).toLocaleDateString()}</TableCell>
                      <TableCell>{audit.auditor}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{audit.score}/{audit.maxScore}</p>
                          <p className="text-sm text-muted-foreground">
                            {Math.round((audit.score / audit.maxScore) * 100)}%
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(audit.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(audit.status)}
                            <span className="capitalize">{audit.status}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{audit.findings} findings</p>
                          <p className="text-sm text-muted-foreground">{audit.actions} actions</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Progress 
                            value={(audit.completedActions / audit.actions) * 100} 
                            className="w-20"
                          />
                          <p className="text-sm text-muted-foreground">
                            {audit.completedActions}/{audit.actions}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Reports</CardTitle>
                <CardDescription>Generate compliance and audit reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Monthly Compliance Summary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="w-4 h-4 mr-2" />
                  Audit Action Plan Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Regulatory Compliance Status
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Staff Training Compliance
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Reviews</CardTitle>
                <CardDescription>Scheduled compliance reviews and audits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">CQC Self-Assessment</p>
                    <p className="text-sm text-muted-foreground">Due in 45 days</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Calendar className="w-3 h-3 mr-1" />
                    Upcoming
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Internal Quality Review</p>
                    <p className="text-sm text-muted-foreground">Due in 15 days</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Urgent
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Insurance Renewal</p>
                    <p className="text-sm text-muted-foreground">Due in 90 days</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    On Track
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
