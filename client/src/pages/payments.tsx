import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Payment } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { format, addDays, startOfMonth, endOfMonth, parseISO, isSameDay } from "date-fns";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
  Clock,
  User,
  Download,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
  Printer,
  Send,
  Receipt
} from "lucide-react";

const paymentSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  treatmentId: z.string().optional(),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  paymentMethod: z.enum(["card", "cash", "bank_transfer", "finance"]),
  description: z.string().min(1, "Description is required"),
  dueDate: z.date().optional(),
  notes: z.string().optional(),
});

const invoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
    total: z.number().min(0),
  })),
  dueDate: z.date(),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;
type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface ExtendedPayment extends Payment {
  clientName?: string;
  clientEmail?: string;
  treatmentName?: string;
  invoiceNumber?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  notes?: string;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Treatment {
  id: string;
  name: string;
  price: number;
}

export default function Payments() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("payments");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<ExtendedPayment | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingPayment, setEditingPayment] = useState<ExtendedPayment | null>(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  // Fetch data
  const { data: payments = [], isLoading: paymentsLoading, refetch: refetchPayments } = useQuery<ExtendedPayment[]>({
    queryKey: ["/api/payments"],
    enabled: isAuthenticated,
  });

  const { data: invoices = [], isLoading: invoicesLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices"],
    enabled: isAuthenticated,
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    enabled: isAuthenticated,
  });

  const { data: treatments = [] } = useQuery<Treatment[]>({
    queryKey: ["/api/treatments"],
    enabled: isAuthenticated,
  });

  // Form handling
  const {
    register: registerPayment,
    handleSubmit: handlePaymentSubmit,
    reset: resetPayment,
    setValue: setPaymentValue,
    formState: { errors: paymentErrors, isSubmitting: isPaymentSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const {
    register: registerInvoice,
    handleSubmit: handleInvoiceSubmit,
    reset: resetInvoice,
    formState: { errors: invoiceErrors, isSubmitting: isInvoiceSubmitting },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
  });

  // Filter data
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = !searchTerm || 
      payment.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.treatmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesMethod = paymentMethodFilter === "all" || payment.paymentMethod === paymentMethodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = !searchTerm || 
      invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'sent':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'draft':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatAmount = (amount: number | string) => {
    return `£${parseFloat(amount.toString()).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "PPP");
  };

  // Calculate summary stats
  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);

  const pendingAmount = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);

  const todayPayments = payments.filter((p) => 
    isSameDay(parseISO(p.createdAt || new Date().toISOString()), new Date())
  );

  const todayRevenue = todayPayments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);

  const monthlyRevenue = payments
    .filter((p) => {
      const paymentDate = parseISO(p.createdAt || new Date().toISOString());
      const now = new Date();
      return paymentDate >= startOfMonth(now) && paymentDate <= endOfMonth(now) && p.status === 'completed';
    })
    .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);

  const handleAddPayment = useCallback(() => {
    setEditingPayment(null);
    resetPayment({
      clientId: "",
      amount: 0,
      paymentMethod: "card",
      description: "",
    });
    setIsPaymentDialogOpen(true);
  }, [resetPayment]);

  const handleAddInvoice = useCallback(() => {
    resetInvoice({
      clientId: "",
      items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
      dueDate: addDays(new Date(), 30),
    });
    setIsInvoiceDialogOpen(true);
  }, [resetInvoice]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lea-pearl-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-lea-elegant-silver border-t-lea-deep-charcoal rounded-full" />
          <p className="text-lea-charcoal-grey font-medium">Loading payments...</p>
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
                Payment Management
              </h1>
              <p className="text-lea-charcoal-grey mt-1">
                Manage payments, invoices, and financial reporting
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => refetchPayments()}
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
                Export Report
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
                    <DollarSign className="w-5 h-5 text-lea-platinum-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-lea-charcoal-grey">Today's Revenue</p>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">
                    {formatAmount(todayRevenue)}
                  </p>
                  <p className="text-xs text-lea-slate-grey">
                    {todayPayments.length} transactions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-lea-charcoal-grey">Pending</p>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">
                    {formatAmount(pendingAmount)}
                  </p>
                  <p className="text-xs text-lea-slate-grey">
                    {payments.filter(p => p.status === 'pending').length} outstanding
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-lea-elegant-silver rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-lea-deep-charcoal" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-lea-charcoal-grey">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">
                    {formatAmount(monthlyRevenue)}
                  </p>
                  <p className="text-xs text-lea-slate-grey">
                    This month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-lea-deep-charcoal rounded-lg flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-lea-platinum-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-lea-charcoal-grey">Total Revenue</p>
                  <p className="text-2xl font-bold text-lea-deep-charcoal">
                    {formatAmount(totalRevenue)}
                  </p>
                  <p className="text-xs text-lea-slate-grey">
                    All time
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList className="grid grid-cols-2 w-full sm:w-auto">
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddPayment}
                className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Payment
              </Button>
              <Button
                onClick={handleAddInvoice}
                variant="outline"
                className="border-lea-silver-grey text-lea-charcoal-grey hover:bg-lea-pearl-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lea-charcoal-grey w-4 h-4" />
                    <Input
                      placeholder="Search payments, invoices, clients..."
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
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {activeTab === "payments" && (
                    <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Methods</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal font-serif">Payment Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {paymentsLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin w-8 h-8 border-4 border-lea-elegant-silver border-t-lea-deep-charcoal rounded-full" />
                    </div>
                  ) : filteredPayments.length === 0 ? (
                    <div className="text-center py-12">
                      <CreditCard className="w-12 h-12 text-lea-charcoal-grey mx-auto mb-4" />
                      <p className="text-lea-charcoal-grey">No payments found matching your criteria</p>
                      <Button onClick={handleAddPayment} className="mt-4" variant="outline">
                        Record Payment
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-lea-deep-charcoal">
                                  {payment.clientName || 'Unknown Client'}
                                </p>
                                <p className="text-sm text-lea-charcoal-grey">
                                  {payment.clientEmail}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-lea-deep-charcoal">{payment.description || payment.treatmentName || 'Payment'}</p>
                                {payment.invoiceNumber && (
                                  <p className="text-sm text-lea-charcoal-grey">Invoice: {payment.invoiceNumber}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <CreditCard className="w-4 h-4 mr-2 text-lea-charcoal-grey" />
                                <span className="capitalize">{payment.paymentMethod?.replace('_', ' ')}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-lea-deep-charcoal">
                              {formatAmount(payment.amount)}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(payment.status)}>
                                {payment.status?.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-lea-charcoal-grey">
                              {formatDate(payment.createdAt || new Date().toISOString())}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
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
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal font-serif">Invoice Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {invoicesLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin w-8 h-8 border-4 border-lea-elegant-silver border-t-lea-deep-charcoal rounded-full" />
                    </div>
                  ) : filteredInvoices.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-lea-charcoal-grey mx-auto mb-4" />
                      <p className="text-lea-charcoal-grey">No invoices found</p>
                      <Button onClick={handleAddInvoice} className="mt-4" variant="outline">
                        Create Invoice
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Issue Date</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInvoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium text-lea-deep-charcoal">
                              {invoice.invoiceNumber}
                            </TableCell>
                            <TableCell>{invoice.clientName}</TableCell>
                            <TableCell className="font-medium">
                              {formatAmount(invoice.total)}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(invoice.status)}>
                                {invoice.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                            <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Printer className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Send className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPayment ? "Edit Payment" : "Record New Payment"}
            </DialogTitle>
          </DialogHeader>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientId">Client *</Label>
                <Select onValueChange={(value) => setPaymentValue("clientId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.firstName} {client.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="treatmentId">Treatment (Optional)</Label>
                <Select onValueChange={(value) => setPaymentValue("treatmentId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select treatment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No specific treatment</SelectItem>
                    {treatments.map((treatment) => (
                      <SelectItem key={treatment.id} value={treatment.id}>
                        {treatment.name} - {formatAmount(treatment.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  {...registerPayment("amount", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select onValueChange={(value) => setPaymentValue("paymentMethod", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="finance">Finance Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Input
                {...registerPayment("description")}
                placeholder="Payment description"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                {...registerPayment("notes")}
                placeholder="Additional notes"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPaymentDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPaymentSubmitting}
                className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal"
              >
                {isPaymentSubmitting ? "Saving..." : editingPayment ? "Update Payment" : "Record Payment"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
