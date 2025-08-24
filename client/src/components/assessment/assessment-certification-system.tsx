import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { 
  GraduationCap, 
  FileCheck, 
  Award, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  BarChart3, 
  Download, 
  Upload,
  Plus,
  Eye,
  Edit,
  Star,
  Calendar as CalendarIcon,
  Target,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';

interface Assessment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  type: 'quiz' | 'practical' | 'portfolio' | 'osce' | 'written';
  description: string;
  maxScore: number;
  passingScore: number;
  timeLimit: number; // minutes
  attempts: number;
  status: 'draft' | 'published' | 'archived';
  questions: Question[];
  rubric?: AssessmentRubric;
  autoGrade: boolean;
  dueDate?: Date;
  availableFrom: Date;
  availableUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'essay' | 'practical-demo' | 'case-study';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  explanation?: string;
  mediaUrls?: string[];
  rubric?: QuestionRubric;
}

interface AssessmentRubric {
  id: string;
  criteria: RubricCriterion[];
  levels: RubricLevel[];
}

interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
}

interface RubricLevel {
  id: string;
  name: string;
  description: string;
  points: number;
}

interface QuestionRubric {
  criterionId: string;
  levels: { levelId: string; description: string }[];
}

interface StudentSubmission {
  id: string;
  assessmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: Date;
  status: 'submitted' | 'graded' | 'pending-review';
  score?: number;
  maxScore: number;
  passed: boolean;
  attempt: number;
  timeSpent: number; // minutes
  answers: SubmissionAnswer[];
  feedback?: string;
  gradedBy?: string;
  gradedAt?: Date;
}

interface SubmissionAnswer {
  questionId: string;
  answer: string | string[];
  points?: number;
  feedback?: string;
  isCorrect?: boolean;
}

interface Certification {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  certificationType: 'completion' | 'competency' | 'cpd' | 'professional';
  certificateNumber: string;
  issuedDate: Date;
  expiryDate?: Date;
  awardingBody: string;
  level: string;
  credits: number;
  status: 'active' | 'expired' | 'revoked';
  digitalSignature: string;
  verificationUrl: string;
  requirements: CertificationRequirement[];
}

interface CertificationRequirement {
  id: string;
  description: string;
  completed: boolean;
  completedDate?: Date;
  evidence?: string[];
}

const assessmentTypes = [
  { value: 'quiz', label: 'Online Quiz', icon: BookOpen },
  { value: 'practical', label: 'Practical Assessment', icon: Target },
  { value: 'portfolio', label: 'Portfolio Review', icon: FileCheck },
  { value: 'osce', label: 'OSCE Examination', icon: Users },
  { value: 'written', label: 'Written Exam', icon: Edit }
];

const competencyData = [
  { name: 'Technical Skills', current: 85, target: 90 },
  { name: 'Safety Protocols', current: 92, target: 95 },
  { name: 'Client Communication', current: 88, target: 90 },
  { name: 'Professional Ethics', current: 95, target: 95 },
  { name: 'Practical Application', current: 82, target: 85 }
];

const passRateData = [
  { month: 'Jan', rate: 78 },
  { month: 'Feb', rate: 82 },
  { month: 'Mar', rate: 85 },
  { month: 'Apr', rate: 88 },
  { month: 'May', rate: 90 },
  { month: 'Jun', rate: 87 }
];

