import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useCallback } from "react";

export default function StudentPortal() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock student data
  const studentData = {
    name: "John Smith",
    email: "john@example.com",
    studentId: "STU2025001",
    cpdHours: 35,
    targetCpdHours: 40,
    currentLevel: "Level 4",
    enrollmentDate: "2024-09-01"
  };

  const { data: courses = [] } = useQuery({
    queryKey: ["/api/courses"],
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ["/api/enrollments"],
  });

  // Mock current enrollments data
  const currentEnrollments = [
    {
      id: "1",
      courseId: "1",
      courseName: "Level 4 Botox Training",
      progress: 75,
      status: "active",
      nextDeadline: "2025-09-15",
      assessmentsDue: 2
    },
    {
      id: "2", 
      courseId: "2",
      courseName: "Advanced Dermal Fillers",
      progress: 45,
      status: "active",
      nextDeadline: "2025-10-01",
      assessmentsDue: 1
    }
  ];

  // Mock course materials
  const courseMaterials = [
    {
      id: "1",
      title: "Anatomy & Physiology Module",
      type: "video",
      duration: "45 mins",
      completed: true
    },
    {
      id: "2",
      title: "Injection Techniques Theory",
      type: "pdf", 
      duration: "30 mins",
      completed: true
    },
    {
      id: "3",
      title: "Patient Consultation Assessment",
      type: "quiz",
      duration: "15 mins",
      completed: false
    },
    {
      id: "4",
      title: "Practical Skills Demonstration",
      type: "assessment",
      duration: "2 hours",
      completed: false
    }
  ];

  // Handle button clicks to prevent navigation
  const handleContinueLearning = useCallback((courseId: string) => {
    console.log('Continue learning for course:', courseId);
    setActiveTab("materials");
    // Add your learning logic here
  }, []);

  const handleStartReview = useCallback((materialId: string, action: 'start' | 'review') => {
    console.log(`${action} material:`, materialId);
    // Add your material logic here
  }, []);

  const handleAssessmentAction = useCallback((assessmentId: string, action: 'submit' | 'start') => {
    console.log(`${action} assessment:`, assessmentId);
    // Add your assessment logic here
  }, []);

  const handleQuickAction = useCallback((action: string) => {
    console.log('Quick action:', action);
    // Add your quick action logic here
  }, []);

  const handleEnrollNow = useCallback((courseId: string) => {
    console.log('Enroll in course:', courseId);
    // Add your enrollment logic here
  }, []);

  return (
    <div className="min-h-screen bg-lea-pearl-white">
      {/* Header */}
      <header className="bg-lea-platinum-grey/95 backdrop-blur-lg border-b border-lea-warm-grey shadow-lea-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-lea-elegant-silver via-lea-elegant-silver to-gray-500 rounded-lg flex items-center justify-center">
                <span className="text-lea-deep-charcoal font-bold text-lg font-serif">L</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-serif font-bold text-lea-deep-charcoal tracking-tight leading-none">
                  LEA AESTHETICS
                </h1>
                <p className="text-xs font-medium text-lea-charcoal-grey tracking-wider uppercase">
                  Academy
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-lea-deep-charcoal">Welcome, {studentData.name}</p>
                <p className="text-xs text-lea-charcoal-grey">Excellence in aesthetic education</p>
              </div>
              <Badge variant="secondary" className="bg-lea-silver-grey text-lea-deep-charcoal">{studentData.studentId}</Badge>
              <Button variant="outline" size="sm" className="border-lea-deep-charcoal text-lea-deep-charcoal hover:bg-lea-deep-charcoal hover:text-lea-platinum-white transition-all duration-300">
                <i className="fas fa-sign-out-alt mr-2"></i>Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
              {/* Desktop Tab Navigation */}
              <TabsList className="hidden sm:grid w-full grid-cols-4 bg-lea-platinum-white border-lea-silver-grey">
                <TabsTrigger value="dashboard" className="text-lea-charcoal-grey data-[state=active]:text-lea-deep-charcoal data-[state=active]:bg-lea-elegant-silver/20">Dashboard</TabsTrigger>
                <TabsTrigger value="courses" className="text-lea-charcoal-grey data-[state=active]:text-lea-deep-charcoal data-[state=active]:bg-lea-elegant-silver/20">My Courses</TabsTrigger>
                <TabsTrigger value="materials" className="text-lea-charcoal-grey data-[state=active]:text-lea-deep-charcoal data-[state=active]:bg-lea-elegant-silver/20">Materials</TabsTrigger>
                <TabsTrigger value="assessments" className="text-lea-charcoal-grey data-[state=active]:text-lea-deep-charcoal data-[state=active]:bg-lea-elegant-silver/20">Assessments</TabsTrigger>
              </TabsList>
              
              {/* Mobile Tab Navigation */}
              <div className="sm:hidden bg-lea-platinum-white border border-lea-silver-grey rounded-xl p-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={activeTab === "dashboard" ? "default" : "ghost"} 
                    size="sm" 
                    className={`justify-start text-xs ${activeTab === "dashboard" ? "bg-lea-elegant-silver/20 text-lea-deep-charcoal" : "text-lea-charcoal-grey hover:bg-lea-pearl-white"}`}
                    onClick={() => setActiveTab("dashboard")}
                  >
                    <i className="fas fa-tachometer-alt mr-2"></i>Dashboard
                  </Button>
                  <Button 
                    variant={activeTab === "courses" ? "default" : "ghost"} 
                    size="sm" 
                    className={`justify-start text-xs ${activeTab === "courses" ? "bg-lea-elegant-silver/20 text-lea-deep-charcoal" : "text-lea-charcoal-grey hover:bg-lea-pearl-white"}`}
                    onClick={() => setActiveTab("courses")}
                  >
                    <i className="fas fa-graduation-cap mr-2"></i>Courses
                  </Button>
                  <Button 
                    variant={activeTab === "materials" ? "default" : "ghost"} 
                    size="sm" 
                    className={`justify-start text-xs ${activeTab === "materials" ? "bg-lea-elegant-silver/20 text-lea-deep-charcoal" : "text-lea-charcoal-grey hover:bg-lea-pearl-white"}`}
                    onClick={() => setActiveTab("materials")}
                  >
                    <i className="fas fa-book mr-2"></i>Materials
                  </Button>
                  <Button 
                    variant={activeTab === "assessments" ? "default" : "ghost"} 
                    size="sm" 
                    className={`justify-start text-xs ${activeTab === "assessments" ? "bg-lea-elegant-silver/20 text-lea-deep-charcoal" : "text-lea-charcoal-grey hover:bg-lea-pearl-white"}`}
                    onClick={() => setActiveTab("assessments")}
                  >
                    <i className="fas fa-clipboard-check mr-2"></i>Assessments
                  </Button>
                </div>
              </div>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-4 md:space-y-6">
                {/* Progress Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-lea-deep-charcoal font-serif">CPD Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-lea-charcoal-grey">Current Hours</span>
                          <span className="font-medium text-lea-deep-charcoal">{studentData.cpdHours}/{studentData.targetCpdHours}</span>
                        </div>
                        <Progress value={(studentData.cpdHours / studentData.targetCpdHours) * 100} className="h-2" />
                        <p className="text-xs text-lea-slate-grey">
                          {studentData.targetCpdHours - studentData.cpdHours} hours remaining
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-lea-deep-charcoal font-serif">Active Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-lea-elegant-silver">{currentEnrollments.length}</div>
                        <p className="text-sm text-lea-charcoal-grey">Courses in progress</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-lea-deep-charcoal font-serif">Next Deadline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-lg font-bold text-lea-clinical-blue">Sep 15</div>
                        <p className="text-sm text-lea-charcoal-grey">Assessment due</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Current Courses */}
                <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
                  <CardHeader>
                    <CardTitle className="text-lea-deep-charcoal font-serif">Current Enrollments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentEnrollments.map((enrollment) => (
                        <div key={enrollment.id} className="border border-lea-silver-grey rounded-xl p-4 bg-lea-pearl-white hover:shadow-lea-subtle transition-all duration-300">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-lea-deep-charcoal">{enrollment.courseName}</h4>
                              <p className="text-sm text-lea-charcoal-grey">Next deadline: {enrollment.nextDeadline}</p>
                            </div>
                            <Badge variant="default" className="bg-lea-elegant-silver text-lea-deep-charcoal">{enrollment.status}</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-lea-charcoal-grey">Progress</span>
                              <span className="text-lea-deep-charcoal">{enrollment.progress}%</span>
                            </div>
                            <Progress value={enrollment.progress} className="h-2" />
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-sm text-lea-charcoal-grey">
                              {enrollment.assessmentsDue} assessments due
                            </span>
                            <Button 
                              size="sm" 
                              className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal transition-all duration-300"
                              onClick={() => handleContinueLearning(enrollment.courseId)}
                            >
                              Continue Learning
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Courses Tab */}
              <TabsContent value="courses" className="space-y-4 md:space-y-6">
                <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
                  <CardHeader>
                    <CardTitle className="text-lea-deep-charcoal font-serif">Available Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courses.map((course: any) => (
                        <Card key={course.id} className="border border-lea-silver-grey hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-lea-deep-charcoal font-serif">{course.name}</CardTitle>
                            <Badge variant="secondary" className="bg-lea-silver-grey text-lea-charcoal-grey">{course.level}</Badge>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-lea-charcoal-grey mb-3 leading-relaxed">{course.description}</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-lea-charcoal-grey">Duration:</span>
                                <span className="text-lea-deep-charcoal">{course.duration} days</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-lea-charcoal-grey">Price:</span>
                                <span className="font-bold text-lea-elegant-silver">£{course.price}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-lea-charcoal-grey">Max Students:</span>
                                <span className="text-lea-deep-charcoal">{course.maxStudents}</span>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              className="w-full mt-4 bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal transition-all duration-300"
                              onClick={() => handleEnrollNow(course.id)}
                            >
                              Enroll Now
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Materials Tab */}
              <TabsContent value="materials" className="space-y-4 md:space-y-6">
                <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
                  <CardHeader>
                    <CardTitle className="text-lea-deep-charcoal font-serif">Course Materials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {courseMaterials.map((material) => (
                        <div key={material.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-lea-silver-grey rounded-xl bg-lea-pearl-white hover:shadow-lea-subtle transition-all duration-300 gap-4">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              material.completed ? 'bg-lea-elegant-silver/20' : 'bg-lea-silver-grey/50'
                            }`}>
                              {material.type === 'video' && <i className="fas fa-play text-lea-clinical-blue"></i>}
                              {material.type === 'pdf' && <i className="fas fa-file-pdf text-lea-error-red"></i>}
                              {material.type === 'quiz' && <i className="fas fa-question-circle text-lea-elegant-silver"></i>}
                              {material.type === 'assessment' && <i className="fas fa-clipboard-check text-lea-deep-charcoal"></i>}
                            </div>
                            <div>
                              <h4 className="font-medium text-lea-deep-charcoal">{material.title}</h4>
                              <p className="text-sm text-lea-charcoal-grey">{material.duration}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 sm:flex-shrink-0">
                            {material.completed ? (
                              <Badge className="bg-lea-elegant-silver/20 text-lea-deep-charcoal border-lea-elegant-silver/30">
                                <i className="fas fa-check mr-1"></i>Completed
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-lea-silver-grey text-lea-charcoal-grey">Pending</Badge>
                            )}
                            <Button 
                              size="sm" 
                              variant={material.completed ? "outline" : "default"}
                              className={material.completed ? "border-lea-silver-grey text-lea-charcoal-grey hover:bg-lea-pearl-white" : "bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal"}
                              onClick={() => handleStartReview(material.id, material.completed ? 'review' : 'start')}
                            >
                              {material.completed ? "Review" : "Start"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Assessments Tab */}
              <TabsContent value="assessments" className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {/* Pending Assessments */}
                  <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
                    <CardHeader>
                      <CardTitle className="text-lea-deep-charcoal font-serif">Pending Assessments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-l-4 border-lea-error-red pl-4 py-2">
                          <h4 className="font-medium text-lea-deep-charcoal">Practical Skills Assessment</h4>
                          <p className="text-sm text-lea-charcoal-grey">Due: September 15, 2025</p>
                          <p className="text-sm text-lea-error-red font-medium">High Priority</p>
                          <Button 
                            size="sm" 
                            className="mt-2 bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal transition-all duration-300"
                            onClick={() => handleAssessmentAction('practical-skills', 'submit')}
                          >
                            Submit Assessment
                          </Button>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-4 py-2">
                          <h4 className="font-medium text-lea-deep-charcoal">Theory Examination</h4>
                          <p className="text-sm text-lea-charcoal-grey">Due: October 1, 2025</p>
                          <p className="text-sm text-yellow-600 font-medium">Medium Priority</p>
                          <Button 
                            size="sm" 
                            className="mt-2" 
                            variant="outline"
                            onClick={() => handleAssessmentAction('theory-exam', 'start')}
                          >
                            Start Assessment
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Completed Assessments */}
                  <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
                    <CardHeader>
                      <CardTitle className="text-lea-deep-charcoal font-serif">Completed Assessments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-l-4 border-lea-clinical-blue pl-4 py-2">
                          <h4 className="font-medium text-lea-deep-charcoal">Anatomy Quiz</h4>
                          <p className="text-sm text-lea-charcoal-grey">Completed: August 20, 2025</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm font-medium text-lea-deep-charcoal">Score: 85%</span>
                            <Badge className="bg-lea-clinical-blue/20 text-lea-clinical-blue border-lea-clinical-blue/30">Passed</Badge>
                          </div>
                        </div>
                        <div className="border-l-4 border-lea-clinical-blue pl-4 py-2">
                          <h4 className="font-medium text-lea-deep-charcoal">Safety Protocol Test</h4>
                          <p className="text-sm text-lea-charcoal-grey">Completed: August 15, 2025</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm font-medium text-lea-deep-charcoal">Score: 92%</span>
                            <Badge className="bg-lea-clinical-blue/20 text-lea-clinical-blue border-lea-clinical-blue/30">Passed</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
            {/* Student Profile */}
            <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
              <CardHeader>
                <CardTitle className="text-center text-lea-deep-charcoal font-serif">Student Profile</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-16 h-16 bg-lea-clinical-blue rounded-full flex items-center justify-center mx-auto mb-4 shadow-lea-card">
                  <i className="fas fa-graduation-cap text-lea-platinum-white text-xl"></i>
                </div>
                <h3 className="font-semibold text-lg text-lea-deep-charcoal">{studentData.name}</h3>
                <p className="text-lea-charcoal-grey text-sm mb-4">{studentData.email}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-lea-charcoal-grey">Student ID:</span>
                    <span className="font-medium text-lea-deep-charcoal">{studentData.studentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-lea-charcoal-grey">Level:</span>
                    <span className="font-medium text-lea-deep-charcoal">{studentData.currentLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-lea-charcoal-grey">Enrolled:</span>
                    <span className="font-medium text-lea-deep-charcoal">{new Date(studentData.enrollmentDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal font-serif">Academic Excellence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-lea-elegant-silver">{studentData.cpdHours}</div>
                  <p className="text-sm text-lea-charcoal-grey">CPD Hours Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-lea-clinical-blue">2</div>
                  <p className="text-sm text-lea-charcoal-grey">Courses Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-lea-deep-charcoal">87%</div>
                  <p className="text-sm text-lea-charcoal-grey">Average Score</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal font-serif">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-lea-charcoal-grey hover:bg-lea-pearl-white hover:text-lea-deep-charcoal transition-all duration-300"
                  onClick={() => handleQuickAction('download-certificates')}
                >
                  <i className="fas fa-download mr-3 text-lea-elegant-silver"></i>
                  Download Certificates
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-lea-charcoal-grey hover:bg-lea-pearl-white hover:text-lea-deep-charcoal transition-all duration-300"
                  onClick={() => handleQuickAction('view-schedule')}
                >
                  <i className="fas fa-calendar mr-3 text-lea-clinical-blue"></i>
                  View Schedule
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-lea-charcoal-grey hover:bg-lea-pearl-white hover:text-lea-deep-charcoal transition-all duration-300"
                  onClick={() => handleQuickAction('contact-tutor')}
                >
                  <i className="fas fa-envelope mr-3 text-lea-deep-charcoal"></i>
                  Contact Tutor
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-lea-charcoal-grey hover:bg-lea-pearl-white hover:text-lea-deep-charcoal transition-all duration-300"
                  onClick={() => handleQuickAction('resource-library')}
                >
                  <i className="fas fa-book mr-3 text-lea-clinical-blue"></i>
                  Resource Library
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
