import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell,
  AlertTriangle, 
  Clock,
  Package,
  Wrench,
  CheckCircle,
  X,
  Eye,
  Filter,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';

interface InventoryAlert {
  id: string;
  inventoryId?: string;
  equipmentId?: string;
  alertType: 'low_stock' | 'expired' | 'maintenance_due' | 'warranty_expiring';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  isRead: boolean;
  isDismissed: boolean;
  expiresAt?: string;
  actionRequired?: string;
  createdAt: string;
}

export default function InventoryAlerts() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch alerts data
  const { data: alerts = [], isLoading, error } = useQuery({
    queryKey: ['/api/alerts', selectedType, selectedSeverity, showUnreadOnly],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedType !== 'all') params.append('alertType', selectedType);
      if (selectedSeverity !== 'all') params.append('severity', selectedSeverity);
      if (showUnreadOnly) params.append('unreadOnly', 'true');
      
      const response = await fetch(`/api/alerts?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return response.json() as InventoryAlert[];
    },
    refetchInterval: 60000 // Refetch every minute
  });

  // Mark alert as read
  const markAsRead = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await fetch(`/api/alerts/${alertId}/read`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Failed to mark alert as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
    }
  });

  // Dismiss alert
  const dismissAlert = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await fetch(`/api/alerts/${alertId}/dismiss`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Failed to dismiss alert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({ title: "Alert dismissed", description: "The alert has been dismissed successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Get alert icon
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <Package className="h-5 w-5" />;
      case 'expired':
        return <Clock className="h-5 w-5" />;
      case 'maintenance_due':
        return <Wrench className="h-5 w-5" />;
      case 'warranty_expiring':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get alert type display name
  const getAlertTypeDisplay = (type: string) => {
    switch (type) {
      case 'low_stock':
        return 'Low Stock';
      case 'expired':
        return 'Expired Item';
      case 'maintenance_due':
        return 'Maintenance Due';
      case 'warranty_expiring':
        return 'Warranty Expiring';
      default:
        return type;
    }
  };

  const handleMarkAsRead = (alert: InventoryAlert) => {
    if (!alert.isRead) {
      markAsRead.mutate(alert.id);
    }
  };

  const handleDismiss = (alertId: string) => {
    dismissAlert.mutate(alertId);
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const criticalCount = alerts.filter(alert => alert.severity === 'critical').length;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load alerts. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-lea-deep-charcoal font-serif">Inventory Alerts</h1>
          <p className="text-lea-charcoal-grey">
            Monitor stock levels, maintenance schedules, and equipment status
          </p>
          <div className="flex items-center gap-4 mt-2">
            {unreadCount > 0 && (
              <Badge className="bg-red-100 text-red-800 border-red-200">
                {unreadCount} unread alerts
              </Badge>
            )}
            {criticalCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {criticalCount} critical alerts
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-lea-silver-grey shadow-lea-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-lea-charcoal-grey" />
              <span className="text-sm font-medium text-lea-charcoal-grey">Filters:</span>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Alert Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="maintenance_due">Maintenance Due</SelectItem>
                  <SelectItem value="warranty_expiring">Warranty Expiring</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={showUnreadOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Unread Only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card className="border-lea-silver-grey shadow-lea-card">
        <CardHeader>
          <CardTitle className="text-lea-deep-charcoal font-serif">Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-lea-card-hover ${
                  alert.isRead 
                    ? 'bg-white border-lea-silver-grey' 
                    : 'bg-lea-pearl-white border-lea-clinical-blue/30 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Alert Icon */}
                    <div className={`p-2 rounded-lg ${
                      alert.severity === 'critical' ? 'bg-red-500 text-white' :
                      alert.severity === 'high' ? 'bg-red-100 text-red-600' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {getAlertIcon(alert.alertType)}
                    </div>

                    {/* Alert Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {getAlertTypeDisplay(alert.alertType)}
                        </Badge>
                        {!alert.isRead && (
                          <div className="w-2 h-2 bg-lea-clinical-blue rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="text-sm text-lea-deep-charcoal font-medium mb-1">
                        {alert.message}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-lea-charcoal-grey">
                        <span>
                          {format(new Date(alert.createdAt), 'MMM dd, yyyy HH:mm')}
                        </span>
                        {alert.actionRequired && (
                          <span className="text-lea-clinical-blue font-medium">
                            Action: {alert.actionRequired}
                          </span>
                        )}
                        {alert.expiresAt && (
                          <span>
                            Expires: {format(new Date(alert.expiresAt), 'MMM dd, yyyy')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Alert Actions */}
                  <div className="flex items-center gap-2">
                    {!alert.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(alert)}
                        className="gap-1 text-lea-clinical-blue hover:bg-lea-clinical-blue/10"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Mark Read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDismiss(alert.id)}
                      className="gap-1 text-lea-charcoal-grey hover:bg-red-50 hover:text-red-600"
                      disabled={dismissAlert.isPending}
                    >
                      <X className="h-3 w-3" />
                      Dismiss
                    </Button>
                  </div>
                </div>

                {/* Action Button for Critical Alerts */}
                {alert.severity === 'critical' && alert.actionRequired && (
                  <div className="mt-3 pt-3 border-t border-lea-silver-grey">
                    <Button size="sm" className="gap-2 bg-red-600 text-white hover:bg-red-700">
                      <AlertTriangle className="h-3 w-3" />
                      Take Action Now
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            {alerts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">
                  {showUnreadOnly ? 'No unread alerts' : 'All clear!'}
                </h3>
                <p className="text-lea-charcoal-grey">
                  {showUnreadOnly 
                    ? 'You have read all your alerts.' 
                    : 'No alerts to display at the moment. Your inventory and equipment are in good condition.'
                  }
                </p>
                {showUnreadOnly && (
                  <Button
                    variant="outline"
                    onClick={() => setShowUnreadOnly(false)}
                    className="mt-4"
                  >
                    Show All Alerts
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alert Summary */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-lea-silver-grey">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {alerts.filter(a => a.severity === 'critical').length}
              </div>
              <div className="text-sm text-lea-charcoal-grey">Critical Alerts</div>
            </CardContent>
          </Card>
          <Card className="border-lea-silver-grey">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {alerts.filter(a => a.severity === 'high').length}
              </div>
              <div className="text-sm text-lea-charcoal-grey">High Priority</div>
            </CardContent>
          </Card>
          <Card className="border-lea-silver-grey">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {alerts.filter(a => a.severity === 'medium').length}
              </div>
              <div className="text-sm text-lea-charcoal-grey">Medium Priority</div>
            </CardContent>
          </Card>
          <Card className="border-lea-silver-grey">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {alerts.filter(a => a.severity === 'low').length}
              </div>
              <div className="text-sm text-lea-charcoal-grey">Low Priority</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
