import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Payment } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { 
  Search, 
  Download, 
  Eye, 
  RefreshCw, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Calendar as CalendarIcon,
  CreditCard,
  TrendingUp,
  FileText,
  Shield
} from "lucide-react";

interface PaymentsManagementProps {
  className?: string;
}

interface PaymentStats {
  todayRevenue: number;
  todayCount: number;
  pendingAmount: number;
  pendingCount: number;
  totalRevenue: number;
  completedCount: number;
  ageVerifiedCount: number;
  complianceRate: number;
}

export default function PaymentsManagement({ className }: PaymentsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDateRange, setFilterDateRange] = useState<{start: Date | null; end: Date | null}>({
    start: null,
    end: null
  });
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const refundPaymentMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      const response = await fetch(`/api/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to process refund');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      toast({
        title: "Refund Processed",
        description: "Payment has been successfully refunded",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Refund Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter payments based on search, status, and date range
  const filteredPayments = useMemo(() => {
    return payments.filter((payment: any) => {
      const matchesSearch = !searchTerm || 
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.clientId && payment.clientId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (payment.studentId && payment.studentId.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
      
      let matchesDate = true;
      if (filterDateRange.start && filterDateRange.end) {
        const paymentDate = new Date(payment.createdAt);
        matchesDate = isWithinInterval(paymentDate, {
          start: filterDateRange.start,
          end: filterDateRange.end
        });
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [payments, searchTerm, filterStatus, filterDateRange]);

  // Calculate statistics
  const stats: PaymentStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayPayments = payments.filter((p: any) => {
      const paymentDate = new Date(p.createdAt);
      return paymentDate >= today && paymentDate < tomorrow;
    });

    const todayRevenue = todayPayments
      .filter((p: any) => p.status === 'completed')
      .reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0);

    const pendingPayments = payments.filter((p: any) => p.status === 'pending');
    const pendingAmount = pendingPayments.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0);

    const completedPayments = payments.filter((p: any) => p.status === 'completed');
    const totalRevenue = completedPayments.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0);

    const ageVerifiedCount = payments.filter((p: any) => p.ageVerified).length;
    const complianceRate = payments.length > 0 ? Math.round((ageVerifiedCount / payments.length) * 100) : 0;

    return {
      todayRevenue,
      todayCount: todayPayments.length,
      pendingAmount,
      pendingCount: pendingPayments.length,
      totalRevenue,
      completedCount: completedPayments.length,
      ageVerifiedCount,
      complianceRate,
    };
  }, [payments]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'refunded':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      case 'refunded':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatAmount = (amount: string | number) => {
    return `£${parseFloat(amount.toString()).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailsDialogOpen(true);
  };

  const handleRefund = (payment: Payment) => {
    if (window.confirm(`Are you sure you want to refund ${formatAmount(payment.amount)}?`)) {
      refundPaymentMutation.mutate(payment.id);
    }
  };

  const handleExportReport = () => {
    // Generate CSV export
    const csvContent = [
      ['Date', 'Payment ID', 'Type', 'Amount', 'Status', 'Age Verified'],
      ...filteredPayments.map((payment: any) => [
        formatDate(payment.createdAt),
        payment.id,
        payment.clientId ? 'Treatment' : 'Course',
        formatAmount(payment.amount),
        payment.status,
        payment.ageVerified ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const setQuickDateRange = (range: 'today' | 'week' | 'month' | 'quarter') => {
    const today = new Date();
    let start: Date, end: Date;

    switch (range) {
      case 'today':
        start = new Date(today);
        start.setHours(0, 0, 0, 0);
        end = new Date(today);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        start = new Date(today);
        start.setDate(today.getDate() - 7);
        end = today;
        break;
      case 'month':
        start = startOfMonth(today);
        end = endOfMonth(today);
        break;
      case 'quarter':
        start = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        end = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3 + 3, 0);
        break;
    }

    setFilterDateRange({ start, end });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal">Payments Management</h2>
          <p className="text-lea-charcoal-grey">Track payments and financial reporting</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/payments"] })}
            className="border-lea-silver-grey"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={handleExportReport}
            className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-lea-charcoal-grey">Today's Revenue</p>
                <p className="text-xl font-bold text-lea-deep-charcoal" data-testid="today-revenue">
                  {formatAmount(stats.todayRevenue)}
                </p>
                <p className="text-sm text-lea-charcoal-grey">{stats.todayCount} transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-lea-charcoal-grey">Pending Payments</p>
                <p className="text-xl font-bold text-lea-deep-charcoal" data-testid="pending-amount">
                  {formatAmount(stats.pendingAmount)}
                </p>
                <p className="text-sm text-lea-charcoal-grey">{stats.pendingCount} outstanding</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-lea-clinical-blue/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-lea-clinical-blue" />
              </div>
              <div>
                <p className="text-sm text-lea-charcoal-grey">Total Revenue</p>
                <p className="text-xl font-bold text-lea-deep-charcoal" data-testid="total-revenue">
                  {formatAmount(stats.totalRevenue)}
                </p>
                <p className="text-sm text-lea-charcoal-grey">{stats.completedCount} completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-lea-elegant-silver/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-lea-elegant-silver" />
              </div>
              <div>
                <p className="text-sm text-lea-charcoal-grey">Age Verified</p>
                <p className="text-xl font-bold text-lea-deep-charcoal" data-testid="verified-count">
                  {stats.ageVerifiedCount}
                </p>
                <p className="text-sm text-lea-charcoal-grey">{stats.complianceRate}% compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lea-charcoal-grey w-4 h-4" />
          <Input
            placeholder="Search by payment ID or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-lea-silver-grey focus:border-lea-clinical-blue"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full lg:w-[180px] border-lea-silver-grey">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          {['Today', 'Week', 'Month', 'Quarter'].map((period) => (
            <Button
              key={period}
              size="sm"
              variant="outline"
              onClick={() => setQuickDateRange(period.toLowerCase() as any)}
              className="border-lea-silver-grey"
            >
              {period}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setFilterDateRange({ start: null, end: null })}
            className="border-lea-silver-grey"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Payments Table */}
      <Card className="bg-lea-platinum-white border-lea-silver-grey">
        <CardHeader>
          <CardTitle className="text-lea-deep-charcoal font-serif">Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin w-8 h-8 border-4 border-lea-elegant-silver border-t-lea-deep-charcoal rounded-full" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-lea-charcoal-grey mx-auto mb-4" />
              <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">
                {searchTerm || filterStatus !== 'all' || filterDateRange.start 
                  ? 'No payments found' 
                  : 'No payments yet'
                }
              </h3>
              <p className="text-lea-charcoal-grey">
                {searchTerm || filterStatus !== 'all' || filterDateRange.start
                  ? 'Try adjusting your search or filter criteria'
                  : 'Payment transactions will appear here once bookings are made'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Age Verified</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment: any) => (
                    <TableRow key={payment.id} className="hover:bg-lea-pearl-white">
                      <TableCell>
                        <div className="font-mono text-sm">
                          {payment.id.substring(0, 8)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-lea-clinical-blue rounded-full"></div>
                          <span className="text-lea-charcoal-grey">
                            {payment.clientId ? 'Treatment' : payment.studentId ? 'Course' : 'Payment'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-lea-deep-charcoal" data-testid={`amount-${payment.id}`}>
                          {formatAmount(payment.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(payment.status)} className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payment.ageVerified ? (
                          <CheckCircle className="w-4 h-4 text-green-600" data-testid={`verified-${payment.id}`} />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" data-testid={`unverified-${payment.id}`} />
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-lea-charcoal-grey text-sm">
                          {formatDate(payment.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(payment)}
                            className="text-lea-clinical-blue hover:bg-lea-clinical-blue/10"
                            data-testid={`view-${payment.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {payment.status === 'completed' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRefund(payment)}
                              className="text-red-600 hover:bg-red-50"
                              data-testid={`refund-${payment.id}`}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lea-deep-charcoal font-serif">Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-lea-deep-charcoal mb-3">Payment Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-lea-charcoal-grey">Payment ID:</span>
                      <span className="font-mono text-sm">{selectedPayment.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-lea-charcoal-grey">Amount:</span>
                      <span className="font-medium">{formatAmount(selectedPayment.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-lea-charcoal-grey">Status:</span>
                      <Badge variant={getStatusBadgeVariant(selectedPayment.status)}>
                        {selectedPayment.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-lea-charcoal-grey">Date:</span>
                      <span>{formatDate(selectedPayment.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-lea-deep-charcoal mb-3">Compliance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-lea-charcoal-grey">Age Verified:</span>
                      <div className="flex items-center space-x-2">
                        {selectedPayment.ageVerified ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">Verified</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            <span className="text-yellow-600">Pending</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-lea-charcoal-grey">Service Type:</span>
                      <span>
                        {selectedPayment.clientId ? 'Treatment' : 
                         selectedPayment.studentId ? 'Course' : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedPayment.stripePaymentIntentId && (
                <div>
                  <h4 className="font-medium text-lea-deep-charcoal mb-3">Payment Processing</h4>
                  <div className="bg-lea-pearl-white p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lea-charcoal-grey">Stripe Payment Intent:</span>
                      <span className="font-mono text-sm">{selectedPayment.stripePaymentIntentId}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsDialogOpen(false)}
                  className="border-lea-silver-grey"
                >
                  Close
                </Button>
                {selectedPayment.status === 'completed' && (
                  <Button
                    onClick={() => {
                      handleRefund(selectedPayment);
                      setIsDetailsDialogOpen(false);
                    }}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Process Refund
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
