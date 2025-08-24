import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatDistanceToNow, format } from 'date-fns';

type StudentProgress = {
  id: string;
  studentId: string;
  courseId: string;
  courseName: string;
  studentName: string;
  studentEmail: string;
  enrollmentDate: string;
  completionPercentage: number;
  lastActivity: string;
  status: 'active' | 'completed' | 'paused' | 'overdue';
  modulesCompleted: number;
  totalModules: number;
  assessmentsPassed: number;
  totalAssessments: number;
  timeSpent: number; // in hours
  certificateIssued?: boolean;
  grade?: number;
};

type ModuleProgress = {
  id: string;
  title: string;
  completionPercentage: number;
  status: 'not-started' | 'in-progress' | 'completed';
  lastAccessed: string;
  timeSpent: number;
  assessmentScore?: number;
};

type StudentProgressProps = {
  courseId?: string;
  studentId?: string;
  showIndividualProgress?: boolean;
};

export default function StudentProgress({ 
  courseId, 
  studentId, 
  showIndividualProgress = false 
}: StudentProgressProps) {
  const isMobile = useIsMobile();
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  
  const { data: progressData, isLoading } = useQuery<StudentProgress[]>({
    queryKey: [`/api/student-progress`, courseId, studentId],
    initialData: [
      {
        id: '1',
        studentId: 'student1',
        courseId: 'course1',
        courseName: 'Advanced Facial Aesthetics',
        studentName: 'Emma Thompson',
        studentEmail: 'emma.thompson@email.com',
        enrollmentDate: '2024-01-15T00:00:00Z',
        completionPercentage: 75,
        lastActivity: '2024-02-20T14:30:00Z',
        status: 'active',
        modulesCompleted: 6,
        totalModules: 8,
        assessmentsPassed: 4,
        totalAssessments: 6,
        timeSpent: 24.5,
        grade: 87
      },
      {
        id: '2',
        studentId: 'student2',
        courseId: 'course1',
        courseName: 'Advanced Facial Aesthetics',
        studentName: 'James Wilson',
        studentEmail: 'james.wilson@email.com',
        enrollmentDate: '2024-01-20T00:00:00Z',
        completionPercentage: 100,
        lastActivity: '2024-02-18T16:45:00Z',
        status: 'completed',
        modulesCompleted: 8,
        totalModules: 8,
        assessmentsPassed: 6,
        totalAssessments: 6,
        timeSpent: 32.0,
        certificateIssued: true,
        grade: 94
      },
      {
        id: '3',
        studentId: 'student3',
        courseId: 'course2',
        courseName: 'Skin Analysis Fundamentals',
        studentName: 'Sarah Chen',
        studentEmail: 'sarah.chen@email.com',
        enrollmentDate: '2024-02-01T00:00:00Z',
        completionPercentage: 45,
        lastActivity: '2024-02-10T10:20:00Z',
        status: 'paused',
        modulesCompleted: 3,
        totalModules: 7,
        assessmentsPassed: 2,
        totalAssessments: 5,
        timeSpent: 15.2
      }
    ]
  });

  const { data: moduleProgress } = useQuery<ModuleProgress[]>({
    queryKey: [`/api/module-progress`, selectedStudent],
    enabled: !!selectedStudent,
    initialData: [
      {
        id: 'mod1',
        title: 'Introduction to Facial Anatomy',
        completionPercentage: 100,
        status: 'completed',
        lastAccessed: '2024-02-15T09:00:00Z',
        timeSpent: 3.5,
        assessmentScore: 92
      },
      {
        id: 'mod2',
        title: 'Product Knowledge and Selection',
        completionPercentage: 80,
        status: 'in-progress',
        lastAccessed: '2024-02-20T14:30:00Z',
        timeSpent: 2.8
      },
      {
        id: 'mod3',
        title: 'Advanced Injection Techniques',
        completionPercentage: 0,
        status: 'not-started',
        lastAccessed: '2024-02-01T00:00:00Z',
        timeSpent: 0
      }
    ]
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'fas fa-check-circle';
      case 'active': return 'fas fa-play-circle';
      case 'paused': return 'fas fa-pause-circle';
      case 'overdue': return 'fas fa-exclamation-triangle';
      default: return 'fas fa-circle';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (showIndividualProgress && studentId) {
    const student = progressData?.find(p => p.studentId === studentId);
    if (!student) return <div>Student not found</div>;

    return (
      <div className="space-y-6">
        <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.studentName}`} />
                <AvatarFallback>{student.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-lea-deep-charcoal">{student.studentName}</h2>
                <p className="text-sm text-lea-charcoal-grey">{student.studentEmail}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={getStatusColor(student.status)}>
                    <i className={`${getStatusIcon(student.status)} mr-1`}></i>
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </Badge>
                  {student.certificateIssued && (
                    <Badge className="bg-purple-100 text-purple-800">
                      <i className="fas fa-certificate mr-1"></i>
                      Certified
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-lea-deep-charcoal">
                  {student.completionPercentage}%
                </div>
                <p className="text-sm text-lea-charcoal-grey">Complete</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={student.completionPercentage} className="h-3" />
              
              <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4`}>
                <div className="text-center p-3 bg-lea-pearl-white rounded-lg">
                  <div className="text-lg font-semibold text-lea-deep-charcoal">
                    {student.modulesCompleted}/{student.totalModules}
                  </div>
                  <p className="text-xs text-lea-charcoal-grey">Modules</p>
                </div>
                <div className="text-center p-3 bg-lea-pearl-white rounded-lg">
                  <div className="text-lg font-semibold text-lea-deep-charcoal">
                    {student.assessmentsPassed}/{student.totalAssessments}
                  </div>
                  <p className="text-xs text-lea-charcoal-grey">Assessments</p>
                </div>
                <div className="text-center p-3 bg-lea-pearl-white rounded-lg">
                  <div className="text-lg font-semibold text-lea-deep-charcoal">
                    {student.timeSpent}h
                  </div>
                  <p className="text-xs text-lea-charcoal-grey">Time Spent</p>
                </div>
                {student.grade && (
                  <div className="text-center p-3 bg-lea-pearl-white rounded-lg">
                    <div className="text-lg font-semibold text-lea-deep-charcoal">
                      {student.grade}%
                    </div>
                    <p className="text-xs text-lea-charcoal-grey">Grade</p>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-lea-charcoal-grey">
                <p><strong>Enrolled:</strong> {format(new Date(student.enrollmentDate), 'MMM dd, yyyy')}</p>
                <p><strong>Last Activity:</strong> {formatDistanceToNow(new Date(student.lastActivity), { addSuffix: true })}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Module Progress */}
        <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
          <CardHeader>
            <CardTitle className="text-lea-deep-charcoal">Module Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moduleProgress?.map((module) => (
                <div key={module.id} className="border border-lea-silver-grey rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-lea-deep-charcoal">{module.title}</h4>
                    <Badge className={getStatusColor(module.status === 'not-started' ? 'paused' : module.status === 'in-progress' ? 'active' : 'completed')}>
                      {module.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <Progress value={module.completionPercentage} className="mb-2" />
                  <div className="flex justify-between text-sm text-lea-charcoal-grey">
                    <span>{module.completionPercentage}% complete</span>
                    <span>{module.timeSpent}h spent</span>
                  </div>
                  {module.assessmentScore && (
                    <div className="mt-2 text-sm">
                      <span className="text-lea-deep-charcoal font-medium">Assessment Score: </span>
                      <span className="text-green-600 font-semibold">{module.assessmentScore}%</span>
                    </div>
                  )}
                </div>
              )) || []}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-lea-deep-charcoal`}>
            Student Progress Overview
          </h2>
          <p className="text-sm text-lea-charcoal-grey">
            Track student progress across all courses and modules
          </p>
        </div>
        <Button className="bg-lea-clinical-blue hover:bg-blue-700">
          <i className="fas fa-download mr-2"></i>
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Progress</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {progressData?.map((student) => (
              <Card key={student.id} className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-shadow cursor-pointer"
                    onClick={() => setSelectedStudent(student.studentId)}>
                <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.studentName}`} />
                      <AvatarFallback>{student.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-lea-deep-charcoal truncate">
                        {student.studentName}
                      </h3>
                      <p className="text-sm text-lea-charcoal-grey truncate">
                        {student.courseName}
                      </p>
                      <div className="mt-2">
                        <Progress value={student.completionPercentage} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-medium text-lea-deep-charcoal">
                          {student.completionPercentage}%
                        </span>
                        <Badge className={getStatusColor(student.status)} size="sm">
                          {student.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-lea-charcoal-grey mt-1">
                        Last active {formatDistanceToNow(new Date(student.lastActivity), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || []}
          </div>
        </TabsContent>

        <TabsContent value="detailed">
          <Card className="border border-lea-silver-grey shadow-lea-card">
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                <div className="p-4 space-y-4">
                  {progressData?.map((student) => (
                    <div key={student.id} className="border border-lea-silver-grey rounded-lg p-4 hover:bg-lea-pearl-white transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.studentName}`} />
                            <AvatarFallback>{student.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-lea-deep-charcoal">{student.studentName}</h4>
                            <p className="text-sm text-lea-charcoal-grey">{student.courseName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-lea-deep-charcoal">
                            {student.completionPercentage}%
                          </div>
                          <Badge className={getStatusColor(student.status)} size="sm">
                            {student.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <Progress value={student.completionPercentage} className="mb-3" />
                      
                      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-2 text-sm`}>
                        <div>
                          <span className="text-lea-charcoal-grey">Modules:</span>
                          <span className="ml-1 font-medium text-lea-deep-charcoal">
                            {student.modulesCompleted}/{student.totalModules}
                          </span>
                        </div>
                        <div>
                          <span className="text-lea-charcoal-grey">Tests:</span>
                          <span className="ml-1 font-medium text-lea-deep-charcoal">
                            {student.assessmentsPassed}/{student.totalAssessments}
                          </span>
                        </div>
                        <div>
                          <span className="text-lea-charcoal-grey">Time:</span>
                          <span className="ml-1 font-medium text-lea-deep-charcoal">
                            {student.timeSpent}h
                          </span>
                        </div>
                        {student.grade && (
                          <div>
                            <span className="text-lea-charcoal-grey">Grade:</span>
                            <span className="ml-1 font-medium text-green-600">
                              {student.grade}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )) || []}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-lea-silver-grey shadow-lea-card">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-lea-deep-charcoal mb-2">
                  {progressData?.filter(s => s.status === 'active').length || 0}
                </div>
                <p className="text-sm text-lea-charcoal-grey">Active Students</p>
              </CardContent>
            </Card>
            
            <Card className="border border-lea-silver-grey shadow-lea-card">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {progressData?.filter(s => s.status === 'completed').length || 0}
                </div>
                <p className="text-sm text-lea-charcoal-grey">Completed</p>
              </CardContent>
            </Card>
            
            <Card className="border border-lea-silver-grey shadow-lea-card">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-lea-clinical-blue mb-2">
                  {progressData ? Math.round(progressData.reduce((acc, s) => acc + s.completionPercentage, 0) / progressData.length) : 0}%
                </div>
                <p className="text-sm text-lea-charcoal-grey">Avg. Progress</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
