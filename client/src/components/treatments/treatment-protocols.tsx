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
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Edit, Trash2, FileText, Clock, Shield, AlertTriangle, CheckCircle } from "lucide-react";

const protocolSchema = z.object({
  name: z.string().min(1, "Protocol name is required"),
  treatmentId: z.string().min(1, "Treatment is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  pretreatment: z.string().optional(),
  procedure: z.string().min(1, "Procedure steps are required"),
  posttreatment: z.string().optional(),
  contraindications: z.string().optional(),
  complications: z.string().optional(),
  equipment: z.string().optional(),
  products: z.string().optional(),
  safetyNotes: z.string().optional(),
  clinicalNotes: z.string().optional(),
});

type ProtocolFormData = z.infer<typeof protocolSchema>;

interface TreatmentProtocol {
  id: string;
  name: string;
  treatmentId: string;
  treatmentName: string;
  category: string;
  description: string;
  duration: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  pretreatment?: string;
  procedure: string;
  posttreatment?: string;
  contraindications?: string;
  complications?: string;
  equipment?: string;
  products?: string;
  safetyNotes?: string;
  clinicalNotes?: string;
  status: "draft" | "active" | "archived";
  version: string;
  createdAt: string;
  updatedAt: string;
}

interface TreatmentProtocolsProps {
  className?: string;
}

const categories = [
  "Facial Treatments",
  "Body Treatments",
  "Chemical Peels",
  "Microneedling",
  "Laser Treatments",
  "Injectable Treatments",
  "Assessment Procedures",
  "Safety Protocols"
];

export default function TreatmentProtocols({ className }: TreatmentProtocolsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProtocol, setEditingProtocol] = useState<TreatmentProtocol | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<TreatmentProtocol | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data - replace with actual API calls
  const { data: protocols = [], isLoading } = useQuery({
    queryKey: ["/api/treatment-protocols"],
    initialData: [
      {
        id: "1",
        name: "Advanced Hydrating Facial",
        treatmentId: "treatment-1",
        treatmentName: "Hydrating Facial",
        category: "Facial Treatments",
        description: "Comprehensive hydrating facial treatment with deep cleansing and moisturizing",
        duration: 90,
        difficulty: "intermediate" as const,
        pretreatment: "Client consultation, skin analysis, patch test if required",
        procedure: "1. Double cleanse with appropriate cleanser\n2. Steam face for 5-8 minutes\n3. Gentle exfoliation\n4. Extraction if needed\n5. Apply hydrating mask for 15 minutes\n6. Facial massage with serum\n7. Apply moisturizer and SPF",
        posttreatment: "Provide aftercare instructions, book follow-up appointment",
        contraindications: "Active skin infections, recent chemical treatments, pregnancy (certain products)",
        complications: "Possible reactions: redness, sensitivity, breakouts",
        equipment: "Steamer, magnifying lamp, extraction tools, massage tools",
        products: "Cleanser, exfoliant, hydrating mask, serums, moisturizer, SPF",
        safetyNotes: "Always perform patch test, maintain hygiene protocols, check for allergies",
        clinicalNotes: "Document skin condition before and after, note any adverse reactions",
        status: "active" as const,
        version: "1.2",
        createdAt: "2024-01-15T00:00:00Z",
        updatedAt: "2024-02-20T00:00:00Z"
      },
      {
        id: "2",
        name: "Chemical Peel Protocol",
        treatmentId: "treatment-2",
        treatmentName: "Chemical Peel",
        category: "Chemical Peels",
        description: "Professional chemical peel application for skin rejuvenation",
        duration: 60,
        difficulty: "advanced" as const,
        pretreatment: "Skin preparation 2 weeks prior, consent form, patch test",
        procedure: "1. Thorough skin cleansing\n2. Degrease skin\n3. Apply peel solution evenly\n4. Monitor reaction time\n5. Neutralize if required\n6. Apply soothing post-peel treatment",
        posttreatment: "Provide strict aftercare instructions, schedule follow-up",
        contraindications: "Pregnancy, active infections, recent Accutane use, autoimmune conditions",
        complications: "Hyperpigmentation, scarring, infection, allergic reaction",
        equipment: "pH strips, timer, neutralizing solution, cooling fan",
        products: "Peel solution, neutralizer, soothing serum, healing balm",
        safetyNotes: "CRITICAL: Never exceed recommended time, have neutralizer ready, monitor continuously",
        clinicalNotes: "Document peel strength, application time, client reaction, healing progress",
        status: "active" as const,
        version: "2.0",
        createdAt: "2024-01-20T00:00:00Z",
        updatedAt: "2024-02-15T00:00:00Z"
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
  } = useForm<ProtocolFormData>({
    resolver: zodResolver(protocolSchema),
    defaultValues: {
      difficulty: "intermediate",
      duration: 60,
    },
  });

  // Filter protocols
  const filteredProtocols = protocols.filter((protocol) => {
    const matchesSearch = !searchTerm || 
      protocol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      protocol.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || protocol.category === filterCategory;
    const matchesDifficulty = filterDifficulty === "all" || protocol.difficulty === filterDifficulty;
    const matchesStatus = filterStatus === "all" || protocol.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
  });

  const onSubmit = useCallback((data: ProtocolFormData) => {
    console.log("Protocol data:", data);
    // Here you would call the API to create/update the protocol
    toast({
      title: "Success",
      description: `Protocol ${editingProtocol ? 'updated' : 'created'} successfully`,
    });
    setIsDialogOpen(false);
    setEditingProtocol(null);
    reset();
  }, [editingProtocol, toast, reset]);

  const handleEdit = useCallback((protocol: TreatmentProtocol) => {
    setEditingProtocol(protocol);
    reset({
      name: protocol.name,
      treatmentId: protocol.treatmentId,
      category: protocol.category,
      description: protocol.description,
      duration: protocol.duration,
      difficulty: protocol.difficulty,
      pretreatment: protocol.pretreatment || "",
      procedure: protocol.procedure,
      posttreatment: protocol.posttreatment || "",
      contraindications: protocol.contraindications || "",
      complications: protocol.complications || "",
      equipment: protocol.equipment || "",
      products: protocol.products || "",
      safetyNotes: protocol.safetyNotes || "",
      clinicalNotes: protocol.clinicalNotes || "",
    });
    setIsDialogOpen(true);
  }, [reset]);

  const handleDelete = useCallback((protocol: TreatmentProtocol) => {
    if (window.confirm(`Are you sure you want to delete "${protocol.name}"?`)) {
      // API call to delete protocol
      toast({
        title: "Success",
        description: "Protocol deleted successfully",
      });
    }
  }, [toast]);

  const handleAddNew = useCallback(() => {
    setEditingProtocol(null);
    reset({
      name: "",
      treatmentId: "",
      category: "",
      description: "",
      duration: 60,
      difficulty: "intermediate",
      pretreatment: "",
      procedure: "",
      posttreatment: "",
      contraindications: "",
      complications: "",
      equipment: "",
      products: "",
      safetyNotes: "",
      clinicalNotes: "",
    });
    setIsDialogOpen(true);
  }, [reset]);

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge className="bg-green-100 text-green-800">Beginner</Badge>;
      case 'intermediate':
        return <Badge className="bg-yellow-100 text-yellow-800">Intermediate</Badge>;
      case 'advanced':
        return <Badge className="bg-red-100 text-red-800">Advanced</Badge>;
      default:
        return <Badge variant="outline">{difficulty}</Badge>;
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

  if (viewMode === "detail" && selectedProtocol) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setViewMode("list")}
            className="gap-2 text-lea-charcoal-grey hover:text-lea-deep-charcoal"
          >
            ← Back to Protocols
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleEdit(selectedProtocol)}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Protocol
            </Button>
          </div>
        </div>

        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardHeader className="border-b border-lea-silver-grey">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lea-deep-charcoal font-serif text-2xl">
                  {selectedProtocol.name}
                </CardTitle>
                <p className="text-lea-charcoal-grey mt-1">{selectedProtocol.description}</p>
              </div>
              <div className="flex gap-2">
                {getDifficultyBadge(selectedProtocol.difficulty)}
                {getStatusBadge(selectedProtocol.status)}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center p-3 bg-lea-pearl-white rounded-lg">
                <Clock className="w-5 h-5 mx-auto mb-1 text-lea-charcoal-grey" />
                <div className="text-lg font-semibold text-lea-deep-charcoal">{selectedProtocol.duration}min</div>
                <p className="text-xs text-lea-charcoal-grey">Duration</p>
              </div>
              <div className="text-center p-3 bg-lea-pearl-white rounded-lg">
                <FileText className="w-5 h-5 mx-auto mb-1 text-lea-charcoal-grey" />
                <div className="text-lg font-semibold text-lea-deep-charcoal">v{selectedProtocol.version}</div>
                <p className="text-xs text-lea-charcoal-grey">Version</p>
              </div>
              <div className="text-center p-3 bg-lea-pearl-white rounded-lg">
                <Shield className="w-5 h-5 mx-auto mb-1 text-lea-charcoal-grey" />
                <div className="text-lg font-semibold text-lea-deep-charcoal">{selectedProtocol.category}</div>
                <p className="text-xs text-lea-charcoal-grey">Category</p>
              </div>
              <div className="text-center p-3 bg-lea-pearl-white rounded-lg">
                <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-lea-charcoal-grey" />
                <div className="text-lg font-semibold text-lea-deep-charcoal">{selectedProtocol.difficulty}</div>
                <p className="text-xs text-lea-charcoal-grey">Difficulty</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="procedure" className="w-full">
              <TabsList className="w-full justify-start border-b border-lea-silver-grey bg-transparent h-12">
                <TabsTrigger value="procedure">Procedure</TabsTrigger>
                <TabsTrigger value="safety">Safety & Clinical</TabsTrigger>
                <TabsTrigger value="equipment">Equipment & Products</TabsTrigger>
                <TabsTrigger value="aftercare">Aftercare</TabsTrigger>
              </TabsList>

              <TabsContent value="procedure" className="p-6 space-y-6">
                {selectedProtocol.pretreatment && (
                  <div>
                    <h4 className="font-medium text-lea-deep-charcoal mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 bg-lea-clinical-blue/10 rounded-full flex items-center justify-center">
                        <span className="text-lea-clinical-blue text-sm font-medium">1</span>
                      </div>
                      Pre-treatment
                    </h4>
                    <div className="bg-lea-pearl-white p-4 rounded-lg">
                      <p className="text-lea-deep-charcoal whitespace-pre-line">{selectedProtocol.pretreatment}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-lea-deep-charcoal mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-lea-clinical-blue/10 rounded-full flex items-center justify-center">
                      <span className="text-lea-clinical-blue text-sm font-medium">2</span>
                    </div>
                    Main Procedure
                  </h4>
                  <div className="bg-lea-pearl-white p-4 rounded-lg">
                    <p className="text-lea-deep-charcoal whitespace-pre-line">{selectedProtocol.procedure}</p>
                  </div>
                </div>

                {selectedProtocol.posttreatment && (
                  <div>
                    <h4 className="font-medium text-lea-deep-charcoal mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 bg-lea-clinical-blue/10 rounded-full flex items-center justify-center">
                        <span className="text-lea-clinical-blue text-sm font-medium">3</span>
                      </div>
                      Post-treatment
                    </h4>
                    <div className="bg-lea-pearl-white p-4 rounded-lg">
                      <p className="text-lea-deep-charcoal whitespace-pre-line">{selectedProtocol.posttreatment}</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="safety" className="p-6 space-y-6">
                {selectedProtocol.contraindications && (
                  <div>
                    <h4 className="font-medium text-lea-deep-charcoal mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      Contraindications
                    </h4>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <p className="text-red-800 whitespace-pre-line">{selectedProtocol.contraindications}</p>
                    </div>
                  </div>
                )}

                {selectedProtocol.complications && (
                  <div>
                    <h4 className="font-medium text-lea-deep-charcoal mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      Potential Complications
                    </h4>
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                      <p className="text-orange-800 whitespace-pre-line">{selectedProtocol.complications}</p>
                    </div>
                  </div>
                )}

                {selectedProtocol.safetyNotes && (
                  <div>
                    <h4 className="font-medium text-lea-deep-charcoal mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-lea-clinical-blue" />
                      Safety Notes
                    </h4>
                    <div className="bg-lea-clinical-blue/5 border border-lea-clinical-blue/20 p-4 rounded-lg">
                      <p className="text-lea-deep-charcoal whitespace-pre-line">{selectedProtocol.safetyNotes}</p>
                    </div>
                  </div>
                )}

                {selectedProtocol.clinicalNotes && (
                  <div>
                    <h4 className="font-medium text-lea-deep-charcoal mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-lea-charcoal-grey" />
                      Clinical Notes
                    </h4>
                    <div className="bg-lea-pearl-white p-4 rounded-lg">
                      <p className="text-lea-deep-charcoal whitespace-pre-line">{selectedProtocol.clinicalNotes}</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="equipment" className="p-6 space-y-6">
                {selectedProtocol.equipment && (
                  <div>
                    <h4 className="font-medium text-lea-deep-charcoal mb-3">Equipment Required</h4>
                    <div className="bg-lea-pearl-white p-4 rounded-lg">
                      <p className="text-lea-deep-charcoal whitespace-pre-line">{selectedProtocol.equipment}</p>
                    </div>
                  </div>
                )}

                {selectedProtocol.products && (
                  <div>
                    <h4 className="font-medium text-lea-deep-charcoal mb-3">Products Required</h4>
                    <div className="bg-lea-pearl-white p-4 rounded-lg">
                      <p className="text-lea-deep-charcoal whitespace-pre-line">{selectedProtocol.products}</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="aftercare" className="p-6">
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-lea-charcoal-grey mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">
                    Aftercare Instructions
                  </h3>
                  <p className="text-lea-charcoal-grey mb-4">
                    Detailed aftercare instructions will be displayed here
                  </p>
                  <Button className="bg-lea-clinical-blue hover:bg-blue-700">
                    Generate Aftercare PDF
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal">Treatment Protocols</h2>
          <p className="text-lea-charcoal-grey">Comprehensive treatment procedures and clinical guidelines</p>
        </div>
        <Button 
          onClick={handleAddNew}
          className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Protocol
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-lea-elegant-silver/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-lea-elegant-silver" />
              </div>
              <div>
                <p className="text-sm text-lea-charcoal-grey">Total Protocols</p>
                <p className="text-xl font-bold text-lea-deep-charcoal">
                  {protocols.length}
                </p>
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
                  {protocols.filter(p => p.status === 'active').length}
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
                <p className="text-sm text-lea-charcoal-grey">Advanced</p>
                <p className="text-xl font-bold text-lea-deep-charcoal">
                  {protocols.filter(p => p.difficulty === 'advanced').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-lea-charcoal-grey">Avg Duration</p>
                <p className="text-xl font-bold text-lea-deep-charcoal">
                  {protocols.length > 0 
                    ? Math.round(protocols.reduce((sum, p) => sum + p.duration, 0) / protocols.length)
                    : 0
                  }m
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
            placeholder="Search protocols by name or description..."
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
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
          <SelectTrigger className="w-full sm:w-[140px] border-lea-silver-grey">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
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

      {/* Protocols Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProtocols.map((protocol) => (
          <Card key={protocol.id} className="bg-lea-platinum-white border-lea-silver-grey hover:shadow-lea-card-hover transition-all duration-200 cursor-pointer"
                onClick={() => {
                  setSelectedProtocol(protocol);
                  setViewMode("detail");
                }}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2">
                  {getDifficultyBadge(protocol.difficulty)}
                  {getStatusBadge(protocol.status)}
                </div>
                <div className="text-xs text-lea-charcoal-grey">
                  v{protocol.version}
                </div>
              </div>
              <CardTitle className="text-lea-deep-charcoal font-serif text-lg">
                {protocol.name}
              </CardTitle>
              <p className="text-sm text-lea-charcoal-grey line-clamp-2">
                {protocol.description}
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between items-center text-sm text-lea-charcoal-grey mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {protocol.duration}min
                </span>
                <span>{protocol.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(protocol);
                    }}
                    className="text-lea-elegant-silver hover:bg-lea-elegant-silver/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(protocol);
                    }}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProtocol(protocol);
                    setViewMode("detail");
                  }}
                  className="text-lea-clinical-blue hover:bg-lea-clinical-blue/10"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProtocols.length === 0 && (
        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-lea-charcoal-grey mx-auto mb-4" />
            <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">
              No protocols found
            </h3>
            <p className="text-lea-charcoal-grey mb-4">
              {searchTerm || filterCategory !== 'all' || filterDifficulty !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first treatment protocol to get started'
              }
            </p>
            {!searchTerm && filterCategory === 'all' && filterDifficulty === 'all' && filterStatus === 'all' && (
              <Button onClick={handleAddNew} className="bg-lea-deep-charcoal hover:bg-lea-elegant-charcoal">
                <Plus className="w-4 h-4 mr-2" />
                Create First Protocol
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Protocol Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lea-deep-charcoal font-serif">
              {editingProtocol ? "Edit Protocol" : "Create New Protocol"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Protocol Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., Advanced Hydrating Facial Protocol"
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
                    {categories.map((category) => (
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
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  {...register("duration", { valueAsNumber: true })}
                  placeholder="60"
                  className="border-lea-silver-grey"
                />
                {errors.duration && (
                  <p className="text-sm text-red-500 mt-1">{errors.duration.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty *</Label>
                <Select onValueChange={(value: any) => setValue("difficulty", value)}>
                  <SelectTrigger className="border-lea-silver-grey">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Brief description of the protocol..."
                rows={2}
                className="border-lea-silver-grey"
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            <Tabs defaultValue="procedure" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="procedure">Procedure</TabsTrigger>
                <TabsTrigger value="safety">Safety</TabsTrigger>
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
                <TabsTrigger value="clinical">Clinical</TabsTrigger>
              </TabsList>

              <TabsContent value="procedure" className="space-y-4">
                <div>
                  <Label htmlFor="pretreatment">Pre-treatment Preparation</Label>
                  <Textarea
                    id="pretreatment"
                    {...register("pretreatment")}
                    placeholder="Steps to take before the main procedure..."
                    rows={3}
                    className="border-lea-silver-grey"
                  />
                </div>

                <div>
                  <Label htmlFor="procedure">Main Procedure *</Label>
                  <Textarea
                    id="procedure"
                    {...register("procedure")}
                    placeholder="Step-by-step procedure instructions..."
                    rows={6}
                    className="border-lea-silver-grey"
                  />
                  {errors.procedure && (
                    <p className="text-sm text-red-500 mt-1">{errors.procedure.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="posttreatment">Post-treatment Care</Label>
                  <Textarea
                    id="posttreatment"
                    {...register("posttreatment")}
                    placeholder="Steps to take after the procedure..."
                    rows={3}
                    className="border-lea-silver-grey"
                  />
                </div>
              </TabsContent>

              <TabsContent value="safety" className="space-y-4">
                <div>
                  <Label htmlFor="contraindications">Contraindications</Label>
                  <Textarea
                    id="contraindications"
                    {...register("contraindications")}
                    placeholder="Conditions or situations where this treatment should not be performed..."
                    rows={3}
                    className="border-lea-silver-grey"
                  />
                </div>

                <div>
                  <Label htmlFor="complications">Potential Complications</Label>
                  <Textarea
                    id="complications"
                    {...register("complications")}
                    placeholder="Possible adverse reactions and complications..."
                    rows={3}
                    className="border-lea-silver-grey"
                  />
                </div>

                <div>
                  <Label htmlFor="safetyNotes">Safety Notes</Label>
                  <Textarea
                    id="safetyNotes"
                    {...register("safetyNotes")}
                    placeholder="Critical safety information and warnings..."
                    rows={3}
                    className="border-lea-silver-grey"
                  />
                </div>
              </TabsContent>

              <TabsContent value="equipment" className="space-y-4">
                <div>
                  <Label htmlFor="equipment">Equipment Required</Label>
                  <Textarea
                    id="equipment"
                    {...register("equipment")}
                    placeholder="List all equipment and tools needed..."
                    rows={3}
                    className="border-lea-silver-grey"
                  />
                </div>

                <div>
                  <Label htmlFor="products">Products Required</Label>
                  <Textarea
                    id="products"
                    {...register("products")}
                    placeholder="List all products and consumables needed..."
                    rows={3}
                    className="border-lea-silver-grey"
                  />
                </div>
              </TabsContent>

              <TabsContent value="clinical" className="space-y-4">
                <div>
                  <Label htmlFor="clinicalNotes">Clinical Notes</Label>
                  <Textarea
                    id="clinicalNotes"
                    {...register("clinicalNotes")}
                    placeholder="Important clinical observations and documentation requirements..."
                    rows={4}
                    className="border-lea-silver-grey"
                  />
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
                {isSubmitting ? "Saving..." : editingProtocol ? "Update Protocol" : "Create Protocol"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
