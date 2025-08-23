import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Booking } from "@shared/schema";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TreatmentBooking from "@/components/booking/treatment-booking";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function Bookings() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    enabled: isAuthenticated,
  });

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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
                    Bookings Management
                  </h2>
                  <p className="text-sm text-maerose-forest/60 mt-1">
                    Manage treatment appointments and schedules
                  </p>
                </div>
                <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
                  <DialogTrigger asChild>
                  <Button className="bg-maerose-forest text-maerose-cream hover:bg-maerose-forest/90" data-testid="button-new-booking">
                    <i className="fas fa-plus mr-2"></i>New Booking
                  </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <TreatmentBooking onSuccess={() => setShowBookingDialog(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {bookingsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : bookings.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <i className="fas fa-calendar-plus text-4xl text-maerose-forest/40 mb-4"></i>
                  <h3 className="text-lg font-medium text-maerose-forest mb-2">No bookings yet</h3>
                  <p className="text-maerose-forest/60 mb-4">
                    Start by creating your first treatment booking
                  </p>
                  <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-create-first-booking">
                        Create First Booking
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking: any) => (
                  <Card key={booking.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-maerose-forest rounded-full flex items-center justify-center">
                              <span className="text-maerose-cream font-medium text-sm">
                                {formatTime(booking.scheduledDate)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium text-maerose-forest" data-testid={`text-booking-${booking.id}`}>
                              {formatDate(booking.scheduledDate)}
                            </h3>
                            <p className="text-sm text-maerose-forest/60">
                              Treatment ID: {booking.treatmentId}
                            </p>
                            <p className="text-xs text-maerose-forest font-medium">
                              Client ID: {booking.clientId}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={getStatusBadgeVariant(booking.status)}>
                            {booking.status}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-maerose-forest text-maerose-forest hover:bg-maerose-cream/50"
                              data-testid={`button-view-booking-${booking.id}`}
                            >
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-maerose-forest text-maerose-forest hover:bg-maerose-cream/50"
                              data-testid={`button-edit-booking-${booking.id}`}
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                      {booking.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-700">{booking.notes}</p>
                        </div>
                      )}
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
