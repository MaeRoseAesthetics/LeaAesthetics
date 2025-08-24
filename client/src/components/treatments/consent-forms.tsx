import { useState, useCallback, useRef, useEffect } from "react";
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
import { Search, Plus, Edit, Trash2, FileText, PenTool, Download, Send, CheckCircle, Clock, AlertTriangle, Eye } from "lucide-react";

const consentFormSchema = z.object({
  name: z.string().min(1, "Form name is required"),
  treatmentId: z.string().min(1, "Treatment is required"),
  templateType: z.enum(["standard", "advanced", "custom"]),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Form content is required"),
  riskLevel: z.enum(["low", "medium", "high"]),
  minimumAge: z.number().min(16).max(80),
  validityPeriod: z.number().min(1).max(365), // days
  requiresWitness: z.boolean(),
  mandatoryFields: z.array(z.string()).optional(),
  disclaimers: z.string().optional(),
  aftercareInstructions: z.string().optional(),
});

type ConsentFormData = z.infer<typeof consentFormSchema>;

interface ConsentForm {
  id: string;
  name: string;
  treatmentId: string;
  treatmentName: string;
  templateType: "standard" | "advanced" | "custom";
  category: string;
  description: string;
  content: string;
  riskLevel: "low" | "medium" | "high";
  minimumAge: number;
  validityPeriod: number;
  requiresWitness: boolean;
  mandatoryFields?: string[];
  disclaimers?: string;
  aftercareInstructions?: string;
  status: "draft" | "active" | "archived";
  version: string;
  totalSigned: number;
  createdAt: string;
  updatedAt: string;
}

interface SignedConsent {
  id: string;
  formId: string;
  formName: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  signedDate: string;
  signature: string;
  witnessSignature?: string;
  witnessName?: string;
  ipAddress: string;
  status: "signed" | "expired" | "withdrawn";
  treatmentDate?: string;
}

const consentCategories = [
  "Facial Treatments",
  "Body Treatments",
  "Chemical Peels",
  "Injectable Treatments",
  "Laser Procedures",
  "Surgical Procedures",
  "Assessment & Consultation",
  "Photography & Media"
];

const mandatoryFieldOptions = [
  "Full Name",
  "Date of Birth", 
  "Contact Information",
  "Medical History",
  "Current Medications",
  "Allergies",
  "Previous Treatments",
  "Emergency Contact",
  "GP Information",
  "Insurance Details"
];

