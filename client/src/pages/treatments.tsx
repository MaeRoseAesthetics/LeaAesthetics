import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, DollarSign, Clock, Users, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";

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
  const { user, isAuthenticated } = useAuth();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    const mockTreatments: Treatment[] = [
      {
        id: "1",
        name: "Advanced Hydrating Facial",
        category: "Facial Treatments",
        description: "A deeply nourishing facial treatment using premium serums and advanced techniques to restore skin hydration and luminosity.",
        price: 120,
        duration: 90,
        targetAudience: "client",
        aftercare: "Avoid direct sunlight for 24 hours. Apply provided SPF daily.",
        contraindications: "Active skin infections, recent chemical peels",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Chemical Peel Certification Course",
        category: "Training Courses",
        description: "Comprehensive 3-day certification course covering all aspects of chemical peel application, safety protocols, and client assessment.",
        price: 850,
        duration: 1440, // 24 hours over 3 days
        targetAudience: "practitioner",
        requirements: "Level 3 Beauty Therapy qualification",
        equipment: "Training models, peel solutions, safety equipment provided",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Microneedling Treatment",
        category: "Microneedling",
        description: "Professional microneedling treatment to improve skin texture, reduce scarring, and stimulate collagen production.",
        price: 200,
        duration: 75,
        targetAudience: "client",
        aftercare: "No makeup for 12 hours. Use provided healing serum twice daily.",
        contraindications: "Active acne, keloid scarring, blood thinning medications",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    setTreatments(mockTreatments);
    setIsLoading(false);
  }, []);

  const onSubmit = async (data: TreatmentFormData) => {
    setIsSubmitting(true);
    try {
      if (editingTreatment) {
        // Update existing treatment
        const updatedTreatment = {
          ...editingTreatment,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        setTreatments(prev => prev.map(t => t.id === editingTreatment.id ? updatedTreatment : t));
      } else {
        // Add new treatment
        const newTreatment: Treatment = {
          id: Date.now().toString(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setTreatments(prev => [...prev, newTreatment]);
      }
      
      setIsDialogOpen(false);
      setEditingTreatment(null);
      reset();
    } catch (error) {
      console.error("Error saving treatment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (treatment: Treatment) => {
    setEditingTreatment(treatment);
    reset(treatment);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this treatment?")) {
      setTreatments(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleAddNew = () => {
    setEditingTreatment(null);
    reset({
      targetAudience: "client",
      price: 0,
      duration: 60,
    });
    setIsDialogOpen(true);
  };

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
                disabled={isSubmitting}
                className="bg-lea-deep-charcoal hover:bg-lea-elegant-charcoal"
              >
                {isSubmitting ? "Saving..." : editingTreatment ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
