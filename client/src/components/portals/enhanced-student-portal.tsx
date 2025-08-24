import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  Star,
  Download,
  Upload,
  MessageCircle,
  Calendar,
  Target,
  TrendingUp,
  BarChart3,
  User,
  Settings,
  Bell,
  Play,
  FileText,
  CheckCircle,
  AlertCircle,
  Trophy,
  Brain,
  Sparkles,
  ChevronRight,
  Plus,
  Eye,
  Share,
  Shield,
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";

interface CourseModule {
  id: string;
  title: string;
  description: string;
  contentType: 'video' | 'document' | 'interactive' | 'quiz';
  duration: number;
  completed: boolean;
  progress: number;
  orderIndex: number;
}

interface Course {
  id: string;
  name: string;
  description: string;
  level: string;
  instructor: string;
  duration: number;
  modules: CourseModule[];
  progress: number;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  targetCompletionDate: string;
  certificateEarned?: boolean;
}

interface Assessment {
  id: string;
  courseId: string;
  courseName: string;
  type: 'quiz' | 'practical' | 'portfolio' | 'osce';
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  maxScore?: number;
  feedback?: string;
  attempts: number;
  maxAttempts: number;
}

interface CpdRecord {
  id: string;
  title: string;
  provider: string;
  hours: number;
  dateCompleted: string;
  category: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  certificateUrl?: string;
}

interface DigitalCertificate {
  id: string;
  courseId: string;
  courseName: string;
  certificateNumber: string;
  issuedDate: string;
  expiryDate?: string;
  awardingBody: string;
  finalGrade: string;
  verificationCode: string;
  downloadUrl: string;
  shareableUrl: string;
}

interface StudentData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  studentId: string;
  enrollmentDate: string;
  currentLevel: string;
  totalCpdHours: number;
  targetCpdHours: number;
  profileImageUrl?: string;
  averageGrade: number;
  coursesCompleted: number;
  certificatesEarned: number;
}

