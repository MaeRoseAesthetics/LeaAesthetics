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
  Award,
  FileText,
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Eye,
  Settings,
  Shield,
  Target,
  TrendingUp,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { format, addMonths, differenceInDays } from "date-fns";

interface OfqualRequirement {
  id: string;
  category: 'governance' | 'quality-assurance' | 'assessment' | 'moderation' | 'certification' | 'compliance';
  requirement: string;
  description: string;
  status: 'compliant' | 'partial' | 'non-compliant' | 'pending';
  priority: 'critical' | 'high' | 'medium' | 'low';
  dueDate?: string;
  lastReview: string;
  nextReview: string;
  responsible: string;
  evidence: string[];
  actions: string[];
  complianceScore: number;
}

interface QualificationStandard {
  id: string;
  code: string;
  title: string;
  level: string;
  creditValue: number;
  status: 'active' | 'pending' | 'withdrawn' | 'under_review';
  lastUpdate: string;
  totalLearners: number;
  completionRate: number;
  averageGrade: number;
}

interface AssessmentRecord {
  id: string;
  qualificationId: string;
  studentId: string;
  studentName: string;
  assessmentType: 'formative' | 'summative' | 'practical' | 'portfolio';
  grade: string;
  score: number;
  maxScore: number;
  assessmentDate: string;
  moderationStatus: 'pending' | 'approved' | 'requires_action';
  moderatorNotes?: string;
}

