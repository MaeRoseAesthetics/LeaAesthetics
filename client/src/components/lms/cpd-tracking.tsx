import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Trophy, 
  Plus, 
  Search, 
  Filter,
  Download,
  Upload,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  BookOpen,
  Calendar,
  FileText,
  Award,
  TrendingUp,
  BarChart3,
  Target,
  Users,
  Settings,
  RefreshCw,
  Shield,
  AlertTriangle,
  BookCheck,
  Star,
  Zap,
  PieChart
} from "lucide-react";
import { format, startOfYear, endOfYear, differenceInDays } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Interfaces
interface CpdRecord {
  id: string;
  studentId: string;
  studentName: string;
  activityType: "course" | "workshop" | "conference" | "webinar" | "self_study" | "mentoring" | "other";
  title: string;
  description: string;
  provider: string;
  hours: number;
  dateCompleted: string;
  certificateNumber?: string;
  verificationStatus: "pending" | "verified" | "rejected";
  verifiedBy?: string;
  verifiedAt?: string;
  evidenceUrl?: string;
  category: "clinical" | "business" | "regulatory" | "safety" | "ethics" | "other";
  relevanceRating: number; // 1-5 scale
  notes?: string;
  expiryDate?: string;
  renewalRequired: boolean;
  cpdYear: number;
  createdAt: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  cpdHours: number;
  requiredHours: number;
  complianceStatus: "compliant" | "deficient" | "at_risk";
  currentYear: number;
  lastActivity: string;
}

interface CpdStats {
  totalStudents: number;
  compliantStudents: number;
  deficientStudents: number;
  atRiskStudents: number;
  totalHoursRecorded: number;
  averageHoursPerStudent: number;
  pendingVerifications: number;
  activitiesByType: { type: string; count: number; hours: number }[];
  activitiesByCategory: { category: string; count: number; hours: number }[];
  complianceByYear: { year: number; compliant: number; total: number }[];
}

interface CpdRequirements {
  annualHours: number;
  clinicalHours: number;
  regulatoryHours: number;
  ethicsHours: number;
  businessHours: number;
  safetyHours: number;
  renewalPeriod: number; // years
  gracePeriod: number; // days
}

const cpdSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  activityType: z.enum(["course", "workshop", "conference", "webinar", "self_study", "mentoring", "other"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  provider: z.string().min(1, "Provider is required"),
  hours: z.number().min(0.5, "Minimum 0.5 hours required").max(40, "Maximum 40 hours per activity"),
  dateCompleted: z.string().min(1, "Date completed is required"),
  category: z.enum(["clinical", "business", "regulatory", "safety", "ethics", "other"]),
  relevanceRating: z.number().min(1).max(5),
  certificateNumber: z.string().optional(),
  evidenceUrl: z.string().optional(),
  notes: z.string().optional(),
  expiryDate: z.string().optional(),
  renewalRequired: z.boolean().optional(),
});

type CpdFormData = z.infer<typeof cpdSchema>;

