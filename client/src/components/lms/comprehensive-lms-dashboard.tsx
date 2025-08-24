import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  FileText,
  PieChart,
  BarChart3,
  Target,
  Plus,
  ArrowRight,
  User,
  Activity,
  DollarSign,
  Brain,
  Shield,
  Zap,
  Globe,
  BookCheck,
  UserCheck,
  Trophy,
  Briefcase,
} from "lucide-react";
import { format, subDays, addDays } from "date-fns";

// Import existing LMS components
import LMSDashboard from "./lms-dashboard";
import CourseManagement from "./course-management";
import StudentEnrollment from "./student-enrollment";
import AssessmentSystem from "./assessment-system";
import CertificateManagement from "./certificate-management";
import CpdTracking from "./cpd-tracking";

// Comprehensive LMS Statistics Interface
interface ComprehensiveLMSStats {
  // Overall metrics
  totalStudents: number;
  totalCourses: number;
  totalInstructors: number;
  totalModules: number;
  
  // Enrollment metrics
  activeEnrollments: number;
  pendingApplications: number;
  completedCourses: number;
  droppedStudents: number;
  
  // Assessment metrics
  totalAssessments: number;
  pendingGrading: number;
  averageScore: number;
  passRate: number;
  
  // Certificate metrics
  certificatesIssued: number;
  pendingCertificates: number;
  expiringSoon: number;
  revokedCertificates: number;
  
  // CPD metrics
  totalCpdHours: number;
  averageCpdPerStudent: number;
  cpdCompliant: number;
  cpdDeficient: number;
  
  // Financial metrics
  totalRevenue: number;
  monthlyRevenue: number;
  averageCoursePrice: number;
  paymentsPending: number;
  
  // Performance metrics
  averageCompletionRate: number;
  studentSatisfaction: number;
  instructorRating: number;
  systemUptime: number;
  
  // Compliance metrics
  ofqualCompliant: number;
  auditReadiness: number;
  dataCompliance: number;
  certificationValidity: number;
}

// Recent Activity Interface
interface LMSActivity {
  id: string;
  type: 
    | "enrollment"
    | "completion" 
    | "assessment_submitted"
    | "assessment_graded"
    | "certificate_issued"
    | "cpd_recorded"
    | "course_created"
    | "student_registered"
    | "payment_received"
    | "module_completed";
  studentName?: string;
  instructorName?: string;
  courseName?: string;
  moduleName?: string;
  assessmentName?: string;
  message: string;
  timestamp: string;
  priority: "low" | "medium" | "high";
  status: "success" | "warning" | "error" | "info";
  metadata?: Record<string, any>;
}

// Quick Actions Interface
interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  color: string;
  count?: number;
}

