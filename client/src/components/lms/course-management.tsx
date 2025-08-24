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
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Clock, 
  Calendar,
  DollarSign,
  FileText,
  Video,
  Award,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Copy,
  Archive,
  Settings,
  Upload,
  Download,
  Star,
  TrendingUp,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Course {
  id: string;
  name: string;
  description: string;
  level: string;
  category: string;
  duration: number; // weeks
  price: number;
  maxStudents: number;
  currentEnrollments: number;
  completionRate: number;
  averageRating: number;
  status: "active" | "draft" | "archived";
  instructorId: string;
  instructorName: string;
  modules: CourseModule[];
  nextIntake: string;
  accreditationBody: string;
  prerequisites: string[];
  learningOutcomes: string[];
  assessmentMethods: string[];
  createdAt: string;
  updatedAt: string;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: number; // hours
  order: number;
  contentType: "video" | "document" | "quiz" | "assignment";
  content: string; // URL or content
  isRequired: boolean;
}

interface Instructor {
  id: string;
  name: string;
  email: string;
  specializations: string[];
  qualifications: string[];
}

const courseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  description: z.string().min(1, "Description is required"),
  level: z.string().min(1, "Level is required"),
  category: z.string().min(1, "Category is required"),
  duration: z.number().min(1, "Duration must be at least 1 week"),
  price: z.number().min(0, "Price cannot be negative"),
  maxStudents: z.number().min(1, "Must allow at least 1 student"),
  instructorId: z.string().min(1, "Instructor is required"),
  nextIntake: z.string().min(1, "Next intake date is required"),
  accreditationBody: z.string().min(1, "Accreditation body is required"),
  prerequisites: z.array(z.string()),
  learningOutcomes: z.array(z.string()),
  assessmentMethods: z.array(z.string())
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function CourseManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const queryClient = useQueryClient();

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      description: "",
      level: "",
      category: "",
      duration: 1,
      price: 0,
      maxStudents: 20,
      instructorId: "",
      nextIntake: "",
      accreditationBody: "",
      prerequisites: [],
      learningOutcomes: [],
      assessmentMethods: []
    }
  });

  // Mock data - replace with actual API calls
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/lms/courses"],
    initialData: [
      {
        id: "1",
        name: "Advanced Facial Aesthetics",
        description: "Comprehensive training in advanced facial aesthetic procedures including dermal fillers, anti-wrinkle treatments, and advanced injection techniques.",
        level: "Level 4 Diploma",
        category: "Aesthetic Treatments",
        duration: 12,
        price: 2950,
        maxStudents: 20,
        currentEnrollments: 15,
        completionRate: 84,
        averageRating: 4.8,
        status: "active",
        instructorId: "inst1",
        instructorName: "Dr. Sarah Johnson",
        modules: [
          {
            id: "mod1",
            title: "Anatomy & Physiology",
            description: "Facial anatomy and physiological processes",
            duration: 8,
            order: 1,
            contentType: "video",
            content: "/videos/anatomy-basics.mp4",
            isRequired: true
          },
          {
            id: "mod2", 
            title: "Product Knowledge",
            description: "Understanding different filler types and applications",
            duration: 6,
            order: 2,
            contentType: "document",
            content: "/documents/product-guide.pdf",
            isRequired: true
          }
        ],
        nextIntake: "2024-03-15T00:00:00Z",
        accreditationBody: "ABT (Association of Beauty Therapists)",
        prerequisites: ["Level 3 Beauty Therapy", "First Aid Certificate"],
        learningOutcomes: [
          "Demonstrate advanced injection techniques",
          "Assess client suitability for treatments", 
          "Manage complications and adverse reactions"
        ],
        assessmentMethods: ["Practical assessment", "Written examination", "Portfolio"],
        createdAt: "2024-01-15T00:00:00Z",
        updatedAt: "2024-02-10T00:00:00Z"
      },
      {
        id: "2",
        name: "Chemical Peel Certification", 
        description: "Professional certification in chemical peel procedures for skin rejuvenation and treatment of various skin conditions.",
        level: "Level 3 Certificate",
        category: "Advanced Treatments",
        duration: 8,
        price: 1850,
        maxStudents: 15,
        currentEnrollments: 12,
        completionRate: 88,
        averageRating: 4.6,
        status: "active",
        instructorId: "inst2",
        instructorName: "Emma Thompson",
        modules: [],
        nextIntake: "2024-04-01T00:00:00Z",
        accreditationBody: "CIBTAC",
        prerequisites: ["Level 2 Beauty Therapy"],
        learningOutcomes: [
          "Perform superficial and medium depth peels",
          "Develop appropriate treatment plans",
          "Recognize contraindications and complications"
        ],
        assessmentMethods: ["Practical demonstration", "Case studies"],
        createdAt: "2024-01-20T00:00:00Z",
        updatedAt: "2024-02-05T00:00:00Z"
      }
    ]
  });

  const { data: instructors = [] } = useQuery<Instructor[]>({
    queryKey: ["/api/lms/instructors"],
    initialData: [
      {
        id: "inst1",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@leaaesthetics.com",
        specializations: ["Facial Aesthetics", "Anti-aging Treatments"],
        qualifications: ["MD", "Aesthetic Medicine Diploma"]
      },
      {
        id: "inst2", 
        name: "Emma Thompson",
        email: "emma.thompson@leaaesthetics.com",
        specializations: ["Chemical Peels", "Skin Rejuvenation"],
        qualifications: ["Level 4 Aesthetics", "CIBTAC Certified"]
      }
    ]
  });

  const createCourseMutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      // API call would go here
      return { ...data, id: Date.now().toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lms/courses"] });
      setIsCreateDialogOpen(false);
      form.reset();
    }
  });

  const updateCourseMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CourseFormData> }) => {
      // API call would go here
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lms/courses"] });
      setIsEditDialogOpen(false);
      setSelectedCourse(null);
    }
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (id: string) => {
      // API call would go here
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lms/courses"] });
    }
  });

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(courses.map(course => course.category))];

  const handleCreateCourse = (data: CourseFormData) => {
    createCourseMutation.mutate(data);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    form.reset({
      name: course.name,
      description: course.description,
      level: course.level,
      category: course.category,
      duration: course.duration,
      price: course.price,
      maxStudents: course.maxStudents,
      instructorId: course.instructorId,
      nextIntake: course.nextIntake,
      accreditationBody: course.accreditationBody,
      prerequisites: course.prerequisites,
      learningOutcomes: course.learningOutcomes,
      assessmentMethods: course.assessmentMethods
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCourse = (data: CourseFormData) => {
    if (selectedCourse) {
      updateCourseMutation.mutate({ id: selectedCourse.id, data });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const CourseDialog = ({ isOpen, onOpenChange, title, course }: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    course?: Course | null;
  }) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lea-deep-charcoal font-serif">{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(course ? handleUpdateCourse : handleCreateCourse)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Course Name</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Enter course name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Select onValueChange={(value) => form.setValue("level", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Level 2 Certificate">Level 2 Certificate</SelectItem>
                      <SelectItem value="Level 3 Certificate">Level 3 Certificate</SelectItem>
                      <SelectItem value="Level 4 Diploma">Level 4 Diploma</SelectItem>
                      <SelectItem value="Level 5 Diploma">Level 5 Diploma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Course description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => form.setValue("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aesthetic Treatments">Aesthetic Treatments</SelectItem>
                      <SelectItem value="Advanced Treatments">Advanced Treatments</SelectItem>
                      <SelectItem value="Prerequisites">Prerequisites</SelectItem>
                      <SelectItem value="Business Skills">Business Skills</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="duration">Duration (weeks)</Label>
                  <Input
                    id="duration"
                    type="number"
                    {...form.register("duration", { valueAsNumber: true })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">Price (£)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...form.register("price", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Course Modules</h3>
                <Button type="button" variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Module
                </Button>
              </div>
              
              {/* Module management would go here */}
              <div className="border border-lea-silver-grey rounded-lg p-4">
                <p className="text-sm text-lea-charcoal-grey">
                  Module management interface would be implemented here
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="assessment" className="space-y-4">
              <div>
                <Label>Learning Outcomes</Label>
                <Textarea
                  placeholder="Enter learning outcomes (one per line)"
                  rows={4}
                />
              </div>
              
              <div>
                <Label>Assessment Methods</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Practical assessment", "Written examination", "Portfolio", "Case studies", "Peer review"].map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <input type="checkbox" id={method} />
                      <Label htmlFor={method} className="text-sm">{method}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Select onValueChange={(value) => form.setValue("instructorId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select instructor" />
                    </SelectTrigger>
                    <SelectContent>
                      {instructors.map((instructor) => (
                        <SelectItem key={instructor.id} value={instructor.id}>
                          {instructor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="maxStudents">Max Students</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    {...form.register("maxStudents", { valueAsNumber: true })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nextIntake">Next Intake Date</Label>
                  <Input
                    id="nextIntake"
                    type="date"
                    {...form.register("nextIntake")}
                  />
                </div>
                
                <div>
                  <Label htmlFor="accreditationBody">Accreditation Body</Label>
                  <Select onValueChange={(value) => form.setValue("accreditationBody", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select accreditation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ABT">ABT (Association of Beauty Therapists)</SelectItem>
                      <SelectItem value="CIBTAC">CIBTAC</SelectItem>
                      <SelectItem value="VTCT">VTCT</SelectItem>
                      <SelectItem value="City & Guilds">City & Guilds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-lea-clinical-blue hover:bg-blue-700"
              disabled={createCourseMutation.isPending || updateCourseMutation.isPending}
            >
              {course ? "Update Course" : "Create Course"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-lea-deep-charcoal font-serif">Course Management</h1>
          <p className="text-lea-charcoal-grey">Create and manage Ofqual-compliant training courses</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-lea-clinical-blue hover:bg-blue-700 gap-2">
              <Plus className="w-4 h-4" />
              New Course
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lea-charcoal-grey w-4 h-4" />
          <Input
            placeholder="Search courses..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="bg-lea-platinum-white border-lea-silver-grey shadow-lea-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lea-deep-charcoal font-serif text-lg">{course.name}</CardTitle>
                  <p className="text-sm text-lea-charcoal-grey mt-1">{course.level}</p>
                </div>
                {getStatusBadge(course.status)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-lea-charcoal-grey line-clamp-2">{course.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-lea-charcoal-grey" />
                  <span>{course.duration} weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-lea-charcoal-grey" />
                  <span>£{course.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-lea-charcoal-grey" />
                  <span>{course.currentEnrollments}/{course.maxStudents}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{course.averageRating}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-lea-silver-grey">
                <span className="text-xs text-lea-charcoal-grey">
                  Next intake: {format(new Date(course.nextIntake), 'MMM dd, yyyy')}
                </span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEditCourse(course)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
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

      {/* Create/Edit Course Dialogs */}
      <CourseDialog 
        isOpen={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
        title="Create New Course" 
      />
      
      <CourseDialog 
        isOpen={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        title="Edit Course" 
        course={selectedCourse}
      />
    </div>
  );
}