export default function CpdTracking() {
  const [activeTab, setActiveTab] = useState("records");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("2024");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CpdRecord | null>(null);

  const queryClient = useQueryClient();

  const form = useForm<CpdFormData>({
    resolver: zodResolver(cpdSchema),
    defaultValues: {
      activityType: "course",
      category: "clinical",
      relevanceRating: 5,
      hours: 1,
      renewalRequired: false,
    }
  });

  // Mock data
  const { data: cpdRecords = [] } = useQuery<CpdRecord[]>({
    queryKey: ["/api/lms/cpd-records", yearFilter],
    initialData: [
      {
        id: "cpd1",
        studentId: "std1",
        studentName: "Emma Thompson",
        activityType: "course",
        title: "Advanced Dermal Filler Techniques",
        description: "Comprehensive training in advanced dermal filler injection techniques and safety protocols",
        provider: "Advanced Aesthetics Institute",
        hours: 8,
        dateCompleted: "2024-01-15T00:00:00Z",
        certificateNumber: "AAI-2024-001",
        verificationStatus: "verified",
        verifiedBy: "Dr. Sarah Johnson",
        verifiedAt: "2024-01-16T10:30:00Z",
        evidenceUrl: "/documents/cpd/cpd1-certificate.pdf",
        category: "clinical",
        relevanceRating: 5,
        notes: "Excellent course covering latest techniques and safety protocols",
        renewalRequired: true,
        expiryDate: "2026-01-15T00:00:00Z",
        cpdYear: 2024,
        createdAt: "2024-01-15T18:00:00Z"
      },
      {
        id: "cpd2",
        studentId: "std1",
        studentName: "Emma Thompson",
        activityType: "conference",
        title: "UK Aesthetic Conference 2024",
        description: "Annual conference covering latest trends and regulations in aesthetic medicine",
        provider: "UK Aesthetics Society",
        hours: 12,
        dateCompleted: "2024-02-20T00:00:00Z",
        certificateNumber: "UKAS-CONF-2024-456",
        verificationStatus: "verified",
        verifiedBy: "Dr. Sarah Johnson",
        verifiedAt: "2024-02-21T09:15:00Z",
        evidenceUrl: "/documents/cpd/cpd2-certificate.pdf",
        category: "regulatory",
        relevanceRating: 5,
        notes: "Great networking and regulatory updates",
        renewalRequired: false,
        cpdYear: 2024,
        createdAt: "2024-02-20T17:00:00Z"
      },
      {
        id: "cpd3",
        studentId: "std2",
        studentName: "James Wilson",
        activityType: "webinar",
        title: "Chemical Peel Safety Update",
        description: "Latest safety protocols and guidelines for chemical peel procedures",
        provider: "Professional Beauty Association",
        hours: 2,
        dateCompleted: "2024-02-10T00:00:00Z",
        verificationStatus: "pending",
        evidenceUrl: "/documents/cpd/cpd3-certificate.pdf",
        category: "safety",
        relevanceRating: 4,
        notes: "Good refresher on safety protocols",
        renewalRequired: false,
        cpdYear: 2024,
        createdAt: "2024-02-10T14:00:00Z"
      },
      {
        id: "cpd4",
        studentId: "std2",
        studentName: "James Wilson",
        activityType: "self_study",
        title: "Business Ethics in Aesthetics",
        description: "Self-study course on ethical business practices in aesthetic medicine",
        provider: "Ethics Institute",
        hours: 4,
        dateCompleted: "2024-01-25T00:00:00Z",
        verificationStatus: "verified",
        verifiedBy: "Dr. Sarah Johnson",
        verifiedAt: "2024-01-26T11:00:00Z",
        category: "ethics",
        relevanceRating: 3,
        notes: "Important but could be more practical",
        renewalRequired: false,
        cpdYear: 2024,
        createdAt: "2024-01-25T16:30:00Z"
      }
    ]
  });

  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ["/api/lms/cpd-students", yearFilter],
    initialData: [
      {
        id: "std1",
        name: "Emma Thompson",
        email: "emma.thompson@example.com",
        cpdHours: 20,
        requiredHours: 20,
        complianceStatus: "compliant",
        currentYear: 2024,
        lastActivity: "2024-02-20T00:00:00Z"
      },
      {
        id: "std2",
        name: "James Wilson",
        email: "james.wilson@example.com",
        cpdHours: 6,
        requiredHours: 20,
        complianceStatus: "deficient",
        currentYear: 2024,
        lastActivity: "2024-02-10T00:00:00Z"
      },
      {
        id: "std3",
        name: "Sarah Chen",
        email: "sarah.chen@example.com",
        cpdHours: 15,
        requiredHours: 20,
        complianceStatus: "at_risk",
        currentYear: 2024,
        lastActivity: "2024-01-30T00:00:00Z"
      }
    ]
  });

  const { data: stats } = useQuery<CpdStats>({
    queryKey: ["/api/lms/cpd-stats", yearFilter],
    initialData: {
      totalStudents: 1247,
      compliantStudents: 1189,
      deficientStudents: 58,
      atRiskStudents: 156,
      totalHoursRecorded: 15678,
      averageHoursPerStudent: 12.6,
      pendingVerifications: 23,
      activitiesByType: [
        { type: "course", count: 456, hours: 3648 },
        { type: "conference", count: 234, hours: 2808 },
        { type: "workshop", count: 345, hours: 1725 },
        { type: "webinar", count: 567, hours: 1134 },
        { type: "self_study", count: 234, hours: 936 }
      ],
      activitiesByCategory: [
        { category: "clinical", count: 789, hours: 6312 },
        { category: "regulatory", count: 234, hours: 1872 },
        { category: "safety", count: 345, hours: 1380 },
        { category: "business", count: 123, hours: 984 },
        { category: "ethics", count: 156, hours: 624 }
      ],
      complianceByYear: [
        { year: 2022, compliant: 234, total: 267 },
        { year: 2023, compliant: 456, total: 512 },
        { year: 2024, compliant: 1189, total: 1247 }
      ]
    }
  });

  const { data: requirements } = useQuery<CpdRequirements>({
    queryKey: ["/api/lms/cpd-requirements"],
    initialData: {
      annualHours: 20,
      clinicalHours: 10,
      regulatoryHours: 4,
      ethicsHours: 2,
      businessHours: 2,
      safetyHours: 2,
      renewalPeriod: 3,
      gracePeriod: 30
    }
  });

  const createCpdMutation = useMutation({
    mutationFn: async (data: CpdFormData) => {
      // API call would go here
      return { ...data, id: Date.now().toString(), cpdYear: new Date().getFullYear() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lms/cpd-records"] });
      setIsCreateDialogOpen(false);
      form.reset();
    }
  });

  const verifyRecordMutation = useMutation({
    mutationFn: async ({ recordId, status }: { recordId: string; status: "verified" | "rejected" }) => {
      // API call would go here
      return { recordId, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lms/cpd-records"] });
      setIsVerifyDialogOpen(false);
      setSelectedRecord(null);
    }
  });

  const filteredRecords = cpdRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.verificationStatus === statusFilter;
    const matchesType = typeFilter === "all" || record.activityType === typeFilter;
    const matchesCategory = categoryFilter === "all" || record.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesCategory;
  });

  const handleCreateCpd = (data: CpdFormData) => {
    createCpdMutation.mutate(data);
  };

  const handleVerifyRecord = (recordId: string, status: "verified" | "rejected") => {
    verifyRecordMutation.mutate({ recordId, status });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getComplianceBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Compliant</Badge>;
      case 'at_risk':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />At Risk</Badge>;
      case 'deficient':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Deficient</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="w-4 h-4" />;
      case 'conference': return <Users className="w-4 h-4" />;
      case 'workshop': return <Target className="w-4 h-4" />;
      case 'webinar': return <Calendar className="w-4 h-4" />;
      case 'self_study': return <BookCheck className="w-4 h-4" />;
      case 'mentoring': return <User className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'clinical': return 'text-blue-600';
      case 'regulatory': return 'text-purple-600';
      case 'safety': return 'text-red-600';
      case 'business': return 'text-green-600';
      case 'ethics': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-lea-deep-charcoal font-serif flex items-center gap-3">
            <Trophy className="w-8 h-8 text-teal-600" />
            CPD Tracking System
          </h1>
          <p className="text-lea-charcoal-grey mt-1">
            Continuing Professional Development hours tracking and compliance management
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lea-clinical-blue hover:bg-blue-700 gap-2">
                <Plus className="w-4 h-4" />
                Record CPD
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-teal-200" />
            <div className="text-2xl font-bold">{stats?.totalStudents.toLocaleString()}</div>
            <p className="text-sm text-teal-200">Total Students</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-200" />
            <div className="text-2xl font-bold">{stats?.compliantStudents.toLocaleString()}</div>
            <p className="text-sm text-green-200">Compliant</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-200" />
            <div className="text-2xl font-bold">{stats?.atRiskStudents}</div>
            <p className="text-sm text-yellow-200">At Risk</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-200" />
            <div className="text-2xl font-bold">{stats?.deficientStudents}</div>
            <p className="text-sm text-red-200">Deficient</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-blue-200" />
            <div className="text-2xl font-bold">{(stats?.totalHoursRecorded / 1000).toFixed(1)}k</div>
            <p className="text-sm text-blue-200">Total Hours</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-purple-200" />
            <div className="text-2xl font-bold">{stats?.averageHoursPerStudent}</div>
            <p className="text-sm text-purple-200">Avg Hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="records">CPD Records</TabsTrigger>
          <TabsTrigger value="students">Student Progress</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lea-charcoal-grey w-4 h-4" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="course">Course</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="webinar">Webinar</SelectItem>
                <SelectItem value="self_study">Self Study</SelectItem>
                <SelectItem value="mentoring">Mentoring</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="clinical">Clinical</SelectItem>
                <SelectItem value="regulatory">Regulatory</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="ethics">Ethics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* CPD Records List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRecords.map((record) => (
              <Card key={record.id} className="bg-lea-platinum-white border-lea-silver-grey shadow-lea-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lea-deep-charcoal font-serif text-lg line-clamp-2 flex items-center gap-2">
                        {getActivityTypeIcon(record.activityType)}
                        {record.title}
                      </CardTitle>
                      <p className="text-sm text-lea-charcoal-grey mt-1">{record.provider}</p>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      {getStatusBadge(record.verificationStatus)}
                      <Badge variant="outline" className={getCategoryColor(record.category)}>
                        {record.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-lea-charcoal-grey" />
                      <span className="font-medium">{record.studentName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-lea-charcoal-grey" />
                      <span>{record.hours} hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-lea-charcoal-grey" />
                      <span>Completed: {format(new Date(record.dateCompleted), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-lea-charcoal-grey" />
                      <span>Relevance: {record.relevanceRating}/5</span>
                    </div>
                  </div>

                  <div className="p-3 bg-lea-pearl-white rounded-lg">
                    <p className="text-sm text-lea-charcoal-grey line-clamp-3">{record.description}</p>
                  </div>

                  {record.notes && (
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700 line-clamp-2">{record.notes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {record.evidenceUrl && (
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Evidence
                      </Button>
                    )}
                    {record.verificationStatus === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedRecord(record);
                          setIsVerifyDialogOpen(true);
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verify
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                  
                  <div className="pt-2 border-t border-lea-silver-grey">
                    <div className="flex justify-between text-xs text-lea-charcoal-grey">
                      <span>Type: {record.activityType}</span>
                      {record.verifiedAt && (
                        <span>Verified: {format(new Date(record.verifiedAt), 'MMM dd')}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          {/* Student Progress Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {students.map((student) => (
              <Card key={student.id} className="bg-lea-platinum-white border-lea-silver-grey shadow-lea-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lea-deep-charcoal font-serif">{student.name}</CardTitle>
                      <p className="text-sm text-lea-charcoal-grey">{student.email}</p>
                    </div>
                    {getComplianceBadge(student.complianceStatus)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">CPD Progress</span>
                      <span className="text-sm text-lea-charcoal-grey">
                        {student.cpdHours}/{student.requiredHours} hours
                      </span>
                    </div>
                    <Progress 
                      value={(student.cpdHours / student.requiredHours) * 100} 
                      className="h-3"
                    />
                    <div className="text-xs text-lea-charcoal-grey text-center">
                      {Math.round((student.cpdHours / student.requiredHours) * 100)}% Complete
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-lea-charcoal-grey">Current Year:</span>
                      <span className="ml-2 font-medium">{student.currentYear}</span>
                    </div>
                    <div>
                      <span className="text-lea-charcoal-grey">Status:</span>
                      <span className={`ml-2 font-medium ${
                        student.complianceStatus === 'compliant' ? 'text-green-600' :
                        student.complianceStatus === 'at_risk' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {student.complianceStatus === 'compliant' ? 'On Track' :
                         student.complianceStatus === 'at_risk' ? 'At Risk' :
                         'Behind'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-lea-silver-grey">
                    <div className="text-xs text-lea-charcoal-grey">
                      Last Activity: {format(new Date(student.lastActivity), 'MMM dd, yyyy')}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <BookCheck className="w-4 h-4 mr-1" />
                      View Records
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mail className="w-4 h-4 mr-1" />
                      Reminder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Compliance Dashboard</h3>
            <p className="text-gray-600 mb-6">
              Monitor compliance status, generate reports, and manage requirements
            </p>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">CPD Analytics</h3>
            <p className="text-gray-600 mb-6">
              Comprehensive analytics on CPD activities, trends, and compliance patterns
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create CPD Record Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lea-deep-charcoal font-serif">Record CPD Activity</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(handleCreateCpd)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentId">Student</Label>
                <Select onValueChange={(value) => form.setValue("studentId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="activityType">Activity Type</Label>
                <Select onValueChange={(value) => form.setValue("activityType", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="self_study">Self Study</SelectItem>
                    <SelectItem value="mentoring">Mentoring</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="title">Activity Title</Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="e.g., Advanced Dermal Filler Techniques"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Describe the learning activity and key outcomes"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="provider">Provider</Label>
                <Input
                  id="provider"
                  {...form.register("provider")}
                  placeholder="e.g., Advanced Aesthetics Institute"
                />
              </div>
              
              <div>
                <Label htmlFor="hours">Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="40"
                  {...form.register("hours", { valueAsNumber: true })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => form.setValue("category", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clinical">Clinical</SelectItem>
                    <SelectItem value="regulatory">Regulatory</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="ethics">Ethics</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="dateCompleted">Date Completed</Label>
                <Input
                  id="dateCompleted"
                  type="date"
                  {...form.register("dateCompleted")}
                />
              </div>
              
              <div>
                <Label htmlFor="relevanceRating">Relevance (1-5)</Label>
                <Select onValueChange={(value) => form.setValue("relevanceRating", parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 - Highly Relevant</SelectItem>
                    <SelectItem value="4">4 - Very Relevant</SelectItem>
                    <SelectItem value="3">3 - Moderately Relevant</SelectItem>
                    <SelectItem value="2">2 - Slightly Relevant</SelectItem>
                    <SelectItem value="1">1 - Not Relevant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-lea-clinical-blue hover:bg-blue-700"
                disabled={createCpdMutation.isPending}
              >
                Record CPD Activity
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Verify Record Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lea-deep-charcoal font-serif">Verify CPD Record</DialogTitle>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{selectedRecord.title}</h4>
                <p className="text-sm text-gray-600">{selectedRecord.studentName}</p>
                <p className="text-sm text-gray-600">{selectedRecord.hours} hours • {selectedRecord.provider}</p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleVerifyRecord(selectedRecord.id, "verified")}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700"
                  onClick={() => handleVerifyRecord(selectedRecord.id, "rejected")}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
