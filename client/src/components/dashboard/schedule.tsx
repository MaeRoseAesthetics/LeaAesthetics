import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Booking } from "@shared/schema";

export default function Schedule() {
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-maerose-forest font-serif">Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter today's bookings
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysBookings = bookings.filter((booking: any) => {
    const bookingDate = new Date(booking.scheduledDate);
    return bookingDate >= today && bookingDate < tomorrow;
  });

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 border-green-200';
      case 'scheduled':
        return 'bg-maerose-cream/50 border-maerose-burgundy/30';
      case 'completed':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-maerose-cream/50 border-maerose-forest/30';
    }
  };

  const getTimeColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-maerose-forest';
      case 'scheduled':
        return 'bg-maerose-burgundy';
      case 'completed':
        return 'bg-gray-400';
      default:
        return 'bg-maerose-forest';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-maerose-forest font-serif">Today's Schedule</CardTitle>
        <p className="text-sm text-maerose-forest/60">Manage your appointments and treatment bookings</p>
      </CardHeader>
      <CardContent>
        {todaysBookings.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-calendar-day text-3xl text-maerose-forest/40 mb-3"></i>
            <h3 className="text-lg font-medium text-maerose-forest mb-2">No appointments today</h3>
            <p className="text-maerose-forest/60">Your schedule is clear for today</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todaysBookings.map((booking: any) => (
              <div
                key={booking.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColor(booking.status)}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 ${getTimeColor(booking.status)} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-medium text-sm" data-testid={`booking-time-${booking.id}`}>
                        {formatTime(booking.scheduledDate)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-maerose-forest" data-testid={`booking-client-${booking.id}`}>
                      Client ID: {booking.clientId}
                    </p>
                    <p className="text-sm text-maerose-forest/60">
                      Treatment ID: {booking.treatmentId}
                    </p>
                    <Badge
                      variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                      className="mt-1"
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-maerose-forest hover:bg-maerose-cream/50"
                    data-testid={`button-view-client-${booking.id}`}
                  >
                    <i className="fas fa-user"></i>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-maerose-forest hover:bg-maerose-cream/50"
                    data-testid={`button-reschedule-${booking.id}`}
                  >
                    <i className="fas fa-clock"></i>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
