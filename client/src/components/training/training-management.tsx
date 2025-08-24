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
  BookOpen,
  Users,
  Award,
  Calendar,
  Clock,
  Download,
  Upload,
  Eye,
  Settings,
  Plus,
  Search,
  Filter,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Star,
  User,
} from "lucide-react";
import { format, addWeeks, differenceInDays, addDays } from "date-fns";

interface Course {
  id: string;
  title: string;
  description: string;
  category: 'aesthetic' | 'compliance' | 'business' | 'safety';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in hours
  price: number;
  instructor: string;
  enrolledStudents: number;
  maxCapacity: number;
  status: 'active' | 'draft' | 'archived';
  startDate: string;
  endDate: string;
  modules: Module[];
  rating: number;
  completionRate: number;
  certificateTemplate?: string;
  prerequisites: string[];
  tags: string[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  duration: number;
  order: number;
  isCompleted: boolean;
  resources: Resource[];
}

interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'link' | 'image';
  url: string;
  size?: number;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  enrolledCourses: string[];
  completedCourses: string[];
  progress: { [courseId: string]: number };
  totalHours: number;
  certificates: Certificate[];
  lastActive: string;
  status: 'active' | 'inactive' | 'suspended';
}

interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  completionDate: string;
  score: number;
  certificateUrl: string;
  expiryDate?: string;
}

