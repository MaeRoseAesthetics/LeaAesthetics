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
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Award, 
  Plus, 
  Search, 
  Filter,
  Download,
  Upload,
  Eye,
  Share,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  BookOpen,
  Calendar,
  FileText,
  Printer,
  Mail,
  Globe,
  Zap,
  BarChart3,
  Target,
  TrendingUp,
  Users,
  Settings,
  RefreshCw,
  Link,
  QrCode,
  Lock
} from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Interfaces
interface DigitalCertificate {
  id: string;
  certificateNumber: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseName: string;
  certificateType: "completion" | "achievement" | "competency" | "cpd";
  title: string;
  description: string;
  issuedDate: string;
  expiryDate?: string;
  awardingBody: string;
  qualificationLevel: string;
  credits?: number;
  gradingScale: string;
  finalGrade: string;
  finalScore: number;
  maxScore: number;
  hoursCompleted: number;
  instructorName: string;
  verificationCode: string;
  status: "active" | "revoked" | "expired";
  downloadCount: number;
  lastDownloaded?: string;
  shareableUrl: string;
  metadata: Record<string, any>;
}

interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  templateType: "standard" | "premium" | "custom";
  certificateTypes: string[];
  layout: string;
  colorScheme: string;
  logoPosition: string;
  signatureFields: string[];
  customFields: string[];
  active: boolean;
  isDefault: boolean;
}

interface CertificateVerification {
  id: string;
  certificateId: string;
  verifierName?: string;
  verifierEmail?: string;
  verifierOrganization?: string;
  verificationResult: "valid" | "invalid" | "expired" | "revoked";
  verifiedAt: string;
  ipAddress: string;
}

interface CertificateStats {
  totalIssued: number;
  activeCount: number;
  expiredCount: number;
  revokedCount: number;
  downloadsThisMonth: number;
  verificationsThisMonth: number;
  topCourses: { courseName: string; count: number }[];
  issuanceByMonth: { month: string; count: number }[];
  expiringInNext30Days: number;
}

const certificateSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  courseId: z.string().min(1, "Course is required"),
  certificateType: z.enum(["completion", "achievement", "competency", "cpd"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  qualificationLevel: z.string().min(1, "Qualification level is required"),
  finalGrade: z.string().min(1, "Final grade is required"),
  finalScore: z.number().min(0).max(100),
  hoursCompleted: z.number().min(0),
  credits: z.number().optional(),
  expiryDate: z.string().optional(),
  templateId: z.string().min(1, "Template is required"),
  notes: z.string().optional(),
});

type CertificateFormData = z.infer<typeof certificateSchema>;

