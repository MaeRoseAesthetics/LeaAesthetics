import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Client } from "@shared/schema";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const clientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  currentMedications: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function Clients() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [showClientDialog, setShowClientDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    enabled: isAuthenticated,
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-maerose-cream">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="bg-white border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-maerose-forest" data-testid="text-page-title">
                    Client Management
                  </h2>
                  <p className="text-sm text-maerose-forest/60 mt-1">
                    Manage client profiles, medical history, and treatment records
                  </p>
                </div>
                <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-maerose-forest text-maerose-cream hover:bg-maerose-forest/90" data-testid="button-new-client">
                      <i className="fas fa-plus mr-2"></i>New Client
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Client</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                      <div>
                        <Label htmlFor="medicalHistory">Medical History</Label>
                        <Textarea
                          id="medicalHistory"
                          {...register("medicalHistory")}
                          data-testid="textarea-medical-history"
                        />
                      </div>
                      <div>
                        <Label htmlFor="allergies">Allergies</Label>
                        <Textarea
                          id="allergies"
                          {...register("allergies")}
                          data-testid="textarea-allergies"
                        />
                      </div>
                      <div>
                        <Label htmlFor="currentMedications">Current Medications</Label>
                        <Textarea
                          id="currentMedications"
                          {...register("currentMedications")}
                          data-testid="textarea-medications"
                        />
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
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
                          disabled={createClientMutation.isPending}
                          data-testid="button-create-client"
                        >
                          {createClientMutation.isPending ? "Creating..." : "Create Client"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-6">
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
                          data-testid={`button-view-client-${client.id}`}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-maerose-forest text-maerose-forest hover:bg-maerose-cream/50"
                          data-testid={`button-book-treatment-${client.id}`}
                        >
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
    </div>
  );
}
