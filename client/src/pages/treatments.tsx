import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { format, parseISO } from "date-fns";
import {
  Plus,
  Pencil,
  Trash2,
  DollarSign,
  Clock,
  Users,
  Award,
  Search,
  Filter,
  Eye,
  Edit,
  RefreshCw,
  Download,
  Star,
  TrendingUp,
  Activity,
  FileText,
  Heart,
  Shield
} from "lucide-react";

const treatmentSchema = z.object({
  name: z.string().min(1, "Treatment name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be non-negative"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  targetAudience: z.enum(["client", "practitioner", "both"]),
  requirements: z.string().optional(),
  aftercare: z.string().optional(),
  contraindications: z.string().optional(),
  equipment: z.string().optional(),
});

type TreatmentFormData = z.infer<typeof treatmentSchema>;

interface Treatment {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  targetAudience: "client" | "practitioner" | "both";
  requirements?: string;
  aftercare?: string;
  contraindications?: string;
  equipment?: string;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  "Facial Treatments",
  "Body Treatments", 
  "Chemical Peels",
  "Microneedling",
  "Laser Treatments",
  "Injectable Treatments",
  "Training Courses",
  "Assessment Services",
  "Consultation Services"
];

export default function Treatments() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [showTreatmentDetails, setShowTreatmentDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [audienceFilter, setAudienceFilter] = useState<string>("all");
  const [activeView, setActiveView] = useState<"grid" | "table">("grid");
  
  // Fetch treatments
  const { data: treatments = [], isLoading, refetch: refetchTreatments } = useQuery<Treatment[]>({
    queryKey: ["/api/treatments"],
    enabled: isAuthenticated,
  });
  
  // Create/Update mutations
  const createTreatmentMutation = useMutation({
    mutationFn: async (data: TreatmentFormData) => {
      const response = await apiRequest('POST', '/api/treatments', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/treatments"] });
      toast({ title: "Success", description: "Treatment created successfully" });
      setIsDialogOpen(false);
      reset();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
  
  const updateTreatmentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TreatmentFormData }) => {
      const response = await apiRequest('PUT', `/api/treatments/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/treatments"] });
      toast({ title: "Success", description: "Treatment updated successfully" });
      setIsDialogOpen(false);
      setEditingTreatment(null);
      reset();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
  
  const deleteTreatmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/treatments/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/treatments"] });
      toast({ title: "Success", description: "Treatment deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TreatmentFormData>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      targetAudience: "client",
      price: 0,
      duration: 60,
    },
  });

  // Filter treatments
  const filteredTreatments = treatments.filter(treatment => {
    const matchesSearch = !searchTerm || 
      treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || treatment.category === categoryFilter;
    const matchesAudience = audienceFilter === "all" || treatment.targetAudience === audienceFilter;
    
    return matchesSearch && matchesCategory && matchesAudience;
  });

  const onSubmit = (data: TreatmentFormData) => {
    if (editingTreatment) {
      updateTreatmentMutation.mutate({ id: editingTreatment.id, data });
    } else {
      createTreatmentMutation.mutate(data);
    }
  };

  const handleEdit = (treatment: Treatment) => {
    setEditingTreatment(treatment);
    // Set form values for editing
    Object.entries(treatment).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
        setValue(key as keyof TreatmentFormData, value);
      }
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this treatment?")) {
      deleteTreatmentMutation.mutate(id);
    }
  };

  const handleAddNew = useCallback(() => {
    setEditingTreatment(null);
    reset({
      name: "",
      category: "",
      description: "",
      targetAudience: "client",
      price: 0,
      duration: 60,
      requirements: "",
      aftercare: "",
      contraindications: "",
      equipment: "",
    });
    setIsDialogOpen(true);
  }, [reset]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-lea-deep-charcoal mb-2">Treatments & Services</h1>
          <p className="text-lea-charcoal-grey">Manage your clinic services and training courses</p>
        </div>
        <Button onClick={handleAddNew} className="bg-lea-deep-charcoal hover:bg-lea-elegant-charcoal">
          <Plus className="w-4 h-4 mr-2" />
          Add Treatment
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-lea-elegant-silver rounded-lg mr-4">
              <Users className="w-6 h-6 text-lea-deep-charcoal" />
            </div>
            <div>
              <p className="text-2xl font-bold text-lea-deep-charcoal">
                {treatments.filter(t => t.targetAudience === "client").length}
              </p>
              <p className="text-sm text-lea-charcoal-grey">Client Services</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-lea-clinical-blue rounded-lg mr-4">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-lea-deep-charcoal">
                {treatments.filter(t => t.targetAudience === "practitioner").length}
              </p>
              <p className="text-sm text-lea-charcoal-grey">Training Courses</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-lea-deep-charcoal">
                £{treatments.reduce((sum, t) => sum + t.price, 0).toLocaleString()}
              </p>
              <p className="text-sm text-lea-charcoal-grey">Total Value</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mr-4">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-lea-deep-charcoal">
                {Math.round(treatments.reduce((sum, t) => sum + t.duration, 0) / treatments.length || 0)}m
              </p>
              <p className="text-sm text-lea-charcoal-grey">Avg Duration</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Treatments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Treatments & Courses</CardTitle>
          <CardDescription>
            Manage your complete service catalog including treatments and training programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {treatments.map((treatment) => (
                <TableRow key={treatment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{treatment.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {treatment.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{treatment.category}</TableCell>
                  <TableCell>
                    <Badge variant={treatment.targetAudience === "client" ? "secondary" : 
                                  treatment.targetAudience === "practitioner" ? "default" : "outline"}>
                      {treatment.targetAudience === "client" ? "Clients" : 
                       treatment.targetAudience === "practitioner" ? "Training" : "Both"}
                    </Badge>
                  </TableCell>
                  <TableCell>£{treatment.price}</TableCell>
                  <TableCell>{treatment.duration}m</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(treatment)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(treatment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTreatment ? "Edit Treatment" : "Add New Treatment"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Treatment Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., Advanced Hydrating Facial"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger>
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
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Detailed description of the treatment..."
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price (£)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  {...register("duration", { valueAsNumber: true })}
                  placeholder="60"
                />
                {errors.duration && (
                  <p className="text-sm text-red-500 mt-1">{errors.duration.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Select onValueChange={(value: any) => setValue("targetAudience", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Clients</SelectItem>
                    <SelectItem value="practitioner">Training</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="requirements">Requirements (Optional)</Label>
              <Textarea
                id="requirements"
                {...register("requirements")}
                placeholder="e.g., Level 3 Beauty Therapy qualification"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="aftercare">Aftercare Instructions (Optional)</Label>
              <Textarea
                id="aftercare"
                {...register("aftercare")}
                placeholder="Post-treatment care instructions..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="contraindications">Contraindications (Optional)</Label>
              <Textarea
                id="contraindications"
                {...register("contraindications")}
                placeholder="Conditions or situations where treatment should be avoided..."
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createTreatmentMutation.isPending || updateTreatmentMutation.isPending}
                className="bg-lea-deep-charcoal hover:bg-lea-elegant-charcoal"
              >
                {(createTreatmentMutation.isPending || updateTreatmentMutation.isPending) ? "Saving..." : editingTreatment ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