export const AssessmentCertificationSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('assessments');
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAssessment, setNewAssessment] = useState<Partial<Assessment>>({
    type: 'quiz',
    maxScore: 100,
    passingScore: 70,
    timeLimit: 60,
    attempts: 3,
    autoGrade: true,
    status: 'draft'
  });

  // Mock data - would come from API
  useEffect(() => {
    setAssessments([
      {
        id: '1',
        courseId: 'course1',
        courseName: 'Level 4 Botox Training',
        title: 'Anatomy & Safety Assessment',
        type: 'quiz',
        description: 'Comprehensive assessment covering facial anatomy and injection safety protocols',
        maxScore: 100,
        passingScore: 80,
        timeLimit: 45,
        attempts: 3,
        status: 'published',
        questions: [],
        autoGrade: true,
        availableFrom: new Date('2024-08-01'),
        availableUntil: new Date('2024-09-30'),
        createdAt: new Date('2024-07-15'),
        updatedAt: new Date('2024-08-01')
      },
      {
        id: '2',
        courseId: 'course1',
        courseName: 'Level 4 Botox Training',
        title: 'Practical Injection Technique',
        type: 'practical',
        description: 'Hands-on assessment of injection techniques and client consultation skills',
        maxScore: 100,
        passingScore: 85,
        timeLimit: 120,
        attempts: 2,
        status: 'published',
        questions: [],
        autoGrade: false,
        dueDate: new Date('2024-09-15'),
        availableFrom: new Date('2024-08-15'),
        createdAt: new Date('2024-07-20'),
        updatedAt: new Date('2024-08-15')
      }
    ]);

    setSubmissions([
      {
        id: '1',
        assessmentId: '1',
        studentId: 'student1',
        studentName: 'Sarah Johnson',
        submittedAt: new Date('2024-08-20T14:30:00'),
        status: 'graded',
        score: 85,
        maxScore: 100,
        passed: true,
        attempt: 1,
        timeSpent: 35,
        answers: [],
        feedback: 'Excellent understanding of anatomy. Minor improvements needed in safety protocols.',
        gradedBy: 'Dr. Smith',
        gradedAt: new Date('2024-08-20T16:00:00')
      },
      {
        id: '2',
        assessmentId: '2',
        studentId: 'student2',
        studentName: 'Michael Chen',
        submittedAt: new Date('2024-08-21T10:15:00'),
        status: 'pending-review',
        maxScore: 100,
        passed: false,
        attempt: 1,
        timeSpent: 95,
        answers: []
      }
    ]);

    setCertifications([
      {
        id: '1',
        studentId: 'student1',
        studentName: 'Sarah Johnson',
        courseId: 'course1',
        courseName: 'Level 4 Botox Training',
        certificationType: 'competency',
        certificateNumber: 'LEA-BOT-2024-001',
        issuedDate: new Date('2024-08-22'),
        awardingBody: 'Lea Aesthetics Academy',
        level: 'Level 4',
        credits: 12,
        status: 'active',
        digitalSignature: 'signature-hash-12345',
        verificationUrl: 'https://verify.leaaesthetics.com/LEA-BOT-2024-001',
        requirements: [
          { id: '1', description: 'Complete theoretical assessment', completed: true, completedDate: new Date('2024-08-20') },
          { id: '2', description: 'Pass practical examination', completed: true, completedDate: new Date('2024-08-21') },
          { id: '3', description: 'Submit portfolio of practice', completed: true, completedDate: new Date('2024-08-22') }
        ]
      }
    ]);
  }, []);

  const createAssessment = () => {
    console.log('Creating assessment:', newAssessment);
    setShowCreateForm(false);
    // Implementation for creating assessment
  };

  const generateCertificate = (studentId: string, courseId: string) => {
    console.log(`Generating certificate for student ${studentId} in course ${courseId}`);
    // Implementation for certificate generation
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
      case 'active':
      case 'graded':
        return 'text-green-600 bg-green-100';
      case 'failed':
      case 'expired':
        return 'text-red-600 bg-red-100';
      case 'pending-review':
      case 'submitted':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Assessment & Certification System</h2>
        <div className="flex space-x-2">
          <Badge variant="secondary" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Ofqual Compliant
          </Badge>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="grading">Grading</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="assessments">
          <div className="space-y-6">
            {/* Assessment Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Assessments</p>
                      <p className="text-3xl font-bold">{assessments.length}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Published</p>
                      <p className="text-3xl font-bold text-green-600">
                        {assessments.filter(a => a.status === 'published').length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Auto-Graded</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {assessments.filter(a => a.autoGrade).length}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Pass Rate</p>
                      <p className="text-3xl font-bold text-purple-600">87%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assessment List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Assessment Library</CardTitle>
                  <div className="flex space-x-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="quiz">Quizzes</SelectItem>
                        <SelectItem value="practical">Practical</SelectItem>
                        <SelectItem value="portfolio">Portfolio</SelectItem>
                        <SelectItem value="osce">OSCE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessments.map((assessment) => (
                    <div key={assessment.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-blue-100">
                            {assessmentTypes.find(t => t.value === assessment.type)?.icon && 
                              React.createElement(assessmentTypes.find(t => t.value === assessment.type)!.icon, { className: "h-5 w-5 text-blue-600" })
                            }
                          </div>
                          <div>
                            <h4 className="font-semibold">{assessment.title}</h4>
                            <p className="text-sm text-muted-foreground">{assessment.courseName}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(assessment.status)}>
                            {assessment.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {assessmentTypes.find(t => t.value === assessment.type)?.label}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{assessment.description}</p>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Passing Score</p>
                          <p className="text-muted-foreground">{assessment.passingScore}/{assessment.maxScore}</p>
                        </div>
                        <div>
                          <p className="font-medium">Time Limit</p>
                          <p className="text-muted-foreground">{assessment.timeLimit} min</p>
                        </div>
                        <div>
                          <p className="font-medium">Attempts</p>
                          <p className="text-muted-foreground">{assessment.attempts}</p>
                        </div>
                        <div>
                          <p className="font-medium">Auto Grade</p>
                          <p className="text-muted-foreground">{assessment.autoGrade ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <p className="font-medium">Available Until</p>
                          <p className="text-muted-foreground">
                            {assessment.availableUntil ? format(assessment.availableUntil, 'MMM dd') : 'No limit'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Results
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Create Assessment Form */}
            {showCreateForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Assessment Title</Label>
                      <Input
                        value={newAssessment.title || ''}
                        onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })}
                        placeholder="Enter assessment title"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Assessment Type</Label>
                      <Select
                        value={newAssessment.type}
                        onValueChange={(value: 'quiz' | 'practical' | 'portfolio' | 'osce' | 'written') =>
                          setNewAssessment({ ...newAssessment, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {assessmentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={newAssessment.description || ''}
                      onChange={(e) => setNewAssessment({ ...newAssessment, description: e.target.value })}
                      placeholder="Describe the assessment objectives and requirements"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Maximum Score</Label>
                      <Input
                        type="number"
                        value={newAssessment.maxScore || ''}
                        onChange={(e) => setNewAssessment({ ...newAssessment, maxScore: parseInt(e.target.value) })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Passing Score</Label>
                      <Input
                        type="number"
                        value={newAssessment.passingScore || ''}
                        onChange={(e) => setNewAssessment({ ...newAssessment, passingScore: parseInt(e.target.value) })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Time Limit (minutes)</Label>
                      <Input
                        type="number"
                        value={newAssessment.timeLimit || ''}
                        onChange={(e) => setNewAssessment({ ...newAssessment, timeLimit: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-grade"
                        checked={newAssessment.autoGrade}
                        onCheckedChange={(checked) => setNewAssessment({ ...newAssessment, autoGrade: checked })}
                      />
                      <Label htmlFor="auto-grade">Enable auto-grading</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Maximum Attempts</Label>
                      <Input
                        type="number"
                        className="w-20"
                        value={newAssessment.attempts || ''}
                        onChange={(e) => setNewAssessment({ ...newAssessment, attempts: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={createAssessment}>
                      Create Assessment
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="submissions">
          <div className="space-y-6">
            {/* Submission Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                      <p className="text-3xl font-bold">{submissions.length}</p>
                    </div>
                    <FileCheck className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {submissions.filter(s => s.status === 'pending-review').length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Passed</p>
                      <p className="text-3xl font-bold text-green-600">
                        {submissions.filter(s => s.passed).length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {Math.round(submissions.filter(s => s.score).reduce((acc, s) => acc + s.score!, 0) / submissions.filter(s => s.score).length)}%
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submissions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-blue-100">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{submission.studentName}</h4>
                            <p className="text-sm text-muted-foreground">
                              Assessment #{submission.assessmentId} • Attempt {submission.attempt}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(submission.status)}>
                            {submission.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                          {submission.score !== undefined && (
                            <Badge variant={submission.passed ? "default" : "destructive"}>
                              {submission.score}/{submission.maxScore}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Submitted</p>
                          <p className="text-muted-foreground">
                            {format(submission.submittedAt, 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Time Spent</p>
                          <p className="text-muted-foreground">{submission.timeSpent} min</p>
                        </div>
                        <div>
                          <p className="font-medium">Status</p>
                          <p className="text-muted-foreground">{submission.passed ? 'Passed' : 'Failed'}</p>
                        </div>
                        <div>
                          <p className="font-medium">Graded By</p>
                          <p className="text-muted-foreground">{submission.gradedBy || 'Auto-graded'}</p>
                        </div>
                      </div>
                      
                      {submission.feedback && (
                        <div className="bg-muted p-3 rounded">
                          <p className="text-sm font-medium mb-1">Feedback:</p>
                          <p className="text-sm">{submission.feedback}</p>
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="grading">
          <div className="space-y-6">
            {/* Grading Queue */}
            <Card>
              <CardHeader>
                <CardTitle>Grading Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.filter(s => s.status === 'pending-review').map((submission) => (
                    <div key={submission.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{submission.studentName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Submitted {format(submission.submittedAt, 'MMM dd, HH:mm')}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm">
                            Grade Now
                          </Button>
                          <Button variant="outline" size="sm">
                            View Submission
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Assessment</p>
                          <p className="text-muted-foreground">Assessment #{submission.assessmentId}</p>
                        </div>
                        <div>
                          <p className="font-medium">Time Spent</p>
                          <p className="text-muted-foreground">{submission.timeSpent} minutes</p>
                        </div>
                        <div>
                          <p className="font-medium">Attempt</p>
                          <p className="text-muted-foreground">{submission.attempt} of {submission.attempt + 2}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Competency Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Student Competency Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competencyData.map((competency, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{competency.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {competency.current}% / {competency.target}%
                        </span>
                      </div>
                      <div className="relative">
                        <Progress value={competency.current} className="h-3" />
                        <div 
                          className="absolute top-0 h-3 w-0.5 bg-red-500"
                          style={{ left: `${competency.target}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="certifications">
          <div className="space-y-6">
            {/* Certification Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Issued Certificates</p>
                      <p className="text-3xl font-bold">{certifications.length}</p>
                    </div>
                    <Award className="h-8 w-8 text-gold-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Certificates</p>
                      <p className="text-3xl font-bold text-green-600">
                        {certifications.filter(c => c.status === 'active').length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Expiring Soon</p>
                      <p className="text-3xl font-bold text-yellow-600">0</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Credits</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {certifications.reduce((acc, c) => acc + c.credits, 0)}
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Certificates List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Issued Certificates</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Certificate
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-gold-100">
                            <Award className="h-5 w-5 text-gold-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{cert.courseName}</h4>
                            <p className="text-sm text-muted-foreground">{cert.studentName}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(cert.status)}>
                            {cert.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {cert.certificationType.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Certificate No.</p>
                          <p className="text-muted-foreground font-mono">{cert.certificateNumber}</p>
                        </div>
                        <div>
                          <p className="font-medium">Issued Date</p>
                          <p className="text-muted-foreground">{format(cert.issuedDate, 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <p className="font-medium">Level</p>
                          <p className="text-muted-foreground">{cert.level}</p>
                        </div>
                        <div>
                          <p className="font-medium">Credits</p>
                          <p className="text-muted-foreground">{cert.credits}</p>
                        </div>
                        <div>
                          <p className="font-medium">Awarding Body</p>
                          <p className="text-muted-foreground">{cert.awardingBody}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="font-medium text-sm">Requirements Completed:</p>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                          {cert.requirements.map((req) => (
                            <div key={req.id} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">{req.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Send to Student
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pass Rate Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Pass Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={passRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="rate" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Competency Radar */}
              <Card>
                <CardHeader>
                  <CardTitle>Average Competency Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={competencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="current" fill="#8884d8" />
                      <Bar dataKey="target" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average Completion Time</span>
                      <span className="font-semibold">42 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>First-Attempt Pass Rate</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Student Satisfaction</span>
                      <span className="font-semibold">4.2/5.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assessment Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {assessmentTypes.map((type) => (
                      <div key={type.value} className="flex items-center justify-between">
                        <span>{type.label}</span>
                        <Badge variant="outline">
                          {assessments.filter(a => a.type === type.value).length}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Practical Assessment</p>
                        <p className="text-xs text-muted-foreground">Due Sep 15</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssessmentCertificationSystem;
