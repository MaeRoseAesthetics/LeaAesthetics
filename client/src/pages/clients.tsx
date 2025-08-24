import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Client } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { format, addDays, parseISO, differenceInYears } from "date-fns";
import {
  User,
  Users,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  MapPin,
  Shield,
  FileText,
  Camera,
  MessageSquare,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Download,
  Activity,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Heart,
  Star,
  UserCheck
} from "lucide-react";

const clientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(1, "Address is required"),
  emergencyContact: z.string().min(1, "Emergency contact is required"),
  emergencyPhone: z.string().min(1, "Emergency phone is required"),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  currentMedications: z.string().optional(),
  skinType: z.enum(["dry", "oily", "combination", "sensitive", "normal"]).optional(),
  skinConcerns: z.string().optional(),
  previousTreatments: z.string().optional(),
  contraindications: z.string().optional(),
  preferredPractitioner: z.string().optional(),
  communicationPreferences: z.array(z.enum(["email", "sms", "phone", "post"])).optional(),
  marketingConsent: z.boolean().optional(),
  notes: z.string().optional(),
});

interface ExtendedClient extends Client {
  age?: number;
  totalTreatments?: number;
  lastTreatment?: string;
  nextAppointment?: string;
  totalSpent?: number;
  riskLevel?: "low" | "medium" | "high";
  tags?: string[];
}

interface TreatmentHistory {
  id: string;
  clientId: string;
  treatmentName: string;
  date: string;
  practitioner: string;
  notes?: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  amount: number;
  status: "completed" | "scheduled" | "cancelled";
}

interface Communication {
  id: string;
  clientId: string;
  type: "email" | "sms" | "call" | "appointment" | "note";
  subject: string;
  message: string;
  date: string;
  sentBy: string;
  status?: "sent" | "delivered" | "read" | "failed";
}

type ClientFormData = z.infer<typeof clientSchema>;

