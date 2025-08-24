import { useState, useCallback, useEffect } from "react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Search, Plus, Edit, Trash2, Clock, DollarSign, Users, Award, FileText, Activity } from "lucide-react";

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

interface TreatmentsManagementProps {
  className?: string;
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

export default function TreatmentsManagement({ className }: TreatmentsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterAudience, setFilterAudience] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load treatments from API
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await fetch('/api/treatments');
        const data = await response.json();
        setTreatments(data.treatments || []);
      } catch (error) {
        console.error('Error fetching treatments:', error);
        setTreatments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  const createTreatmentMutation = useMutation({
    mutationFn: async (data: TreatmentFormData) => {
      const response = await fetch('/api/treatments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create treatment');
      return response.json();
    },
    onSuccess: (result) => {
      setTreatments(prev => [...prev, result.treatment]);
      toast({
        title: "Success",
        description: "Treatment created successfully",
      });
      setIsDialogOpen(false);
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

  const updateTreatmentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TreatmentFormData }) => {
      const response = await fetch(`/api/treatments?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update treatment');
      return response.json();
    },
    onSuccess: (result) => {
      setTreatments(prev => prev.map(t => t.id === result.treatment.id ? result.treatment : t));
      toast({
        title: "Success",
        description: "Treatment updated successfully",
      });
      setIsDialogOpen(false);
      setEditingTreatment(null);
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

  const deleteTreatmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/treatments?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete treatment');
      return response.json();
    },
    onSuccess: (_, id) => {
      setTreatments(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Success",
        description: "Treatment deleted successfully",
      });
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
    formState: { errors, isSubmitting },
  } = useForm<TreatmentFormData>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      targetAudience: "client",
      price: 0,
      duration: 60,
    },
  });

  // Filter treatments
  const filteredTreatments = treatments.filter((treatment) => {
    const matchesSearch = !searchTerm || 
      treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || treatment.category === filterCategory;
    const matchesAudience = filterAudience === "all" || treatment.targetAudience === filterAudience;
    
    return matchesSearch && matchesCategory && matchesAudience;
  });

  const onSubmit = useCallback((data: TreatmentFormData) => {
    if (editingTreatment) {
      updateTreatmentMutation.mutate({ id: editingTreatment.id, data });
    } else {
      createTreatmentMutation.mutate(data);
    }
  }, [editingTreatment, createTreatmentMutation, updateTreatmentMutation]);

  const handleEdit = useCallback((treatment: Treatment) => {
    setEditingTreatment(treatment);
    reset({
      name: treatment.name,
      category: treatment.category,
      description: treatment.description,
      price: treatment.price,
      duration: treatment.duration,
      targetAudience: treatment.targetAudience,
      requirements: treatment.requirements || "",
      aftercare: treatment.aftercare || "",
      contraindications: treatment.contraindications || "",
      equipment: treatment.equipment || "",
    });
    setIsDialogOpen(true);
  }, [reset]);

  const handleDelete = useCallback((treatment: Treatment) => {
    if (window.confirm(`Are you sure you want to delete "${treatment.name}"?`)) {
      deleteTreatmentMutation.mutate(treatment.id);
    }
  }, [deleteTreatmentMutation]);

  const handleAddNew = useCallback(() => {
    setEditingTreatment(null);
    reset({
      name: "",
      category: "",
      description: "",
      price: 0,
      duration: 60,
      targetAudience: "client",
      requirements: "",
      aftercare: "",
      contraindications: "",
      equipment: "",
    });
    setIsDialogOpen(true);
  }, [reset]);

  const getAudienceBadge = (audience: string) => {
    switch (audience) {
      case 'client':
        return <Badge variant="secondary">Clients</Badge>;
      case 'practitioner':
        return <Badge variant="default" className="bg-lea-clinical-blue">Training</Badge>;
      case 'both':
        return <Badge variant="outline">Both</Badge>;
      default:
        return <Badge variant="outline">{audience}</Badge>;
    }
  };

  // Stats calculations
  const totalTreatments = treatments.length;
  const clientServices = treatments.filter(t => t.targetAudience === "client").length;
  const trainingCourses = treatments.filter(t => t.targetAudience === "practitioner").length;
  const totalValue = treatments.reduce((sum, t) => sum + t.price, 0);
  const averageDuration = treatments.length > 0 
    ? Math.round(treatments.reduce((sum, t) => sum + t.duration, 0) / treatments.length)
    : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal">Treatments Management</h2>
          <p className="text-lea-charcoal-grey">Manage your treatment protocols and procedures</p>
        </div>
        <Button 
          onClick={handleAddNew}
          className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Treatment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-lea-elegant-silver/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-lea-elegant-silver" />
              </div>
              <div>
                <p className="text-sm text-lea-charcoal-grey">Total</p>
                <p className="text-xl font-bold text-lea-deep-charcoal" data-testid="total-treatments">
                  {totalTreatments}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-lea-clinical-blue/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-lea-clinical-blue" />
              </div>
              <div>
                <p className="text-sm text-lea-charcoal-grey">Client Services</p>
                <p className="text-xl font-bold text-lea-deep-charcoal" data-testid="client-services">
                  {clientServices}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-lea-charcoal-grey">Training</p>
                <p className="text-xl font-bold text-lea-deep-charcoal" data-testid="training-courses">
                  {trainingCourses}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-lea-charcoal-grey">Total Value</p>
                <p className="text-xl font-bold text-lea-deep-charcoal" data-testid="total-value">
                  £{totalValue.toLocaleString()}
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
                <p className="text-xl font-bold text-lea-deep-charcoal" data-testid="avg-duration">
                  {averageDuration}m
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
            placeholder="Search treatments by name or description..."
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
        <Select value={filterAudience} onValueChange={setFilterAudience}>
          <SelectTrigger className="w-full sm:w-[150px] border-lea-silver-grey">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="client">Clients</SelectItem>
            <SelectItem value="practitioner">Training</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Treatments Table */}
      <Card className="bg-lea-platinum-white border-lea-silver-grey">
        <CardHeader>
          <CardTitle className="text-lea-deep-charcoal font-serif">Treatment Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin w-8 h-8 border-4 border-lea-elegant-silver border-t-lea-deep-charcoal rounded-full" />
            </div>
          ) : filteredTreatments.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-lea-charcoal-grey mx-auto mb-4" />
              <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">
                {searchTerm || filterCategory !== 'all' || filterAudience !== 'all' 
                  ? 'No treatments found' 
                  : 'No treatments yet'
                }
              </h3>
              <p className="text-lea-charcoal-grey mb-4">
                {searchTerm || filterCategory !== 'all' || filterAudience !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Add your first treatment to get started'
                }
              </p>
              {!searchTerm && filterCategory === 'all' && filterAudience === 'all' && (
                <Button onClick={handleAddNew} className="bg-lea-deep-charcoal hover:bg-lea-elegant-charcoal">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Treatment
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Treatment</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTreatments.map((treatment) => (
                    <TableRow key={treatment.id} className="hover:bg-lea-pearl-white">
                      <TableCell>
                        <div>
                          <p className="font-medium text-lea-deep-charcoal">{treatment.name}</p>
                          <p className="text-sm text-lea-charcoal-grey line-clamp-2 mt-1">
                            {treatment.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-lea-charcoal-grey">{treatment.category}</span>
                      </TableCell>
                      <TableCell>
                        {getAudienceBadge(treatment.targetAudience)}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-lea-deep-charcoal">
                          £{treatment.price}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-lea-charcoal-grey">{treatment.duration}m</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedTreatment(treatment)}
                            className="text-lea-clinical-blue hover:bg-lea-clinical-blue/10"
                          >
                            <i className="fas fa-eye w-4 h-4"></i>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(treatment)}
                            className="text-lea-elegant-silver hover:bg-lea-elegant-silver/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(treatment)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Treatment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lea-deep-charcoal font-serif">
              {editingTreatment ? "Edit Treatment" : "Add New Treatment"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Treatment Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., Advanced Hydrating Facial"
                  className="border-lea-silver-grey"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>
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
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Detailed description of the treatment..."
                rows={3}
                className="border-lea-silver-grey"
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price (£) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="border-lea-silver-grey"
                />
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
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
                <Label htmlFor="targetAudience">Target Audience *</Label>
                <Select onValueChange={(value: any) => setValue("targetAudience", value)}>
                  <SelectTrigger className="border-lea-silver-grey">
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
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                {...register("requirements")}
                placeholder="e.g., Level 3 Beauty Therapy qualification"
                rows={2}
                className="border-lea-silver-grey"
              />
            </div>

            <div>
              <Label htmlFor="aftercare">Aftercare Instructions</Label>
              <Textarea
                id="aftercare"
                {...register("aftercare")}
                placeholder="Post-treatment care instructions..."
                rows={3}
                className="border-lea-silver-grey"
              />
            </div>

            <div>
              <Label htmlFor="contraindications">Contraindications</Label>
              <Textarea
                id="contraindications"
                {...register("contraindications")}
                placeholder="Conditions or situations where treatment should be avoided..."
                rows={3}
                className="border-lea-silver-grey"
              />
            </div>

            <div>
              <Label htmlFor="equipment">Equipment Required</Label>
              <Textarea
                id="equipment"
                {...register("equipment")}
                placeholder="List of equipment and supplies needed..."
                rows={2}
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
                {isSubmitting ? "Saving..." : editingTreatment ? "Update Treatment" : "Add Treatment"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
