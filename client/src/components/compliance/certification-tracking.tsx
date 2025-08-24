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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  Award, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download, 
  Upload, 
  RefreshCw, 
  BookOpen, 
  Plus, 
  Search,
  Filter,
  Users,
  FileText,
  Star,
  Target,
  TrendingUp
} from 'lucide-react';

const certificationSchema = z.object({
  staffId: z.string().min(1, 'Staff member is required'),
  certificationName: z.string().min(1, 'Certification name is required'),
  issuingBody: z.string().min(1, 'Issuing body is required'),
  certificationDate: z.string().min(1, 'Certification date is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  level: z.string().min(1, 'Level is required'),
  cpd_hours: z.number().min(0, 'CPD hours must be positive'),
  documents: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

const trainingRecordSchema = z.object({
  staffId: z.string().min(1, 'Staff member is required'),
  trainingTitle: z.string().min(1, 'Training title is required'),
  provider: z.string().min(1, 'Training provider is required'),
  trainingDate: z.string().min(1, 'Training date is required'),
  duration: z.number().min(1, 'Duration is required'),
  trainingType: z.string().min(1, 'Training type is required'),
  cpd_hours: z.number().min(0, 'CPD hours must be positive'),
  assessment_score: z.number().min(0).max(100).optional(),
  status: z.string().min(1, 'Status is required'),
});

type CertificationFormData = z.infer<typeof certificationSchema>;
type TrainingRecordFormData = z.infer<typeof trainingRecordSchema>;

const CERTIFICATION_LEVELS = [
  { value: 'basic', label: 'Basic' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
  { value: 'master', label: 'Master' },
];

const TRAINING_TYPES = [
  { value: 'workshop', label: 'Workshop' },
  { value: 'online_course', label: 'Online Course' },
  { value: 'conference', label: 'Conference' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'hands_on', label: 'Hands-on Training' },
  { value: 'certification_course', label: 'Certification Course' },
];

const TRAINING_STATUS = [
  { value: 'completed', label: 'Completed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'cancelled', label: 'Cancelled' },
];

// Mock data
const mockStaffMembers = [
  { id: '1', name: 'Dr. Michael Chen', role: 'Lead Practitioner' },
  { id: '2', name: 'Sarah Johnson', role: 'Senior Aesthetician' },
  { id: '3', name: 'Emma Williams', role: 'Aesthetician' },
  { id: '4', name: 'James Brown', role: 'Aesthetic Practitioner' },
  { id: '5', name: 'Lisa Davis', role: 'Nurse Practitioner' },
];

const mockCertifications = [
  {
    id: '1',
    staffId: '1',
    staffName: 'Dr. Michael Chen',
    certificationName: 'Advanced Botox & Dermal Fillers',
    issuingBody: 'British College of Aesthetic Medicine',
    certificationDate: '2022-03-15T00:00:00Z',
    expiryDate: '2025-03-15T00:00:00Z',
    status: 'valid',
    level: 'advanced',
    cpd_hours: 35,
    documents: ['certificate.pdf', 'practical_assessment.pdf'],
  },
  {
    id: '2',
    staffId: '2',
    staffName: 'Sarah Johnson',
    certificationName: 'Skin Analysis & Treatment Planning',
    issuingBody: 'Institute of Medical Aesthetics',
    certificationDate: '2023-01-20T00:00:00Z',
    expiryDate: '2024-12-20T23:59:59Z',
    status: 'expiring_soon',
    level: 'intermediate',
    cpd_hours: 20,
    documents: ['certificate.pdf'],
  },
  {
    id: '3',
    staffId: '3',
    staffName: 'Emma Williams',
    certificationName: 'Chemical Peels Certification',
    issuingBody: 'Professional Beauty Association',
    certificationDate: '2021-11-10T00:00:00Z',
    expiryDate: '2024-11-10T23:59:59Z',
    status: 'expired',
    level: 'basic',
    cpd_hours: 15,
    documents: ['certificate.pdf', 'theory_exam.pdf'],
  },
  {
    id: '4',
    staffId: '4',
    staffName: 'James Brown',
    certificationName: 'Laser Safety Officer',
    issuingBody: 'Laser Safety Institute',
    certificationDate: '2023-06-05T00:00:00Z',
    expiryDate: '2026-06-05T23:59:59Z',
    status: 'valid',
    level: 'expert',
    cpd_hours: 40,
    documents: ['certificate.pdf', 'safety_manual.pdf'],
  },
];

const mockTrainingRecords = [
  {
    id: '1',
    staffId: '1',
    staffName: 'Dr. Michael Chen',
    trainingTitle: 'New Injection Techniques Workshop',
    provider: 'Aesthetic Training Academy',
    trainingDate: '2024-08-15T09:00:00Z',
    duration: 8, // hours
    trainingType: 'workshop',
    cpd_hours: 8,
    assessment_score: 95,
    status: 'completed',
    notes: 'Excellent performance in practical assessment',
  },
  {
    id: '2',
    staffId: '2',
    staffName: 'Sarah Johnson',
    trainingTitle: 'Advanced Skincare Consultation',
    provider: 'Professional Development Institute',
    trainingDate: '2024-08-22T14:00:00Z',
    duration: 4,
    trainingType: 'online_course',
    cpd_hours: 4,
    assessment_score: 88,
    status: 'completed',
    notes: 'Strong understanding of consultation protocols',
  },
  {
    id: '3',
    staffId: '3',
    staffName: 'Emma Williams',
    trainingTitle: 'Patient Safety & Emergency Procedures',
    provider: 'Medical Safety Training Ltd',
    trainingDate: '2024-09-10T10:00:00Z',
    duration: 6,
    trainingType: 'hands_on',
    cpd_hours: 6,
    assessment_score: null,
    status: 'scheduled',
    notes: 'Annual mandatory training',
  },
];

const mockLicenseRenewals = [
  {
    id: '1',
    staffId: '1',
    staffName: 'Dr. Michael Chen',
    licenseType: 'Medical Practitioner License',
    issuingBody: 'General Medical Council',
    currentExpiryDate: '2024-12-31T23:59:59Z',
    renewalStatus: 'pending',
    renewalDate: '2024-11-15T00:00:00Z',
    fee: 695,
    cpd_required: 50,
    cpd_completed: 42,
  },
  {
    id: '2',
    staffId: '2',
    staffName: 'Sarah Johnson',
    licenseType: 'Aesthetician License',
    issuingBody: 'British Association of Beauty Therapy',
    currentExpiryDate: '2025-06-30T23:59:59Z',
    renewalStatus: 'completed',
    renewalDate: '2024-05-15T00:00:00Z',
    fee: 295,
    cpd_required: 20,
    cpd_completed: 25,
  },
  {
    id: '3',
    staffId: '4',
    staffName: 'James Brown',
    licenseType: 'Laser Practitioner License',
    issuingBody: 'Care Quality Commission',
    currentExpiryDate: '2024-10-15T23:59:59Z',
    renewalStatus: 'overdue',
    renewalDate: '2024-08-15T00:00:00Z',
    fee: 450,
    cpd_required: 30,
    cpd_completed: 18,
  },
];

export default function CertificationTracking() {
  const [activeTab, setActiveTab] = useState('certifications');
  const [showCertDialog, setShowCertDialog] = useState(false);
  const [showTrainingDialog, setShowTrainingDialog] = useState(false);

  const certForm = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
  });

  const trainingForm = useForm<TrainingRecordFormData>({
    resolver: zodResolver(trainingRecordSchema),
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Valid</Badge>;
      case 'expiring_soon':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Expiring Soon</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Expired</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'scheduled':
        return <Badge className="bg-purple-100 text-purple-800"><Calendar className="w-3 h-3 mr-1" />Scheduled</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      basic: 'bg-gray-100 text-gray-800',
      intermediate: 'bg-blue-100 text-blue-800',
      advanced: 'bg-purple-100 text-purple-800',
      expert: 'bg-orange-100 text-orange-800',
      master: 'bg-red-100 text-red-800',
    };
    return <Badge className={colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{level}</Badge>;
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCPDProgress = (completed: number, required: number) => {
    return Math.min((completed / required) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="certifications" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span>Certifications</span>
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Training</span>
          </TabsTrigger>
          <TabsTrigger value="licenses" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span>Licenses</span>
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
        </TabsList>

        {/* Certifications Tab */}
        <TabsContent value="certifications">
          <div className="space-y-6">
            {/* Certifications Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Certifications</p>
                      <p className="text-2xl font-bold text-lea-deep-charcoal">24</p>
                    </div>
                    <Award className="h-8 w-8 text-lea-sage-green" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Valid</p>
                      <p className="text-2xl font-bold text-green-600">18</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Expiring Soon</p>
                      <p className="text-2xl font-bold text-yellow-600">4</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Expired</p>
                      <p className="text-2xl font-bold text-red-600">2</p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Certifications List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Professional Certifications
                    </CardTitle>
                    <CardDescription>
                      Track and manage staff professional certifications
                    </CardDescription>
                  </div>
                  <Dialog open={showCertDialog} onOpenChange={setShowCertDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Certification
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCertifications.map((cert) => (
                    <div key={cert.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium">{cert.certificationName}</h4>
                            {getStatusBadge(cert.status)}
                            {getLevelBadge(cert.level)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Practitioner:</span>
                              <span className="ml-2 font-medium">{cert.staffName}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Issuing Body:</span>
                              <span className="ml-2 font-medium">{cert.issuingBody}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Certified:</span>
                              <span className="ml-2 font-medium">
                                {new Date(cert.certificationDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Expires:</span>
                              <span className="ml-2 font-medium">
                                {new Date(cert.expiryDate).toLocaleDateString()}
                                {cert.status === 'expiring_soon' && (
                                  <span className="ml-1 text-orange-600">
                                    ({getDaysUntilExpiry(cert.expiryDate)} days remaining)
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <GraduationCap className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-sm text-muted-foreground">CPD Hours: </span>
                              <span className="font-medium">{cert.cpd_hours}</span>
                            </div>
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-sm text-muted-foreground">Documents: </span>
                              <span className="font-medium">{cert.documents?.length || 0}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          {cert.status === 'expiring_soon' && (
                            <Button size="sm" className="bg-orange-600 text-white hover:bg-orange-700">
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Renew
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

        {/* Training Records Tab */}
        <TabsContent value="training">
          <div className="space-y-6">
            {/* Training Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Training Sessions</p>
                      <p className="text-2xl font-bold text-lea-deep-charcoal">156</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-lea-sage-green" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">This Year</p>
                      <p className="text-2xl font-bold text-blue-600">42</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">CPD Hours</p>
                      <p className="text-2xl font-bold text-green-600">284</p>
                    </div>
                    <GraduationCap className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Score</p>
                      <p className="text-2xl font-bold text-purple-600">91%</p>
                    </div>
                    <Star className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Training Records */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Training Records
                    </CardTitle>
                    <CardDescription>
                      Track staff continuing professional development
                    </CardDescription>
                  </div>
                  <Dialog open={showTrainingDialog} onOpenChange={setShowTrainingDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Training
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTrainingRecords.map((training) => (
                    <div key={training.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium">{training.trainingTitle}</h4>
                            {getStatusBadge(training.status)}
                            {training.assessment_score && (
                              <Badge className="bg-purple-100 text-purple-800">
                                <Star className="w-3 h-3 mr-1" />
                                {training.assessment_score}%
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Participant:</span>
                              <span className="ml-2 font-medium">{training.staffName}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Provider:</span>
                              <span className="ml-2 font-medium">{training.provider}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Date:</span>
                              <span className="ml-2 font-medium">
                                {new Date(training.trainingDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Type:</span>
                              <span className="ml-2 font-medium capitalize">
                                {training.trainingType.replace('_', ' ')}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Duration:</span>
                              <span className="ml-2 font-medium">{training.duration} hours</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">CPD Hours:</span>
                              <span className="ml-2 font-medium">{training.cpd_hours}</span>
                            </div>
                          </div>
                          
                          {training.notes && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <p className="text-sm text-muted-foreground">Notes:</p>
                              <p className="text-sm">{training.notes}</p>
                            </div>
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

        {/* License Renewals Tab */}
        <TabsContent value="licenses">
          <div className="space-y-6">
            {/* License Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Licenses</p>
                      <p className="text-2xl font-bold text-lea-deep-charcoal">15</p>
                    </div>
                    <Award className="h-8 w-8 text-lea-sage-green" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Due for Renewal</p>
                      <p className="text-2xl font-bold text-yellow-600">3</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Overdue</p>
                      <p className="text-2xl font-bold text-red-600">1</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Renewal Cost</p>
                      <p className="text-2xl font-bold text-purple-600">£1,440</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* License Renewals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  License Management
                </CardTitle>
                <CardDescription>
                  Track professional licenses and renewal requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLicenseRenewals.map((license) => (
                    <div key={license.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium">{license.licenseType}</h4>
                            {getStatusBadge(license.renewalStatus)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">License Holder:</span>
                              <span className="ml-2 font-medium">{license.staffName}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Issuing Body:</span>
                              <span className="ml-2 font-medium">{license.issuingBody}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Current Expiry:</span>
                              <span className="ml-2 font-medium">
                                {new Date(license.currentExpiryDate).toLocaleDateString()}
                                {license.renewalStatus === 'pending' && (
                                  <span className="ml-1 text-orange-600">
                                    ({getDaysUntilExpiry(license.currentExpiryDate)} days remaining)
                                  </span>
                                )}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Renewal Fee:</span>
                              <span className="ml-2 font-medium">£{license.fee}</span>
                            </div>
                          </div>
                          
                          {/* CPD Progress */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">CPD Hours Progress</span>
                              <span className="text-sm text-muted-foreground">
                                {license.cpd_completed}/{license.cpd_required} hours
                              </span>
                            </div>
                            <Progress 
                              value={getCPDProgress(license.cpd_completed, license.cpd_required)} 
                              className="h-2" 
                            />
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {license.renewalStatus === 'pending' && (
                            <Button size="sm" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Renew
                            </Button>
                          )}
                          {license.renewalStatus === 'overdue' && (
                            <Button size="sm" className="bg-red-600 text-white hover:bg-red-700">
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              Urgent
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

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Team Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team Compliance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockStaffMembers.map((staff) => {
                    const staffCerts = mockCertifications.filter(c => c.staffId === staff.id);
                    const staffTraining = mockTrainingRecords.filter(t => t.staffId === staff.id);
                    const staffLicenses = mockLicenseRenewals.filter(l => l.staffId === staff.id);
                    
                    const validCerts = staffCerts.filter(c => c.status === 'valid').length;
                    const totalCerts = staffCerts.length;
                    const completedTraining = staffTraining.filter(t => t.status === 'completed').length;
                    
                    return (
                      <div key={staff.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center space-x-3">
                              <h4 className="font-medium">{staff.name}</h4>
                              <Badge variant="outline">{staff.role}</Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium text-muted-foreground">Certifications</h5>
                                <div className="flex items-center space-x-2">
                                  <Progress value={(validCerts / Math.max(totalCerts, 1)) * 100} className="flex-1" />
                                  <span className="text-sm font-medium">{validCerts}/{totalCerts}</span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium text-muted-foreground">Training (This Year)</h5>
                                <div className="flex items-center space-x-2">
                                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">{completedTraining} completed</span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium text-muted-foreground">License Status</h5>
                                <div className="flex flex-wrap gap-1">
                                  {staffLicenses.map(license => (
                                    <div key={license.id}>
                                      {getStatusBadge(license.renewalStatus)}
                                    </div>
                                  ))}
                                  {staffLicenses.length === 0 && (
                                    <Badge variant="outline" className="text-xs">No licenses</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Compliance Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Actions Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium">1 license overdue for renewal</p>
                        <p className="text-sm text-muted-foreground">James Brown - Laser Practitioner License</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-red-600 text-white hover:bg-red-700">
                      Action Required
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium">4 certifications expiring within 60 days</p>
                        <p className="text-sm text-muted-foreground">Schedule renewal appointments</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Schedule
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">CPD hours tracking</p>
                        <p className="text-sm text-muted-foreground">2 staff members need additional CPD hours</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Certification Dialog */}
      <Dialog open={showCertDialog} onOpenChange={setShowCertDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Certification</DialogTitle>
          </DialogHeader>
          <form onSubmit={certForm.handleSubmit((data) => console.log('Certification:', data))} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="staffId">Staff Member</Label>
                <Select onValueChange={(value) => certForm.setValue('staffId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStaffMembers.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name} - {staff.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="certificationName">Certification Name</Label>
                <Input {...certForm.register('certificationName')} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="issuingBody">Issuing Body</Label>
                <Input {...certForm.register('issuingBody')} />
              </div>
              <div>
                <Label htmlFor="level">Level</Label>
                <Select onValueChange={(value) => certForm.setValue('level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {CERTIFICATION_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="certificationDate">Certification Date</Label>
                <Input {...certForm.register('certificationDate')} type="date" />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input {...certForm.register('expiryDate')} type="date" />
              </div>
              <div>
                <Label htmlFor="cpd_hours">CPD Hours</Label>
                <Input {...certForm.register('cpd_hours', { valueAsNumber: true })} type="number" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea 
                {...certForm.register('notes')}
                placeholder="Any additional information about this certification..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowCertDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                Add Certification
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Training Dialog */}
      <Dialog open={showTrainingDialog} onOpenChange={setShowTrainingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Training Record</DialogTitle>
          </DialogHeader>
          <form onSubmit={trainingForm.handleSubmit((data) => console.log('Training:', data))} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="staffId">Staff Member</Label>
                <Select onValueChange={(value) => trainingForm.setValue('staffId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStaffMembers.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name} - {staff.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="trainingTitle">Training Title</Label>
                <Input {...trainingForm.register('trainingTitle')} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="provider">Training Provider</Label>
                <Input {...trainingForm.register('provider')} />
              </div>
              <div>
                <Label htmlFor="trainingType">Training Type</Label>
                <Select onValueChange={(value) => trainingForm.setValue('trainingType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAINING_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <Label htmlFor="trainingDate">Training Date</Label>
                <Input {...trainingForm.register('trainingDate')} type="date" />
              </div>
              <div>
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input {...trainingForm.register('duration', { valueAsNumber: true })} type="number" />
              </div>
              <div>
                <Label htmlFor="cpd_hours">CPD Hours</Label>
                <Input {...trainingForm.register('cpd_hours', { valueAsNumber: true })} type="number" />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => trainingForm.setValue('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAINING_STATUS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowTrainingDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                Add Training
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
