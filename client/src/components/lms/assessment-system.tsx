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
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  ClipboardList, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Download,
  Upload,
  GraduationCap,
  Target,
  TrendingUp,
  Award,
  Users,
  Calendar,
  BookOpen,
  PieChart
} from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Assessment {
  id: string;
  title: string;
  description: string;
  type: "quiz" | "practical" | "assignment" | "exam";
  courseId: string;
  courseName: string;
  moduleId?: string;
  duration: number; // minutes
  totalPoints: number;
  passingScore: number;
  maxAttempts: number;
  timeLimit?: number;
  instructions: string;
  questions: Question[];
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  autoGrade: boolean;
  showResults: boolean;
}

interface Question {
  id: string;
  type: "multiple_choice" | "true_false" | "short_answer" | "essay" | "practical";
  question: string;
  points: number;
  options?: string[]; // for multiple choice
  correctAnswer?: string | number; // index for MC, text for others
  explanation?: string;
  mediaUrl?: string;
  required: boolean;
  order: number;
}

interface Submission {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseName: string;
  submittedAt: string;
  startedAt: string;
  completedAt?: string;
  status: "in_progress" | "submitted" | "graded" | "overdue";
  score?: number;
  maxScore: number;
  percentage?: number;
  passed: boolean;
  attempts: number;
  maxAttempts: number;
  timeSpent?: number; // minutes
  answers: SubmissionAnswer[];
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
}

interface SubmissionAnswer {
  questionId: string;
  answer: string | number | string[];
  points?: number;
  maxPoints: number;
  feedback?: string;
  isCorrect?: boolean;
}

interface AssessmentStats {
  totalAssessments: number;
  activeAssessments: number;
  pendingGrading: number;
  averageScore: number;
  completionRate: number;
  totalSubmissions: number;
  recentActivity: number;
}

const assessmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["quiz", "practical", "assignment", "exam"]),
  courseId: z.string().min(1, "Course is required"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  passingScore: z.number().min(0).max(100, "Passing score must be between 0-100"),
  maxAttempts: z.number().min(1, "Must allow at least 1 attempt"),
  timeLimit: z.number().optional(),
  instructions: z.string().optional(),
  dueDate: z.string().optional(),
  autoGrade: z.boolean(),
  showResults: z.boolean()
});

const questionSchema = z.object({
  type: z.enum(["multiple_choice", "true_false", "short_answer", "essay", "practical"]),
  question: z.string().min(1, "Question is required"),
  points: z.number().min(1, "Points must be at least 1"),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.number()]).optional(),
  explanation: z.string().optional(),
  mediaUrl: z.string().optional(),
  required: z.boolean()
});

type AssessmentFormData = z.infer<typeof assessmentSchema>;
type QuestionFormData = z.infer<typeof questionSchema>;

