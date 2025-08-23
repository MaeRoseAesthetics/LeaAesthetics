import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Client } from "@shared/schema";

export default function ClientActivity() {
  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-maerose-forest font-serif">Recent Client Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort clients by most recent activity (creation date for now)
  const recentClients = clients
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusBadge = (client: any) => {
    if (client.consentStatus === 'signed') {
      return <Badge className="bg-green-100 text-green-800">Follow-up due</Badge>;
    }
    if (!client.ageVerified) {
      return <Badge className="bg-blue-100 text-blue-800">New patient</Badge>;
    }
    if (client.consentStatus === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800">Consent pending</Badge>;
    }
    return <Badge variant="outline">Active</Badge>;
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-maerose-forest font-serif">Recent Client Activity</CardTitle>
          <Button variant="ghost" size="sm" className="text-maerose-forest hover:bg-maerose-cream/50" data-testid="button-view-all-clients">
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentClients.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-users text-3xl text-maerose-forest/40 mb-3"></i>
            <h3 className="text-lg font-medium text-maerose-forest mb-2">No client activity</h3>
            <p className="text-maerose-forest/60">Client activity will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentClients.map((client: any) => (
              <div key={client.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-maerose-forest rounded-full flex items-center justify-center">
                    <span className="text-maerose-cream font-medium text-sm">
                      {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-maerose-forest" data-testid={`client-name-${client.id}`}>
                      {client.firstName} {client.lastName}
                    </p>
                    <p className="text-sm text-maerose-forest/60">
                      Added {formatRelativeTime(client.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(client)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-maerose-forest hover:bg-maerose-cream/50"
                    data-testid={`button-view-client-record-${client.id}`}
                  >
                    <i className="fas fa-arrow-right"></i>
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
