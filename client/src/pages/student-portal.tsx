import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StudentPortal() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-maerose-cream via-white to-maerose-cream/50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-serif font-bold text-maerose-gold tracking-wide">MaeRose Student Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, {studentData.name}</span>
              <Badge variant="secondary">{studentData.studentId}</Badge>
              <Button variant="outline" size="sm">
                <i className="fas fa-sign-out-alt mr-2"></i>Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="courses">My Courses</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="assessments">Assessments</TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-6">
                {/* Progress Overview */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">CPD Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current Hours</span>
                          <span className="font-medium">{studentData.cpdHours}/{studentData.targetCpdHours}</span>
                        </div>
                        <Progress value={(studentData.cpdHours / studentData.targetCpdHours) * 100} />
                        <p className="text-xs text-gray-500">
                          {studentData.targetCpdHours - studentData.cpdHours} hours remaining
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Active Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-maerose-gold">{currentEnrollments.length}</div>
                        <p className="text-sm text-gray-600">Courses in progress</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Next Deadline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">Sep 15</div>
                        <p className="text-sm text-gray-600">Assessment due</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Current Courses */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Enrollments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentEnrollments.map((enrollment) => (
                        <div key={enrollment.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">{enrollment.courseName}</h4>
                              <p className="text-sm text-gray-600">Next deadline: {enrollment.nextDeadline}</p>
                            </div>
                            <Badge variant="default">{enrollment.status}</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{enrollment.progress}%</span>
                            </div>
                            <Progress value={enrollment.progress} />
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-sm text-gray-600">
                              {enrollment.assessmentsDue} assessments due
                            </span>
                            <Button size="sm">Continue Learning</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Courses Tab */}
              <TabsContent value="courses" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {courses.map((course: any) => (
                        <Card key={course.id} className="border hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{course.name}</CardTitle>
                            <Badge variant="secondary">{course.level}</Badge>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Duration:</span>
                                <span>{course.duration} days</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Price:</span>
                                <span className="font-bold text-maerose-gold">£{course.price}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Max Students:</span>
                                <span>{course.maxStudents}</span>
                              </div>
                            </div>
                            <Button size="sm" className="w-full mt-4">
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
              <TabsContent value="materials" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Materials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {courseMaterials.map((material) => (
                        <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              material.completed ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              {material.type === 'video' && <i className="fas fa-play text-blue-600"></i>}
                              {material.type === 'pdf' && <i className="fas fa-file-pdf text-red-600"></i>}
                              {material.type === 'quiz' && <i className="fas fa-question-circle text-purple-600"></i>}
                              {material.type === 'assessment' && <i className="fas fa-clipboard-check text-orange-600"></i>}
                            </div>
                            <div>
                              <h4 className="font-medium">{material.title}</h4>
                              <p className="text-sm text-gray-600">{material.duration}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {material.completed ? (
                              <Badge variant="default">
                                <i className="fas fa-check mr-1"></i>Completed
                              </Badge>
                            ) : (
                              <Badge variant="outline">Pending</Badge>
                            )}
                            <Button size="sm" variant={material.completed ? "outline" : "default"}>
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
              <TabsContent value="assessments" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Pending Assessments */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Assessments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-l-4 border-red-500 pl-4">
                          <h4 className="font-medium">Practical Skills Assessment</h4>
                          <p className="text-sm text-gray-600">Due: September 15, 2025</p>
                          <p className="text-sm text-red-600">High Priority</p>
                          <Button size="sm" className="mt-2">Submit Assessment</Button>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-4">
                          <h4 className="font-medium">Theory Examination</h4>
                          <p className="text-sm text-gray-600">Due: October 1, 2025</p>
                          <p className="text-sm text-yellow-600">Medium Priority</p>
                          <Button size="sm" className="mt-2" variant="outline">Start Assessment</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Completed Assessments */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Completed Assessments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-medium">Anatomy Quiz</h4>
                          <p className="text-sm text-gray-600">Completed: August 20, 2025</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm font-medium">Score: 85%</span>
                            <Badge variant="default">Passed</Badge>
                          </div>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-medium">Safety Protocol Test</h4>
                          <p className="text-sm text-gray-600">Completed: August 15, 2025</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm font-medium">Score: 92%</span>
                            <Badge variant="default">Passed</Badge>
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
          <div className="space-y-6">
            {/* Student Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Student Profile</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-16 h-16 bg-maerose-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-graduation-cap text-maerose-cream text-xl"></i>
                </div>
                <h3 className="font-semibold text-lg">{studentData.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{studentData.email}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Student ID:</span>
                    <span className="font-medium">{studentData.studentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Level:</span>
                    <span className="font-medium">{studentData.currentLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enrolled:</span>
                    <span className="font-medium">{new Date(studentData.enrollmentDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-maerose-gold">{studentData.cpdHours}</div>
                  <p className="text-sm text-gray-600">CPD Hours Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <p className="text-sm text-gray-600">Courses Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">87%</div>
                  <p className="text-sm text-gray-600">Average Score</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <i className="fas fa-download mr-2"></i>
                  Download Certificates
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <i className="fas fa-calendar mr-2"></i>
                  View Schedule
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <i className="fas fa-envelope mr-2"></i>
                  Contact Tutor
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <i className="fas fa-book mr-2"></i>
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