export default function AssessmentSystem() {
  const [activeTab, setActiveTab] = useState("assessments");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  const queryClient = useQueryClient();

  const assessmentForm = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "quiz",
      courseId: "",
      duration: 60,
      passingScore: 70,
      maxAttempts: 3,
      timeLimit: undefined,
      instructions: "",
      dueDate: "",
      autoGrade: true,
      showResults: true
    }
  });

  const questionForm = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      type: "multiple_choice",
      question: "",
      points: 1,
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
      mediaUrl: "",
      required: true
    }
  });

  // Mock data - replace with actual API calls
  const { data: stats } = useQuery<AssessmentStats>({
    queryKey: ["/api/lms/assessment-stats"],
    initialData: {
      totalAssessments: 24,
      activeAssessments: 18,
      pendingGrading: 12,
      averageScore: 78.5,
      completionRate: 85,
      totalSubmissions: 156,
      recentActivity: 8
    }
  });

  const { data: assessments = [] } = useQuery<Assessment[]>({
    queryKey: ["/api/lms/assessments"],
    initialData: [
      {
        id: "assess1",
        title: "Facial Anatomy Quiz",
        description: "Assessment covering facial bone structure, muscle groups, and nerve pathways",
        type: "quiz",
        courseId: "course1",
        courseName: "Advanced Facial Aesthetics",
        moduleId: "mod1",
        duration: 45,
        totalPoints: 50,
        passingScore: 70,
        maxAttempts: 3,
        timeLimit: 45,
        instructions: "Answer all questions within the time limit. You have 3 attempts to pass.",
        questions: [
          {
            id: "q1",
            type: "multiple_choice",
            question: "Which muscle is primarily responsible for raising the eyebrows?",
            points: 2,
            options: ["Frontalis", "Procerus", "Corrugator", "Orbicularis oculi"],
            correctAnswer: 0,
            explanation: "The frontalis muscle is responsible for raising the eyebrows and creating horizontal forehead wrinkles.",
            required: true,
            order: 1
          },
          {
            id: "q2",
            type: "true_false",
            question: "The facial artery crosses over the mandible at the anterior border of the masseter muscle.",
            points: 2,
            correctAnswer: "true",
            explanation: "This is a key landmark for identifying the facial artery during injections.",
            required: true,
            order: 2
          }
        ],
        status: "published",
        createdAt: "2024-02-01T00:00:00Z",
        updatedAt: "2024-02-15T00:00:00Z",
        dueDate: "2024-03-30T23:59:59Z",
        autoGrade: true,
        showResults: true
      },
      {
        id: "assess2",
        title: "Chemical Peel Practical Assessment",
        description: "Hands-on evaluation of chemical peel application technique and safety protocols",
        type: "practical",
        courseId: "course2",
        courseName: "Chemical Peel Certification",
        duration: 120,
        totalPoints: 100,
        passingScore: 80,
        maxAttempts: 2,
        instructions: "Demonstrate proper preparation, application, and aftercare procedures for superficial chemical peels.",
        questions: [
          {
            id: "q3",
            type: "practical",
            question: "Demonstrate proper skin preparation before chemical peel application",
            points: 20,
            required: true,
            order: 1
          },
          {
            id: "q4",
            type: "practical", 
            question: "Apply chemical peel solution with proper technique and timing",
            points: 30,
            required: true,
            order: 2
          }
        ],
        status: "published",
        createdAt: "2024-02-10T00:00:00Z",
        updatedAt: "2024-02-20T00:00:00Z",
        dueDate: "2024-05-15T17:00:00Z",
        autoGrade: false,
        showResults: false
      }
    ]
  });

  const { data: submissions = [] } = useQuery<Submission[]>({
    queryKey: ["/api/lms/submissions"],
    initialData: [
      {
        id: "sub1",
        assessmentId: "assess1",
        assessmentTitle: "Facial Anatomy Quiz",
        studentId: "std1",
        studentName: "Emma Thompson",
        studentEmail: "emma.thompson@example.com",
        courseId: "course1",
        courseName: "Advanced Facial Aesthetics",
        submittedAt: "2024-02-20T14:30:00Z",
        startedAt: "2024-02-20T14:00:00Z",
        completedAt: "2024-02-20T14:30:00Z",
        status: "graded",
        score: 42,
        maxScore: 50,
        percentage: 84,
        passed: true,
        attempts: 1,
        maxAttempts: 3,
        timeSpent: 30,
        answers: [
          {
            questionId: "q1",
            answer: 0,
            points: 2,
            maxPoints: 2,
            isCorrect: true
          },
          {
            questionId: "q2",
            answer: "true",
            points: 2,
            maxPoints: 2,
            isCorrect: true
          }
        ],
        gradedAt: "2024-02-20T15:00:00Z",
        gradedBy: "Dr. Sarah Johnson"
      },
      {
        id: "sub2",
        assessmentId: "assess2",
        assessmentTitle: "Chemical Peel Practical Assessment",
        studentId: "std2",
        studentName: "James Wilson",
        studentEmail: "james.wilson@example.com",
        courseId: "course2",
        courseName: "Chemical Peel Certification",
        submittedAt: "2024-02-21T16:45:00Z",
        startedAt: "2024-02-21T14:45:00Z",
        status: "submitted",
        score: undefined,
        maxScore: 100,
        passed: false,
        attempts: 1,
        maxAttempts: 2,
        timeSpent: 120,
        answers: [
          {
            questionId: "q3",
            answer: "Completed skin preparation checklist",
            maxPoints: 20
          },
          {
            questionId: "q4",
            answer: "Applied 30% glycolic acid peel with proper neutralization",
            maxPoints: 30
          }
        ]
      }
    ]
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["/api/lms/courses-basic"],
    initialData: [
      { id: "course1", name: "Advanced Facial Aesthetics" },
      { id: "course2", name: "Chemical Peel Certification" }
    ]
  });

  const createAssessmentMutation = useMutation({
    mutationFn: async (data: AssessmentFormData) => {
      // API call would go here
      return { ...data, id: Date.now().toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lms/assessments"] });
      setIsAssessmentDialogOpen(false);
      assessmentForm.reset();
    }
  });

  const gradeSubmissionMutation = useMutation({
    mutationFn: async ({ id, score, feedback }: { id: string; score: number; feedback?: string }) => {
      // API call would go here
      return { id, score, feedback };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lms/submissions"] });
    }
  });

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter;
    const matchesType = typeFilter === "all" || assessment.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.assessmentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case 'archived':
        return <Badge className="bg-red-100 text-red-800">Archived</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'submitted':
        return <Badge className="bg-yellow-100 text-yellow-800">Submitted</Badge>;
      case 'graded':
        return <Badge className="bg-purple-100 text-purple-800">Graded</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const types = {
      quiz: { bg: "bg-blue-100", text: "text-blue-800", label: "Quiz" },
      practical: { bg: "bg-green-100", text: "text-green-800", label: "Practical" },
      assignment: { bg: "bg-purple-100", text: "text-purple-800", label: "Assignment" },
      exam: { bg: "bg-red-100", text: "text-red-800", label: "Exam" }
    };
    
    const style = types[type as keyof typeof types] || { bg: "bg-gray-100", text: "text-gray-800", label: type };
    return <Badge className={`${style.bg} ${style.text}`}>{style.label}</Badge>;
  };

  const handleCreateAssessment = (data: AssessmentFormData) => {
    createAssessmentMutation.mutate(data);
  };

  const handleGradeSubmission = (submissionId: string, score: number, feedback?: string) => {
    gradeSubmissionMutation.mutate({ id: submissionId, score, feedback });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-lea-deep-charcoal font-serif">Assessment System</h1>
          <p className="text-lea-charcoal-grey">Manage assessments, quizzes, and student evaluations</p>
        </div>
        
        <Dialog open={isAssessmentDialogOpen} onOpenChange={setIsAssessmentDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-lea-clinical-blue hover:bg-blue-700 gap-2">
              <Plus className="w-4 h-4" />
              New Assessment
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-lea-platinum-white border-lea-silver-grey shadow-lea-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lea-charcoal-grey font-medium">Total Assessments</p>
                <p className="text-3xl font-bold text-lea-deep-charcoal">{stats.totalAssessments}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-lea-clinical-blue" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-lea-platinum-white border-lea-silver-grey shadow-lea-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lea-charcoal-grey font-medium">Pending Grading</p>
                <p className="text-3xl font-bold text-lea-deep-charcoal">{stats.pendingGrading}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-lea-platinum-white border-lea-silver-grey shadow-lea-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lea-charcoal-grey font-medium">Average Score</p>
                <p className="text-3xl font-bold text-lea-deep-charcoal">{stats.averageScore}%</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-lea-platinum-white border-lea-silver-grey shadow-lea-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lea-charcoal-grey font-medium">Completion Rate</p>
                <p className="text-3xl font-bold text-lea-deep-charcoal">{stats.completionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="question-bank">Question Bank</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assessments" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lea-charcoal-grey w-4 h-4" />
              <Input
                placeholder="Search assessments..."
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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="practical">Practical</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assessments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAssessments.map((assessment) => (
              <Card key={assessment.id} className="bg-lea-platinum-white border-lea-silver-grey shadow-lea-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lea-deep-charcoal font-serif text-lg">{assessment.title}</CardTitle>
                      <p className="text-sm text-lea-charcoal-grey mt-1">{assessment.courseName}</p>
                    </div>
                    <div className="flex gap-2">
                      {getTypeBadge(assessment.type)}
                      {getStatusBadge(assessment.status)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-lea-charcoal-grey line-clamp-2">{assessment.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-lea-charcoal-grey" />
                      <span>{assessment.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-lea-charcoal-grey" />
                      <span>{assessment.passingScore}% to pass</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-lea-charcoal-grey" />
                      <span>{assessment.questions.length} questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-lea-charcoal-grey" />
                      <span>{assessment.totalPoints} points</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-lea-silver-grey">
                    <span className="text-xs text-lea-charcoal-grey">
                      {assessment.dueDate ? `Due: ${format(new Date(assessment.dueDate), 'MMM dd')}` : 'No due date'}
                    </span>
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="submissions" className="space-y-6">
          {/* Submissions Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lea-charcoal-grey w-4 h-4" />
              <Input
                placeholder="Search submissions..."
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
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submissions Table */}
          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-lea-silver-grey bg-lea-pearl-white">
                      <th className="text-left p-4 font-medium text-lea-deep-charcoal">Student</th>
                      <th className="text-left p-4 font-medium text-lea-deep-charcoal">Assessment</th>
                      <th className="text-left p-4 font-medium text-lea-deep-charcoal">Submitted</th>
                      <th className="text-left p-4 font-medium text-lea-deep-charcoal">Status</th>
                      <th className="text-left p-4 font-medium text-lea-deep-charcoal">Score</th>
                      <th className="text-left p-4 font-medium text-lea-deep-charcoal">Attempts</th>
                      <th className="text-left p-4 font-medium text-lea-deep-charcoal">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.map((submission) => (
                      <tr key={submission.id} className="border-b border-lea-silver-grey hover:bg-lea-pearl-white/50">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-lea-deep-charcoal">{submission.studentName}</p>
                            <p className="text-sm text-lea-charcoal-grey">{submission.studentEmail}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-lea-deep-charcoal">{submission.assessmentTitle}</p>
                            <p className="text-sm text-lea-charcoal-grey">{submission.courseName}</p>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-lea-charcoal-grey">
                          {format(new Date(submission.submittedAt), 'MMM dd, HH:mm')}
                        </td>
                        <td className="p-4">
                          {getStatusBadge(submission.status)}
                        </td>
                        <td className="p-4">
                          {submission.score !== undefined ? (
                            <div>
                              <p className="font-medium text-lea-deep-charcoal">
                                {submission.score}/{submission.maxScore}
                              </p>
                              <p className={`text-sm ${submission.passed ? 'text-green-600' : 'text-red-600'}`}>
                                {submission.percentage}% {submission.passed ? '✓' : '✗'}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-lea-charcoal-grey">Pending</span>
                          )}
                        </td>
                        <td className="p-4 text-sm text-lea-charcoal-grey">
                          {submission.attempts}/{submission.maxAttempts}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {submission.status === 'submitted' && (
                              <Button variant="ghost" size="sm" className="text-lea-clinical-blue">
                                Grade
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal font-serif flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-lea-charcoal-grey">
                  <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Assessment performance charts would be displayed here</p>
                  <p className="text-sm mt-2">Including pass rates, score distributions, and trend analysis</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal font-serif flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Student Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-lea-charcoal-grey">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Individual student progress tracking</p>
                  <p className="text-sm mt-2">With detailed performance metrics and improvement recommendations</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="question-bank" className="space-y-6">
          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Question Bank Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-lea-charcoal-grey">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Question bank interface would be implemented here</p>
                <p className="text-sm mt-2">Including question creation, categorization, and reuse across assessments</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Assessment Dialog */}
      <Dialog open={isAssessmentDialogOpen} onOpenChange={setIsAssessmentDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lea-deep-charcoal font-serif">Create New Assessment</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={assessmentForm.handleSubmit(handleCreateAssessment)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Assessment Title</Label>
                <Input
                  id="title"
                  {...assessmentForm.register("title")}
                  placeholder="Enter assessment title"
                />
              </div>
              
              <div>
                <Label htmlFor="type">Assessment Type</Label>
                <Select onValueChange={(value: any) => assessmentForm.setValue("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="practical">Practical</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...assessmentForm.register("description")}
                placeholder="Assessment description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="course">Course</Label>
                <Select onValueChange={(value) => assessmentForm.setValue("courseId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course: any) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  {...assessmentForm.register("duration", { valueAsNumber: true })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="passingScore">Passing Score (%)</Label>
                <Input
                  id="passingScore"
                  type="number"
                  {...assessmentForm.register("passingScore", { valueAsNumber: true })}
                />
              </div>
              
              <div>
                <Label htmlFor="maxAttempts">Max Attempts</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  {...assessmentForm.register("maxAttempts", { valueAsNumber: true })}
                />
              </div>
              
              <div>
                <Label htmlFor="timeLimit">Time Limit (optional)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  {...assessmentForm.register("timeLimit", { valueAsNumber: true })}
                  placeholder="Minutes"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                {...assessmentForm.register("instructions")}
                placeholder="Assessment instructions for students"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoGrade"
                  onCheckedChange={(checked) => assessmentForm.setValue("autoGrade", checked)}
                />
                <Label htmlFor="autoGrade">Auto-grade when possible</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="showResults"
                  onCheckedChange={(checked) => assessmentForm.setValue("showResults", checked)}
                />
                <Label htmlFor="showResults">Show results to students</Label>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsAssessmentDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-lea-clinical-blue hover:bg-blue-700"
                disabled={createAssessmentMutation.isPending}
              >
                Create Assessment
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
