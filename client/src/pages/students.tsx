import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Student, Enrollment } from "@shared/schema";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";

const studentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  qualificationLevel: z.string().optional(),
  priorExperience: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

export default function Students() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: students = [], isLoading: studentsLoading } = useQuery<Student[]>({
    queryKey: ["/api/students"],
    enabled: isAuthenticated,
  });

  const { data: enrollments = [] } = useQuery<Enrollment[]>({
    queryKey: ["/api/enrollments"],
    enabled: isAuthenticated,
  });

  const createStudentMutation = useMutation({
    mutationFn: async (data: StudentFormData) => {
      const response = await apiRequest("POST", "/api/students", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      toast({
        title: "Success",
        description: "Student created successfully",
      });
      setShowStudentDialog(false);
      reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  const onSubmit = (data: StudentFormData) => {
    createStudentMutation.mutate(data);
  };

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

  const getStudentEnrollments = (studentId: string) => {
    return enrollments.filter((e: any) => e.studentId === studentId);
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
                    Student Management
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage training students, track progress, and CPD hours
                  </p>
                </div>
                <Dialog open={showStudentDialog} onOpenChange={setShowStudentDialog}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-new-student">
                      <i className="fas fa-plus mr-2"></i>New Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Student</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            {...register("firstName")}
                            data-testid="input-first-name"
                          />
                          {errors.firstName && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.firstName.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            {...register("lastName")}
                            data-testid="input-last-name"
                          />
                          {errors.lastName && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          data-testid="input-email"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          {...register("phone")}
                          data-testid="input-phone"
                        />
                      </div>
                      <div>
                        <Label htmlFor="qualificationLevel">Current Qualification Level</Label>
                        <Input
                          id="qualificationLevel"
                          {...register("qualificationLevel")}
                          placeholder="e.g., Level 3, HND, Degree"
                          data-testid="input-qualification-level"
                        />
                      </div>
                      <div>
                        <Label htmlFor="priorExperience">Prior Experience</Label>
                        <Textarea
                          id="priorExperience"
                          {...register("priorExperience")}
                          placeholder="Previous aesthetic training or medical background"
                          data-testid="textarea-prior-experience"
                        />
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowStudentDialog(false)}
                          data-testid="button-cancel"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={createStudentMutation.isPending}
                          data-testid="button-create-student"
                        >
                          {createStudentMutation.isPending ? "Creating..." : "Create Student"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Student Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-medical-blue rounded-md flex items-center justify-center">
                        <i className="fas fa-user-graduate text-white text-sm"></i>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Students</p>
                      <p className="text-2xl font-semibold text-gray-900" data-testid="text-total-students">
                        {students.length}
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
                        <i className="fas fa-graduation-cap text-white text-sm"></i>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Active Enrollments</p>
                      <p className="text-2xl font-semibold text-gray-900" data-testid="text-active-enrollments">
                        {enrollments.filter((e: any) => e.status === 'active').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-warning rounded-md flex items-center justify-center">
                        <i className="fas fa-clock text-white text-sm"></i>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Average CPD Hours</p>
                      <p className="text-2xl font-semibold text-gray-900" data-testid="text-average-cpd">
                        {students.length > 0 
                          ? Math.round(students.reduce((sum: number, s: any) => sum + (s.cpdHours || 0), 0) / students.length)
                          : 0
                        }
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
                      <p className="text-sm font-medium text-gray-500">Completed Courses</p>
                      <p className="text-2xl font-semibold text-gray-900" data-testid="text-completed-courses">
                        {enrollments.filter((e: any) => e.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {studentsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : students.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <i className="fas fa-user-graduate text-4xl text-gray-400 mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No students yet</h3>
                  <p className="text-gray-500 mb-4">
                    Start by adding your first student profile
                  </p>
                  <Dialog open={showStudentDialog} onOpenChange={setShowStudentDialog}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-create-first-student">
                        Add First Student
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((student: any) => {
                  const studentEnrollments = getStudentEnrollments(student.id);
                  const activeEnrollments = studentEnrollments.filter((e: any) => e.status === 'active');
                  const completedEnrollments = studentEnrollments.filter((e: any) => e.status === 'completed');
                  
                  return (
                    <Card key={student.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg" data-testid={`text-student-name-${student.id}`}>
                            {student.firstName} {student.lastName}
                          </CardTitle>
                          <div className="flex space-x-1">
                            {student.cpdHours >= 20 && (
                              <Badge variant="secondary" className="text-xs">
                                <i className="fas fa-certificate mr-1"></i>CPD Complete
                              </Badge>
                            )}
                            {activeEnrollments.length > 0 && (
                              <Badge variant="default" className="text-xs">
                                Active
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <i className="fas fa-envelope mr-2 w-4"></i>
                            {student.email}
                          </div>
                          {student.phone && (
                            <div className="flex items-center text-gray-600">
                              <i className="fas fa-phone mr-2 w-4"></i>
                              {student.phone}
                            </div>
                          )}
                          {student.qualificationLevel && (
                            <div className="flex items-center text-gray-600">
                              <i className="fas fa-graduation-cap mr-2 w-4"></i>
                              {student.qualificationLevel}
                            </div>
                          )}
                          <div className="flex items-center text-gray-600">
                            <i className="fas fa-clock mr-2 w-4"></i>
                            {student.cpdHours || 0} CPD Hours
                          </div>
                        </div>
                        
                        {/* Enrollment Summary */}
                        <div className="mt-4 p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between text-sm">
                            <span>Active Courses:</span>
                            <span className="font-medium text-medical-blue">{activeEnrollments.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Completed:</span>
                            <span className="font-medium text-success">{completedEnrollments.length}</span>
                          </div>
                          {activeEnrollments.length > 0 && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Overall Progress</span>
                                <span>
                                  {Math.round(
                                    activeEnrollments.reduce((sum: number, e: any) => sum + e.progress, 0) / 
                                    activeEnrollments.length
                                  )}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-medical-blue h-1.5 rounded-full" 
                                  style={{ 
                                    width: `${Math.round(
                                      activeEnrollments.reduce((sum: number, e: any) => sum + e.progress, 0) / 
                                      activeEnrollments.length
                                    )}%` 
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {student.priorExperience && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-md">
                            <h4 className="text-xs font-medium text-blue-800 mb-1">Prior Experience</h4>
                            <p className="text-xs text-blue-700 truncate">{student.priorExperience}</p>
                          </div>
                        )}

                        <div className="flex justify-between mt-4 pt-4 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-view-student-${student.id}`}
                          >
                            View Progress
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-enroll-student-${student.id}`}
                          >
                            Enroll Course
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