export default function EnhancedStudentPortal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [showCpdDialog, setShowCpdDialog] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<DigitalCertificate | null>(null);
  const { toast } = useToast();

  // Mock student data - replace with real API calls
  const studentData: StudentData = {
    id: "student-123",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "+44 7700 900456",
    studentId: "LEA2025001",
    enrollmentDate: "2024-09-01",
    currentLevel: "Level 4",
    totalCpdHours: 35,
    targetCpdHours: 40,
    averageGrade: 87.5,
    coursesCompleted: 3,
    certificatesEarned: 2,
  };

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/student/courses"],
    initialData: [
      {
        id: "course-1",
        name: "Level 4 Botox Training",
        description: "Comprehensive botox injection training program",
        level: "Level 4",
        instructor: "Dr. Sarah Wilson",
        duration: 120,
        progress: 75,
        status: "active",
        startDate: "2024-09-01",
        targetCompletionDate: "2024-12-01",
        modules: [
          {
            id: "mod-1",
            title: "Anatomy & Physiology",
            description: "Understanding facial anatomy",
            contentType: "video",
            duration: 45,
            completed: true,
            progress: 100,
            orderIndex: 1,
          },
          {
            id: "mod-2", 
            title: "Injection Techniques",
            description: "Practical injection methods",
            contentType: "interactive",
            duration: 60,
            completed: true,
            progress: 100,
            orderIndex: 2,
          },
          {
            id: "mod-3",
            title: "Safety Protocols",
            description: "Patient safety and emergency procedures",
            contentType: "document",
            duration: 30,
            completed: false,
            progress: 60,
            orderIndex: 3,
          },
        ],
      },
      {
        id: "course-2",
        name: "Advanced Dermal Fillers",
        description: "Advanced lip and cheek enhancement techniques",
        level: "Level 5",
        instructor: "Dr. Emma Johnson",
        duration: 90,
        progress: 45,
        status: "active",
        startDate: "2024-10-01",
        targetCompletionDate: "2025-01-15",
        modules: [],
      },
    ],
  });

  const { data: assessments = [] } = useQuery<Assessment[]>({
    queryKey: ["/api/student/assessments"],
    initialData: [
      {
        id: "assess-1",
        courseId: "course-1",
        courseName: "Level 4 Botox Training",
        type: "practical",
        title: "Practical Skills Assessment",
        dueDate: "2024-11-15",
        status: "pending",
        attempts: 0,
        maxAttempts: 3,
      },
      {
        id: "assess-2",
        courseId: "course-1", 
        courseName: "Level 4 Botox Training",
        type: "quiz",
        title: "Anatomy Quiz",
        dueDate: "2024-11-01",
        status: "graded",
        score: 85,
        maxScore: 100,
        feedback: "Excellent understanding of facial anatomy. Minor improvements needed in muscle identification.",
        attempts: 1,
        maxAttempts: 2,
      },
    ],
  });

  const { data: cpdRecords = [] } = useQuery<CpdRecord[]>({
    queryKey: ["/api/student/cpd"],
    initialData: [
      {
        id: "cpd-1",
        title: "Advanced Skin Analysis Workshop",
        provider: "Aesthetic Training Institute",
        hours: 8,
        dateCompleted: "2024-10-15",
        category: "clinical",
        verificationStatus: "verified",
        certificateUrl: "/certificates/cpd-1.pdf",
      },
      {
        id: "cpd-2",
        title: "Business Skills for Practitioners",
        provider: "Professional Development Academy",
        hours: 12,
        dateCompleted: "2024-09-20",
        category: "business",
        verificationStatus: "pending",
      },
    ],
  });

  const { data: certificates = [] } = useQuery<DigitalCertificate[]>({
    queryKey: ["/api/student/certificates"],
    initialData: [
      {
        id: "cert-1",
        courseId: "course-1",
        courseName: "Level 4 Botox Training",
        certificateNumber: "LEA-BOT-2024-001",
        issuedDate: "2024-08-15",
        awardingBody: "Lea Aesthetics Academy",
        finalGrade: "Distinction",
        verificationCode: "ABC123XYZ",
        downloadUrl: "/certificates/cert-1.pdf",
        shareableUrl: "https://verify.lea-aesthetics.com/ABC123XYZ",
      },
    ],
  });

  const activeCourses = courses.filter(c => c.status === 'active');
  const completedCourses = courses.filter(c => c.status === 'completed');
  const pendingAssessments = assessments.filter(a => a.status === 'pending');
  const gradedAssessments = assessments.filter(a => a.status === 'graded');

  const handleViewCourse = useCallback((course: Course) => {
    setSelectedCourse(course);
    setShowCourseDialog(true);
  }, []);

  const handleViewCertificate = useCallback((certificate: DigitalCertificate) => {
    setSelectedCertificate(certificate);
    setShowCertificateDialog(true);
  }, []);

  const handleDownloadCertificate = useCallback((certificate: DigitalCertificate) => {
    // Mock download
    toast({
      title: "Certificate Downloaded",
      description: `${certificate.courseName} certificate has been downloaded`,
    });
  }, [toast]);

  const handleShareCertificate = useCallback((certificate: DigitalCertificate) => {
    navigator.clipboard.writeText(certificate.shareableUrl);
    toast({
      title: "Link Copied",
      description: "Certificate verification link copied to clipboard",
    });
  }, [toast]);

  const getCpdProgress = () => {
    const progress = (studentData.totalCpdHours / studentData.targetCpdHours) * 100;
    return Math.min(progress, 100);
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4 text-red-500" />;
      case 'document':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'interactive':
        return <Brain className="w-4 h-4 text-purple-500" />;
      case 'quiz':
        return <Target className="w-4 h-4 text-green-500" />;
      default:
        return <BookOpen className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAssessmentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-orange-600 bg-orange-100';
      case 'submitted':
        return 'text-blue-600 bg-blue-100';
      case 'graded':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCpdStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-orange-600 bg-orange-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold text-gray-900">
                  LEA AESTHETICS ACADEMY
                </h1>
                <p className="text-sm text-gray-600">Student Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {studentData.firstName} {studentData.lastName}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-indigo-100 text-indigo-800">
                      {studentData.studentId}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800">
                      {studentData.currentLevel}
                    </Badge>
                  </div>
                </div>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={studentData.profileImageUrl} />
                  <AvatarFallback className="bg-indigo-600 text-white">
                    {studentData.firstName[0]}{studentData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Enhanced Navigation */}
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-lg border-0 p-2 rounded-xl">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="assessments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              Assessments
            </TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <Award className="w-4 h-4 mr-2" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="cpd" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <Trophy className="w-4 h-4 mr-2" />
              CPD
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Average Grade</p>
                      <p className="text-3xl font-bold">{studentData.averageGrade}%</p>
                    </div>
                    <Star className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Courses Completed</p>
                      <p className="text-3xl font-bold">{studentData.coursesCompleted}</p>
                    </div>
                    <GraduationCap className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Certificates</p>
                      <p className="text-3xl font-bold">{studentData.certificatesEarned}</p>
                    </div>
                    <Award className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">CPD Hours</p>
                      <p className="text-3xl font-bold">{studentData.totalCpdHours}</p>
                      <p className="text-orange-100 text-xs">of {studentData.targetCpdHours}</p>
                    </div>
                    <Trophy className="w-8 h-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Learning & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Active Courses */}
              <Card className="lg:col-span-2 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-900 font-serif flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Continue Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeCourses.map((course) => (
                      <div key={course.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{course.name}</h4>
                            <p className="text-sm text-gray-600">
                              with {course.instructor} • {course.level}
                            </p>
                          </div>
                          <Badge className="bg-indigo-100 text-indigo-800">
                            {course.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handleViewCourse(course)}
                            className="bg-indigo-600 hover:bg-indigo-700"
                          >
                            Continue Course
                          </Button>
                          <Button size="sm" variant="outline">
                            View Modules
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CPD Progress & Actions */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-900 font-serif">CPD Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${getCpdProgress() * 3.51} 351`}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#d97706" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{getCpdProgress().toFixed(0)}%</p>
                          <p className="text-xs text-gray-600">Complete</p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      {studentData.totalCpdHours} of {studentData.targetCpdHours} hours completed
                    </p>
                    
                    <div className="space-y-2">
                      <Button 
                        onClick={() => setShowCpdDialog(true)}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Record CPD
                      </Button>
                      <Button 
                        onClick={() => setActiveTab("cpd")}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        View All Records
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Assessments */}
            {pendingAssessments.length > 0 && (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-900 font-serif flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    Upcoming Assessments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingAssessments.map((assessment) => (
                      <div key={assessment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div>
                          <h4 className="font-medium text-gray-900">{assessment.title}</h4>
                          <p className="text-sm text-gray-600">{assessment.courseName}</p>
                          <p className="text-sm text-orange-600">
                            Due: {format(new Date(assessment.dueDate), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getAssessmentStatusColor(assessment.status)}>
                            {assessment.status}
                          </Badge>
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                            {assessment.type === 'quiz' ? 'Take Quiz' : 'Submit Assessment'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="shadow-lg hover:shadow-xl transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{course.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                      </div>
                      <Badge className={course.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                        {course.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}h
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {course.instructor}
                        </span>
                      </div>
                      
                      <Button 
                        onClick={() => handleViewCourse(course)}
                        className="w-full"
                        variant={course.status === 'active' ? 'default' : 'outline'}
                      >
                        {course.status === 'active' ? 'Continue Learning' : 'View Course'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {certificates.map((certificate) => (
                <Card key={certificate.id} className="shadow-lg hover:shadow-xl transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{certificate.courseName}</CardTitle>
                        <p className="text-sm text-gray-600">Certificate #{certificate.certificateNumber}</p>
                      </div>
                      <Award className="w-8 h-8 text-yellow-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Issued:</span>
                          <p className="font-medium">{format(new Date(certificate.issuedDate), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Grade:</span>
                          <p className="font-medium text-green-600">{certificate.finalGrade}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Awarding Body:</span>
                          <p className="font-medium">{certificate.awardingBody}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Verification:</span>
                          <p className="font-medium text-blue-600">{certificate.verificationCode}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleViewCertificate(certificate)}
                          size="sm"
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button 
                          onClick={() => handleDownloadCertificate(certificate)}
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button 
                          onClick={() => handleShareCertificate(certificate)}
                          size="sm"
                          variant="outline"
                        >
                          <Share className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* CPD Tab */}
          <TabsContent value="cpd" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">CPD Records</h2>
                <p className="text-gray-600">Continuing Professional Development tracking</p>
              </div>
              <Button 
                onClick={() => setShowCpdDialog(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add CPD Record
              </Button>
            </div>

            <div className="space-y-4">
              {cpdRecords.map((record) => (
                <Card key={record.id} className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                        <p className="text-gray-600 mt-1">Provider: {record.provider}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {record.hours} hours
                          </span>
                          <span>Completed: {format(new Date(record.dateCompleted), 'MMM dd, yyyy')}</span>
                          <Badge className="bg-blue-100 text-blue-800">{record.category}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getCpdStatusColor(record.verificationStatus)}>
                          {record.verificationStatus}
                        </Badge>
                        {record.certificateUrl && (
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Certificate
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Other tabs would be implemented similarly... */}
        </Tabs>
      </div>

      {/* Course Detail Dialog */}
      <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">
              {selectedCourse?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-6 py-4">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Course Modules</h3>
                      <div className="space-y-3">
                        {selectedCourse.modules.map((module) => (
                          <div key={module.id} className="flex items-center gap-4 p-3 border rounded-lg">
                            {getModuleIcon(module.contentType)}
                            <div className="flex-1">
                              <h4 className="font-medium">{module.title}</h4>
                              <p className="text-sm text-gray-600">{module.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Progress value={module.progress} className="flex-1 h-2" />
                                <span className="text-sm text-gray-600">{module.progress}%</span>
                              </div>
                            </div>
                            {module.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <Button size="sm">
                                {module.contentType === 'video' ? 'Watch' : 'Start'}
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Course Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-600">Instructor:</span>
                        <p className="font-medium">{selectedCourse.instructor}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Level:</span>
                        <p className="font-medium">{selectedCourse.level}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <p className="font-medium">{selectedCourse.duration} hours</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Target Date:</span>
                        <p className="font-medium">
                          {format(new Date(selectedCourse.targetCompletionDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <span className="text-gray-600">Progress:</span>
                        <div className="mt-2">
                          <Progress value={selectedCourse.progress} className="h-2" />
                          <p className="text-center mt-1 font-medium">{selectedCourse.progress}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Certificate Detail Dialog */}
      <Dialog open={showCertificateDialog} onOpenChange={setShowCertificateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Digital Certificate</DialogTitle>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-6 py-4">
              <div className="text-center p-8 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                <Award className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">{selectedCertificate.courseName}</h3>
                <p className="text-gray-600 mt-2">Certificate of Completion</p>
                <p className="text-lg font-semibold text-yellow-700 mt-4">
                  Grade: {selectedCertificate.finalGrade}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Certificate Number:</span>
                  <p className="font-mono font-medium">{selectedCertificate.certificateNumber}</p>
                </div>
                <div>
                  <span className="text-gray-600">Verification Code:</span>
                  <p className="font-mono font-medium">{selectedCertificate.verificationCode}</p>
                </div>
                <div>
                  <span className="text-gray-600">Issued Date:</span>
                  <p className="font-medium">{format(new Date(selectedCertificate.issuedDate), 'MMMM dd, yyyy')}</p>
                </div>
                <div>
                  <span className="text-gray-600">Awarding Body:</span>
                  <p className="font-medium">{selectedCertificate.awardingBody}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => handleDownloadCertificate(selectedCertificate)}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  onClick={() => handleShareCertificate(selectedCertificate)}
                  variant="outline"
                  className="flex-1"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share Link
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CPD Recording Dialog */}
      <Dialog open={showCpdDialog} onOpenChange={setShowCpdDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Record CPD Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Activity Title *</Label>
              <Input placeholder="e.g., Advanced Injection Techniques Workshop" className="mt-2" />
            </div>
            <div>
              <Label>Training Provider *</Label>
              <Input placeholder="e.g., Professional Training Institute" className="mt-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Hours Completed *</Label>
                <Input type="number" placeholder="8" className="mt-2" />
              </div>
              <div>
                <Label>Date Completed *</Label>
                <Input type="date" className="mt-2" />
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <select className="w-full mt-2 p-2 border border-gray-300 rounded-md">
                <option value="clinical">Clinical Skills</option>
                <option value="business">Business Skills</option>
                <option value="safety">Safety & Compliance</option>
                <option value="regulatory">Regulatory Updates</option>
              </select>
            </div>
            <div>
              <Label>Upload Certificate (optional)</Label>
              <Input type="file" accept=".pdf,.jpg,.jpeg,.png" className="mt-2" />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCpdDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowCpdDialog(false)}>
              Record CPD
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
