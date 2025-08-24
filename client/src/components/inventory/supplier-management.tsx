import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Package,
  Star,
  AlertCircle,
  CheckCircle,
  Calendar,
  Edit,
  Download
} from "lucide-react";

const supplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  vatNumber: z.string().optional(),
  website: z.string().url("Valid URL required").optional().or(z.literal("")),
  specialties: z.string().optional(),
  notes: z.string().optional(),
});

const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  orderNumber: z.string().min(1, "Order number is required"),
  items: z.array(z.object({
    productName: z.string().min(1, "Product name is required"),
    quantity: z.number().min(1, "Quantity must be positive"),
    unitPrice: z.number().min(0, "Unit price must be positive"),
    total: z.number().min(0, "Total must be positive"),
  })),
  totalAmount: z.number().min(0, "Total amount must be positive"),
  expectedDelivery: z.string().min(1, "Expected delivery date is required"),
  notes: z.string().optional(),
});

type SupplierFormData = z.infer<typeof supplierSchema>;
type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>;

// Mock data
const mockSuppliers = [
  {
    id: "1",
    name: "Aesthetic Supplies Ltd",
    contactPerson: "Sarah Johnson",
    email: "sarah@aestheticsupplies.co.uk",
    phone: "+44 20 1234 5678",
    address: "123 Medical Lane",
    city: "London",
    country: "United Kingdom",
    vatNumber: "GB123456789",
    website: "https://aestheticsupplies.co.uk",
    specialties: "Injectable fillers, Botulinum toxin, Medical devices",
    rating: 4.8,
    totalOrders: 24,
    onTimeDelivery: 96,
    averageDeliveryDays: 3.2,
    status: "active",
    notes: "Premium supplier with excellent service record"
  },
  {
    id: "2",
    name: "Medical Aesthetics Corp",
    contactPerson: "Dr. Michael Chen",
    email: "orders@medicalaesthetics.com",
    phone: "+44 161 987 6543",
    address: "45 Innovation Drive",
    city: "Manchester",
    country: "United Kingdom",
    vatNumber: "GB987654321",
    website: "https://medicalaesthetics.com",
    specialties: "Training materials, Certification programs, Equipment",
    rating: 4.5,
    totalOrders: 18,
    onTimeDelivery: 89,
    averageDeliveryDays: 5.1,
    status: "active",
    notes: "Specialized in training and education materials"
  },
  {
    id: "3",
    name: "Beauty Tech Solutions",
    contactPerson: "Emma Williams",
    email: "support@beautytech.uk",
    phone: "+44 131 555 0123",
    address: "78 Technology Park",
    city: "Edinburgh",
    country: "United Kingdom",
    vatNumber: "GB456789123",
    website: "https://beautytech.uk",
    specialties: "LED therapy devices, Skincare technology, Treatment supplies",
    rating: 4.3,
    totalOrders: 12,
    onTimeDelivery: 83,
    averageDeliveryDays: 4.7,
    status: "pending_review",
    notes: "New supplier undergoing performance evaluation"
  }
];

const mockPurchaseOrders = [
  {
    id: "PO-2024-001",
    supplierId: "1",
    supplierName: "Aesthetic Supplies Ltd",
    orderNumber: "PO-2024-001",
    orderDate: "2024-08-20",
    expectedDelivery: "2024-08-25",
    status: "pending",
    totalAmount: 1850.00,
    items: [
      { productName: "Hyaluronic Acid Filler 1ml", quantity: 10, unitPrice: 85.00, total: 850.00 },
      { productName: "Botulinum Toxin 100U", quantity: 5, unitPrice: 150.00, total: 750.00 },
      { productName: "Cannula Set 25G", quantity: 25, unitPrice: 10.00, total: 250.00 }
    ],
    notes: "Urgent order for upcoming training session"
  },
  {
    id: "PO-2024-002",
    supplierId: "2",
    supplierName: "Medical Aesthetics Corp",
    orderNumber: "PO-2024-002",
    orderDate: "2024-08-18",
    expectedDelivery: "2024-08-23",
    actualDelivery: "2024-08-22",
    status: "delivered",
    totalAmount: 450.00,
    items: [
      { productName: "Training Manual - Advanced Techniques", quantity: 3, unitPrice: 120.00, total: 360.00 },
      { productName: "Practice Kit - Basic Injections", quantity: 3, unitPrice: 30.00, total: 90.00 }
    ],
    notes: "Training materials for new staff"
  }
];

interface SupplierManagementProps {
  className?: string;
}

