import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const enrollmentSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  courseId: z.string().min(1, "Course is required"),
});

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

interface CourseBookingProps {
  onSuccess?: () => void;
}

export default function CourseBooking({ onSuccess }: CourseBookingProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: students = [] } = useQuery({
    queryKey: ["/api/students"],
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["/api/courses"],
  });

  const createEnrollmentMutation = useMutation({
    mutationFn: async (data: EnrollmentFormData) => {
      const response = await apiRequest("POST", "/api/enrollments", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
      toast({
        title: "Success",
        description: "Student enrolled successfully",
      });
      reset();
      onSuccess?.();
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
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
  });

  const onSubmit = (data: EnrollmentFormData) => {
    createEnrollmentMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900" data-testid="title-course-enrollment">
          Enroll Student in Course
        </h2>
        <p className="text-sm text-gray-500">Add a student to a training course</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="studentId">Student *</Label>
          <Select onValueChange={(value) => setValue("studentId", value)}>
            <SelectTrigger data-testid="select-student">
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student: any) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} - {student.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.studentId && (
            <p className="text-sm text-red-500 mt-1">{errors.studentId.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="courseId">Course *</Label>
          <Select onValueChange={(value) => setValue("courseId", value)}>
            <SelectTrigger data-testid="select-course">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course: any) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name} - {course.level} - £{course.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.courseId && (
            <p className="text-sm text-red-500 mt-1">{errors.courseId.message}</p>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Enrollment Information</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Student will receive welcome materials via email</li>
            <li>• Course access will be granted immediately upon enrollment</li>
            <li>• Payment processing will be initiated for course fees</li>
            <li>• Age verification may be required for certain treatments</li>
          </ul>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              onSuccess?.();
            }}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createEnrollmentMutation.isPending}
            data-testid="button-enroll-student"
          >
            {createEnrollmentMutation.isPending ? "Enrolling..." : "Enroll Student"}
          </Button>
        </div>
      </form>
    </div>
  );
}
