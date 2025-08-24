import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  Search,
  Plus,
  Settings,
  Clock,
  MapPin,
  Activity,
  DollarSign,
  BarChart3,
  Tool,
  Zap
} from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';

interface Equipment {
  id: string;
  name: string;
  model?: string;
  serialNumber?: string;
  manufacturer?: string;
  purchaseDate?: string;
  purchaseCost?: number;
  warrantyExpiry?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  serviceInterval?: number;
  status: 'operational' | 'maintenance' | 'repair' | 'retired';
  location?: string;
  roomId?: string;
  calibrationDate?: string;
  nextCalibrationDate?: string;
  maintenanceCost?: number;
  notes?: string;
  qrCode?: string;
  maintenanceStatus: 'up_to_date' | 'due_soon' | 'overdue';
  daysToMaintenance?: number;
  maintenanceHistory?: MaintenanceRecord[];
}

interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  maintenanceType: 'routine' | 'repair' | 'calibration' | 'inspection';
  scheduledDate?: string;
  completedDate?: string;
  performedBy?: string;
  externalProvider?: string;
  description: string;
  issuesFound?: string;
  actionsPerformed?: string;
  cost?: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

interface EquipmentSummary {
  totalEquipment: number;
  operationalCount: number;
  maintenanceCount: number;
  repairCount: number;
  maintenanceDueCount: number;
  statusSummary: Record<string, number>;
  locationSummary: Record<string, number>;
}

