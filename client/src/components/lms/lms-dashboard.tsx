import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DollarSign
} from "lucide-react";
import { format, subDays } from "date-fns";

interface LMSStats {
  totalStudents: number;
  activeEnrollments: number;
  completedCourses: number;
  totalCourses: number;
  certificatesIssued: number;
  averageCompletionRate: number;
  totalRevenue: number;
  monthlyRevenue: number;
  avgStudentRating: number;
  complianceScore: number;
}

interface Course {
  id: string;
  name: string;
  level: string;
  category: string;
  enrollments: number;
  completions: number;
  completionRate: number;
  averageRating: number;
  status: "active" | "draft" | "archived";
  nextIntake: string;
  duration: number; // weeks
  price: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrolledCourses: number;
  completedCourses: number;
  totalProgress: number;
  lastActivity: string;
  status: "active" | "inactive" | "completed";
  currentCourse?: string;
}

interface RecentActivity {
  id: string;
  type: "enrollment" | "completion" | "assessment" | "certificate";
  studentName: string;
  courseName?: string;
  message: string;
  timestamp: string;
}

export default function LMSDashboard() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  // Mock data - replace with actual API calls
  const { data: stats } = useQuery<LMSStats>({
    queryKey: ["/api/lms/stats", timeRange],
    initialData: {
      totalStudents: 247,
      activeEnrollments: 156,
      completedCourses: 89,
      totalCourses: 12,
      certificatesIssued: 89,
      averageCompletionRate: 78,
      totalRevenue: 48750,
      monthlyRevenue: 12450,
      avgStudentRating: 4.7,
      complianceScore: 96
    }
  });

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/lms/courses"],
    initialData: [
      {
        id: "1",
        name: "Advanced Facial Aesthetics",
        level: "Level 4 Diploma",
        category: "Aesthetic Treatments",
        enrollments: 45,
        completions: 38,
        completionRate: 84,
        averageRating: 4.8,
        status: "active",
        nextIntake: "2024-03-15T00:00:00Z",
        duration: 12,
        price: 2950
      },
      {
        id: "2", 
        name: "Chemical Peel Certification",
        level: "Level 3 Certificate",
        category: "Advanced Treatments",
        enrollments: 32,
        completions: 28,
        completionRate: 88,
        averageRating: 4.6,
        status: "active",
        nextIntake: "2024-04-01T00:00:00Z",
        duration: 8,
        price: 1850
      },
      {
        id: "3",
        name: "Anatomy & Physiology for Aesthetics",
        level: "Foundation Course",
        category: "Prerequisites",
        enrollments: 78,
        completions: 72,
        completionRate: 92,
        averageRating: 4.9,
        status: "active",
        nextIntake: "2024-03-01T00:00:00Z",
        duration: 6,
        price: 895
      }
    ]
  });

  const { data: recentStudents = [] } = useQuery<Student[]>({
    queryKey: ["/api/lms/recent-students"],
    initialData: [
      {
        id: "1",
        name: "Emma Thompson",
        email: "emma.thompson@example.com",
        enrolledCourses: 2,
        completedCourses: 1,
        totalProgress: 65,
        lastActivity: "2024-02-20T14:30:00Z",
        status: "active",
        currentCourse: "Advanced Facial Aesthetics"
      },
      {
        id: "2",
        name: "James Wilson", 
        email: "james.wilson@example.com",
        enrolledCourses: 1,
        completedCourses: 1,
        totalProgress: 100,
        lastActivity: "2024-02-18T16:45:00Z",
        status: "completed",
        currentCourse: "Chemical Peel Certification"
      },
      {
        id: "3",
        name: "Sarah Chen",
        email: "sarah.chen@example.com",
        enrolledCourses: 3,
        completedCourses: 0,
        totalProgress: 45,
        lastActivity: "2024-02-19T10:20:00Z",
        status: "active",
        currentCourse: "Anatomy & Physiology"
      }
    ]
  });

  const { data: recentActivity = [] } = useQuery<RecentActivity[]>({
    queryKey: ["/api/lms/activity"],
    initialData: [
      {
        id: "1",
        type: "completion",
        studentName: "James Wilson",
        courseName: "Chemical Peel Certification",
        message: "completed Chemical Peel Certification with distinction",
        timestamp: "2024-02-20T16:45:00Z"
      },
      {
        id: "2",
        type: "enrollment",
        studentName: "Emma Thompson",
        courseName: "Advanced Facial Aesthetics",
        message: "enrolled in Advanced Facial Aesthetics course",
        timestamp: "2024-02-20T14:30:00Z"
      },
      {
        id: "3",
        type: "certificate",
        studentName: "Sarah Mitchell",
        courseName: "Anatomy & Physiology",
        message: "received digital certificate for Anatomy & Physiology",
        timestamp: "2024-02-19T11:15:00Z"
      },
      {
        id: "4",
        type: "assessment",
        studentName: "Michael Brown",
        courseName: "Advanced Facial Aesthetics",
        message: "submitted Module 3 assessment for review",
        timestamp: "2024-02-19T09:30:00Z"
      }
    ]
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "enrollment":
        return <Users className="w-4 h-4 text-blue-600" />;
      case "completion":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "certificate":
        return <Award className="w-4 h-4 text-purple-600" />;
      case "assessment":
        return <FileText className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case 'archived':
        return <Badge className="bg-red-100 text-red-800">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-lea-deep-charcoal font-serif">Learning Management System</h1>
          <p className="text-lea-charcoal-grey">Ofqual-compliant training platform with comprehensive student tracking</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-lea-clinical-blue hover:bg-blue-700 gap-2">
            <Plus className="w-4 h-4" />
            New Course
          </Button>
          <Button variant="outline" className="border-lea-silver-grey gap-2">
            <Users className="w-4 h-4" />
            Enroll Student
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-lea-platinum-white border-lea-silver-grey shadow-lea-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lea-charcoal-grey font-medium">Total Students</p>
                <p className="text-3xl font-bold text-lea-deep-charcoal">{stats.totalStudents}</p>
                <p className="text-sm text-green-600 font-medium">↑ 12% vs last month</p>
              </div>
              <div className="w-12 h-12 bg-lea-clinical-blue/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-lea-clinical-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-lea-platinum-white border-lea-silver-grey shadow-lea-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lea-charcoal-grey font-medium">Active Courses</p>
                <p className="text-3xl font-bold text-lea-deep-charcoal">{stats.totalCourses}</p>
                <p className="text-sm text-lea-charcoal-grey">
                  {courses.filter(c => c.status === 'active').length} active
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-lea-platinum-white border-lea-silver-grey shadow-lea-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lea-charcoal-grey font-medium">Completion Rate</p>
                <p className="text-3xl font-bold text-lea-deep-charcoal">{stats.averageCompletionRate}%</p>
                <p className="text-sm text-green-600 font-medium">↑ 3% vs last month</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-lea-platinum-white border-lea-silver-grey shadow-lea-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lea-charcoal-grey font-medium">Monthly Revenue</p>
                <p className="text-3xl font-bold text-lea-deep-charcoal">£{(stats.monthlyRevenue / 1000).toFixed(1)}k</p>
                <p className="text-sm text-green-600 font-medium">↑ 8% vs last month</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-lea-clinical-blue" />
            <div className="text-2xl font-bold text-lea-deep-charcoal">{stats.certificatesIssued}</div>
            <p className="text-sm text-lea-charcoal-grey">Certificates Issued</p>
          </CardContent>
        </Card>

        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold text-lea-deep-charcoal">{stats.avgStudentRating}</div>
            <p className="text-sm text-lea-charcoal-grey">Average Rating</p>
          </CardContent>
        </Card>

        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-lea-deep-charcoal">{stats.activeEnrollments}</div>
            <p className="text-sm text-lea-charcoal-grey">Active Enrollments</p>
          </CardContent>
        </Card>

        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-lea-elegant-silver" />
            <div className="text-2xl font-bold text-lea-deep-charcoal">{stats.complianceScore}%</div>
            <p className="text-sm text-lea-charcoal-grey">Compliance Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Performance */}
          <Card className="bg-lea-platinum-white border-lea-silver-grey shadow-lea-card">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Course Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.slice(0, 5).map((course) => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-lea-deep-charcoal">{course.name}</h4>
                        <p className="text-sm text-lea-charcoal-grey">{course.level} • {course.enrollments} students</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-lea-deep-charcoal">{course.completionRate}%</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-lea-charcoal-grey">{course.averageRating}</span>
                        </div>
                      </div>
                    </div>
                    <Progress value={course.completionRate} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Feed */}
          <Card className="bg-lea-platinum-white border-lea-silver-grey shadow-lea-card">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.slice(0, 8).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-lea-silver-grey last:border-0">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-lea-deep-charcoal">
                        <span className="font-medium">{activity.studentName}</span> {activity.message}
                      </p>
                      <p className="text-xs text-lea-charcoal-grey mt-1">
                        {format(new Date(activity.timestamp), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-lea-silver-grey">
                <Button variant="ghost" className="w-full text-lea-clinical-blue hover:bg-lea-clinical-blue/10">
                  View All Activity
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-lea-platinum-white border-lea-silver-grey shadow-lea-card">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-3 bg-lea-clinical-blue hover:bg-blue-700">
                <GraduationCap className="w-4 h-4" />
                Create New Course
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 border-lea-silver-grey hover:bg-lea-pearl-white">
                <Users className="w-4 h-4" />
                Manage Students
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 border-lea-silver-grey hover:bg-lea-pearl-white">
                <FileText className="w-4 h-4" />
                Create Assessment
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 border-lea-silver-grey hover:bg-lea-pearl-white">
                <Award className="w-4 h-4" />
                Issue Certificate
              </Button>
            </CardContent>
          </Card>

          {/* Top Students */}
          <Card className="bg-lea-platinum-white border-lea-silver-grey shadow-lea-card">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif flex items-center gap-2">
                <Star className="w-5 h-5" />
                Top Performing Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentStudents.slice(0, 5).map((student, index) => (
                  <div key={student.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-lea-pearl-white text-lea-charcoal-grey'
                    }`}>
                      #{index + 1}
                    </div>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback className="bg-lea-elegant-silver/20 text-lea-deep-charcoal">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-lea-deep-charcoal truncate">{student.name}</p>
                      <p className="text-xs text-lea-charcoal-grey">{student.totalProgress}% progress</p>
                    </div>
                    {getStatusBadge(student.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Intakes */}
          <Card className="bg-lea-platinum-white border-lea-silver-grey shadow-lea-card">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Course Intakes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {courses.filter(c => c.nextIntake).slice(0, 4).map((course) => (
                  <div key={course.id} className="flex justify-between items-center p-3 bg-lea-pearl-white rounded-lg">
                    <div>
                      <p className="font-medium text-lea-deep-charcoal text-sm">{course.name}</p>
                      <p className="text-xs text-lea-charcoal-grey">{course.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-lea-clinical-blue">
                        {format(new Date(course.nextIntake), 'MMM dd')}
                      </p>
                      <p className="text-xs text-lea-charcoal-grey">£{course.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="bg-lea-platinum-white border-lea-silver-grey shadow-lea-card">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-lea-charcoal-grey">Ofqual Compliance</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">{stats.complianceScore}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-lea-charcoal-grey">Data Backup</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Current</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-lea-charcoal-grey">Certificate Validation</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-lea-charcoal-grey">Server Performance</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Optimal</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