export default function TrainingManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const { toast } = useToast();

  // Mock data - replace with real API calls
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/training/courses"],
    initialData: [
      {
        id: "course-1",
        title: "Advanced Botox Techniques",
        description: "Comprehensive training in advanced botulinum toxin injection techniques for aesthetic practitioners",
        category: "aesthetic",
        level: "advanced",
        duration: 16,
        price: 1299,
        instructor: "Dr. Sarah Wilson",
        enrolledStudents: 24,
        maxCapacity: 30,
        status: "active",
        startDate: "2024-09-15",
        endDate: "2024-09-17",
        modules: [
          {
            id: "mod-1",
            title: "Facial Anatomy Review",
            description: "Detailed review of facial anatomy for injection procedures",
            type: "video",
            duration: 2,
            order: 1,
            isCompleted: false,
            resources: []
          },
          {
            id: "mod-2",
            title: "Advanced Injection Techniques",
            description: "Hands-on training with advanced injection methods",
            type: "assignment",
            duration: 4,
            order: 2,
            isCompleted: false,
            resources: []
          }
        ],
        rating: 4.8,
        completionRate: 95,
        prerequisites: ["Basic Botox Certification"],
        tags: ["botox", "advanced", "practical"],
      },
      {
        id: "course-2",
        title: "Dermal Filler Safety & Techniques",
        description: "Essential safety protocols and injection techniques for dermal fillers",
        category: "aesthetic",
        level: "intermediate",
        duration: 12,
        price: 999,
        instructor: "Dr. Michael Brown",
        enrolledStudents: 18,
        maxCapacity: 25,
        status: "active",
        startDate: "2024-10-01",
        endDate: "2024-10-02",
        modules: [
          {
            id: "mod-3",
            title: "Filler Types & Properties",
            description: "Understanding different filler types and their applications",
            type: "video",
            duration: 3,
            order: 1,
            isCompleted: false,
            resources: []
          }
        ],
        rating: 4.6,
        completionRate: 88,
        prerequisites: ["Foundation Aesthetics"],
        tags: ["fillers", "safety", "intermediate"],
      },
      {
        id: "course-3",
        title: "JCCP Compliance & Documentation",
        description: "Complete guide to JCCP compliance requirements and proper documentation",
        category: "compliance",
        level: "beginner",
        duration: 8,
        price: 399,
        instructor: "Emma Thompson",
        enrolledStudents: 35,
        maxCapacity: 50,
        status: "active",
        startDate: "2024-08-25",
        endDate: "2024-08-25",
        modules: [
          {
            id: "mod-4",
            title: "JCCP Requirements Overview",
            description: "Understanding all JCCP compliance requirements",
            type: "document",
            duration: 2,
            order: 1,
            isCompleted: false,
            resources: []
          }
        ],
        rating: 4.9,
        completionRate: 98,
        prerequisites: [],
        tags: ["compliance", "jccp", "documentation"],
      }
    ],
  });

  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ["/api/training/students"],
    initialData: [
      {
        id: "student-1",
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice.johnson@email.com",
        phone: "+44 7700 900123",
        enrolledCourses: ["course-1", "course-3"],
        completedCourses: ["course-3"],
        progress: { "course-1": 65, "course-3": 100 },
        totalHours: 24,
        certificates: [
          {
            id: "cert-1",
            courseId: "course-3",
            courseName: "JCCP Compliance & Documentation",
            completionDate: "2024-08-25",
            score: 96,
            certificateUrl: "/certificates/cert-1.pdf"
          }
        ],
        lastActive: "2024-08-23",
        status: "active"
      },
      {
        id: "student-2",
        firstName: "Robert",
        lastName: "Davis",
        email: "robert.davis@email.com",
        phone: "+44 7700 900456",
        enrolledCourses: ["course-2"],
        completedCourses: [],
        progress: { "course-2": 40 },
        totalHours: 8,
        certificates: [],
        lastActive: "2024-08-20",
        status: "active"
      }
    ],
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'aesthetic':
        return 'bg-purple-100 text-purple-800';
      case 'compliance':
        return 'bg-blue-100 text-blue-800';
      case 'business':
        return 'bg-green-100 text-green-800';
      case 'safety':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Courses</p>
                <p className="text-3xl font-bold">{courses.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Students</p>
                <p className="text-3xl font-bold">
                  {students.filter(s => s.status === 'active').length}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Certificates Issued</p>
                <p className="text-3xl font-bold">
                  {students.reduce((total, student) => total + student.certificates.length, 0)}
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold">
                  £{courses.reduce((total, course) => total + (course.price * course.enrolledStudents), 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 5)
                .map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(course.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
                        </div>
                        <Badge className={getCategoryColor(course.category)}>
                          {course.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">£{course.price}</p>
                      <p className="text-sm text-gray-600">{course.enrolledStudents} enrolled</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Student Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students
                .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
                .slice(0, 5)
                .map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{student.firstName} {student.lastName}</h4>
                        <p className="text-sm text-gray-600">
                          Last active: {format(new Date(student.lastActive), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{student.enrolledCourses.length} courses</p>
                      <p className="text-sm text-gray-600">{student.totalHours}h completed</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Course Management</h2>
        <Button onClick={() => setShowCourseDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="all">All Categories</option>
          <option value="aesthetic">Aesthetic</option>
          <option value="compliance">Compliance</option>
          <option value="business">Business</option>
          <option value="safety">Safety</option>
        </select>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <Badge className={getCategoryColor(course.category)}>
                  {course.category}
                </Badge>
                <Badge className={getStatusColor(course.status)}>
                  {course.status}
                </Badge>
              </div>
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Instructor:</span>
                  <span className="font-medium">{course.instructor}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{course.duration}h</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">£{course.price}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Enrollment:</span>
                    <span>{course.enrolledStudents}/{course.maxCapacity}</span>
                  </div>
                  <Progress 
                    value={(course.enrolledStudents / course.maxCapacity) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={getLevelColor(course.level)}>
                    {course.level}
                  </Badge>
                  <div className="flex items-center text-sm text-yellow-600">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    {course.rating}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Settings className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Management</h2>
        <Button onClick={() => setShowStudentDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      <div className="space-y-4">
        {students.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-gray-600">{student.email}</p>
                    <p className="text-sm text-gray-500">{student.phone}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {student.status}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Last active: {format(new Date(student.lastActive), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Hours</p>
                  <p className="text-2xl font-bold text-blue-600">{student.totalHours}h</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Enrolled Courses ({student.enrolledCourses.length})</h4>
                  <div className="space-y-2">
                    {student.enrolledCourses.map((courseId) => {
                      const course = courses.find(c => c.id === courseId);
                      const progress = student.progress[courseId] || 0;
                      
                      return (
                        <div key={courseId} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium">{course?.title}</h5>
                            <span className="text-sm text-gray-600">{progress}% complete</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {student.certificates.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Certificates ({student.certificates.length})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {student.certificates.map((cert) => (
                        <div key={cert.id} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                          <Award className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-sm font-medium">{cert.courseName}</p>
                            <p className="text-xs text-gray-600">
                              Score: {cert.score}% - {format(new Date(cert.completionDate), 'MMM yyyy')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    View Profile
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Export Data
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4 mr-1" />
                    Manage
                  </Button>
                </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Training Management</h1>
          <p className="text-gray-600 mt-1">Manage courses, students, and training programs</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          {renderCourses()}
        </TabsContent>

        <TabsContent value="students" className="mt-6">
          {renderStudents()}
        </TabsContent>
      </Tabs>

      {/* Create Course Dialog */}
      <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Course Title</Label>
                <Input className="mt-1" placeholder="Enter course title" />
              </div>
              <div>
                <Label>Category</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="aesthetic">Aesthetic</option>
                  <option value="compliance">Compliance</option>
                  <option value="business">Business</option>
                  <option value="safety">Safety</option>
                </select>
              </div>
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea className="mt-1" placeholder="Course description" />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Duration (hours)</Label>
                <Input type="number" className="mt-1" placeholder="8" />
              </div>
              <div>
                <Label>Price (£)</Label>
                <Input type="number" className="mt-1" placeholder="299" />
              </div>
              <div>
                <Label>Max Capacity</Label>
                <Input type="number" className="mt-1" placeholder="20" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCourseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowCourseDialog(false)}>
              Create Course
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Student Dialog */}
      <Dialog open={showStudentDialog} onOpenChange={setShowStudentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input className="mt-1" placeholder="Enter first name" />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input className="mt-1" placeholder="Enter last name" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input type="email" className="mt-1" placeholder="student@email.com" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input className="mt-1" placeholder="+44 7700 900000" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowStudentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowStudentDialog(false)}>
              Add Student
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
