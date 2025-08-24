import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Edit, Trash2, Calendar, Clock, Heart, Send, Phone, Mail, CheckCircle, AlertTriangle, FileText, Download } from "lucide-react";

const aftercareSchema = z.object({
  name: z.string().min(1, "Aftercare plan name is required"),
  treatmentId: z.string().min(1, "Treatment is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  immediateInstructions: z.string().min(1, "Immediate instructions are required"),
  dayOneInstructions: z.string().optional(),
  weekOneInstructions: z.string().optional(),
  monthOneInstructions: z.string().optional(),
  longTermCare: z.string().optional(),
  warningSignsSymptoms: z.string().optional(),
  emergencyProcedures: z.string().optional(),
  followUpSchedule: z.string().optional(),
  restrictedActivities: z.string().optional(),
  recommendedProducts: z.string().optional(),
  dietaryGuidelines: z.string().optional(),
  sunProtection: z.string().optional(),
  duration: z.number().min(1).max(365), // days
  priority: z.enum(["low", "medium", "high", "critical"]),
  autoReminders: z.boolean(),
});

type AftercareFormData = z.infer<typeof aftercareSchema>;

interface AftercareTemplate {
  id: string;
  name: string;
  treatmentId: string;
  treatmentName: string;
  category: string;
  description: string;
  immediateInstructions: string;
  dayOneInstructions?: string;
  weekOneInstructions?: string;
  monthOneInstructions?: string;
  longTermCare?: string;
  warningSignsSymptoms?: string;
  emergencyProcedures?: string;
  followUpSchedule?: string;
  restrictedActivities?: string;
  recommendedProducts?: string;
  dietaryGuidelines?: string;
  sunProtection?: string;
  duration: number; // days
  priority: "low" | "medium" | "high" | "critical";
  autoReminders: boolean;
  status: "draft" | "active" | "archived";
  timesUsed: number;
  averageRating?: number;
  createdAt: string;
  updatedAt: string;
}

interface ClientAftercare {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  treatmentId: string;
  treatmentName: string;
  aftercareTemplateId: string;
  aftercareTemplateName: string;
  treatmentDate: string;
  currentPhase: "immediate" | "day_one" | "week_one" | "month_one" | "long_term" | "completed";
  compliance: "excellent" | "good" | "fair" | "poor";
  nextFollowUp?: string;
  notes?: string;
  completionRate: number;
  alerts: number;
  status: "active" | "completed" | "overdue" | "emergency";
  createdAt: string;
}

const aftercareCategories = [
  "Facial Treatments",
  "Body Treatments", 
  "Chemical Peels",
  "Injectable Treatments",
  "Laser Procedures",
  "Surgical Procedures",
  "Wound Care",
  "Post-Treatment Recovery"
];

export default function AftercareManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"templates" | "active" | "completed">("templates");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AftercareTemplate | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<AftercareTemplate | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data - replace with actual API calls
  const { data: aftercareTemplates = [], isLoading } = useQuery({
    queryKey: ["/api/aftercare-templates"],
    initialData: [
      {
        id: "1",
        name: "Chemical Peel Recovery Protocol",
        treatmentId: "treatment-2",
        treatmentName: "Chemical Peel",
        category: "Chemical Peels",
        description: "Comprehensive aftercare for chemical peel treatments",
        immediateInstructions: "Apply cooling gel immediately. Keep treated area clean and dry. Avoid touching or picking at the skin.",
        dayOneInstructions: "Continue with gentle cleansing using recommended cleanser. Apply prescribed healing cream 3x daily. Avoid makeup.",
        weekOneInstructions: "Begin gentle moisturizing routine. Introduce SPF 30+ daily. Monitor for any unusual reactions.",
        monthOneInstructions: "Resume normal skincare routine gradually. Continue daily SPF. Schedule follow-up assessment.",
        warningSignsSymptoms: "Excessive redness, swelling, blistering, signs of infection, severe pain",
        emergencyProcedures: "Contact clinic immediately if experiencing severe symptoms. Apply cool compress for swelling.",
        followUpSchedule: "48 hours, 1 week, 2 weeks, 1 month",
        restrictedActivities: "No sun exposure, no swimming, no intense exercise for 48 hours",
        sunProtection: "SPF 30+ required daily for 4 weeks minimum",
        duration: 30,
        priority: "high" as const,
        autoReminders: true,
        status: "active" as const,
        timesUsed: 23,
        averageRating: 4.8,
        createdAt: "2024-01-20T00:00:00Z",
        updatedAt: "2024-02-15T00:00:00Z"
      },
      {
        id: "2",
        name: "Facial Treatment Standard Care",
        treatmentId: "treatment-1", 
        treatmentName: "Hydrating Facial",
        category: "Facial Treatments",
        description: "Standard aftercare routine for facial treatments",
        immediateInstructions: "Avoid touching face for 2 hours. Keep skin hydrated with provided serum.",
        dayOneInstructions: "Use gentle cleanser, apply moisturizer twice daily",
        weekOneInstructions: "Continue moisturizing routine, can resume normal skincare",
        warningSignsSymptoms: "Unusual redness, irritation, or breakouts",
        followUpSchedule: "1 week (optional)",
        duration: 7,
        priority: "low" as const,
        autoReminders: false,
        status: "active" as const,
        timesUsed: 87,
        averageRating: 4.5,
        createdAt: "2024-01-15T00:00:00Z",
        updatedAt: "2024-02-10T00:00:00Z"
      }
    ]
  });

  const { data: activeAftercare = [] } = useQuery({
    queryKey: ["/api/active-aftercare"],
    initialData: [
      {
        id: "ac1",
        clientId: "client1",
        clientName: "Emma Thompson",
        clientEmail: "emma@example.com",
        clientPhone: "+44 7123 456789",
        treatmentId: "treatment-2",
        treatmentName: "Chemical Peel",
        aftercareTemplateId: "1",
        aftercareTemplateName: "Chemical Peel Recovery Protocol",
        treatmentDate: "2024-02-20T14:00:00Z",
        currentPhase: "week_one" as const,
        compliance: "excellent" as const,
        nextFollowUp: "2024-02-27T10:00:00Z",
        notes: "Client following instructions perfectly, healing well",
        completionRate: 85,
        alerts: 0,
        status: "active" as const,
        createdAt: "2024-02-20T14:00:00Z"
      },
      {
        id: "ac2",
        clientId: "client2", 
        clientName: "James Wilson",
        clientEmail: "james@example.com",
        treatmentId: "treatment-1",
        treatmentName: "Hydrating Facial",
        aftercareTemplateId: "2",
        aftercareTemplateName: "Facial Treatment Standard Care",
        treatmentDate: "2024-02-18T11:30:00Z",
        currentPhase: "completed" as const,
        compliance: "good" as const,
        completionRate: 100,
        alerts: 0,
        status: "completed" as const,
        createdAt: "2024-02-18T11:30:00Z"
      }
    ]
  });

  const { data: treatments = [] } = useQuery({
    queryKey: ["/api/treatments"],
    initialData: [
      { id: "treatment-1", name: "Hydrating Facial" },
      { id: "treatment-2", name: "Chemical Peel" },
      { id: "treatment-3", name: "Microneedling" }
    ]
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AftercareFormData>({
    resolver: zodResolver(aftercareSchema),
    defaultValues: {
      duration: 7,
      priority: "medium",
      autoReminders: true,
    },
  });

  // Filter templates
  const filteredTemplates = aftercareTemplates.filter((template) => {
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || template.category === filterCategory;
    const matchesStatus = filterStatus === "all" || template.status === filterStatus;
    const matchesPriority = filterPriority === "all" || template.priority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  // Filter active aftercare
  const filteredActive = activeAftercare.filter((aftercare) => {
    return !searchTerm || 
      aftercare.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aftercare.treatmentName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const onSubmit = useCallback((data: AftercareFormData) => {
    console.log("Aftercare template data:", data);
    toast({
      title: "Success",
      description: `Aftercare template ${editingTemplate ? 'updated' : 'created'} successfully`,
    });
    setIsDialogOpen(false);
    setEditingTemplate(null);
    reset();
  }, [editingTemplate, toast, reset]);

  const handleEdit = useCallback((template: AftercareTemplate) => {
    setEditingTemplate(template);
    reset({
      name: template.name,
      treatmentId: template.treatmentId,
      category: template.category,
      description: template.description,
      immediateInstructions: template.immediateInstructions,
      dayOneInstructions: template.dayOneInstructions || "",
      weekOneInstructions: template.weekOneInstructions || "",
      monthOneInstructions: template.monthOneInstructions || "",
      longTermCare: template.longTermCare || "",
      warningSignsSymptoms: template.warningSignsSymptoms || "",
      emergencyProcedures: template.emergencyProcedures || "",
      followUpSchedule: template.followUpSchedule || "",
      restrictedActivities: template.restrictedActivities || "",
      recommendedProducts: template.recommendedProducts || "",
      dietaryGuidelines: template.dietaryGuidelines || "",
      sunProtection: template.sunProtection || "",
      duration: template.duration,
      priority: template.priority,
      autoReminders: template.autoReminders,
    });
    setIsDialogOpen(true);
  }, [reset]);

  const handleDelete = useCallback((template: AftercareTemplate) => {
    if (window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
      toast({
        title: "Success",
        description: "Aftercare template deleted successfully",
      });
    }
  }, [toast]);

  const handleAddNew = useCallback(() => {
    setEditingTemplate(null);
    reset({
      name: "",
      treatmentId: "",
      category: "",
      description: "",
      immediateInstructions: "",
      dayOneInstructions: "",
      weekOneInstructions: "",
      monthOneInstructions: "",
      longTermCare: "",
      warningSignsSymptoms: "",
      emergencyProcedures: "",
      followUpSchedule: "",
      restrictedActivities: "",
      recommendedProducts: "",
      dietaryGuidelines: "",
      sunProtection: "",
      duration: 7,
      priority: "medium",
      autoReminders: true,
    });
    setIsDialogOpen(true);
  }, [reset]);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-500 text-white">Critical</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Overdue</Badge>;
      case 'emergency':
        return <Badge className="bg-red-500 text-white"><AlertTriangle className="w-3 h-3 mr-1" />Emergency</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getComplianceBadge = (compliance: string) => {
    switch (compliance) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
      case 'fair':
        return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>;
      case 'poor':
        return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
      default:
        return <Badge variant="outline">{compliance}</Badge>;
    }
  };

  const getPhaseBadge = (phase: string) => {
    switch (phase) {
      case 'immediate':
        return <Badge className="bg-red-100 text-red-800">Immediate</Badge>;
      case 'day_one':
        return <Badge className="bg-orange-100 text-orange-800">Day 1</Badge>;
      case 'week_one':
        return <Badge className="bg-yellow-100 text-yellow-800">Week 1</Badge>;
      case 'month_one':
        return <Badge className="bg-blue-100 text-blue-800">Month 1</Badge>;
      case 'long_term':
        return <Badge className="bg-purple-100 text-purple-800">Long Term</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{phase}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal">Aftercare Management</h2>
          <p className="text-lea-charcoal-grey">Comprehensive post-treatment care and follow-up tracking</p>
        </div>
        <Button 
          onClick={handleAddNew}
          className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Aftercare Plan
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="active">Active Care</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-lea-elegant-silver/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-lea-elegant-silver" />
                  </div>
                  <div>
                    <p className="text-sm text-lea-charcoal-grey">Templates</p>
                    <p className="text-xl font-bold text-lea-deep-charcoal">{aftercareTemplates.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-lea-charcoal-grey">Active Plans</p>
                    <p className="text-xl font-bold text-lea-deep-charcoal">
                      {activeAftercare.filter(a => a.status === 'active').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-lea-charcoal-grey">High Priority</p>
                    <p className="text-xl font-bold text-lea-deep-charcoal">
                      {aftercareTemplates.filter(t => t.priority === 'high' || t.priority === 'critical').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-lea-clinical-blue/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-lea-clinical-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-lea-charcoal-grey">Completion Rate</p>
                    <p className="text-xl font-bold text-lea-deep-charcoal">
                      {activeAftercare.length > 0 
                        ? Math.round(activeAftercare.reduce((sum, a) => sum + a.completionRate, 0) / activeAftercare.length)
                        : 0
                      }%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lea-charcoal-grey w-4 h-4" />
              <Input
                placeholder="Search aftercare templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-lea-silver-grey focus:border-lea-clinical-blue"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[180px] border-lea-silver-grey">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {aftercareCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-[140px] border-lea-silver-grey">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[120px] border-lea-silver-grey">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="bg-lea-platinum-white border-lea-silver-grey hover:shadow-lea-card-hover transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2">
                      {getPriorityBadge(template.priority)}
                      {getStatusBadge(template.status)}
                    </div>
                    <div className="text-xs text-lea-charcoal-grey">
                      {template.timesUsed} uses
                    </div>
                  </div>
                  <CardTitle className="text-lea-deep-charcoal font-serif text-lg">
                    {template.name}
                  </CardTitle>
                  <p className="text-sm text-lea-charcoal-grey line-clamp-2">
                    {template.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center text-sm text-lea-charcoal-grey mb-3">
                    <span>{template.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {template.duration} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-lea-charcoal-grey mb-4">
                    <span>Treatment: {template.treatmentName}</span>
                    {template.averageRating && (
                      <span>★ {template.averageRating.toFixed(1)}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(template)}
                        className="text-lea-elegant-silver hover:bg-lea-elegant-silver/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(template)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-lea-clinical-blue hover:bg-lea-clinical-blue/10"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-lea-charcoal-grey hover:bg-gray-50"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          {/* Active Aftercare Table */}
          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif">Active Aftercare Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Treatment</TableHead>
                      <TableHead>Treatment Date</TableHead>
                      <TableHead>Current Phase</TableHead>
                      <TableHead>Compliance</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Next Follow-up</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActive.filter(a => a.status === 'active').map((aftercare) => (
                      <TableRow key={aftercare.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-lea-deep-charcoal">{aftercare.clientName}</p>
                            <p className="text-sm text-lea-charcoal-grey">{aftercare.clientEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-lea-deep-charcoal">{aftercare.treatmentName}</p>
                            <p className="text-sm text-lea-charcoal-grey">{aftercare.aftercareTemplateName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-lea-deep-charcoal">
                            {new Date(aftercare.treatmentDate).toLocaleDateString()}
                          </p>
                        </TableCell>
                        <TableCell>
                          {getPhaseBadge(aftercare.currentPhase)}
                        </TableCell>
                        <TableCell>
                          {getComplianceBadge(aftercare.compliance)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-lea-clinical-blue h-2 rounded-full transition-all duration-300"
                                style={{ width: `${aftercare.completionRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-lea-deep-charcoal">
                              {aftercare.completionRate}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {aftercare.nextFollowUp ? (
                            <div>
                              <p className="text-lea-deep-charcoal">
                                {new Date(aftercare.nextFollowUp).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-lea-charcoal-grey">
                                {new Date(aftercare.nextFollowUp).toLocaleTimeString()}
                              </p>
                            </div>
                          ) : (
                            <p className="text-lea-charcoal-grey">Not scheduled</p>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-lea-clinical-blue hover:bg-lea-clinical-blue/10"
                            >
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-lea-charcoal-grey hover:bg-gray-50"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-lea-elegant-silver hover:bg-lea-elegant-silver/10"
                            >
                              <Calendar className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {/* Completed Aftercare Table */}
          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif">Completed Aftercare Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Treatment</TableHead>
                      <TableHead>Completion Date</TableHead>
                      <TableHead>Final Compliance</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActive.filter(a => a.status === 'completed').map((aftercare) => (
                      <TableRow key={aftercare.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-lea-deep-charcoal">{aftercare.clientName}</p>
                            <p className="text-sm text-lea-charcoal-grey">{aftercare.clientEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-lea-deep-charcoal">{aftercare.treatmentName}</p>
                            <p className="text-sm text-lea-charcoal-grey">{aftercare.aftercareTemplateName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-lea-deep-charcoal">
                            {new Date(aftercare.createdAt).toLocaleDateString()}
                          </p>
                        </TableCell>
                        <TableCell>
                          {getComplianceBadge(aftercare.compliance)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${aftercare.completionRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-lea-deep-charcoal">
                              {aftercare.completionRate}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-lea-clinical-blue hover:bg-lea-clinical-blue/10"
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-lea-charcoal-grey hover:bg-gray-50"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Aftercare Template Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lea-deep-charcoal font-serif">
              {editingTemplate ? "Edit Aftercare Template" : "Create New Aftercare Template"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., Chemical Peel Recovery Protocol"
                  className="border-lea-silver-grey"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="treatmentId">Treatment *</Label>
                <Select onValueChange={(value) => setValue("treatmentId", value)}>
                  <SelectTrigger className="border-lea-silver-grey">
                    <SelectValue placeholder="Select treatment" />
                  </SelectTrigger>
                  <SelectContent>
                    {treatments.map((treatment) => (
                      <SelectItem key={treatment.id} value={treatment.id}>
                        {treatment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.treatmentId && (
                  <p className="text-sm text-red-500 mt-1">{errors.treatmentId.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger className="border-lea-silver-grey">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {aftercareCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="duration">Duration (days) *</Label>
                <Input
                  id="duration"
                  type="number"
                  {...register("duration", { valueAsNumber: true })}
                  placeholder="7"
                  className="border-lea-silver-grey"
                />
                {errors.duration && (
                  <p className="text-sm text-red-500 mt-1">{errors.duration.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="priority">Priority *</Label>
                <Select onValueChange={(value: any) => setValue("priority", value)}>
                  <SelectTrigger className="border-lea-silver-grey">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Brief description of the aftercare plan..."
                rows={2}
                className="border-lea-silver-grey"
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            <Tabs defaultValue="instructions" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="safety">Safety</TabsTrigger>
                <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
                <TabsTrigger value="followup">Follow-up</TabsTrigger>
              </TabsList>

              <TabsContent value="instructions" className="space-y-4">
                <div>
                  <Label htmlFor="immediateInstructions">Immediate Instructions (0-24 hours) *</Label>
                  <Textarea
                    id="immediateInstructions"
                    {...register("immediateInstructions")}
                    placeholder="Instructions for the first 24 hours after treatment..."
                    rows={4}
                    className="border-lea-silver-grey"
                  />
                  {errors.immediateInstructions && (
                    <p className="text-sm text-red-500 mt-1">{errors.immediateInstructions.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="dayOneInstructions">Day 1-3 Instructions</Label>
                  <Textarea
                    id="dayOneInstructions"
                    {...register("dayOneInstructions")}
                    placeholder="Instructions for days 1-3 after treatment..."
                    rows={3}
                    className="border-lea-silver-grey"
                  />
                </div>

                <div>
                  <Label htmlFor="weekOneInstructions">Week 1 Instructions</Label>
                  <Textarea
                    id="weekOneInstructions"
                    {...register("weekOneInstructions")}
                    placeholder="Instructions for the first week..."
                    rows={3}
                    className="border-lea-silver-grey"
                  />
                </div>

                <div>
                  <Label htmlFor="monthOneInstructions">Month 1 Instructions</Label>
                  <Textarea
                    id="monthOneInstructions"
                    {...register("monthOneInstructions")}
                    placeholder="Instructions for the first month..."
                    rows={3}
                    className="border-lea-silver-grey"
                  />
                </div>

                <div>
                  <Label htmlFor="longTermCare">Long-term Care</Label>
                  <Textarea
                    id="longTermCare"
                    {...register("longTermCare")}
                    placeholder="Long-term care instructions..."
                    rows={3}
                    className="border-lea-silver-grey"
                  />
                </div>
              </TabsContent>

              <TabsContent value="safety" className="space-y-4">
                <div>
                  <Label htmlFor="warningSignsSymptoms">Warning Signs & Symptoms</Label>
                  <Textarea
                    id="warningSignsSymptoms"
                    {...register("warningSignsSymptoms")}
                    placeholder="Signs that require immediate attention..."
                    rows={3}
                    className="border-lea-silver-grey"
                  />
                </div>

                <div>
                  <Label htmlFor="emergencyProcedures">Emergency Procedures</Label>
                  <Textarea
                    id="emergencyProcedures"
                    {...register("emergencyProcedures")}
                    placeholder="What to do in case of emergency..."
                    rows={3}
                    className="border-lea-silver-grey"
                  />
                </div>
              </TabsContent>

              <TabsContent value="lifestyle" className="space-y-4">
                <div>
                  <Label htmlFor="restrictedActivities">Restricted Activities</Label>
                  <Textarea
                    id="restrictedActivities"
                    {...register("restrictedActivities")}
                    placeholder="Activities to avoid during recovery..."
                    rows={3}
                    className="border-lea-silver-grey"
                  />
                </div>

                <div>
                  <Label htmlFor="dietaryGuidelines">Dietary Guidelines</Label>
                  <Textarea
                    id="dietaryGuidelines"
                    {...register("dietaryGuidelines")}
                    placeholder="Dietary recommendations and restrictions..."
                    rows={3}
                    className="border-lea-silver-grey"
                  />
                </div>

                <div>
                  <Label htmlFor="sunProtection">Sun Protection</Label>
                  <Textarea
                    id="sunProtection"
                    {...register("sunProtection")}
                    placeholder="Sun protection requirements..."
                    rows={2}
                    className="border-lea-silver-grey"
                  />
                </div>

                <div>
                  <Label htmlFor="recommendedProducts">Recommended Products</Label>
                  <Textarea
                    id="recommendedProducts"
                    {...register("recommendedProducts")}
                    placeholder="Products to use during recovery..."
                    rows={3}
                    className="border-lea-silver-grey"
                  />
                </div>
              </TabsContent>

              <TabsContent value="followup" className="space-y-4">
                <div>
                  <Label htmlFor="followUpSchedule">Follow-up Schedule</Label>
                  <Textarea
                    id="followUpSchedule"
                    {...register("followUpSchedule")}
                    placeholder="When to schedule follow-up appointments..."
                    rows={3}
                    className="border-lea-silver-grey"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoReminders"
                    {...register("autoReminders")}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="autoReminders">Enable Automatic Reminders</Label>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-lea-silver-grey"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal"
              >
                {isSubmitting ? "Saving..." : editingTemplate ? "Update Template" : "Create Template"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