export default function Clients() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const [activeView, setActiveView] = useState<"grid" | "table">("grid");
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ExtendedClient | null>(null);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [editingClient, setEditingClient] = useState<ExtendedClient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  // Fetch data
  const { data: clients = [], isLoading: clientsLoading, refetch: refetchClients } = useQuery<ExtendedClient[]>({
    queryKey: ["/api/clients"],
    enabled: isAuthenticated,
  });

  const { data: treatmentHistory = [], isLoading: treatmentHistoryLoading } = useQuery<TreatmentHistory[]>({
    queryKey: ["/api/treatment-history"],
    enabled: isAuthenticated,
  });

  const { data: communications = [], isLoading: communicationsLoading } = useQuery<Communication[]>({
    queryKey: ["/api/client-communications"],
    enabled: isAuthenticated,
  });

  // Form handling
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

  // Mutations
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
      setShowClientDialog(false);
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

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = !searchTerm || 
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "verified" && client.ageVerified) ||
      (statusFilter === "consented" && client.consentStatus === "signed") ||
      (statusFilter === "new" && new Date(client.createdAt || '').getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const matchesRisk = riskFilter === "all" || client.riskLevel === riskFilter;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return null;
    return differenceInYears(new Date(), parseISO(dateOfBirth));
  };

  const handleAddClient = useCallback(() => {
    setEditingClient(null);
    reset();
    setShowClientDialog(true);
  }, [reset]);

  const onSubmit = (data: ClientFormData) => {
    createClientMutation.mutate(data);
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lea-pearl-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-lea-elegant-silver border-t-lea-deep-charcoal rounded-full" />
          <p className="text-lea-charcoal-grey font-medium">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lea-pearl-white">
      {/* Header */}
      <div className="bg-lea-platinum-white border-b border-lea-silver-grey">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-lea-deep-charcoal">
                Client Management
              </h1>
              <p className="text-lea-charcoal-grey mt-1">
                Complete CRM for managing client profiles, medical history, and treatments
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => refetchClients()}
                className="border-lea-silver-grey text-lea-charcoal-grey hover:bg-lea-pearl-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                className="border-lea-silver-grey text-lea-charcoal-grey hover:bg-lea-pearl-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Clients
              </Button>
              <Button
                onClick={handleAddClient}
                className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Client
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-lea-clinical-blue rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-lea-platinum-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-lea-charcoal-grey">Total Clients</p>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">{clients.length}</p>
                  <p className="text-xs text-lea-slate-grey">Active profiles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-lea-elegant-silver rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-lea-deep-charcoal" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-lea-charcoal-grey">Verified</p>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">
                    {clients.filter(c => c.ageVerified).length}
                  </p>
                  <p className="text-xs text-lea-slate-grey">Age verified</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-lea-charcoal-grey">Consented</p>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">
                    {clients.filter(c => c.consentStatus === 'signed').length}
                  </p>
                  <p className="text-xs text-lea-slate-grey">Signed consent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-lea-deep-charcoal rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-lea-platinum-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-lea-charcoal-grey">New This Month</p>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">
                    {clients.filter(c => new Date(c.createdAt || '').getMonth() === new Date().getMonth()).length}
                  </p>
                  <p className="text-xs text-lea-slate-grey">Recent additions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lea-charcoal-grey w-4 h-4" />
                  <Input
                    placeholder="Search clients by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Age Verified</SelectItem>
                    <SelectItem value="consented">Consented</SelectItem>
                    <SelectItem value="new">New Clients</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex bg-lea-platinum-white rounded-lg p-1 border border-lea-silver-grey">
                  <button
                    onClick={() => setActiveView('grid')}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeView === 'grid' 
                        ? 'bg-lea-elegant-silver text-lea-deep-charcoal shadow-sm' 
                        : 'text-lea-charcoal-grey hover:text-lea-deep-charcoal'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setActiveView('table')}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeView === 'table' 
                        ? 'bg-lea-elegant-silver text-lea-deep-charcoal shadow-sm' 
                        : 'text-lea-charcoal-grey hover:text-lea-deep-charcoal'
                    }`}
                  >
                    Table
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        {clientsLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-lea-elegant-silver border-t-lea-deep-charcoal rounded-full" />
          </div>
        ) : filteredClients.length === 0 ? (
          <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-lea-charcoal-grey mx-auto mb-4" />
              <h3 className="text-xl font-serif font-medium text-lea-deep-charcoal mb-2">
                {clients.length === 0 ? "No clients yet" : "No clients found"}
              </h3>
              <p className="text-lea-charcoal-grey mb-6">
                {clients.length === 0 
                  ? "Start building your client base by adding your first client profile"
                  : "Try adjusting your search criteria or filters"
                }
              </p>
              {clients.length === 0 && (
                <Button onClick={handleAddClient} className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Client
                </Button>
              )}
            </CardContent>
          </Card>
        ) : activeView === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-serif text-lea-deep-charcoal">
                      {client.firstName} {client.lastName}
                    </CardTitle>
                    <div className="flex items-center space-x-1">
                      {client.ageVerified && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {client.riskLevel && (
                        <Badge className={`${getRiskColor(client.riskLevel)} text-xs`}>
                          {client.riskLevel} risk
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-lea-charcoal-grey">
                      <Mail className="w-4 h-4 mr-2 text-lea-slate-grey" />
                      {client.email}
                    </div>
                    {client.phone && (
                      <div className="flex items-center text-lea-charcoal-grey">
                        <Phone className="w-4 h-4 mr-2 text-lea-slate-grey" />
                        {client.phone}
                      </div>
                    )}
                    {client.dateOfBirth && (
                      <div className="flex items-center text-lea-charcoal-grey">
                        <CalendarIcon className="w-4 h-4 mr-2 text-lea-slate-grey" />
                        Age: {getAge(client.dateOfBirth)} years
                      </div>
                    )}
                    <div className="flex items-center text-lea-charcoal-grey">
                      <User className="w-4 h-4 mr-2 text-lea-slate-grey" />
                      Client since {format(parseISO(client.createdAt || new Date().toISOString()), "MMM yyyy")}
                    </div>
                  </div>
                  
                  {/* Medical Alerts */}
                  {(client.medicalHistory || client.allergies) && (
                    <div className="mt-4 space-y-2">
                      {client.medicalHistory && (
                        <div className="p-2 bg-red-50 rounded-md border border-red-200">
                          <div className="flex items-center">
                            <AlertTriangle className="w-3 h-3 text-red-600 mr-1" />
                            <span className="text-xs font-medium text-red-800">Medical History</span>
                          </div>
                          <p className="text-xs text-red-700 mt-1 truncate">{client.medicalHistory}</p>
                        </div>
                      )}
                      {client.allergies && (
                        <div className="p-2 bg-yellow-50 rounded-md border border-yellow-200">
                          <div className="flex items-center">
                            <AlertTriangle className="w-3 h-3 text-yellow-600 mr-1" />
                            <span className="text-xs font-medium text-yellow-800">Allergies</span>
                          </div>
                          <p className="text-xs text-yellow-700 mt-1 truncate">{client.allergies}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between mt-6 pt-4 border-t border-lea-silver-grey">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedClient(client);
                        setShowClientDetails(true);
                      }}
                      className="border-lea-silver-grey text-lea-charcoal-grey hover:bg-lea-pearl-white"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-lea-silver-grey text-lea-charcoal-grey hover:bg-lea-pearl-white"
                    >
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      Book Treatment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif">Client Database</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-lea-deep-charcoal">
                              {client.firstName} {client.lastName}
                            </p>
                            <p className="text-sm text-lea-charcoal-grey">
                              ID: {client.id.slice(-8)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm text-lea-deep-charcoal">{client.email}</p>
                            <p className="text-sm text-lea-charcoal-grey">{client.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {client.dateOfBirth ? `${getAge(client.dateOfBirth)} years` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            {client.ageVerified && (
                              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs w-fit">
                                Verified
                              </Badge>
                            )}
                            <Badge className={`${client.consentStatus === 'signed' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-gray-100 text-gray-800 border-gray-200'} text-xs w-fit`}>
                              {client.consentStatus || 'pending'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {client.riskLevel && (
                            <Badge className={getRiskColor(client.riskLevel)}>
                              {client.riskLevel}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-lea-charcoal-grey">
                          {format(parseISO(client.createdAt || new Date().toISOString()), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedClient(client);
                                setShowClientDetails(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Client Form Dialog */}
      <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lea-deep-charcoal font-serif">
              {editingClient ? "Edit Client" : "Add New Client"}
            </DialogTitle>
            <DialogDescription>
              Complete client profile with comprehensive medical and treatment history
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[70vh] pr-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="medical">Medical</TabsTrigger>
                  <TabsTrigger value="skin">Skin Profile</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>
                  <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle>Add New Client</DialogTitle>
                      <DialogDescription>
                        Complete client profile with comprehensive medical and treatment history
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[70vh] pr-4">
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Tabs defaultValue="personal" className="w-full">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="personal">Personal</TabsTrigger>
                            <TabsTrigger value="medical">Medical</TabsTrigger>
                            <TabsTrigger value="skin">Skin Profile</TabsTrigger>
                            <TabsTrigger value="preferences">Preferences</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="personal" className="space-y-4 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="firstName">First Name *</Label>
                                <Input
                                  id="firstName"
                                  {...register("firstName")}
                                  data-testid="input-first-name"
                                />
                                {errors.firstName && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {errors.firstName.message}
                                  </p>
                                )}
                              </div>
                              <div>
                                <Label htmlFor="lastName">Last Name *</Label>
                                <Input
                                  id="lastName"
                                  {...register("lastName")}
                                  data-testid="input-last-name"
                                />
                                {errors.lastName && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {errors.lastName.message}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  {...register("email")}
                                  data-testid="input-email"
                                />
                                {errors.email && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {errors.email.message}
                                  </p>
                                )}
                              </div>
                              <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                  id="phone"
                                  {...register("phone")}
                                  data-testid="input-phone"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                <Input
                                  id="dateOfBirth"
                                  type="date"
                                  {...register("dateOfBirth")}
                                  data-testid="input-dob"
                                />
                              </div>
                              <div>
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                  id="address"
                                  {...register("address")}
                                  rows={2}
                                  data-testid="textarea-address"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                                <Input
                                  id="emergencyContact"
                                  {...register("emergencyContact")}
                                  data-testid="input-emergency-contact"
                                />
                              </div>
                              <div>
                                <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                                <Input
                                  id="emergencyPhone"
                                  {...register("emergencyPhone")}
                                  data-testid="input-emergency-phone"
                                />
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="medical" className="space-y-4 mt-4">
                            <div>
                              <Label htmlFor="medicalHistory">Medical History</Label>
                              <Textarea
                                id="medicalHistory"
                                {...register("medicalHistory")}
                                placeholder="Any relevant medical conditions, surgeries, or health issues..."
                                rows={3}
                                data-testid="textarea-medical-history"
                              />
                            </div>
                            <div>
                              <Label htmlFor="allergies">Known Allergies</Label>
                              <Textarea
                                id="allergies"
                                {...register("allergies")}
                                placeholder="Food allergies, medication allergies, environmental allergies..."
                                rows={2}
                                data-testid="textarea-allergies"
                              />
                            </div>
                            <div>
                              <Label htmlFor="currentMedications">Current Medications</Label>
                              <Textarea
                                id="currentMedications"
                                {...register("currentMedications")}
                                placeholder="List all current medications, supplements, and dosages..."
                                rows={3}
                                data-testid="textarea-medications"
                              />
                            </div>
                            <div>
                              <Label htmlFor="contraindications">Contraindications</Label>
                              <Textarea
                                id="contraindications"
                                {...register("contraindications")}
                                placeholder="Any conditions that would prevent certain treatments..."
                                rows={2}
                                data-testid="textarea-contraindications"
                              />
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="skin" className="space-y-4 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="skinType">Skin Type</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select skin type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="dry">Dry</SelectItem>
                                    <SelectItem value="oily">Oily</SelectItem>
                                    <SelectItem value="combination">Combination</SelectItem>
                                    <SelectItem value="sensitive">Sensitive</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="skinConcerns">Primary Skin Concerns</Label>
                                <Textarea
                                  id="skinConcerns"
                                  {...register("skinConcerns")}
                                  placeholder="Acne, aging, pigmentation, scarring, etc..."
                                  rows={2}
                                  data-testid="textarea-skin-concerns"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="previousTreatments">Previous Aesthetic Treatments</Label>
                              <Textarea
                                id="previousTreatments"
                                {...register("previousTreatments")}
                                placeholder="List any previous treatments, dates, and practitioners..."
                                rows={3}
                                data-testid="textarea-previous-treatments"
                              />
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="preferences" className="space-y-4 mt-4">
                            <div>
                              <Label htmlFor="preferredPractitioner">Preferred Practitioner</Label>
                              <Input
                                id="preferredPractitioner"
                                {...register("preferredPractitioner")}
                                data-testid="input-preferred-practitioner"
                              />
                            </div>
                            <div>
                              <Label htmlFor="communicationPreferences">Communication Preferences</Label>
                              <Textarea
                                id="communicationPreferences"
                                {...register("communicationPreferences")}
                                placeholder="Email, SMS, phone calls, appointment reminders..."
                                rows={2}
                                data-testid="textarea-communication"
                              />
                            </div>
                            <div>
                              <Label htmlFor="notes">Additional Notes</Label>
                              <Textarea
                                id="notes"
                                {...register("notes")}
                                placeholder="Any other relevant information..."
                                rows={3}
                                data-testid="textarea-notes"
                              />
                            </div>
                          </TabsContent>
                        </Tabs>
                      </form>
                    </ScrollArea>
                    <Separator className="my-4" />
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowClientDialog(false)}
                        data-testid="button-cancel"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={createClientMutation.isPending}
                        data-testid="button-create-client"
                      >
                        {createClientMutation.isPending ? "Creating..." : "Create Client"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Search and Filter Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-maerose-forest/40"></i>
                  <Input
                    placeholder="Search clients by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-clients"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger data-testid="select-filter-status">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    <SelectItem value="verified">Age Verified</SelectItem>
                    <SelectItem value="consented">Consented</SelectItem>
                    <SelectItem value="new">New Clients</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {clientsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : clients.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <i className="fas fa-users text-4xl text-maerose-forest/40 mb-4"></i>
                  <h3 className="text-lg font-medium text-maerose-forest mb-2">No clients yet</h3>
                  <p className="text-maerose-forest/60 mb-4">
                    Start by adding your first client profile
                  </p>
                  <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-create-first-client">
                        Add First Client
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client: any) => (
                  <Card key={client.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-maerose-forest font-serif" data-testid={`text-client-name-${client.id}`}>
                          {client.firstName} {client.lastName}
                        </CardTitle>
                        <div className="flex space-x-1">
                          {client.ageVerified && (
                            <Badge variant="secondary" className="text-xs">
                              <i className="fas fa-check-circle mr-1"></i>Verified
                            </Badge>
                          )}
                          <Badge
                            variant={client.consentStatus === 'signed' ? 'default' : 'outline'}
                            className="text-xs"
                          >
                            {client.consentStatus}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-maerose-forest/60">
                          <i className="fas fa-envelope mr-2 w-4"></i>
                          {client.email}
                        </div>
                        {client.phone && (
                          <div className="flex items-center text-maerose-forest/60">
                            <i className="fas fa-phone mr-2 w-4"></i>
                            {client.phone}
                          </div>
                        )}
                        <div className="flex items-center text-maerose-forest/60">
                          <i className="fas fa-calendar mr-2 w-4"></i>
                          Added {new Date(client.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {client.medicalHistory && (
                        <div className="mt-4 p-3 bg-red-50 rounded-md">
                          <h4 className="text-xs font-medium text-red-800 mb-1">Medical History</h4>
                          <p className="text-xs text-red-700 truncate">{client.medicalHistory}</p>
                        </div>
                      )}
                      
                      {client.allergies && (
                        <div className="mt-2 p-3 bg-yellow-50 rounded-md">
                          <h4 className="text-xs font-medium text-yellow-800 mb-1">Allergies</h4>
                          <p className="text-xs text-yellow-700 truncate">{client.allergies}</p>
                        </div>
                      )}

                      <div className="flex justify-between mt-4 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-maerose-forest text-maerose-forest hover:bg-maerose-cream/50"
                          onClick={() => {
                            setSelectedClient(client);
                            setShowClientDetails(true);
                          }}
                          data-testid={`button-view-client-${client.id}`}
                        >
                          <i className="fas fa-eye mr-1"></i>
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-maerose-forest text-maerose-forest hover:bg-maerose-cream/50"
                          data-testid={`button-book-treatment-${client.id}`}
                        >
                          <i className="fas fa-calendar-plus mr-1"></i>
                          Book Treatment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Client Details Modal */}
      <Dialog open={showClientDetails} onOpenChange={setShowClientDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <i className="fas fa-user-circle text-maerose-forest"></i>
              {selectedClient?.firstName} {selectedClient?.lastName}
            </DialogTitle>
            <DialogDescription>
              Complete client profile and treatment history
            </DialogDescription>
          </DialogHeader>
          
          {selectedClient && (
            <ScrollArea className="h-[70vh] pr-4">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="medical">Medical</TabsTrigger>
                  <TabsTrigger value="treatments">Treatments</TabsTrigger>
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">Email</Label>
                          <p className="font-medium">{selectedClient.email}</p>
                        </div>
                        {selectedClient.phone && (
                          <div>
                            <Label className="text-xs text-muted-foreground">Phone</Label>
                            <p className="font-medium">{selectedClient.phone}</p>
                          </div>
                        )}
                        {selectedClient.address && (
                          <div>
                            <Label className="text-xs text-muted-foreground">Address</Label>
                            <p className="font-medium text-sm">{selectedClient.address}</p>
                          </div>
                        )}
                        <div>
                          <Label className="text-xs text-muted-foreground">Client Since</Label>
                          <p className="font-medium">{new Date(selectedClient.createdAt).toLocaleDateString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Emergency Contact</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {selectedClient.emergencyContact ? (
                          <>
                            <div>
                              <Label className="text-xs text-muted-foreground">Name</Label>
                              <p className="font-medium">{selectedClient.emergencyContact}</p>
                            </div>
                            {selectedClient.emergencyPhone && (
                              <div>
                                <Label className="text-xs text-muted-foreground">Phone</Label>
                                <p className="font-medium">{selectedClient.emergencyPhone}</p>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">No emergency contact provided</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          selectedClient.ageVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <i className={`fas ${
                            selectedClient.ageVerified ? 'fa-check-circle' : 'fa-exclamation-triangle'
                          } mr-1`}></i>
                          {selectedClient.ageVerified ? 'Age Verified' : 'Pending Verification'}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          selectedClient.consentStatus === 'signed'
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <i className={`fas ${
                            selectedClient.consentStatus === 'signed' ? 'fa-file-signature' : 'fa-file-times'
                          } mr-1`}></i>
                          Consent: {selectedClient.consentStatus}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-maerose-forest">0</div>
                        <div className="text-xs text-muted-foreground">Total Treatments</div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="medical" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    {selectedClient.medicalHistory && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm text-red-700">
                            <i className="fas fa-notes-medical mr-2"></i>
                            Medical History
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm whitespace-pre-wrap">{selectedClient.medicalHistory}</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {selectedClient.allergies && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm text-orange-700">
                            <i className="fas fa-exclamation-triangle mr-2"></i>
                            Known Allergies
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm whitespace-pre-wrap">{selectedClient.allergies}</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {selectedClient.currentMedications && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm text-blue-700">
                            <i className="fas fa-pills mr-2"></i>
                            Current Medications
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm whitespace-pre-wrap">{selectedClient.currentMedications}</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {selectedClient.contraindications && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm text-red-700">
                            <i className="fas fa-ban mr-2"></i>
                            Contraindications
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm whitespace-pre-wrap">{selectedClient.contraindications}</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {!selectedClient.medicalHistory && !selectedClient.allergies && 
                     !selectedClient.currentMedications && !selectedClient.contraindications && (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <i className="fas fa-notes-medical text-4xl text-muted-foreground mb-4"></i>
                          <h3 className="text-lg font-medium text-muted-foreground mb-2">No Medical Information</h3>
                          <p className="text-sm text-muted-foreground">
                            No medical history, allergies, or medications recorded
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="treatments" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Treatment History</h3>
                    <Button size="sm" className="bg-maerose-forest text-maerose-cream">
                      <i className="fas fa-plus mr-1"></i>
                      Add Treatment
                    </Button>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <i className="fas fa-clipboard-list text-4xl text-muted-foreground mb-4"></i>
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">No Treatments Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        This client hasn't had any treatments recorded
                      </p>
                      <Button size="sm">
                        <i className="fas fa-calendar-plus mr-1"></i>
                        Book First Treatment
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="photos" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Before/After Photos</h3>
                    <Button size="sm" className="bg-maerose-forest text-maerose-cream">
                      <i className="fas fa-camera mr-1"></i>
                      Upload Photos
                    </Button>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <i className="fas fa-images text-4xl text-muted-foreground mb-4"></i>
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">No Photos</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload before and after treatment photos to track progress
                      </p>
                      <Button size="sm">
                        <i className="fas fa-upload mr-1"></i>
                        Upload First Photos
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notes" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Client Notes & Communications</h3>
                    <Button size="sm" className="bg-maerose-forest text-maerose-cream">
                      <i className="fas fa-plus mr-1"></i>
                      Add Note
                    </Button>
                  </div>
                  
                  {selectedClient.notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          <i className="fas fa-sticky-note mr-2"></i>
                          Client Notes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm whitespace-pre-wrap">{selectedClient.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <i className="fas fa-comments text-4xl text-muted-foreground mb-4"></i>
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">No Communication History</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Communication logs, appointment notes, and follow-ups will appear here
                      </p>
                      <Button size="sm">
                        <i className="fas fa-plus mr-1"></i>
                        Add Communication Note
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </ScrollArea>
          )}
          
          <Separator className="my-4" />
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <i className="fas fa-edit mr-1"></i>
                Edit Profile
              </Button>
              <Button variant="outline" size="sm">
                <i className="fas fa-file-export mr-1"></i>
                Export Data
              </Button>
            </div>
            <Button variant="outline" onClick={() => setShowClientDetails(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