export default function EquipmentDashboard() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch equipment data
  const { data: equipment = [], isLoading, error } = useQuery({
    queryKey: ['/api/equipment', selectedStatus, selectedLocation],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (selectedLocation !== 'all') params.append('location', selectedLocation);
      
      const response = await fetch(`/api/equipment?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch equipment');
      return response.json() as Equipment[];
    }
  });

  // Fetch equipment summary
  const { data: summary } = useQuery({
    queryKey: ['/api/equipment/summary'],
    queryFn: async () => {
      const response = await fetch('/api/equipment/summary');
      if (!response.ok) throw new Error('Failed to fetch summary');
      return response.json() as EquipmentSummary;
    }
  });

  // Filter equipment based on search
  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'repair':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'retired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get maintenance status color
  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'up_to_date':
        return 'text-green-600';
      case 'due_soon':
        return 'text-yellow-600';
      case 'overdue':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Get maintenance status icon
  const getMaintenanceStatusIcon = (status: string) => {
    switch (status) {
      case 'up_to_date':
        return <CheckCircle className="h-4 w-4" />;
      case 'due_soon':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Schedule maintenance
  const scheduleMaintenance = useMutation({
    mutationFn: async ({ equipmentId, maintenanceData }: { equipmentId: string, maintenanceData: any }) => {
      const response = await fetch(`/api/equipment/${equipmentId}/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maintenanceData)
      });
      if (!response.ok) throw new Error('Failed to schedule maintenance');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/equipment'] });
      queryClient.invalidateQueries({ queryKey: ['/api/maintenance'] });
      toast({ title: "Success", description: "Maintenance scheduled successfully" });
      setShowMaintenanceDialog(false);
      setSelectedEquipment(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const handleScheduleMaintenance = useCallback((equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setShowMaintenanceDialog(true);
  }, []);

  const handleQuickMaintenance = useCallback((equipment: Equipment, type: string) => {
    const scheduledDate = addDays(new Date(), type === 'urgent' ? 1 : 7);
    
    scheduleMaintenance.mutate({
      equipmentId: equipment.id,
      maintenanceData: {
        maintenanceType: type === 'routine' ? 'routine' : 'inspection',
        scheduledDate: scheduledDate.toISOString(),
        description: `${type === 'urgent' ? 'Urgent' : 'Routine'} maintenance for ${equipment.name}`,
        status: 'scheduled'
      }
    });
  }, [scheduleMaintenance]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
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
            Failed to load equipment data. Please try again later.
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
          <h1 className="text-3xl font-bold text-lea-deep-charcoal font-serif">Equipment Management</h1>
          <p className="text-lea-charcoal-grey">Monitor equipment status, schedule maintenance, and track performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Reports
          </Button>
          <Button className="gap-2 bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal">
            <Plus className="h-4 w-4" />
            Add Equipment
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-lea-silver-grey shadow-lea-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-lea-charcoal-grey">Total Equipment</p>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">{summary.totalEquipment}</p>
                </div>
                <div className="w-12 h-12 bg-lea-clinical-blue/10 rounded-lg flex items-center justify-center">
                  <Tool className="h-6 w-6 text-lea-clinical-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-lea-silver-grey shadow-lea-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-lea-charcoal-grey">Operational</p>
                  <p className="text-2xl font-bold text-green-600">{summary.operationalCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-lea-silver-grey shadow-lea-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-lea-charcoal-grey">Maintenance Due</p>
                  <p className="text-2xl font-bold text-yellow-600">{summary.maintenanceDueCount}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-lea-silver-grey shadow-lea-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-lea-charcoal-grey">Under Repair</p>
                  <p className="text-2xl font-bold text-red-600">{summary.repairCount}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card className="border-lea-silver-grey shadow-lea-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-lea-charcoal-grey" />
              <Input
                placeholder="Search equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="repair">Under Repair</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {summary?.locationSummary && Object.keys(summary.locationSummary).map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment List */}
      <Card className="border-lea-silver-grey shadow-lea-card">
        <CardHeader>
          <CardTitle className="text-lea-deep-charcoal font-serif">Equipment Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEquipment.map((item) => (
              <div key={item.id} className="p-6 bg-lea-pearl-white rounded-lg border border-lea-silver-grey hover:shadow-lea-card-hover transition-all duration-200">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-lea-deep-charcoal">{item.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-lea-charcoal-grey">
                          {item.model && <span>Model: {item.model}</span>}
                          {item.serialNumber && <span>SN: {item.serialNumber}</span>}
                          {item.manufacturer && <span>{item.manufacturer}</span>}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-lea-charcoal-grey">
                          {item.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {item.location}
                            </span>
                          )}
                          {item.purchaseDate && (
                            <span>
                              Purchased: {format(new Date(item.purchaseDate), 'MMM yyyy')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    {/* Maintenance Status */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-lea-silver-grey">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 ${getMaintenanceStatusColor(item.maintenanceStatus)}`}>
                          {getMaintenanceStatusIcon(item.maintenanceStatus)}
                          <span className="text-sm font-medium">
                            {item.maintenanceStatus === 'up_to_date' && 'Maintenance Up to Date'}
                            {item.maintenanceStatus === 'due_soon' && 'Maintenance Due Soon'}
                            {item.maintenanceStatus === 'overdue' && 'Maintenance Overdue'}
                          </span>
                        </div>
                        {item.nextServiceDate && (
                          <div className="text-xs text-lea-charcoal-grey">
                            Next service: {format(new Date(item.nextServiceDate), 'MMM dd, yyyy')}
                            {item.daysToMaintenance !== null && (
                              <span className="ml-1">
                                ({item.daysToMaintenance > 0 ? `in ${item.daysToMaintenance} days` : `${Math.abs(item.daysToMaintenance)} days overdue`})
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {item.maintenanceStatus !== 'up_to_date' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleQuickMaintenance(item, 'urgent')}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Urgent
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleQuickMaintenance(item, 'routine')}
                              className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                            >
                              Schedule
                            </Button>
                          </>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleScheduleMaintenance(item)}
                          className="gap-1"
                        >
                          <Settings className="h-3 w-3" />
                          Details
                        </Button>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-lea-charcoal-grey">
                      {item.lastServiceDate && (
                        <div>
                          <span className="font-medium">Last Service:</span>
                          <br />
                          {format(new Date(item.lastServiceDate), 'MMM dd, yyyy')}
                        </div>
                      )}
                      {item.warrantyExpiry && (
                        <div>
                          <span className="font-medium">Warranty:</span>
                          <br />
                          {new Date(item.warrantyExpiry) > new Date() ? 
                            `Until ${format(new Date(item.warrantyExpiry), 'MMM yyyy')}` : 
                            'Expired'
                          }
                        </div>
                      )}
                      {item.purchaseCost && (
                        <div>
                          <span className="font-medium">Purchase Cost:</span>
                          <br />
                          £{item.purchaseCost.toFixed(2)}
                        </div>
                      )}
                      {item.maintenanceCost && (
                        <div>
                          <span className="font-medium">Maintenance Cost:</span>
                          <br />
                          £{item.maintenanceCost.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredEquipment.length === 0 && (
              <div className="text-center py-12">
                <Tool className="h-12 w-12 text-lea-charcoal-grey mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">No equipment found</h3>
                <p className="text-lea-charcoal-grey">
                  {searchQuery ? 'No equipment matches your search criteria.' : 'Get started by adding your first piece of equipment.'}
                </p>
                {!searchQuery && (
                  <Button className="mt-4 gap-2 bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal">
                    <Plus className="h-4 w-4" />
                    Add Equipment
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Schedule Dialog */}
      <Dialog open={showMaintenanceDialog} onOpenChange={setShowMaintenanceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Maintenance</DialogTitle>
          </DialogHeader>
          {selectedEquipment && (
            <div className="space-y-4">
              <div className="p-4 bg-lea-pearl-white rounded-lg">
                <h3 className="font-semibold text-lea-deep-charcoal">{selectedEquipment.name}</h3>
                <p className="text-sm text-lea-charcoal-grey">
                  {selectedEquipment.model && `${selectedEquipment.model} • `}
                  {selectedEquipment.serialNumber && `SN: ${selectedEquipment.serialNumber}`}
                </p>
              </div>
              
              <div className="text-center py-8 text-lea-charcoal-grey">
                Maintenance scheduling form will be implemented here
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowMaintenanceDialog(false)}>
                  Cancel
                </Button>
                <Button className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal">
                  Schedule Maintenance
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
