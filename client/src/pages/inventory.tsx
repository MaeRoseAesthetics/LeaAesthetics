import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
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
import { AlertTriangle, Package, Settings, Calendar, Plus, Search, Filter, TrendingDown, TrendingUp, BarChart3, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import SupplierManagement from "@/components/inventory/supplier-management";
import InventoryAnalytics from "@/components/inventory/inventory-analytics";

const inventoryItemSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  sku: z.string().optional(),
  supplier: z.string().optional(),
  currentStock: z.number().min(0, "Stock must be positive"),
  minStockLevel: z.number().min(0, "Minimum stock must be positive"),
  maxStockLevel: z.number().min(0, "Maximum stock must be positive"),
  unitCost: z.number().min(0, "Cost must be positive").optional(),
  expiryDate: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

const equipmentSchema = z.object({
  name: z.string().min(1, "Equipment name is required"),
  type: z.string().min(1, "Type is required"),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  purchaseDate: z.string().optional(),
  warrantyExpiry: z.string().optional(),
  location: z.string().optional(),
  status: z.string().default("operational"),
  lastMaintenance: z.string().optional(),
  nextMaintenance: z.string().optional(),
  maintenanceInterval: z.number().optional(),
  notes: z.string().optional(),
});

const maintenanceRecordSchema = z.object({
  equipmentId: z.string().min(1, "Equipment is required"),
  type: z.string().min(1, "Maintenance type is required"),
  description: z.string().min(1, "Description is required"),
  performedBy: z.string().min(1, "Technician is required"),
  cost: z.number().min(0, "Cost must be positive").optional(),
  nextMaintenanceDate: z.string().optional(),
  notes: z.string().optional(),
});

type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;
type EquipmentFormData = z.infer<typeof equipmentSchema>;
type MaintenanceRecordFormData = z.infer<typeof maintenanceRecordSchema>;

export default function Inventory() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [showInventoryDialog, setShowInventoryDialog] = useState(false);
  const [showEquipmentDialog, setShowEquipmentDialog] = useState(false);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const queryClient = useQueryClient();

  // Mock data for demonstration
  const { data: inventoryItems = [], isLoading: inventoryLoading } = useQuery({
    queryKey: ["/api/inventory"],
    queryFn: () => Promise.resolve([
      {
        id: "1",
        name: "Hyaluronic Acid Filler 1ml",
        category: "Injectable",
        description: "Premium dermal filler for facial enhancement",
        sku: "HAF-001",
        supplier: "Aesthetic Supplies Ltd",
        currentStock: 15,
        minStockLevel: 5,
        maxStockLevel: 50,
        unitCost: 85.00,
        expiryDate: "2024-12-31",
        location: "Fridge A - Shelf 2",
        notes: "Keep refrigerated at 2-8°C"
      },
      {
        id: "2",
        name: "Botulinum Toxin 100U",
        category: "Injectable",
        description: "Type A botulinum toxin for wrinkle treatment",
        sku: "BTX-100",
        supplier: "Medical Aesthetics Corp",
        currentStock: 3,
        minStockLevel: 5,
        maxStockLevel: 20,
        unitCost: 150.00,
        expiryDate: "2024-10-15",
        location: "Fridge B - Shelf 1",
        notes: "Requires special handling - frozen storage"
      },
      {
        id: "3",
        name: "LED Light Therapy Masks",
        category: "Treatment Supplies",
        description: "Disposable face masks for LED therapy",
        sku: "LED-MASK-001",
        supplier: "Beauty Tech Solutions",
        currentStock: 45,
        minStockLevel: 20,
        maxStockLevel: 100,
        unitCost: 2.50,
        expiryDate: null,
        location: "Storage Room - Cabinet 3",
        notes: "Sterile packaging"
      },
    ]),
    enabled: isAuthenticated,
  });

  const { data: equipment = [], isLoading: equipmentLoading } = useQuery({
    queryKey: ["/api/equipment"],
    queryFn: () => Promise.resolve([
      {
        id: "1",
        name: "IPL Hair Removal System",
        type: "Laser Device",
        model: "IPL-Pro 2024",
        serialNumber: "IPL-2024-001",
        manufacturer: "LaserTech Industries",
        purchaseDate: "2023-05-15",
        warrantyExpiry: "2025-05-15",
        location: "Treatment Room 1",
        status: "operational",
        lastMaintenance: "2024-07-15",
        nextMaintenance: "2024-10-15",
        maintenanceInterval: 90,
        notes: "Requires monthly calibration checks"
      },
      {
        id: "2",
        name: "Facial Steamer Unit",
        type: "Facial Equipment",
        model: "Steam-Master Pro",
        serialNumber: "SM-2023-045",
        manufacturer: "Beauty Equipment Co",
        purchaseDate: "2023-03-20",
        warrantyExpiry: "2024-03-20",
        location: "Treatment Room 2",
        status: "maintenance_required",
        lastMaintenance: "2024-05-20",
        nextMaintenance: "2024-08-20",
        maintenanceInterval: 60,
        notes: "Steam output reduced - needs descaling"
      },
      {
        id: "3",
        name: "Ultrasonic Cleaner",
        type: "Cleaning Equipment",
        model: "UltraClean 3000",
        serialNumber: "UC-2023-012",
        manufacturer: "SaniTech Systems",
        purchaseDate: "2023-01-10",
        warrantyExpiry: "2024-01-10",
        location: "Sterilization Area",
        status: "out_of_service",
        lastMaintenance: "2024-06-10",
        nextMaintenance: "2024-09-10",
        maintenanceInterval: 90,
        notes: "Ultrasonic transducers failed - awaiting parts"
      },
    ]),
    enabled: isAuthenticated,
  });

  const { data: maintenanceRecords = [], isLoading: maintenanceLoading } = useQuery({
    queryKey: ["/api/maintenance"],
    queryFn: () => Promise.resolve([
      {
        id: "1",
        equipmentId: "1",
        equipmentName: "IPL Hair Removal System",
        type: "Routine Maintenance",
        description: "Quarterly maintenance and calibration",
        performedBy: "TechCare Services",
        date: "2024-07-15",
        cost: 250.00,
        nextMaintenanceDate: "2024-10-15",
        notes: "All systems functioning normally"
      },
      {
        id: "2",
        equipmentId: "2",
        equipmentName: "Facial Steamer Unit",
        type: "Repair",
        description: "Steam output troubleshooting",
        performedBy: "Beauty Equipment Co",
        date: "2024-05-20",
        cost: 120.00,
        nextMaintenanceDate: "2024-08-20",
        notes: "Temporary fix - full descaling needed"
      },
    ]),
    enabled: isAuthenticated,
  });

  const createInventoryMutation = useMutation({
    mutationFn: async (data: InventoryItemFormData) => {
      // Mock API call
      return Promise.resolve({ id: Date.now().toString(), ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      toast({
        title: "Success",
        description: "Inventory item created successfully",
      });
      setShowInventoryDialog(false);
      inventoryForm.reset();
    },
  });

  const createEquipmentMutation = useMutation({
    mutationFn: async (data: EquipmentFormData) => {
      // Mock API call
      return Promise.resolve({ id: Date.now().toString(), ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      toast({
        title: "Success",
        description: "Equipment added successfully",
      });
      setShowEquipmentDialog(false);
      equipmentForm.reset();
    },
  });

  const inventoryForm = useForm<InventoryItemFormData>({
    resolver: zodResolver(inventoryItemSchema),
  });

  const equipmentForm = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
  });

  const maintenanceForm = useForm<MaintenanceRecordFormData>({
    resolver: zodResolver(maintenanceRecordSchema),
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

  // Calculate low stock items
  const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minStockLevel);
  const expiringSoon = inventoryItems.filter(item => {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow;
  });

  const maintenanceDue = equipment.filter(item => {
    if (!item.nextMaintenance) return false;
    const nextMaintenanceDate = new Date(item.nextMaintenance);
    const today = new Date();
    return nextMaintenanceDate <= today;
  });

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
                  <h2 className="text-2xl font-serif font-bold text-maerose-forest">
                    Inventory & Equipment Management
                  </h2>
                  <p className="text-sm text-maerose-forest/60 mt-1">
                    Manage stock levels, equipment maintenance, and automated alerts
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Dialog open={showInventoryDialog} onOpenChange={setShowInventoryDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-maerose-forest text-maerose-cream hover:bg-maerose-forest/90">
                        <Package className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                  <Dialog open={showEquipmentDialog} onOpenChange={setShowEquipmentDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-maerose-forest text-maerose-forest">
                        <Settings className="w-4 h-4 mr-2" />
                        Add Equipment
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Alert Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className={lowStockItems.length > 0 ? "border-red-200 bg-red-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
                      <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className={expiringSoon.length > 0 ? "border-orange-200 bg-orange-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Expiring Soon</p>
                      <p className="text-2xl font-bold text-orange-600">{expiringSoon.length}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className={maintenanceDue.length > 0 ? "border-yellow-200 bg-yellow-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Maintenance Due</p>
                      <p className="text-2xl font-bold text-yellow-600">{maintenanceDue.length}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="inventory" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="suppliers">
                  <Users className="w-4 h-4 mr-1" />
                  Suppliers
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="inventory" className="space-y-4 mt-6">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-maerose-forest/40" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Injectable">Injectable</SelectItem>
                      <SelectItem value="Treatment Supplies">Treatment Supplies</SelectItem>
                      <SelectItem value="Skincare">Skincare</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Inventory Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inventoryItems.map((item: any) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-maerose-forest font-serif">
                            {item.name}
                          </CardTitle>
                          <div className="flex space-x-1">
                            {item.currentStock <= item.minStockLevel && (
                              <Badge variant="destructive" className="text-xs">
                                <TrendingDown className="w-3 h-3 mr-1" />
                                Low Stock
                              </Badge>
                            )}
                            {item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                              <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Expiring
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs text-muted-foreground">Current Stock</Label>
                              <p className={`font-bold ${item.currentStock <= item.minStockLevel ? 'text-red-600' : 'text-green-600'}`}>
                                {item.currentStock}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Min Level</Label>
                              <p className="font-medium">{item.minStockLevel}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs text-muted-foreground">SKU</Label>
                              <p className="text-sm font-mono">{item.sku || 'N/A'}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Unit Cost</Label>
                              <p className="text-sm font-medium">£{item.unitCost?.toFixed(2) || 'N/A'}</p>
                            </div>
                          </div>

                          {item.expiryDate && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Expiry Date</Label>
                              <p className={`text-sm ${new Date(item.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-orange-600 font-medium' : ''}`}>
                                {new Date(item.expiryDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}

                          <div>
                            <Label className="text-xs text-muted-foreground">Location</Label>
                            <p className="text-sm">{item.location || 'Not specified'}</p>
                          </div>
                        </div>

                        <div className="flex justify-between mt-4 pt-4 border-t">
                          <Button variant="outline" size="sm">
                            <Package className="w-3 h-3 mr-1" />
                            Restock
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="equipment" className="space-y-4 mt-6">
                {/* Equipment Search */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-maerose-forest/40" />
                      <Input
                        placeholder="Search equipment..."
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="maintenance_required">Maintenance Required</SelectItem>
                      <SelectItem value="out_of_service">Out of Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Equipment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {equipment.map((item: any) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-maerose-forest font-serif">
                            {item.name}
                          </CardTitle>
                          <Badge
                            variant={
                              item.status === "operational" 
                                ? "default"
                                : item.status === "maintenance_required"
                                ? "secondary"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {item.status === "operational" && <TrendingUp className="w-3 h-3 mr-1" />}
                            {item.status === "maintenance_required" && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {item.status === "out_of_service" && <TrendingDown className="w-3 h-3 mr-1" />}
                            {item.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.type}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs text-muted-foreground">Model</Label>
                              <p className="text-sm font-medium">{item.model || 'N/A'}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Serial #</Label>
                              <p className="text-sm font-mono">{item.serialNumber || 'N/A'}</p>
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs text-muted-foreground">Location</Label>
                            <p className="text-sm">{item.location}</p>
                          </div>

                          {item.nextMaintenance && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Next Maintenance</Label>
                              <p className={`text-sm ${new Date(item.nextMaintenance) <= new Date() ? 'text-red-600 font-medium' : ''}`}>
                                {new Date(item.nextMaintenance).toLocaleDateString()}
                              </p>
                            </div>
                          )}

                          {item.warrantyExpiry && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Warranty Expires</Label>
                              <p className="text-sm">{new Date(item.warrantyExpiry).toLocaleDateString()}</p>
                            </div>
                          )}

                          {item.notes && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Notes</Label>
                              <p className="text-sm italic">{item.notes}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between mt-4 pt-4 border-t">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedEquipment(item);
                              setShowMaintenanceDialog(true);
                            }}
                          >
                            <Calendar className="w-3 h-3 mr-1" />
                            Schedule
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="w-3 h-3 mr-1" />
                            Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="maintenance" className="space-y-4 mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Maintenance Records</h3>
                  <Button
                    onClick={() => setShowMaintenanceDialog(true)}
                    className="bg-maerose-forest text-maerose-cream"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Record
                  </Button>
                </div>

                {/* Maintenance Records */}
                <div className="space-y-4">
                  {maintenanceRecords.map((record: any) => (
                    <Card key={record.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{record.equipmentName}</h4>
                              <Badge variant="outline" className="text-xs">
                                {record.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{record.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Performed by: {record.performedBy}</span>
                              <span>Date: {new Date(record.date).toLocaleDateString()}</span>
                              {record.cost && <span>Cost: £{record.cost.toFixed(2)}</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            {record.nextMaintenanceDate && (
                              <p className="text-sm">
                                <span className="text-muted-foreground">Next: </span>
                                <span className={new Date(record.nextMaintenanceDate) <= new Date() ? 'text-red-600 font-medium' : ''}>
                                  {new Date(record.nextMaintenanceDate).toLocaleDateString()}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="suppliers" className="mt-6">
                <SupplierManagement />
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <InventoryAnalytics />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Add Inventory Item Dialog */}
      <Dialog open={showInventoryDialog} onOpenChange={setShowInventoryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
            <DialogDescription>
              Add a new product or supply to your inventory
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={inventoryForm.handleSubmit((data) => createInventoryMutation.mutate(data))}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input {...inventoryForm.register("name")} />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => inventoryForm.setValue("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Injectable">Injectable</SelectItem>
                    <SelectItem value="Treatment Supplies">Treatment Supplies</SelectItem>
                    <SelectItem value="Skincare">Skincare</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input {...inventoryForm.register("sku")} />
              </div>
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input {...inventoryForm.register("supplier")} />
              </div>
              <div>
                <Label htmlFor="currentStock">Current Stock *</Label>
                <Input 
                  type="number" 
                  {...inventoryForm.register("currentStock", { valueAsNumber: true })} 
                />
              </div>
              <div>
                <Label htmlFor="minStockLevel">Minimum Stock Level *</Label>
                <Input 
                  type="number" 
                  {...inventoryForm.register("minStockLevel", { valueAsNumber: true })} 
                />
              </div>
              <div>
                <Label htmlFor="unitCost">Unit Cost (£)</Label>
                <Input 
                  type="number" 
                  step="0.01"
                  {...inventoryForm.register("unitCost", { valueAsNumber: true })} 
                />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input type="date" {...inventoryForm.register("expiryDate")} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="location">Storage Location</Label>
                <Input {...inventoryForm.register("location")} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea {...inventoryForm.register("description")} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea {...inventoryForm.register("notes")} />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowInventoryDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createInventoryMutation.isPending}>
                {createInventoryMutation.isPending ? "Adding..." : "Add Item"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Equipment Dialog */}
      <Dialog open={showEquipmentDialog} onOpenChange={setShowEquipmentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Equipment</DialogTitle>
            <DialogDescription>
              Register new equipment for tracking and maintenance
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={equipmentForm.handleSubmit((data) => createEquipmentMutation.mutate(data))}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="name">Equipment Name *</Label>
                <Input {...equipmentForm.register("name")} />
              </div>
              <div>
                <Label htmlFor="type">Type *</Label>
                <Input {...equipmentForm.register("type")} />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input {...equipmentForm.register("model")} />
              </div>
              <div>
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input {...equipmentForm.register("serialNumber")} />
              </div>
              <div>
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input {...equipmentForm.register("manufacturer")} />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input {...equipmentForm.register("location")} />
              </div>
              <div>
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input type="date" {...equipmentForm.register("purchaseDate")} />
              </div>
              <div>
                <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
                <Input type="date" {...equipmentForm.register("warrantyExpiry")} />
              </div>
              <div>
                <Label htmlFor="maintenanceInterval">Maintenance Interval (days)</Label>
                <Input 
                  type="number" 
                  {...equipmentForm.register("maintenanceInterval", { valueAsNumber: true })} 
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => equipmentForm.setValue("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="maintenance_required">Maintenance Required</SelectItem>
                    <SelectItem value="out_of_service">Out of Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea {...equipmentForm.register("notes")} />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowEquipmentDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createEquipmentMutation.isPending}>
                {createEquipmentMutation.isPending ? "Adding..." : "Add Equipment"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Schedule Maintenance Dialog */}
      <Dialog open={showMaintenanceDialog} onOpenChange={setShowMaintenanceDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule Maintenance</DialogTitle>
            <DialogDescription>
              Record maintenance activity for equipment
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={maintenanceForm.handleSubmit((data) => console.log(data))}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="equipmentId">Equipment</Label>
                <Select onValueChange={(value) => maintenanceForm.setValue("equipmentId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipment.map((item: any) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Maintenance Type *</Label>
                <Select onValueChange={(value) => maintenanceForm.setValue("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Routine Maintenance">Routine Maintenance</SelectItem>
                    <SelectItem value="Repair">Repair</SelectItem>
                    <SelectItem value="Calibration">Calibration</SelectItem>
                    <SelectItem value="Inspection">Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea {...maintenanceForm.register("description")} />
              </div>
              <div>
                <Label htmlFor="performedBy">Performed By *</Label>
                <Input {...maintenanceForm.register("performedBy")} />
              </div>
              <div>
                <Label htmlFor="cost">Cost (£)</Label>
                <Input 
                  type="number" 
                  step="0.01"
                  {...maintenanceForm.register("cost", { valueAsNumber: true })} 
                />
              </div>
              <div>
                <Label htmlFor="nextMaintenanceDate">Next Maintenance Date</Label>
                <Input type="date" {...maintenanceForm.register("nextMaintenanceDate")} />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea {...maintenanceForm.register("notes")} />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowMaintenanceDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Record
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
