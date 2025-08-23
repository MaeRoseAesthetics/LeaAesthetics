import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Course, Enrollment } from "@shared/schema";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CourseBooking from "@/components/booking/course-booking";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function Courses() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    enabled: isAuthenticated,
  });

  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery<Enrollment[]>({
    queryKey: ["/api/enrollments"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const formatPrice = (price: string) => {
    return `£${parseFloat(price).toFixed(2)}`;
  };

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'Level 4':
        return 'default';
      case 'Level 5':
        return 'secondary';
      case 'Level 6':
        return 'outline';
      case 'Level 7':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-clinical-grey">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="bg-white border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
                    Training Courses
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Ofqual-aligned training courses and student management
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-enroll-student">
                        <i className="fas fa-user-plus mr-2"></i>Enroll Student
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <CourseBooking onSuccess={() => setShowBookingDialog(false)} />
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" data-testid="button-create-course">
                    <i className="fas fa-plus mr-2"></i>Create Course
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Course Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-warning rounded-md flex items-center justify-center">
                        <i className="fas fa-graduation-cap text-white text-sm"></i>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Active Courses</p>
                      <p className="text-2xl font-semibold text-gray-900" data-testid="text-active-courses">
                        {courses.filter((c: any) => c.active).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-medical-blue rounded-md flex items-center justify-center">
                        <i className="fas fa-users text-white text-sm"></i>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Enrollments</p>
                      <p className="text-2xl font-semibold text-gray-900" data-testid="text-total-enrollments">
                        {enrollments.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-success rounded-md flex items-center justify-center">
                        <i className="fas fa-check-circle text-white text-sm"></i>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Completed</p>
                      <p className="text-2xl font-semibold text-gray-900" data-testid="text-completed-enrollments">
                        {enrollments.filter((e: any) => e.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <i className="fas fa-certificate text-white text-sm"></i>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Ofqual Compliant</p>
                      <p className="text-2xl font-semibold text-gray-900" data-testid="text-compliant-courses">
                        {courses.filter((c: any) => c.ofqualCompliant).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Available Courses */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Available Training Courses</CardTitle>
              </CardHeader>
              <CardContent>
                {coursesLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="fas fa-graduation-cap text-4xl text-gray-400 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
                    <p className="text-gray-500 mb-4">
                      Create your first training course to start enrolling students
                    </p>
                    <Button data-testid="button-create-first-course">
                      Create First Course
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course: any) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-medical-blue to-blue-600 rounded-md flex items-center justify-center">
                            <i className="fas fa-book-open text-white"></i>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900" data-testid={`text-course-name-${course.id}`}>
                              {course.name}
                            </h3>
                            <p className="text-sm text-gray-500">{course.description}</p>
                            <div className="flex items-center space-x-3 mt-1">
                              <Badge variant={getLevelBadgeVariant(course.level)}>
                                {course.level}
                              </Badge>
                              {course.ofqualCompliant && (
                                <Badge variant="secondary">
                                  <i className="fas fa-check-circle mr-1"></i>Ofqual
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500">
                                {course.duration} days
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm text-medical-blue font-medium" data-testid={`text-course-price-${course.id}`}>
                              {formatPrice(course.price)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Max {course.maxStudents} students
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              data-testid={`button-view-course-${course.id}`}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              data-testid={`button-enroll-course-${course.id}`}
                            >
                              Enroll
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Enrollments */}
            <Card>
              <CardHeader>
                <CardTitle>Active Enrollments</CardTitle>
              </CardHeader>
              <CardContent>
                {enrollmentsLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : enrollments.length === 0 ? (
                  <div className="text-center py-8">
                    <i className="fas fa-user-graduate text-2xl text-gray-400 mb-2"></i>
                    <p className="text-gray-500">No active enrollments</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrollments.map((enrollment: any) => (
                      <div
                        key={enrollment.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            Course ID: {enrollment.courseId}
                          </p>
                          <p className="text-sm text-gray-500">
                            Student ID: {enrollment.studentId}
                          </p>
                          <p className="text-xs text-gray-500">
                            Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {enrollment.progress}%
                              </span>
                              <Badge
                                variant={
                                  enrollment.status === 'active' ? 'default' :
                                  enrollment.status === 'completed' ? 'secondary' : 'outline'
                                }
                              >
                                {enrollment.status}
                              </Badge>
                            </div>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-medical-blue h-2 rounded-full"
                                style={{ width: `${enrollment.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-manage-enrollment-${enrollment.id}`}
                          >
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
