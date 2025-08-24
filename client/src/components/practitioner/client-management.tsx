import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Client, InsertClient } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { Search, Plus, User, Calendar as CalendarIcon, Phone, Mail, FileText, Edit, Trash2 } from "lucide-react";

const clientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  dateOfBirth: z.date().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  currentMedications: z.string().optional(),
  ageVerified: z.boolean().default(false),
  consentStatus: z.enum(["pending", "signed", "expired"]).default("pending"),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientManagementProps {
  className?: string;
}

export default function ClientManagement({ className }: ClientManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const createClientMutation = useMutation({
    mutationFn: async (data: ClientFormData) => {
      const response = await apiRequest("POST", "/api/clients", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Success",
        description: "Client created successfully",
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

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ClientFormData> }) => {
      const response = await apiRequest("PUT", `/api/clients/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Success",
        description: "Client updated successfully",
      });
      setIsDialogOpen(false);
      setEditingClient(null);
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

  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/clients/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Success",
        description: "Client deleted successfully",
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
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  // Filter clients based on search and status
  const filteredClients = clients.filter((client: any) => {
    const matchesSearch = !searchTerm || 
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || client.consentStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const onSubmit = useCallback((data: ClientFormData) => {
    if (editingClient) {
      updateClientMutation.mutate({ id: editingClient.id, data });
    } else {
      createClientMutation.mutate(data);
    }
  }, [editingClient, createClientMutation, updateClientMutation]);

  const handleEdit = useCallback((client: Client) => {
    setEditingClient(client);
    reset({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone || "",
      dateOfBirth: client.dateOfBirth ? new Date(client.dateOfBirth) : undefined,
      medicalHistory: client.medicalHistory || "",
      allergies: client.allergies || "",
      currentMedications: client.currentMedications || "",
      ageVerified: client.ageVerified,
      consentStatus: client.consentStatus as "pending" | "signed" | "expired",
    });
    setIsDialogOpen(true);
  }, [reset]);

  const handleDelete = useCallback((client: Client) => {
    if (window.confirm(`Are you sure you want to delete ${client.firstName} ${client.lastName}?`)) {
      deleteClientMutation.mutate(client.id);
    }
  }, [deleteClientMutation]);

  const handleAddNew = useCallback(() => {
    setEditingClient(null);
    reset({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      medicalHistory: "",
      allergies: "",
      currentMedications: "",
      ageVerified: false,
      consentStatus: "pending",
    });
    setIsDialogOpen(true);
  }, [reset]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  // Stats calculations
  const totalClients = clients.length;
  const newThisMonth = clients.filter((client: any) => {
    const clientDate = new Date(client.createdAt);
    const now = new Date();
    return clientDate.getMonth() === now.getMonth() && clientDate.getFullYear() === now.getFullYear();
  }).length;
  const pendingConsent = clients.filter((client: any) => client.consentStatus === 'pending').length;
  const ageVerified = clients.filter((client: any) => client.ageVerified).length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal">Client Management</h2>
          <p className="text-lea-charcoal-grey">Manage your client database and records</p>
        </div>
        <Button 
          onClick={handleAddNew}
          className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Client
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-lea-clinical-blue/10 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-lea-clinical-blue" />
              </div>
              <div>
                <p className="text-sm text-lea-charcoal-grey">Total Clients</p>
                <p className="text-xl font-bold text-lea-deep-charcoal" data-testid="total-clients">
                  {totalClients}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-lea-charcoal-grey">New This Month</p>
                <p className="text-xl font-bold text-lea-deep-charcoal" data-testid="new-clients">
                  {newThisMonth}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-lea-charcoal-grey">Pending Consent</p>
                <p className="text-xl font-bold text-lea-deep-charcoal" data-testid="pending-consent">
                  {pendingConsent}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-lea-elegant-silver/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-shield-alt text-lea-elegant-silver"></i>
              </div>
              <div>
                <p className="text-sm text-lea-charcoal-grey">Age Verified</p>
                <p className="text-xl font-bold text-lea-deep-charcoal" data-testid="age-verified">
                  {ageVerified}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lea-charcoal-grey w-4 h-4" />
          <Input
            placeholder="Search clients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-lea-silver-grey focus:border-lea-clinical-blue"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px] border-lea-silver-grey">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="signed">Signed</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Client Table */}
      <Card className="bg-lea-platinum-white border-lea-silver-grey">
        <CardHeader>
          <CardTitle className="text-lea-deep-charcoal font-serif">Client Database</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin w-8 h-8 border-4 border-lea-elegant-silver border-t-lea-deep-charcoal rounded-full" />
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-lea-charcoal-grey mx-auto mb-4" />
              <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No clients found' : 'No clients yet'}
              </h3>
              <p className="text-lea-charcoal-grey mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Add your first client to get started'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button onClick={handleAddNew} className="bg-lea-deep-charcoal hover:bg-lea-elegant-charcoal">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Client
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Consent Status</TableHead>
                    <TableHead>Age Verified</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client: any) => (
                    <TableRow key={client.id} className="hover:bg-lea-pearl-white">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-lea-clinical-blue rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-lea-deep-charcoal">
                              {client.firstName} {client.lastName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1 text-sm">
                            <Mail className="w-3 h-3 text-lea-charcoal-grey" />
                            <span className="text-lea-charcoal-grey">{client.email}</span>
                          </div>
                          {client.phone && (
                            <div className="flex items-center space-x-1 text-sm">
                              <Phone className="w-3 h-3 text-lea-charcoal-grey" />
                              <span className="text-lea-charcoal-grey">{client.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-lea-charcoal-grey">
                          {formatDate(client.dateOfBirth)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(client.consentStatus)}>
                          {client.consentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {client.ageVerified ? (
                          <i className="fas fa-check-circle text-green-600"></i>
                        ) : (
                          <i className="fas fa-exclamation-triangle text-yellow-600"></i>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-lea-charcoal-grey text-sm">
                          {formatDate(client.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedClient(client)}
                            className="text-lea-clinical-blue hover:bg-lea-clinical-blue/10"
                          >
                            <i className="fas fa-eye w-4 h-4"></i>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(client)}
                            className="text-lea-elegant-silver hover:bg-lea-elegant-silver/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(client)}
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

      {/* Add/Edit Client Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lea-deep-charcoal font-serif">
              {editingClient ? "Edit Client" : "Add New Client"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  className="border-lea-silver-grey"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  className="border-lea-silver-grey"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="border-lea-silver-grey"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  className="border-lea-silver-grey"
                />
              </div>
            </div>

            <div>
              <Label>Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-lea-silver-grey"
                  >
                    {watch("dateOfBirth") ? format(watch("dateOfBirth"), "PPP") : "Select date"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={watch("dateOfBirth")}
                    onSelect={(date) => setValue("dateOfBirth", date)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                {...register("medicalHistory")}
                rows={3}
                className="border-lea-silver-grey"
                placeholder="Any relevant medical history, conditions, or concerns..."
              />
            </div>

            <div>
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                {...register("allergies")}
                rows={2}
                className="border-lea-silver-grey"
                placeholder="Any known allergies or sensitivities..."
              />
            </div>

            <div>
              <Label htmlFor="currentMedications">Current Medications</Label>
              <Textarea
                id="currentMedications"
                {...register("currentMedications")}
                rows={2}
                className="border-lea-silver-grey"
                placeholder="Current medications and dosages..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="consentStatus">Consent Status</Label>
                <Select onValueChange={(value: any) => setValue("consentStatus", value)}>
                  <SelectTrigger className="border-lea-silver-grey">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="signed">Signed</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <input
                  type="checkbox"
                  id="ageVerified"
                  {...register("ageVerified")}
                  className="rounded border-lea-silver-grey"
                />
                <Label htmlFor="ageVerified" className="text-sm">
                  Age verified in person
                </Label>
              </div>
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
                {isSubmitting ? "Saving..." : editingClient ? "Update Client" : "Add Client"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
