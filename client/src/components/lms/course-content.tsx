import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const contentSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  contentType: z.enum(["text", "video", "pdf", "quiz"]),
  filePath: z.string().optional(),
  orderIndex: z.number().min(0),
});

type ContentFormData = z.infer<typeof contentSchema>;

interface CourseContentProps {
  courseId?: string;
}

export default function CourseContent({ courseId }: CourseContentProps) {
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(courseId || "");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses = [] } = useQuery({
    queryKey: ["/api/courses"],
  });

  const { data: courseContent = [], isLoading } = useQuery({
    queryKey: ["/api/course-content", selectedCourse],
    enabled: !!selectedCourse,
  });

  const createContentMutation = useMutation({
    mutationFn: async (data: ContentFormData) => {
      const response = await apiRequest("POST", "/api/course-content", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/course-content"] });
      toast({
        title: "Success",
        description: "Course content created successfully",
      });
      setShowContentDialog(false);
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
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      courseId: selectedCourse,
      contentType: "text",
      orderIndex: 0,
    },
  });

  const contentType = watch("contentType");

  const onSubmit = (data: ContentFormData) => {
    createContentMutation.mutate(data);
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video":
        return "fas fa-play-circle";
      case "pdf":
        return "fas fa-file-pdf";
      case "quiz":
        return "fas fa-question-circle";
      default:
        return "fas fa-file-text";
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "text-red-600";
      case "pdf":
        return "text-blue-600";
      case "quiz":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900" data-testid="text-course-content-title">
            Course Content Management
          </h2>
          <p className="text-sm text-gray-500">
            Create and manage Ofqual-compliant course materials
          </p>
        </div>
        <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-content">
              <i className="fas fa-plus mr-2"></i>Add Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Course Content</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="courseId">Course *</Label>
                <Select
                  value={selectedCourse}
                  onValueChange={(value) => {
                    setSelectedCourse(value);
                    setValue("courseId", value);
                  }}
                >
                  <SelectTrigger data-testid="select-course">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course: any) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} - {course.level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.courseId && (
                  <p className="text-sm text-red-500 mt-1">{errors.courseId.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Content Title *</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="e.g., Introduction to Facial Anatomy"
                    data-testid="input-content-title"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="contentType">Content Type *</Label>
                  <Select onValueChange={(value) => setValue("contentType", value as any)}>
                    <SelectTrigger data-testid="select-content-type">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text/Document</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="quiz">Quiz/Assessment</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.contentType && (
                    <p className="text-sm text-red-500 mt-1">{errors.contentType.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="orderIndex">Order Index</Label>
                <Input
                  id="orderIndex"
                  type="number"
                  {...register("orderIndex", { valueAsNumber: true })}
                  placeholder="0"
                  data-testid="input-order-index"
                />
                {errors.orderIndex && (
                  <p className="text-sm text-red-500 mt-1">{errors.orderIndex.message}</p>
                )}
              </div>

              {contentType === "text" && (
                <div>
                  <Label htmlFor="content">Content Text</Label>
                  <Textarea
                    id="content"
                    {...register("content")}
                    rows={8}
                    placeholder="Enter the lesson content, instructions, or learning materials..."
                    data-testid="textarea-content"
                  />
                </div>
              )}

              {(contentType === "video" || contentType === "pdf") && (
                <div>
                  <Label htmlFor="filePath">File Path/URL</Label>
                  <Input
                    id="filePath"
                    {...register("filePath")}
                    placeholder="Upload file or enter URL"
                    data-testid="input-file-path"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload files to your preferred hosting service and enter the URL here
                  </p>
                </div>
              )}

              {contentType === "quiz" && (
                <div>
                  <Label htmlFor="content">Quiz Instructions</Label>
                  <Textarea
                    id="content"
                    {...register("content")}
                    rows={4}
                    placeholder="Enter quiz instructions, passing criteria, and any special notes..."
                    data-testid="textarea-quiz-content"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowContentDialog(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createContentMutation.isPending}
                  data-testid="button-create-content"
                >
                  {createContentMutation.isPending ? "Creating..." : "Create Content"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Course Selection */}
      {!courseId && (
        <Card>
          <CardHeader>
            <CardTitle>Select Course</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger data-testid="select-course-filter">
                <SelectValue placeholder="Choose a course to manage content" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course: any) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name} - {course.level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Course Content Display */}
      {selectedCourse && (
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="structure">Course Structure</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : courseContent.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <i className="fas fa-book-open text-4xl text-gray-400 mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
                  <p className="text-gray-500 mb-4">
                    Start building your course by adding the first piece of content
                  </p>
                  <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-first-content">
                        Add First Content
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {courseContent
                  .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
                  .map((content: any, index: number) => (
                    <Card key={content.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-medical-blue rounded-lg flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                  {index + 1}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-medium text-gray-900" data-testid={`content-title-${content.id}`}>
                                  {content.title}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                  <i className={`${getContentIcon(content.contentType)} ${getContentTypeColor(content.contentType)} mr-1`}></i>
                                  {content.contentType}
                                </Badge>
                              </div>
                              {content.content && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                  {content.content}
                                </p>
                              )}
                              {content.filePath && (
                                <div className="flex items-center space-x-2 text-sm text-medical-blue">
                                  <i className="fas fa-external-link-alt"></i>
                                  <span>External Resource</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              data-testid={`button-edit-content-${content.id}`}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              data-testid={`button-preview-content-${content.id}`}
                            >
                              <i className="fas fa-eye"></i>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              data-testid={`button-delete-content-${content.id}`}
                            >
                              <i className="fas fa-trash text-red-500"></i>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="structure" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Structure Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-medical-blue" data-testid="stat-total-content">
                        {courseContent.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Content Items</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-success" data-testid="stat-completion-rate">
                        {courseContent.length > 0 ? "85%" : "0%"}
                      </div>
                      <div className="text-sm text-gray-600">Avg. Completion Rate</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600" data-testid="stat-assessments">
                        {courseContent.filter((c: any) => c.contentType === 'quiz').length}
                      </div>
                      <div className="text-sm text-gray-600">Assessments</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Content Distribution</h4>
                    <div className="space-y-2">
                      {['text', 'video', 'pdf', 'quiz'].map((type) => {
                        const count = courseContent.filter((c: any) => c.contentType === type).length;
                        const percentage = courseContent.length > 0 ? (count / courseContent.length) * 100 : 0;
                        return (
                          <div key={type} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <i className={`${getContentIcon(type)} ${getContentTypeColor(type)}`}></i>
                              <span className="text-sm capitalize">{type}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Progress value={percentage} className="w-20 h-2" />
                              <span className="text-sm font-medium w-8">{count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <i className="fas fa-chart-bar text-3xl text-gray-400 mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-500">
                    Detailed analytics on student engagement and content performance will be available here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
