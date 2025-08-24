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
import { Switch } from "@/components/ui/switch";
import { DataTable } from "@/components/ui/data-table";
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  UserPlus, 
  FileText, 
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Download,
  Upload,
  Mail,
  Phone,
  CreditCard,
  Award,
  BookOpen,
  TrendingUp,
  User,
  GraduationCap
} from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  qualifications: string[];
  enrollments: Enrollment[];
  status: "active" | "inactive" | "graduated" | "suspended";
  totalProgress: number;
  createdAt: string;
  updatedAt: string;
}

interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  courseName: string;
  courseLevel: string;
  enrollmentDate: string;
  startDate: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  status: "pending" | "approved" | "active" | "completed" | "withdrawn" | "failed";
  progress: number;
  paymentStatus: "pending" | "partial" | "paid" | "overdue";
  totalFees: number;
  paidAmount: number;
  installmentPlan?: {
    totalInstallments: number;
    paidInstallments: number;
    nextPaymentDate: string;
    installmentAmount: number;
  };
  documents: EnrollmentDocument[];
  notes: string;
}

interface EnrollmentDocument {
  id: string;
  type: "application" | "qualification" | "id" | "contract" | "certificate";
  name: string;
  url: string;
  uploadedAt: string;
  verified: boolean;
}

interface Course {
  id: string;
  name: string;
  level: string;
  price: number;
  duration: number;
  nextIntake: string;
  maxStudents: number;
  currentEnrollments: number;
}

const enrollmentSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  courseId: z.string().min(1, "Course is required"),
  startDate: z.string().min(1, "Start date is required"),
  paymentPlan: z.enum(["full", "installments"]),
  installments: z.number().optional(),
  notes: z.string().optional()
});

const studentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    postCode: z.string().min(1, "Post code is required"),
    country: z.string().min(1, "Country is required")
  }),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    phone: z.string().min(1, "Emergency contact phone is required")
  })
});

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;
type StudentFormData = z.infer<typeof studentSchema>;