export default function CertificateManagement() {
  const [activeTab, setActiveTab] = useState("certificates");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<DigitalCertificate | null>(null);
  const [verificationCode, setVerificationCode] = useState("");

  const queryClient = useQueryClient();

  const form = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      certificateType: "completion",
      finalScore: 0,
      hoursCompleted: 0,
    }
  });

  // Mock data
  const { data: certificates = [] } = useQuery<DigitalCertificate[]>({
    queryKey: ["/api/lms/certificates"],
    initialData: [
      {
        id: "cert1",
        certificateNumber: "LEA-AFA-2024-001",
        studentId: "std1",
        studentName: "Emma Thompson",
        studentEmail: "emma.thompson@example.com",
        courseId: "course1",
        courseName: "Advanced Facial Aesthetics",
        certificateType: "completion",
        title: "Level 4 Diploma in Advanced Facial Aesthetics",
        description: "Successfully completed comprehensive training in advanced facial aesthetic procedures",
        issuedDate: "2024-02-20T00:00:00Z",
        expiryDate: "2027-02-20T00:00:00Z",
        awardingBody: "Lea Aesthetics Academy",
        qualificationLevel: "Level 4 Diploma",
        credits: 120,
        gradingScale: "Pass/Merit/Distinction",
        finalGrade: "Distinction",
        finalScore: 94,
        maxScore: 100,
        hoursCompleted: 240,
        instructorName: "Dr. Sarah Johnson",
        verificationCode: "VERIFY-2024-AFA-001",
        status: "active",
        downloadCount: 3,
        lastDownloaded: "2024-02-21T10:30:00Z",
        shareableUrl: "https://verify.leaaesthetics.com/cert/LEA-AFA-2024-001",
        metadata: {
          issuer: "auto",
          templateUsed: "premium-template",
          complianceChecked: true
        }
      },
      {
        id: "cert2",
        certificateNumber: "LEA-CPC-2024-002",
        studentId: "std2",
        studentName: "James Wilson",
        studentEmail: "james.wilson@example.com",
        courseId: "course2",
        courseName: "Chemical Peel Certification",
        certificateType: "competency",
        title: "Level 3 Certificate in Chemical Peel Procedures",
        description: "Demonstrated competency in safe chemical peel procedures and client care",
        issuedDate: "2024-02-18T00:00:00Z",
        awardingBody: "Lea Aesthetics Academy",
        qualificationLevel: "Level 3 Certificate",
        credits: 60,
        gradingScale: "Pass/Fail",
        finalGrade: "Pass",
        finalScore: 88,
        maxScore: 100,
        hoursCompleted: 120,
        instructorName: "Emma Thompson",
        verificationCode: "VERIFY-2024-CPC-002",
        status: "active",
        downloadCount: 1,
        lastDownloaded: "2024-02-19T14:20:00Z",
        shareableUrl: "https://verify.leaaesthetics.com/cert/LEA-CPC-2024-002",
        metadata: {
          issuer: "manual",
          templateUsed: "standard-template",
          complianceChecked: true
        }
      },
    ]
  });

  const { data: stats } = useQuery<CertificateStats>({
    queryKey: ["/api/lms/certificate-stats"],
    initialData: {
      totalIssued: 1234,
      activeCount: 1189,
      expiredCount: 42,
      revokedCount: 3,
      downloadsThisMonth: 456,
      verificationsThisMonth: 234,
      expiringInNext30Days: 12,
      topCourses: [
        { courseName: "Advanced Facial Aesthetics", count: 345 },
        { courseName: "Chemical Peel Certification", count: 278 },
        { courseName: "Anatomy & Physiology", count: 198 },
      ],
      issuanceByMonth: [
        { month: "Jan", count: 89 },
        { month: "Feb", count: 112 },
        { month: "Mar", count: 134 },
        { month: "Apr", count: 98 },
      ]
    }
  });

  const { data: templates = [] } = useQuery<CertificateTemplate[]>({
    queryKey: ["/api/lms/certificate-templates"],
    initialData: [
      {
        id: "template1",
        name: "Premium Template",
        description: "Professional design with gold accents",
        templateType: "premium",
        certificateTypes: ["completion", "achievement", "competency"],
        layout: "landscape",
        colorScheme: "blue-gold",
        logoPosition: "top-left",
        signatureFields: ["instructor", "director"],
        customFields: ["qr-code", "verification-url"],
        active: true,
        isDefault: false
      },
      {
        id: "template2",
        name: "Standard Template",
        description: "Clean, professional design",
        templateType: "standard",
        certificateTypes: ["completion", "cpd"],
        layout: "landscape",
        colorScheme: "blue-white",
        logoPosition: "center",
        signatureFields: ["instructor"],
        customFields: ["verification-code"],
        active: true,
        isDefault: true
      }
    ]
  });

  const { data: verifications = [] } = useQuery<CertificateVerification[]>({
    queryKey: ["/api/lms/certificate-verifications"],
    initialData: [
      {
        id: "ver1",
        certificateId: "cert1",
        verifierName: "John Smith",
        verifierEmail: "john.smith@company.com",
        verifierOrganization: "Beauty Clinic Ltd",
        verificationResult: "valid",
        verifiedAt: "2024-02-22T09:15:00Z",
        ipAddress: "192.168.1.1"
      }
    ]
  });

  const createCertificateMutation = useMutation({
    mutationFn: async (data: CertificateFormData) => {
      // API call would go here
      const certificateNumber = `LEA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      return { ...data, certificateNumber, id: Date.now().toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lms/certificates"] });
      setIsCreateDialogOpen(false);
      form.reset();
    }
  });

  const revokeCertificateMutation = useMutation({
    mutationFn: async (certificateId: string) => {
      // API call would go here
      return certificateId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lms/certificates"] });
    }
  });

  const verifyCertificateMutation = useMutation({
    mutationFn: async (code: string) => {
      // API call would go here
      const certificate = certificates.find(c => c.verificationCode === code);
      if (certificate) {
        return { certificate, valid: true };
      }
      return { certificate: null, valid: false };
    }
  });

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
    const matchesType = typeFilter === "all" || cert.certificateType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateCertificate = (data: CertificateFormData) => {
    createCertificateMutation.mutate(data);
  };

  const handleRevokeCertificate = (certificateId: string) => {
    revokeCertificateMutation.mutate(certificateId);
  };

  const handleVerifyCertificate = () => {
    verifyCertificateMutation.mutate(verificationCode);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'expired':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Expired</Badge>;
      case 'revoked':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Revoked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'completion':
        return <Badge variant="secondary">Completion</Badge>;
      case 'achievement':
        return <Badge className="bg-blue-100 text-blue-800">Achievement</Badge>;
      case 'competency':
        return <Badge className="bg-purple-100 text-purple-800">Competency</Badge>;
      case 'cpd':
        return <Badge className="bg-teal-100 text-teal-800">CPD</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-lea-deep-charcoal font-serif flex items-center gap-3">
            <Award className="w-8 h-8 text-purple-600" />
            Certificate Management
          </h1>
          <p className="text-lea-charcoal-grey mt-1">
            Digital certificate generation, verification, and compliance tracking
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-lea-silver-grey gap-2">
                <Shield className="w-4 h-4" />
                Verify Certificate
              </Button>
            </DialogTrigger>
          </Dialog>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lea-clinical-blue hover:bg-blue-700 gap-2">
                <Plus className="w-4 h-4" />
                Issue Certificate
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-purple-200" />
            <div className="text-2xl font-bold">{stats?.totalIssued.toLocaleString()}</div>
            <p className="text-sm text-purple-200">Total Issued</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-200" />
            <div className="text-2xl font-bold">{stats?.activeCount.toLocaleString()}</div>
            <p className="text-sm text-green-200">Active</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-200" />
            <div className="text-2xl font-bold">{stats?.expiredCount}</div>
            <p className="text-sm text-yellow-200">Expired</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-200" />
            <div className="text-2xl font-bold">{stats?.revokedCount}</div>
            <p className="text-sm text-red-200">Revoked</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 text-center">
            <Download className="w-8 h-8 mx-auto mb-2 text-blue-200" />
            <div className="text-2xl font-bold">{stats?.downloadsThisMonth}</div>
            <p className="text-sm text-blue-200">Downloads</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-teal-200" />
            <div className="text-2xl font-bold">{stats?.verificationsThisMonth}</div>
            <p className="text-sm text-teal-200">Verifications</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-orange-200" />
            <div className="text-2xl font-bold">{stats?.expiringInNext30Days}</div>
            <p className="text-sm text-orange-200">Expiring Soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="verifications">Verifications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="certificates" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lea-charcoal-grey w-4 h-4" />
              <Input
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="completion">Completion</SelectItem>
                <SelectItem value="achievement">Achievement</SelectItem>
                <SelectItem value="competency">Competency</SelectItem>
                <SelectItem value="cpd">CPD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Certificates List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCertificates.map((certificate) => (
              <Card key={certificate.id} className="bg-lea-platinum-white border-lea-silver-grey shadow-lea-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lea-deep-charcoal font-serif text-lg line-clamp-2">
                        {certificate.title}
                      </CardTitle>
                      <p className="text-sm text-lea-charcoal-grey mt-1">{certificate.certificateNumber}</p>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      {getStatusBadge(certificate.status)}
                      {getTypeBadge(certificate.certificateType)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-lea-charcoal-grey" />
                      <span className="font-medium">{certificate.studentName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-lea-charcoal-grey" />
                      <span>{certificate.courseName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-lea-charcoal-grey" />
                      <span>Issued: {format(new Date(certificate.issuedDate), 'MMM dd, yyyy')}</span>
                    </div>
                    {certificate.expiryDate && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-lea-charcoal-grey" />
                        <span>Expires: {format(new Date(certificate.expiryDate), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-lea-pearl-white rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-lea-charcoal-grey">Grade:</span>
                        <span className="ml-2 font-medium">{certificate.finalGrade}</span>
                      </div>
                      <div>
                        <span className="text-lea-charcoal-grey">Score:</span>
                        <span className="ml-2 font-medium">{certificate.finalScore}%</span>
                      </div>
                      <div>
                        <span className="text-lea-charcoal-grey">Credits:</span>
                        <span className="ml-2 font-medium">{certificate.credits || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-lea-charcoal-grey">Hours:</span>
                        <span className="ml-2 font-medium">{certificate.hoursCompleted}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                    {certificate.status === 'active' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-red-600 hover:text-red-700"
                        onClick={() => handleRevokeCertificate(certificate.id)}
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Revoke
                      </Button>
                    )}
                  </div>
                  
                  <div className="pt-2 border-t border-lea-silver-grey">
                    <div className="flex justify-between text-xs text-lea-charcoal-grey">
                      <span>Downloads: {certificate.downloadCount}</span>
                      <span>Verification: {certificate.verificationCode}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Certificate Templates</h3>
            <p className="text-gray-600 mb-6">
              Manage certificate templates for different types and courses
            </p>
          </div>
        </TabsContent>

        <TabsContent value="verifications" className="space-y-6">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Certificate Verifications</h3>
            <p className="text-gray-600 mb-6">
              Track and manage certificate verification requests
            </p>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Certificate Analytics</h3>
            <p className="text-gray-600 mb-6">
              Comprehensive analytics and reporting on certificate issuance and usage
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Certificate Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lea-deep-charcoal font-serif">Issue New Certificate</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(handleCreateCertificate)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentId">Student</Label>
                <Select onValueChange={(value) => form.setValue("studentId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="std1">Emma Thompson</SelectItem>
                    <SelectItem value="std2">James Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="courseId">Course</Label>
                <Select onValueChange={(value) => form.setValue("courseId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course1">Advanced Facial Aesthetics</SelectItem>
                    <SelectItem value="course2">Chemical Peel Certification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="certificateType">Certificate Type</Label>
                <Select onValueChange={(value) => form.setValue("certificateType", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completion">Completion</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                    <SelectItem value="competency">Competency</SelectItem>
                    <SelectItem value="cpd">CPD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="qualificationLevel">Qualification Level</Label>
                <Select onValueChange={(value) => form.setValue("qualificationLevel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Level 3 Certificate">Level 3 Certificate</SelectItem>
                    <SelectItem value="Level 4 Diploma">Level 4 Diploma</SelectItem>
                    <SelectItem value="Level 5 Diploma">Level 5 Diploma</SelectItem>
                    <SelectItem value="CPD Certificate">CPD Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="title">Certificate Title</Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="e.g., Level 4 Diploma in Advanced Facial Aesthetics"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="finalGrade">Final Grade</Label>
                <Select onValueChange={(value) => form.setValue("finalGrade", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pass">Pass</SelectItem>
                    <SelectItem value="Merit">Merit</SelectItem>
                    <SelectItem value="Distinction">Distinction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="finalScore">Final Score (%)</Label>
                <Input
                  id="finalScore"
                  type="number"
                  min="0"
                  max="100"
                  {...form.register("finalScore", { valueAsNumber: true })}
                />
              </div>
              
              <div>
                <Label htmlFor="hoursCompleted">Hours Completed</Label>
                <Input
                  id="hoursCompleted"
                  type="number"
                  min="0"
                  {...form.register("hoursCompleted", { valueAsNumber: true })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="credits">Credits (optional)</Label>
                <Input
                  id="credits"
                  type="number"
                  {...form.register("credits", { valueAsNumber: true })}
                />
              </div>
              
              <div>
                <Label htmlFor="expiryDate">Expiry Date (optional)</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  {...form.register("expiryDate")}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="templateId">Certificate Template</Label>
              <Select onValueChange={(value) => form.setValue("templateId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} {template.isDefault && "(Default)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-lea-clinical-blue hover:bg-blue-700"
                disabled={createCertificateMutation.isPending}
              >
                Issue Certificate
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Certificate Verification Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lea-deep-charcoal font-serif flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Verify Certificate
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsVerifyDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-lea-clinical-blue hover:bg-blue-700"
                onClick={handleVerifyCertificate}
                disabled={!verificationCode}
              >
                <Shield className="w-4 h-4 mr-2" />
                Verify
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