export default function OfqualCompliance() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showRequirementDialog, setShowRequirementDialog] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<OfqualRequirement | null>(null);
  const { toast } = useToast();

  // Mock data - replace with real API calls
  const { data: requirements = [] } = useQuery<OfqualRequirement[]>({
    queryKey: ["/api/ofqual/requirements"],
    initialData: [
      {
        id: "req-1",
        category: "governance",
        requirement: "Governance Structure",
        description: "Establish and maintain appropriate governance arrangements",
        status: "compliant",
        priority: "critical",
        lastReview: "2024-07-01",
        nextReview: "2025-07-01",
        responsible: "Quality Manager",
        evidence: ["governance-policy.pdf", "board-minutes.pdf"],
        actions: [],
        complianceScore: 95,
      },
      {
        id: "req-2",
        category: "quality-assurance",
        requirement: "Internal Quality Assurance",
        description: "Monitor and evaluate quality of qualifications",
        status: "partial",
        priority: "high",
        dueDate: "2024-09-30",
        lastReview: "2024-06-15",
        nextReview: "2024-09-15",
        responsible: "Lead Internal Verifier",
        evidence: ["qa-procedures.pdf"],
        actions: ["Update sampling strategy", "Review IV reports"],
        complianceScore: 78,
      },
      {
        id: "req-3",
        category: "assessment",
        requirement: "Assessment Strategy",
        description: "Valid, reliable, and fit-for-purpose assessment methods",
        status: "compliant",
        priority: "critical",
        lastReview: "2024-08-01",
        nextReview: "2025-02-01",
        responsible: "Assessment Lead",
        evidence: ["assessment-strategy.pdf", "validity-study.pdf"],
        actions: [],
        complianceScore: 92,
      },
    ],
  });

  const { data: qualifications = [] } = useQuery<QualificationStandard[]>({
    queryKey: ["/api/ofqual/qualifications"],
    initialData: [
      {
        id: "qual-1",
        code: "LEA-AES-L4-001",
        title: "Level 4 Diploma in Aesthetic Treatments",
        level: "Level 4",
        creditValue: 120,
        status: "active",
        lastUpdate: "2024-07-15",
        totalLearners: 145,
        completionRate: 87.5,
        averageGrade: 84.2,
      },
      {
        id: "qual-2", 
        code: "LEA-AES-L5-001",
        title: "Level 5 Advanced Diploma in Aesthetic Practice",
        level: "Level 5",
        creditValue: 180,
        status: "active",
        lastUpdate: "2024-08-01",
        totalLearners: 89,
        completionRate: 91.0,
        averageGrade: 86.7,
      },
    ],
  });

  const { data: assessmentRecords = [] } = useQuery<AssessmentRecord[]>({
    queryKey: ["/api/ofqual/assessments"],
    initialData: [
      {
        id: "assess-1",
        qualificationId: "qual-1",
        studentId: "student-1",
        studentName: "Sarah Johnson",
        assessmentType: "summative",
        grade: "Merit",
        score: 78,
        maxScore: 100,
        assessmentDate: "2024-08-15",
        moderationStatus: "approved",
        moderatorNotes: "Good practical demonstration with minor theoretical gaps",
      },
    ],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'non-compliant':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-4 h-4" />;
      case 'partial':
        return <AlertTriangle className="w-4 h-4" />;
      case 'non-compliant':
        return <AlertCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const calculateOverallCompliance = () => {
    if (requirements.length === 0) return 0;
    const totalScore = requirements.reduce((sum, req) => sum + req.complianceScore, 0);
    return Math.round(totalScore / requirements.length);
  };

  const getCriticalIssuesCount = () => {
    return requirements.filter(req => 
      req.status === 'non-compliant' && req.priority === 'critical'
    ).length;
  };

  const getUpcomingDeadlines = () => {
    return requirements.filter(req => {
      if (!req.dueDate) return false;
      const daysUntilDue = differenceInDays(new Date(req.dueDate), new Date());
      return daysUntilDue <= 30 && daysUntilDue >= 0;
    });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Overall Compliance</p>
                <p className="text-3xl font-bold">{calculateOverallCompliance()}%</p>
              </div>
              <Shield className="w-8 h-8 text-green-200" />
            </div>
            <Progress value={calculateOverallCompliance()} className="mt-2 bg-green-400" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Active Qualifications</p>
                <p className="text-3xl font-bold">{qualifications.filter(q => q.status === 'active').length}</p>
              </div>
              <Award className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Critical Issues</p>
                <p className="text-3xl font-bold">{getCriticalIssuesCount()}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Learners</p>
                <p className="text-3xl font-bold">
                  {qualifications.reduce((sum, qual) => sum + qual.totalLearners, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      {getUpcomingDeadlines().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-500" />
              Upcoming Compliance Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getUpcomingDeadlines().map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <h4 className="font-medium text-gray-900">{req.requirement}</h4>
                    <p className="text-sm text-gray-600">{req.description}</p>
                    <p className="text-sm text-red-600 font-medium">
                      Due: {format(new Date(req.dueDate!), 'MMM dd, yyyy')} 
                      ({differenceInDays(new Date(req.dueDate!), new Date())} days remaining)
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Qualification Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Qualification Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qualifications.map((qual) => (
                <div key={qual.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{qual.title}</h4>
                      <p className="text-sm text-gray-600">Code: {qual.code}</p>
                    </div>
                    <Badge className={qual.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {qual.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Learners</p>
                      <p className="font-semibold">{qual.totalLearners}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Completion Rate</p>
                      <p className="font-semibold">{qual.completionRate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg. Grade</p>
                      <p className="font-semibold">{qual.averageGrade}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['governance', 'quality-assurance', 'assessment', 'moderation', 'certification', 'compliance'].map((category) => {
                const categoryReqs = requirements.filter(req => req.category === category);
                const avgScore = categoryReqs.length > 0 
                  ? Math.round(categoryReqs.reduce((sum, req) => sum + req.complianceScore, 0) / categoryReqs.length)
                  : 0;
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="capitalize font-medium">{category.replace('-', ' ')}</span>
                      <span className="text-sm font-semibold">{avgScore}%</span>
                    </div>
                    <Progress value={avgScore} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRequirements = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ofqual Requirements</h2>
        <Button onClick={() => setShowRequirementDialog(true)}>
          <FileText className="w-4 h-4 mr-2" />
          Add Requirement
        </Button>
      </div>

      <div className="space-y-4">
        {requirements.map((req) => (
          <Card key={req.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{req.requirement}</h3>
                    <Badge className={getStatusColor(req.status)}>
                      {getStatusIcon(req.status)}
                      <span className="ml-1 capitalize">{req.status}</span>
                    </Badge>
                    <Badge className={getPriorityColor(req.priority)}>
                      {req.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{req.description}</p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Category</p>
                      <p className="font-medium capitalize">{req.category.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Responsible</p>
                      <p className="font-medium">{req.responsible}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Review</p>
                      <p className="font-medium">{format(new Date(req.lastReview), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Next Review</p>
                      <p className="font-medium">{format(new Date(req.nextReview), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="ml-6 text-center">
                  <div className="text-2xl font-bold text-blue-600">{req.complianceScore}%</div>
                  <p className="text-sm text-gray-600">Compliance Score</p>
                </div>
              </div>

              {req.evidence.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium mb-2">Evidence:</p>
                  <div className="flex flex-wrap gap-2">
                    {req.evidence.map((doc, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {req.actions.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Required Actions:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {req.actions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedRequirement(req);
                    setShowRequirementDialog(true);
                  }}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <Upload className="w-4 h-4 mr-1" />
                  Evidence
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4 mr-1" />
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderQualifications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Approved Qualifications</h2>
        <Button>
          <Award className="w-4 h-4 mr-2" />
          Add Qualification
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {qualifications.map((qual) => (
          <Card key={qual.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{qual.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Code: {qual.code}</p>
                </div>
                <Badge className={qual.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {qual.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Level</p>
                    <p className="font-semibold">{qual.level}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Credit Value</p>
                    <p className="font-semibold">{qual.creditValue}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Learners</p>
                    <p className="font-semibold">{qual.totalLearners}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Update</p>
                    <p className="font-semibold">{format(new Date(qual.lastUpdate), 'MMM dd, yyyy')}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span className="font-semibold">{qual.completionRate}%</span>
                    </div>
                    <Progress value={qual.completionRate} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Grade</span>
                      <span className="font-semibold">{qual.averageGrade}%</span>
                    </div>
                    <Progress value={qual.averageGrade} className="h-2" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    Export Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAssessments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Assessment Records</h2>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Export Records
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {assessmentRecords.map((record) => (
              <div key={record.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{record.studentName}</h4>
                    <p className="text-sm text-gray-600">Assessment Type: {record.assessmentType}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{record.grade}</p>
                    <p className="text-sm text-gray-600">{record.score}/{record.maxScore}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-600">Assessment Date</p>
                    <p className="font-medium">{format(new Date(record.assessmentDate), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Score</p>
                    <p className="font-medium">{Math.round((record.score / record.maxScore) * 100)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Moderation</p>
                    <Badge className={
                      record.moderationStatus === 'approved' ? 'bg-green-100 text-green-800' :
                      record.moderationStatus === 'requires_action' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {record.moderationStatus.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                {record.moderatorNotes && (
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p className="font-medium mb-1">Moderator Notes:</p>
                    <p>{record.moderatorNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ofqual Compliance</h1>
          <p className="text-gray-600 mt-1">Monitor compliance with Ofqual regulations and standards</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="requirements" className="mt-6">
          {renderRequirements()}
        </TabsContent>

        <TabsContent value="qualifications" className="mt-6">
          {renderQualifications()}
        </TabsContent>

        <TabsContent value="assessments" className="mt-6">
          {renderAssessments()}
        </TabsContent>
      </Tabs>

      {/* Requirement Dialog */}
      <Dialog open={showRequirementDialog} onOpenChange={setShowRequirementDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRequirement ? 'Update Requirement' : 'Add New Requirement'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="governance">Governance</option>
                  <option value="quality-assurance">Quality Assurance</option>
                  <option value="assessment">Assessment</option>
                  <option value="moderation">Moderation</option>
                  <option value="certification">Certification</option>
                  <option value="compliance">Compliance</option>
                </select>
              </div>
              <div>
                <Label>Priority</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            
            <div>
              <Label>Requirement Title</Label>
              <Input className="mt-1" placeholder="Enter requirement title" />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea className="mt-1" placeholder="Enter detailed description" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Responsible Person</Label>
                <Input className="mt-1" placeholder="Enter responsible person" />
              </div>
              <div>
                <Label>Next Review Date</Label>
                <Input type="date" className="mt-1" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowRequirementDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowRequirementDialog(false)}>
              {selectedRequirement ? 'Update' : 'Add'} Requirement
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