export default function StudentEnrollment() {
  const [activeTab, setActiveTab] = useState("enrollments");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  
  const queryClient = useQueryClient();

  const enrollmentForm = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      studentId: "",
      courseId: "",
      startDate: "",
      paymentPlan: "full",
      installments: 3,
      notes: ""
    }
  });

  const studentForm = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: {
        street: "",
        city: "",
        postCode: "",
        country: "United Kingdom"
      },
      emergencyContact: {
        name: "",
        relationship: "",
        phone: ""
      }
    }
  });

  // Mock data - replace with actual API calls
  const { data: enrollments = [] } = useQuery<Enrollment[]>({
    queryKey: ["/api/lms/enrollments"],
    initialData: [
      {
        id: "enr1",
        studentId: "std1",
        courseId: "course1",
        courseName: "Advanced Facial Aesthetics",
        courseLevel: "Level 4 Diploma",
        enrollmentDate: "2024-02-01T00:00:00Z",
        startDate: "2024-03-15T00:00:00Z",
        expectedCompletionDate: "2024-06-15T00:00:00Z",
        status: "approved",
        progress: 45,
        paymentStatus: "partial",
        totalFees: 2950,
        paidAmount: 1475,
        installmentPlan: {
          totalInstallments: 2,
          paidInstallments: 1,
          nextPaymentDate: "2024-04-15T00:00:00Z",
          installmentAmount: 1475
        },
        documents: [
          {
            id: "doc1",
            type: "application",
            name: "Application Form.pdf",
            url: "/documents/applications/app1.pdf",
            uploadedAt: "2024-02-01T10:00:00Z",
            verified: true
          },
          {
            id: "doc2",
            type: "qualification",
            name: "Level 3 Beauty Therapy Certificate.pdf",
            url: "/documents/qualifications/qual1.pdf", 
            uploadedAt: "2024-02-01T10:05:00Z",
            verified: true
          }
        ],
        notes: "Student has excellent practical skills from previous experience"
      },
      {
        id: "enr2",
        studentId: "std2", 
        courseId: "course2",
        courseName: "Chemical Peel Certification",
        courseLevel: "Level 3 Certificate",
        enrollmentDate: "2024-02-10T00:00:00Z",
        startDate: "2024-04-01T00:00:00Z",
        expectedCompletionDate: "2024-06-01T00:00:00Z",
        status: "pending",
        progress: 0,
        paymentStatus: "paid",
        totalFees: 1850,
        paidAmount: 1850,
        documents: [
          {
            id: "doc3",
            type: "application",
            name: "Application Form.pdf",
            url: "/documents/applications/app2.pdf",
            uploadedAt: "2024-02-10T14:00:00Z",
            verified: false
          }
        ],
        notes: "Awaiting verification of Level 2 qualification"
      }
    ]
  });

  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ["/api/lms/students"],
    initialData: [
      {
        id: "std1",
        firstName: "Emma",
        lastName: "Thompson",
        email: "emma.thompson@example.com",
        phone: "+44 7700 900123",
        dateOfBirth: "1990-05-15T00:00:00Z",
        address: {
          street: "123 High Street",
          city: "London",
          postCode: "SW1A 1AA",
          country: "United Kingdom"
        },
        emergencyContact: {
          name: "John Thompson",
          relationship: "Spouse",
          phone: "+44 7700 900124"
        },
        qualifications: ["Level 3 Beauty Therapy", "First Aid Certificate"],
        enrollments: [],
        status: "active",
        totalProgress: 45,
        createdAt: "2024-01-15T00:00:00Z",
        updatedAt: "2024-02-20T00:00:00Z"
      },
      {
        id: "std2",
        firstName: "James",
        lastName: "Wilson",
        email: "james.wilson@example.com",
        phone: "+44 7700 900125",
        dateOfBirth: "1985-08-22T00:00:00Z",
        address: {
          street: "456 Park Lane",
          city: "Manchester",
          postCode: "M1 1AA",
          country: "United Kingdom"
        },
        emergencyContact: {
          name: "Sarah Wilson",
          relationship: "Sister", 
          phone: "+44 7700 900126"
        },
        qualifications: ["Level 2 Beauty Therapy"],
        enrollments: [],
        status: "active",
        totalProgress: 0,
        createdAt: "2024-02-01T00:00:00Z",
        updatedAt: "2024-02-10T00:00:00Z"
      }
    ]
  });

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/lms/courses-basic"],
    initialData: [
      {
        id: "course1",
        name: "Advanced Facial Aesthetics",
        level: "Level 4 Diploma",
        price: 2950,
        duration: 12,
        nextIntake: "2024-03-15T00:00:00Z",
        maxStudents: 20,
        currentEnrollments: 15
      },
      {
        id: "course2",
        name: "Chemical Peel Certification",
        level: "Level 3 Certificate", 
        price: 1850,
        duration: 8,
        nextIntake: "2024-04-01T00:00:00Z",
        maxStudents: 15,
        currentEnrollments: 12
      }
    ]
  });

  const createEnrollmentMutation = useMutation({
    mutationFn: async (data: EnrollmentFormData) => {
      // API call would go here
      return { ...data, id: Date.now().toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lms/enrollments"] });
      setIsEnrollDialogOpen(false);
      enrollmentForm.reset();
    }
  });

  const createStudentMutation = useMutation({
    mutationFn: async (data: StudentFormData) => {
      // API call would go here
      return { ...data, id: Date.now().toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lms/students"] });
      setIsStudentDialogOpen(false);
      studentForm.reset();
    }
  });

  const updateEnrollmentStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // API call would go here
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lms/enrollments"] });
    }
  });

  const filteredEnrollments = enrollments.filter(enrollment => {
    const student = students.find(s => s.id === enrollment.studentId);
    const studentName = student ? `${student.firstName} ${student.lastName}` : "";
    
    const matchesSearch = enrollment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || enrollment.status === statusFilter;
    const matchesCourse = courseFilter === "all" || enrollment.courseId === courseFilter;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>;
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'completed':
        return <Badge className="bg-purple-100 text-purple-800">Completed</Badge>;
      case 'withdrawn':
        return <Badge className="bg-red-100 text-red-800">Withdrawn</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600">Pending</Badge>;
      case 'partial':
        return <Badge className="bg-orange-100 text-orange-800">Partial</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCreateEnrollment = (data: EnrollmentFormData) => {
    createEnrollmentMutation.mutate(data);
  };

  const handleCreateStudent = (data: StudentFormData) => {
    createStudentMutation.mutate(data);
  };

  const handleStatusChange = (enrollmentId: string, newStatus: string) => {
    updateEnrollmentStatusMutation.mutate({ id: enrollmentId, status: newStatus });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-lea-deep-charcoal font-serif">Student Enrollment</h1>
          <p className="text-lea-charcoal-grey">Manage student applications, enrollments, and payments</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isStudentDialogOpen} onOpenChange={setIsStudentDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-lea-silver-grey gap-2">
                <UserPlus className="w-4 h-4" />
                Add Student
              </Button>
            </DialogTrigger>
          </Dialog>
          
          <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lea-clinical-blue hover:bg-blue-700 gap-2">
                <Plus className="w-4 h-4" />
                New Enrollment
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lea-charcoal-grey font-medium">Total Students</p>
                <p className="text-3xl font-bold text-lea-deep-charcoal">{students.length}</p>
              </div>
              <Users className="w-8 h-8 text-lea-clinical-blue" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lea-charcoal-grey font-medium">Active Enrollments</p>
                <p className="text-3xl font-bold text-lea-deep-charcoal">
                  {enrollments.filter(e => e.status === 'active' || e.status === 'approved').length}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lea-charcoal-grey font-medium">Pending Applications</p>
                <p className="text-3xl font-bold text-lea-deep-charcoal">
                  {enrollments.filter(e => e.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lea-charcoal-grey font-medium">Revenue This Month</p>
                <p className="text-3xl font-bold text-lea-deep-charcoal">
                  £{enrollments.reduce((sum, e) => sum + e.paidAmount, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enrollments" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lea-charcoal-grey w-4 h-4" />
              <Input
                placeholder="Search enrollments..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Enrollments Table */}
          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-lea-silver-grey bg-lea-pearl-white">
                      <th className="text-left p-4 font-medium text-lea-deep-charcoal">Student</th>
                      <th className="text-left p-4 font-medium text-lea-deep-charcoal">Course</th>
                      <th className="text-left p-4 font-medium text-lea-deep-charcoal">Start Date</th>
                      <th className="text-left p-4 font-medium text-lea-deep-charcoal">Status</th>
                      <th className="text-left p-4 font-medium text-lea-deep-charcoal">Payment</th>
                      <th className="text-left p-4 font-medium text-lea-deep-charcoal">Progress</th>
                      <th className="text-left p-4 font-medium text-lea-deep-charcoal">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnrollments.map((enrollment) => {
                      const student = students.find(s => s.id === enrollment.studentId);
                      return (
                        <tr key={enrollment.id} className="border-b border-lea-silver-grey hover:bg-lea-pearl-white/50">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-lea-deep-charcoal">
                                {student ? `${student.firstName} ${student.lastName}` : 'Unknown'}
                              </p>
                              <p className="text-sm text-lea-charcoal-grey">{student?.email}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-lea-deep-charcoal">{enrollment.courseName}</p>
                              <p className="text-sm text-lea-charcoal-grey">{enrollment.courseLevel}</p>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-lea-charcoal-grey">
                            {format(new Date(enrollment.startDate), 'MMM dd, yyyy')}
                          </td>
                          <td className="p-4">
                            {getStatusBadge(enrollment.status)}
                          </td>
                          <td className="p-4">
                            <div>
                              {getPaymentStatusBadge(enrollment.paymentStatus)}
                              <p className="text-sm text-lea-charcoal-grey mt-1">
                                £{enrollment.paidAmount} / £{enrollment.totalFees}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-lea-silver-grey rounded-full h-2">
                                <div 
                                  className="bg-lea-clinical-blue h-2 rounded-full" 
                                  style={{ width: `${enrollment.progress}%` }}
                                />
                              </div>
                              <span className="text-sm text-lea-charcoal-grey">{enrollment.progress}%</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students" className="space-y-6">
          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardContent className="p-6">
              <div className="text-center text-lea-charcoal-grey">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Student management interface would be implemented here</p>
                <p className="text-sm mt-2">Including detailed student profiles, qualification tracking, and performance analytics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="applications" className="space-y-6">
          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardContent className="p-6">
              <div className="text-center text-lea-charcoal-grey">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Application processing interface would be implemented here</p>
                <p className="text-sm mt-2">Including document verification, qualification checks, and approval workflow</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-6">
          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardContent className="p-6">
              <div className="text-center text-lea-charcoal-grey">
                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Payment management interface would be implemented here</p>
                <p className="text-sm mt-2">Including payment tracking, installment management, and financial reporting</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Enrollment Dialog */}
      <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lea-deep-charcoal font-serif">Create New Enrollment</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={enrollmentForm.handleSubmit(handleCreateEnrollment)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student">Student</Label>
                <Select onValueChange={(value) => enrollmentForm.setValue("studentId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="course">Course</Label>
                <Select onValueChange={(value) => enrollmentForm.setValue("courseId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...enrollmentForm.register("startDate")}
              />
            </div>
            
            <div>
              <Label>Payment Plan</Label>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="full" 
                    value="full"
                    {...enrollmentForm.register("paymentPlan")}
                  />
                  <Label htmlFor="full">Full Payment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="installments" 
                    value="installments"
                    {...enrollmentForm.register("paymentPlan")}
                  />
                  <Label htmlFor="installments">Installments</Label>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                {...enrollmentForm.register("notes")}
                placeholder="Additional notes about this enrollment"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEnrollDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-lea-clinical-blue hover:bg-blue-700"
                disabled={createEnrollmentMutation.isPending}
              >
                Create Enrollment
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Student Dialog */}
      <Dialog open={isStudentDialogOpen} onOpenChange={setIsStudentDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lea-deep-charcoal font-serif">Add New Student</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={studentForm.handleSubmit(handleCreateStudent)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...studentForm.register("firstName")}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...studentForm.register("lastName")}
                  placeholder="Enter last name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...studentForm.register("email")}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...studentForm.register("phone")}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...studentForm.register("dateOfBirth")}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-lea-deep-charcoal">Address</h3>
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  {...studentForm.register("address.street")}
                  placeholder="Enter street address"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...studentForm.register("address.city")}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <Label htmlFor="postCode">Post Code</Label>
                  <Input
                    id="postCode"
                    {...studentForm.register("address.postCode")}
                    placeholder="Enter post code"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    {...studentForm.register("address.country")}
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-lea-deep-charcoal">Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyName">Name</Label>
                  <Input
                    id="emergencyName"
                    {...studentForm.register("emergencyContact.name")}
                    placeholder="Emergency contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    {...studentForm.register("emergencyContact.relationship")}
                    placeholder="Relationship to student"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="emergencyPhone">Phone</Label>
                <Input
                  id="emergencyPhone"
                  {...studentForm.register("emergencyContact.phone")}
                  placeholder="Emergency contact phone"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsStudentDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-lea-clinical-blue hover:bg-blue-700"
                disabled={createStudentMutation.isPending}
              >
                Add Student
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