export default function ConsentForms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRiskLevel, setFilterRiskLevel] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"forms" | "signed">("forms");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<ConsentForm | null>(null);
  const [selectedForm, setSelectedForm] = useState<ConsentForm | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data - replace with actual API calls
  const { data: consentForms = [], isLoading } = useQuery({
    queryKey: ["/api/consent-forms"],
    initialData: [
      {
        id: "1",
        name: "Facial Treatment Consent",
        treatmentId: "treatment-1",
        treatmentName: "Hydrating Facial",
        templateType: "standard" as const,
        category: "Facial Treatments",
        description: "Standard consent form for facial treatments",
        content: "I understand that I am about to receive a facial treatment...",
        riskLevel: "low" as const,
        minimumAge: 16,
        validityPeriod: 90,
        requiresWitness: false,
        mandatoryFields: ["Full Name", "Date of Birth", "Medical History", "Allergies"],
        disclaimers: "Results may vary between individuals",
        aftercareInstructions: "Avoid direct sun exposure for 24 hours",
        status: "active" as const,
        version: "1.0",
        totalSigned: 45,
        createdAt: "2024-01-15T00:00:00Z",
        updatedAt: "2024-02-01T00:00:00Z"
      },
      {
        id: "2", 
        name: "Chemical Peel High-Risk Consent",
        treatmentId: "treatment-2",
        treatmentName: "Chemical Peel",
        templateType: "advanced" as const,
        category: "Chemical Peels",
        description: "Comprehensive consent for chemical peel treatments",
        content: "I acknowledge the risks associated with chemical peel treatments...",
        riskLevel: "high" as const,
        minimumAge: 18,
        validityPeriod: 30,
        requiresWitness: true,
        mandatoryFields: ["Full Name", "Date of Birth", "Medical History", "Current Medications", "GP Information"],
        disclaimers: "Treatment may cause temporary redness, peeling, and sensitivity",
        aftercareInstructions: "Follow strict post-treatment care protocol",
        status: "active" as const,
        version: "2.1",
        totalSigned: 23,
        createdAt: "2024-01-20T00:00:00Z",
        updatedAt: "2024-02-15T00:00:00Z"
      }
    ]
  });

  const { data: signedConsents = [] } = useQuery({
    queryKey: ["/api/signed-consents"],
    initialData: [
      {
        id: "sc1",
        formId: "1",
        formName: "Facial Treatment Consent",
        clientId: "client1",
        clientName: "Emma Thompson",
        clientEmail: "emma@example.com",
        signedDate: "2024-02-20T10:30:00Z",
        signature: "data:image/svg+xml;base64,PHN2Zy...",
        ipAddress: "192.168.1.1",
        status: "signed" as const,
        treatmentDate: "2024-02-22T14:00:00Z"
      },
      {
        id: "sc2",
        formId: "2", 
        formName: "Chemical Peel High-Risk Consent",
        clientId: "client2",
        clientName: "James Wilson",
        clientEmail: "james@example.com", 
        signedDate: "2024-02-18T15:45:00Z",
        signature: "data:image/svg+xml;base64,PHN2Zy...",
        witnessSignature: "data:image/svg+xml;base64,PHN2Zy...",
        witnessName: "Dr. Smith",
        ipAddress: "192.168.1.2",
        status: "signed" as const,
        treatmentDate: "2024-02-25T11:30:00Z"
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
  } = useForm<ConsentFormData>({
    resolver: zodResolver(consentFormSchema),
    defaultValues: {
      templateType: "standard",
      riskLevel: "low",
      minimumAge: 16,
      validityPeriod: 90,
      requiresWitness: false,
    },
  });

  // Filter forms
  const filteredForms = consentForms.filter((form) => {
    const matchesSearch = !searchTerm || 
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || form.category === filterCategory;
    const matchesStatus = filterStatus === "all" || form.status === filterStatus;
    const matchesRisk = filterRiskLevel === "all" || form.riskLevel === filterRiskLevel;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesRisk;
  });

  // Filter signed consents
  const filteredSigned = signedConsents.filter((consent) => {
    return !searchTerm || 
      consent.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consent.clientName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const onSubmit = useCallback((data: ConsentFormData) => {
    console.log("Consent form data:", data);
    toast({
      title: "Success",
      description: `Consent form ${editingForm ? 'updated' : 'created'} successfully`,
    });
    setIsDialogOpen(false);
    setEditingForm(null);
    reset();
  }, [editingForm, toast, reset]);

  const handleEdit = useCallback((form: ConsentForm) => {
    setEditingForm(form);
    reset({
      name: form.name,
      treatmentId: form.treatmentId,
      templateType: form.templateType,
      category: form.category,
      description: form.description,
      content: form.content,
      riskLevel: form.riskLevel,
      minimumAge: form.minimumAge,
      validityPeriod: form.validityPeriod,
      requiresWitness: form.requiresWitness,
      mandatoryFields: form.mandatoryFields || [],
      disclaimers: form.disclaimers || "",
      aftercareInstructions: form.aftercareInstructions || "",
    });
    setIsDialogOpen(true);
  }, [reset]);

  const handleDelete = useCallback((form: ConsentForm) => {
    if (window.confirm(`Are you sure you want to delete "${form.name}"?`)) {
      toast({
        title: "Success",
        description: "Consent form deleted successfully",
      });
    }
  }, [toast]);

  const handleAddNew = useCallback(() => {
    setEditingForm(null);
    reset({
      name: "",
      treatmentId: "",
      templateType: "standard",
      category: "",
      description: "",
      content: "",
      riskLevel: "low",
      minimumAge: 16,
      validityPeriod: 90,
      requiresWitness: false,
      mandatoryFields: [],
      disclaimers: "",
      aftercareInstructions: "",
    });
    setIsDialogOpen(true);
  }, [reset]);

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>;
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800"><Edit className="w-3 h-3 mr-1" />Draft</Badge>;
      case 'archived':
        return <Badge className="bg-orange-100 text-orange-800">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSignedStatusBadge = (status: string) => {
    switch (status) {
      case 'signed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Signed</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800"><Clock className="w-3 h-3 mr-1" />Expired</Badge>;
      case 'withdrawn':
        return <Badge className="bg-orange-100 text-orange-800"><AlertTriangle className="w-3 h-3 mr-1" />Withdrawn</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Canvas signature functionality
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#1f2937';
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL();
      console.log('Signature saved:', dataURL);
      toast({
        title: "Success",
        description: "Signature saved successfully",
      });
      setShowSignatureDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal">Consent Forms</h2>
          <p className="text-lea-charcoal-grey">Digital consent management with electronic signatures</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleAddNew}
            className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Form
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowSignatureDialog(true)}
            className="border-lea-silver-grey"
          >
            <PenTool className="w-4 h-4 mr-2" />
            Test Signature
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="forms">Form Templates</TabsTrigger>
          <TabsTrigger value="signed">Signed Consents</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-lea-elegant-silver/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-lea-elegant-silver" />
                  </div>
                  <div>
                    <p className="text-sm text-lea-charcoal-grey">Total Forms</p>
                    <p className="text-xl font-bold text-lea-deep-charcoal">{consentForms.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-lea-charcoal-grey">Active</p>
                    <p className="text-xl font-bold text-lea-deep-charcoal">
                      {consentForms.filter(f => f.status === 'active').length}
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
                    <p className="text-sm text-lea-charcoal-grey">High Risk</p>
                    <p className="text-xl font-bold text-lea-deep-charcoal">
                      {consentForms.filter(f => f.riskLevel === 'high').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-lea-platinum-white border-lea-silver-grey">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-lea-clinical-blue/10 rounded-lg flex items-center justify-center">
                    <PenTool className="w-5 h-5 text-lea-clinical-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-lea-charcoal-grey">Total Signed</p>
                    <p className="text-xl font-bold text-lea-deep-charcoal">
                      {consentForms.reduce((sum, f) => sum + f.totalSigned, 0)}
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
                placeholder="Search consent forms..."
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
                {consentCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterRiskLevel} onValueChange={setFilterRiskLevel}>
              <SelectTrigger className="w-full sm:w-[140px] border-lea-silver-grey">
                <SelectValue placeholder="All Risk Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risks</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
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

          {/* Forms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <Card key={form.id} className="bg-lea-platinum-white border-lea-silver-grey hover:shadow-lea-card-hover transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2">
                      {getRiskBadge(form.riskLevel)}
                      {getStatusBadge(form.status)}
                    </div>
                    <div className="text-xs text-lea-charcoal-grey">
                      v{form.version}
                    </div>
                  </div>
                  <CardTitle className="text-lea-deep-charcoal font-serif text-lg">
                    {form.name}
                  </CardTitle>
                  <p className="text-sm text-lea-charcoal-grey line-clamp-2">
                    {form.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center text-sm text-lea-charcoal-grey mb-3">
                    <span>{form.category}</span>
                    <span className="flex items-center gap-1">
                      <PenTool className="w-4 h-4" />
                      {form.totalSigned} signed
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-lea-charcoal-grey mb-4">
                    <span>Min age: {form.minimumAge}</span>
                    <span>Valid: {form.validityPeriod} days</span>
                    {form.requiresWitness && <span>Witness req.</span>}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(form)}
                        className="text-lea-elegant-silver hover:bg-lea-elegant-silver/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(form)}
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
                        <Eye className="w-4 h-4" />
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

        <TabsContent value="signed" className="space-y-6">
          {/* Signed Consents Table */}
          <Card className="bg-lea-platinum-white border-lea-silver-grey">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif">Signed Consent Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Form</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Signed Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Treatment Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSigned.map((consent) => (
                      <TableRow key={consent.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-lea-deep-charcoal">{consent.formName}</p>
                            <p className="text-sm text-lea-charcoal-grey">ID: {consent.formId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-lea-deep-charcoal">{consent.clientName}</p>
                            <p className="text-sm text-lea-charcoal-grey">{consent.clientEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-lea-deep-charcoal">
                            {new Date(consent.signedDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-lea-charcoal-grey">
                            {new Date(consent.signedDate).toLocaleTimeString()}
                          </p>
                        </TableCell>
                        <TableCell>
                          {getSignedStatusBadge(consent.status)}
                        </TableCell>
                        <TableCell>
                          {consent.treatmentDate ? (
                            <p className="text-lea-deep-charcoal">
                              {new Date(consent.treatmentDate).toLocaleDateString()}
                            </p>
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
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-lea-charcoal-grey hover:bg-gray-50"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-lea-elegant-silver hover:bg-lea-elegant-silver/10"
                            >
                              <Send className="w-4 h-4" />
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

      {/* Add/Edit Consent Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lea-deep-charcoal font-serif">
              {editingForm ? "Edit Consent Form" : "Create New Consent Form"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Form Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., Facial Treatment Consent"
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
                    {consentCategories.map((category) => (
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
                <Label htmlFor="riskLevel">Risk Level *</Label>
                <Select onValueChange={(value: any) => setValue("riskLevel", value)}>
                  <SelectTrigger className="border-lea-silver-grey">
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="templateType">Template Type *</Label>
                <Select onValueChange={(value: any) => setValue("templateType", value)}>
                  <SelectTrigger className="border-lea-silver-grey">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Brief description of the consent form..."
                rows={2}
                className="border-lea-silver-grey"
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="content">Form Content *</Label>
              <Textarea
                id="content"
                {...register("content")}
                placeholder="Enter the complete consent form text..."
                rows={8}
                className="border-lea-silver-grey"
              />
              {errors.content && (
                <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="minimumAge">Minimum Age *</Label>
                <Input
                  id="minimumAge"
                  type="number"
                  {...register("minimumAge", { valueAsNumber: true })}
                  placeholder="16"
                  className="border-lea-silver-grey"
                />
                {errors.minimumAge && (
                  <p className="text-sm text-red-500 mt-1">{errors.minimumAge.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="validityPeriod">Validity Period (days) *</Label>
                <Input
                  id="validityPeriod"
                  type="number"
                  {...register("validityPeriod", { valueAsNumber: true })}
                  placeholder="90"
                  className="border-lea-silver-grey"
                />
                {errors.validityPeriod && (
                  <p className="text-sm text-red-500 mt-1">{errors.validityPeriod.message}</p>
                )}
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  id="requiresWitness"
                  {...register("requiresWitness")}
                  className="w-4 h-4"
                />
                <Label htmlFor="requiresWitness">Requires Witness</Label>
              </div>
            </div>

            <div>
              <Label>Mandatory Fields</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {mandatoryFieldOptions.map((field) => (
                  <div key={field} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`field-${field}`}
                      value={field}
                      {...register("mandatoryFields")}
                      className="w-4 h-4"
                    />
                    <Label htmlFor={`field-${field}`} className="text-sm">{field}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="disclaimers">Disclaimers</Label>
              <Textarea
                id="disclaimers"
                {...register("disclaimers")}
                placeholder="Additional disclaimers and warnings..."
                rows={3}
                className="border-lea-silver-grey"
              />
            </div>

            <div>
              <Label htmlFor="aftercareInstructions">Aftercare Instructions</Label>
              <Textarea
                id="aftercareInstructions"
                {...register("aftercareInstructions")}
                placeholder="Post-treatment care instructions..."
                rows={3}
                className="border-lea-silver-grey"
              />
            </div>

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
                {isSubmitting ? "Saving..." : editingForm ? "Update Form" : "Create Form"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Signature Dialog */}
      <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Digital Signature</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-lea-silver-grey rounded-lg p-4">
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="border border-lea-silver-grey rounded w-full h-48 cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            <p className="text-sm text-lea-charcoal-grey text-center">
              Sign above using your mouse or touch screen
            </p>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={clearSignature}
                className="border-lea-silver-grey"
              >
                Clear
              </Button>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSignatureDialog(false)}
                  className="border-lea-silver-grey"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveSignature}
                  className="bg-lea-clinical-blue hover:bg-blue-700"
                >
                  Save Signature
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