export default function ComprehensiveLMSDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  // Fetch comprehensive LMS statistics
  const { data: stats } = useQuery<ComprehensiveLMSStats>({
    queryKey: ["/api/lms/comprehensive-stats", timeRange],
    initialData: {
      totalStudents: 1247,
      totalCourses: 45,
      totalInstructors: 18,
      totalModules: 387,
      
      activeEnrollments: 856,
      pendingApplications: 23,
      completedCourses: 1789,
      droppedStudents: 34,
      
      totalAssessments: 2847,
      pendingGrading: 67,
      averageScore: 85.3,
      passRate: 94.2,
      
      certificatesIssued: 1234,
      pendingCertificates: 12,
      expiringSoon: 45,
      revokedCertificates: 3,
      
      totalCpdHours: 15678,
      averageCpdPerStudent: 12.6,
      cpdCompliant: 1189,
      cpdDeficient: 58,
      
      totalRevenue: 2847569,
      monthlyRevenue: 187450,
      averageCoursePrice: 2850,
      paymentsPending: 34567,
      
      averageCompletionRate: 87.4,
      studentSatisfaction: 4.7,
      instructorRating: 4.8,
      systemUptime: 99.8,
      
      ofqualCompliant: 42,
      auditReadiness: 96,
      dataCompliance: 98,
      certificationValidity: 99,
    },
  });

  // Fetch recent activity
  const { data: recentActivity = [] } = useQuery<LMSActivity[]>({
    queryKey: ["/api/lms/recent-activity"],
    initialData: [
      {
        id: "1",
        type: "certificate_issued",
        studentName: "Emma Thompson",
        courseName: "Advanced Facial Aesthetics",
        message: "Certificate issued for Advanced Facial Aesthetics Level 4 Diploma",
        timestamp: new Date().toISOString(),
        priority: "high",
        status: "success",
      },
      {
        id: "2",
        type: "assessment_submitted",
        studentName: "James Wilson",
        courseName: "Chemical Peel Certification",
        assessmentName: "Module 3 Practical",
        message: "Practical assessment submitted for review",
        timestamp: subDays(new Date(), 1).toISOString(),
        priority: "medium",
        status: "info",
      },
      {
        id: "3",
        type: "cpd_recorded",
        studentName: "Sarah Chen",
        message: "12 CPD hours recorded for Advanced Skin Analysis Workshop",
        timestamp: subDays(new Date(), 2).toISOString(),
        priority: "low",
        status: "success",
      },
      {
        id: "4",
        type: "enrollment",
        studentName: "Michael Brown",
        courseName: "Anatomy & Physiology for Aesthetics",
        message: "New enrollment with payment confirmation",
        timestamp: subDays(new Date(), 3).toISOString(),
        priority: "medium",
        status: "success",
      },
      {
        id: "5",
        type: "module_completed",
        studentName: "Lisa Rodriguez",
        courseName: "Dermal Fillers Masterclass",
        moduleName: "Safety Protocols",
        message: "Module completed with 95% score",
        timestamp: subDays(new Date(), 4).toISOString(),
        priority: "low",
        status: "success",
      },
    ],
  });

  // Define quick actions
  const quickActions: QuickAction[] = [
    {
      id: "create-course",
      title: "Create Course",
      description: "Design new training course",
      icon: <BookOpen className="w-5 h-5" />,
      action: "create-course",
      color: "bg-blue-500",
    },
    {
      id: "enroll-student",
      title: "Enroll Student",
      description: "Add student to course",
      icon: <UserCheck className="w-5 h-5" />,
      action: "enroll-student",
      color: "bg-green-500",
    },
    {
      id: "grade-assessments",
      title: "Grade Assessments",
      description: "Review pending submissions",
      icon: <FileText className="w-5 h-5" />,
      action: "grade-assessments",
      color: "bg-orange-500",
      count: stats?.pendingGrading,
    },
    {
      id: "issue-certificates",
      title: "Issue Certificates",
      description: "Generate digital certificates",
      icon: <Award className="w-5 h-5" />,
      action: "issue-certificates",
      color: "bg-purple-500",
      count: stats?.pendingCertificates,
    },
    {
      id: "verify-cpd",
      title: "Verify CPD",
      description: "Review CPD submissions",
      icon: <Shield className="w-5 h-5" />,
      action: "verify-cpd",
      color: "bg-teal-500",
    },
    {
      id: "system-reports",
      title: "System Reports",
      description: "Generate compliance reports",
      icon: <BarChart3 className="w-5 h-5" />,
      action: "system-reports",
      color: "bg-indigo-500",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "enrollment":
        return <Users className="w-4 h-4 text-blue-600" />;
      case "completion":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "certificate_issued":
        return <Award className="w-4 h-4 text-purple-600" />;
      case "assessment_submitted":
        return <FileText className="w-4 h-4 text-orange-600" />;
      case "assessment_graded":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "cpd_recorded":
        return <BookCheck className="w-4 h-4 text-teal-600" />;
      case "course_created":
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case "student_registered":
        return <User className="w-4 h-4 text-green-600" />;
      case "payment_received":
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case "module_completed":
        return <Target className="w-4 h-4 text-blue-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-lea-deep-charcoal font-serif">
              LMS Command Center
            </h1>
            <p className="text-lg text-lea-charcoal-grey mt-1">
              Comprehensive Learning Management System Dashboard
            </p>
            <p className="text-sm text-lea-charcoal-grey">
              Real-time insights • Ofqual Compliant • Full Audit Trail
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-lg p-1 shadow-sm border">
              {(["7d", "30d", "90d", "1y"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range
                      ? "bg-lea-clinical-blue text-white"
                      : "text-lea-charcoal-grey hover:bg-gray-100"
                  }`}
                >
                  {range === "1y" ? "1 Year" : range.toUpperCase()}
                </button>
              ))}
            </div>
            
            <Button className="bg-lea-clinical-blue hover:bg-blue-700 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Students</p>
                  <p className="text-3xl font-bold">{stats?.totalStudents.toLocaleString()}</p>
                  <p className="text-blue-100 text-sm">+12% this month</p>
                </div>
                <GraduationCap className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Active Courses</p>
                  <p className="text-3xl font-bold">{stats?.totalCourses}</p>
                  <p className="text-green-100 text-sm">{stats?.ofqualCompliant} Ofqual compliant</p>
                </div>
                <BookOpen className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Certificates</p>
                  <p className="text-3xl font-bold">{stats?.certificatesIssued.toLocaleString()}</p>
                  <p className="text-purple-100 text-sm">{stats?.pendingCertificates} pending</p>
                </div>
                <Award className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Pass Rate</p>
                  <p className="text-3xl font-bold">{stats?.passRate}%</p>
                  <p className="text-orange-100 text-sm">Avg score: {stats?.averageScore}</p>
                </div>
                <Target className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm font-medium">CPD Hours</p>
                  <p className="text-3xl font-bold">{(stats?.totalCpdHours / 1000).toFixed(1)}k</p>
                  <p className="text-teal-100 text-sm">{stats?.cpdCompliant} compliant</p>
                </div>
                <BookCheck className="w-8 h-8 text-teal-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Revenue</p>
                  <p className="text-3xl font-bold">£{(stats?.monthlyRevenue / 1000).toFixed(0)}k</p>
                  <p className="text-indigo-100 text-sm">+8% vs last month</p>
                </div>
                <DollarSign className="w-8 h-8 text-indigo-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto bg-white shadow-sm border">
            <TabsTrigger value="overview" className="data-[state=active]:bg-lea-clinical-blue data-[state=active]:text-white">
              <PieChart className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-lea-clinical-blue data-[state=active]:text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-lea-clinical-blue data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Students
            </TabsTrigger>
            <TabsTrigger value="assessments" className="data-[state=active]:bg-lea-clinical-blue data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Assessments
            </TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-lea-clinical-blue data-[state=active]:text-white">
              <Award className="w-4 h-4 mr-2" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="cpd" className="data-[state=active]:bg-lea-clinical-blue data-[state=active]:text-white">
              <Trophy className="w-4 h-4 mr-2" />
              CPD
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="bg-white shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-lea-deep-charcoal font-serif flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        className={`h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all border-gray-200 hover:border-gray-300 relative`}
                      >
                        <div className={`${action.color} p-2 rounded-lg text-white`}>
                          {action.icon}
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-sm">{action.title}</p>
                          <p className="text-xs text-gray-500">{action.description}</p>
                        </div>
                        {action.count && (
                          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                            {action.count}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card className="bg-white shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-lea-deep-charcoal font-serif flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Ofqual Compliance</span>
                      <div className="flex items-center gap-2">
                        <Progress value={stats?.auditReadiness} className="w-16 h-2" />
                        <span className="text-sm font-medium text-green-600">{stats?.auditReadiness}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Data Compliance</span>
                      <div className="flex items-center gap-2">
                        <Progress value={stats?.dataCompliance} className="w-16 h-2" />
                        <span className="text-sm font-medium text-green-600">{stats?.dataCompliance}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">System Uptime</span>
                      <div className="flex items-center gap-2">
                        <Progress value={stats?.systemUptime} className="w-16 h-2" />
                        <span className="text-sm font-medium text-green-600">{stats?.systemUptime}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Certificate Validity</span>
                      <div className="flex items-center gap-2">
                        <Progress value={stats?.certificationValidity} className="w-16 h-2" />
                        <span className="text-sm font-medium text-green-600">{stats?.certificationValidity}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Overall Health Score</span>
                      <span className="font-bold text-green-600 text-lg">A+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <Card className="bg-white shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-lea-deep-charcoal font-serif flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    Key Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{stats?.averageCompletionRate}%</p>
                      <p className="text-xs text-blue-600">Completion Rate</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{stats?.studentSatisfaction}</p>
                      <p className="text-xs text-yellow-600">Satisfaction</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{stats?.instructorRating}</p>
                      <p className="text-xs text-green-600">Instructor Rating</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{stats?.averageCpdPerStudent}</p>
                      <p className="text-xs text-purple-600">Avg CPD Hours</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <Button variant="outline" className="w-full">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Detailed Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal font-serif flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500" />
                  Recent Activity
                  <Badge variant="secondary" className="ml-2">{recentActivity.length} items</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0 mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${getActivityStatusColor(activity.status)}`}>
                            {activity.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-gray-500">
                              {format(new Date(activity.timestamp), 'MMM dd, HH:mm')}
                            </p>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                activity.priority === 'high' ? 'border-red-300 text-red-600' :
                                activity.priority === 'medium' ? 'border-yellow-300 text-yellow-600' :
                                'border-gray-300 text-gray-600'
                              }`}
                            >
                              {activity.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Course Management Tab */}
          <TabsContent value="courses" className="space-y-6">
            <CourseManagement />
          </TabsContent>

          {/* Student Management Tab */}
          <TabsContent value="students" className="space-y-6">
            <StudentEnrollment />
          </TabsContent>

          {/* Assessment Management Tab */}
          <TabsContent value="assessments" className="space-y-6">
            <AssessmentSystem />
          </TabsContent>

          {/* Certificate Management Tab */}
          <TabsContent value="certificates" className="space-y-6">
            <CertificateManagement />
          </TabsContent>

          {/* CPD Management Tab */}
          <TabsContent value="cpd" className="space-y-6">
            <CpdTracking />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
