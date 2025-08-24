import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Search,
  Filter,
  Plus,
  Settings,
  BarChart3,
  Clock,
  MapPin,
  Scanner
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  category: string;
  quantity: number;
  minStockLevel: number;
  maxStockLevel?: number;
  unitCost?: number;
  sellPrice?: number;
  supplier?: string;
  expiryDate?: string;
  batchNumber?: string;
  location?: string;
  active: boolean;
  stockStatus: 'normal' | 'low' | 'out';
  isExpired: boolean;
  daysToExpiry?: number;
}

interface InventorySummary {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  expiredItems: number;
  categorySummary: Record<string, number>;
  locationSummary: Record<string, number>;
}

export default function InventoryDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch inventory data
  const { data: inventory = [], isLoading, error } = useQuery({
    queryKey: ['/api/inventory', selectedCategory, selectedLocation],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedLocation !== 'all') params.append('location', selectedLocation);
      
      const response = await fetch(`/api/inventory?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch inventory');
      return response.json() as InventoryItem[];
    }
  });

  // Fetch inventory summary
  const { data: summary } = useQuery({
    queryKey: ['/api/inventory/summary'],
    queryFn: async () => {
      const response = await fetch('/api/inventory/summary');
      if (!response.ok) throw new Error('Failed to fetch summary');
      return response.json() as InventorySummary;
    }
  });

  // Filter inventory based on search
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get stock status color
  const getStockStatusColor = (status: string, isExpired: boolean) => {
    if (isExpired) return 'bg-red-100 text-red-800 border-red-200';
    switch (status) {
      case 'out':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  // Get stock status text
  const getStockStatusText = (item: InventoryItem) => {
    if (item.isExpired) return 'Expired';
    if (item.stockStatus === 'out') return 'Out of Stock';
    if (item.stockStatus === 'low') return 'Low Stock';
    return 'In Stock';
  };

  // Handle stock movement
  const recordStockMovement = useMutation({
    mutationFn: async ({ id, movementData }: { id: string, movementData: any }) => {
      const response = await fetch(`/api/inventory/${id}/movement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movementData)
      });
      if (!response.ok) throw new Error('Failed to record stock movement');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/summary'] });
      toast({ title: "Success", description: "Stock movement recorded successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const handleQuickStockUpdate = useCallback((item: InventoryItem, adjustment: number) => {
    recordStockMovement.mutate({
      id: item.id,
      movementData: {
        movementType: adjustment > 0 ? 'in' : 'out',
        quantity: Math.abs(adjustment),
        reason: adjustment > 0 ? 'restock' : 'treatment_used',
        notes: `Quick ${adjustment > 0 ? 'restock' : 'usage'} adjustment`
      }
    });
  }, [recordStockMovement]);

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
            Failed to load inventory data. Please try again later.
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
          <h1 className="text-3xl font-bold text-lea-deep-charcoal font-serif">Inventory Management</h1>
          <p className="text-lea-charcoal-grey">Track stock levels, manage supplies, and monitor equipment</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Scanner className="h-4 w-4" />
            Scan Barcode
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
              </DialogHeader>
              <div className="text-center py-8 text-lea-charcoal-grey">
                Add item form will be implemented in the next component
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-lea-silver-grey shadow-lea-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-lea-charcoal-grey">Total Items</p>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">{summary.totalItems}</p>
                </div>
                <div className="w-12 h-12 bg-lea-clinical-blue/10 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-lea-clinical-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-lea-silver-grey shadow-lea-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-lea-charcoal-grey">Total Value</p>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">£{summary.totalValue.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-lea-silver-grey shadow-lea-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-lea-charcoal-grey">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">{summary.lowStockItems}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-lea-silver-grey shadow-lea-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-lea-charcoal-grey">Expired Items</p>
                  <p className="text-2xl font-bold text-red-600">{summary.expiredItems}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-red-600" />
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
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="consumable">Consumables</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="product">Products</SelectItem>
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-lea-pearl-white rounded-lg border border-lea-silver-grey">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-lea-charcoal-grey mb-2">
                    Stock Status
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="low_stock">Low Stock</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-lea-charcoal-grey mb-2">
                    Expiring Soon
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All items" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Items</SelectItem>
                      <SelectItem value="30_days">Within 30 days</SelectItem>
                      <SelectItem value="7_days">Within 7 days</SelectItem>
                      <SelectItem value="expired">Already expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-lea-charcoal-grey mb-2">
                    Value Range
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All values" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Values</SelectItem>
                      <SelectItem value="0-50">£0 - £50</SelectItem>
                      <SelectItem value="50-200">£50 - £200</SelectItem>
                      <SelectItem value="200+">£200+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inventory List */}
      <Card className="border-lea-silver-grey shadow-lea-card">
        <CardHeader>
          <CardTitle className="text-lea-deep-charcoal font-serif">Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInventory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-lea-pearl-white rounded-lg border border-lea-silver-grey hover:shadow-lea-card-hover transition-all duration-200">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lea-deep-charcoal">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-lea-charcoal-grey">{item.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-lea-charcoal-grey">
                        {item.sku && <span>SKU: {item.sku}</span>}
                        <span className="capitalize">{item.category}</span>
                        {item.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {item.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-lea-deep-charcoal">
                        {item.quantity} units
                      </div>
                      {item.minStockLevel && (
                        <div className="text-xs text-lea-charcoal-grey">
                          Min: {item.minStockLevel}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <Badge className={getStockStatusColor(item.stockStatus, item.isExpired)}>
                        {getStockStatusText(item)}
                      </Badge>
                      {item.expiryDate && (
                        <div className="text-xs text-lea-charcoal-grey flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.isExpired ? (
                            <span className="text-red-600">
                              Expired {format(new Date(item.expiryDate), 'MMM dd, yyyy')}
                            </span>
                          ) : (
                            <span>
                              Expires {format(new Date(item.expiryDate), 'MMM dd, yyyy')}
                              {item.daysToExpiry !== null && item.daysToExpiry <= 30 && (
                                <span className="text-yellow-600 ml-1">
                                  ({item.daysToExpiry} days)
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleQuickStockUpdate(item, -1)}
                        disabled={item.quantity === 0}
                        className="h-8 w-8 p-0"
                      >
                        -
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleQuickStockUpdate(item, 1)}
                        className="h-8 w-8 p-0"
                      >
                        +
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-1">
                        <Settings className="h-3 w-3" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredInventory.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-lea-charcoal-grey mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">No inventory items found</h3>
                <p className="text-lea-charcoal-grey">
                  {searchQuery ? 'No items match your search criteria.' : 'Get started by adding your first inventory item.'}
                </p>
                {!searchQuery && (
                  <Button 
                    className="mt-4 gap-2 bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal"
                    onClick={() => setShowAddDialog(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Add First Item
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