export default function SupplierManagement({ className = "" }: SupplierManagementProps) {
  const [showSupplierDialog, setShowSupplierDialog] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const supplierForm = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
  });

  const orderForm = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
  });

  const filteredSuppliers = mockSuppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case "pending_review":
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Pending Review</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800"><Package className="w-3 h-3 mr-1" />Processing</Badge>;
      case "shipped":
        return <Badge className="bg-indigo-100 text-indigo-800"><TrendingUp className="w-3 h-3 mr-1" />Shipped</Badge>;
      case "delivered":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Delivered</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs defaultValue="suppliers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="space-y-4 mt-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Supplier Management</h3>
              <p className="text-sm text-muted-foreground">Manage supplier relationships and profiles</p>
            </div>
            <Dialog open={showSupplierDialog} onOpenChange={setShowSupplierDialog}>
              <DialogTrigger asChild>
                <Button className="bg-maerose-forest text-maerose-cream">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Supplier
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-maerose-forest/40" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Suppliers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg text-maerose-forest font-serif">
                        {supplier.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{supplier.contactPerson}</p>
                    </div>
                    {getStatusBadge(supplier.status)}
                  </div>
                  <div className="flex items-center space-x-1">
                    {getRatingStars(supplier.rating)}
                    <span className="text-sm font-medium ml-2">{supplier.rating}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="w-4 h-4 mr-2" />
                      {supplier.email}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 mr-2" />
                      {supplier.phone}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {supplier.city}, {supplier.country}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Specialties</p>
                      <p className="text-sm">{supplier.specialties}</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Orders</p>
                        <p className="font-medium">{supplier.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">On-time</p>
                        <p className="font-medium text-green-600">{supplier.onTimeDelivery}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Avg Days</p>
                        <p className="font-medium">{supplier.averageDeliveryDays}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <Building2 className="w-3 h-3 mr-1" />
                      Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setShowOrderDialog(true);
                      }}
                    >
                      <Package className="w-3 h-3 mr-1" />
                      Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Purchase Orders</h3>
              <p className="text-sm text-muted-foreground">Track and manage purchase orders</p>
            </div>
            <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
              <DialogTrigger asChild>
                <Button className="bg-maerose-forest text-maerose-cream">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Order
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          {/* Purchase Orders List */}
          <div className="space-y-4">
            {mockPurchaseOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <p className="text-sm text-muted-foreground">{order.supplierName}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getOrderStatusBadge(order.status)}
                      <span className="text-lg font-bold">£{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">Order Date</Label>
                        <p>{new Date(order.orderDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Expected Delivery</Label>
                        <p>{new Date(order.expectedDelivery).toLocaleDateString()}</p>
                      </div>
                      {order.actualDelivery && (
                        <div>
                          <Label className="text-xs text-muted-foreground">Actual Delivery</Label>
                          <p className="text-green-600">{new Date(order.actualDelivery).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Order Items</Label>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm">{item.productName}</span>
                            <div className="text-sm text-muted-foreground">
                              {item.quantity} × £{item.unitPrice.toFixed(2)} = £{item.total.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.notes && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Notes</Label>
                        <p className="text-sm italic">{order.notes}</p>
                      </div>
                    )}

                    <div className="flex justify-between pt-2 border-t">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-3 h-3 mr-1" />
                          PDF
                        </Button>
                      </div>
                      {order.status === "pending" && (
                        <Button size="sm" className="bg-maerose-forest text-maerose-cream">
                          Track Order
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4 mt-6">
          <div>
            <h3 className="text-lg font-medium">Supplier Performance Metrics</h3>
            <p className="text-sm text-muted-foreground">Analyze supplier performance and reliability</p>
          </div>

          {/* Performance Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Suppliers</p>
                    <p className="text-2xl font-bold text-maerose-forest">{mockSuppliers.length}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-maerose-sage" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Active Orders</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {mockPurchaseOrders.filter(order => order.status !== "delivered" && order.status !== "cancelled").length}
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Delivery Time</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {(mockSuppliers.reduce((acc, s) => acc + s.averageDeliveryDays, 0) / mockSuppliers.length).toFixed(1)} days
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">On-time Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(mockSuppliers.reduce((acc, s) => acc + s.onTimeDelivery, 0) / mockSuppliers.length)}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Supplier Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Supplier</th>
                      <th className="text-left p-2">Rating</th>
                      <th className="text-left p-2">Total Orders</th>
                      <th className="text-left p-2">On-time Delivery</th>
                      <th className="text-left p-2">Avg Delivery Days</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSuppliers.map((supplier) => (
                      <tr key={supplier.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div>
                            <p className="font-medium">{supplier.name}</p>
                            <p className="text-xs text-muted-foreground">{supplier.contactPerson}</p>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center">
                            {getRatingStars(supplier.rating).slice(0, 5)}
                            <span className="ml-2 text-sm">{supplier.rating}</span>
                          </div>
                        </td>
                        <td className="p-2 font-medium">{supplier.totalOrders}</td>
                        <td className="p-2">
                          <span className={`font-medium ${supplier.onTimeDelivery >= 95 ? 'text-green-600' : supplier.onTimeDelivery >= 85 ? 'text-orange-600' : 'text-red-600'}`}>
                            {supplier.onTimeDelivery}%
                          </span>
                        </td>
                        <td className="p-2 font-medium">{supplier.averageDeliveryDays}</td>
                        <td className="p-2">{getStatusBadge(supplier.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Supplier Dialog */}
      <Dialog open={showSupplierDialog} onOpenChange={setShowSupplierDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>
              Add a new supplier to your network
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={supplierForm.handleSubmit((data) => console.log(data))}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="name">Company Name *</Label>
                <Input {...supplierForm.register("name")} />
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input {...supplierForm.register("contactPerson")} />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input type="email" {...supplierForm.register("email")} />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input {...supplierForm.register("phone")} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input {...supplierForm.register("address")} />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input {...supplierForm.register("city")} />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input {...supplierForm.register("country")} />
              </div>
              <div>
                <Label htmlFor="vatNumber">VAT Number</Label>
                <Input {...supplierForm.register("vatNumber")} />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input {...supplierForm.register("website")} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="specialties">Specialties</Label>
                <Textarea {...supplierForm.register("specialties")} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea {...supplierForm.register("notes")} />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowSupplierDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-maerose-forest text-maerose-cream">
                Add Supplier
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
