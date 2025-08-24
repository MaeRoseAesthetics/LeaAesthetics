import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { format, parseISO } from 'date-fns';

type PaymentRecord = {
  id: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'cash' | 'bank_transfer';
  description: string;
  clientName?: string;
  studentName?: string;
  treatmentType?: string;
  courseTitle?: string;
  createdAt: string;
  updatedAt: string;
  stripePaymentId?: string;
  invoiceNumber?: string;
  refundAmount?: number;
  refundReason?: string;
  metadata?: Record<string, any>;
};

type PaymentHistoryProps = {
  clientId?: string;
  studentId?: string;
  limit?: number;
  showFilters?: boolean;
};

export default function PaymentHistory({ 
  clientId, 
  studentId, 
  limit, 
  showFilters = true 
}: PaymentHistoryProps) {
  const isMobile = useIsMobile();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  
  const { data: payments, isLoading } = useQuery<PaymentRecord[]>({
    queryKey: [`/api/payments`, { clientId, studentId, status: statusFilter, type: typeFilter, search: searchQuery, limit }],
    initialData: [
      {
        id: 'pay_1',
        amount: 25000, // £250.00 in pence
        currency: 'GBP',
        status: 'completed',
        paymentMethod: 'card',
        description: 'Botox Treatment - Forehead Lines',
        clientName: 'Sarah Johnson',
        treatmentType: 'Botox',
        createdAt: '2024-02-20T14:30:00Z',
        updatedAt: '2024-02-20T14:32:00Z',
        stripePaymentId: 'pi_1234567890',
        invoiceNumber: 'INV-2024-001'
      },
      {
        id: 'pay_2',
        amount: 89500, // £895.00 in pence
        currency: 'GBP',
        status: 'completed',
        paymentMethod: 'card',
        description: 'Advanced Facial Aesthetics Course',
        studentName: 'Emma Thompson',
        courseTitle: 'Advanced Facial Aesthetics',
        createdAt: '2024-02-18T10:15:00Z',
        updatedAt: '2024-02-18T10:17:00Z',
        stripePaymentId: 'pi_0987654321',
        invoiceNumber: 'INV-2024-002'
      },
      {
        id: 'pay_3',
        amount: 18500, // £185.00 in pence
        currency: 'GBP',
        status: 'pending',
        paymentMethod: 'bank_transfer',
        description: 'Dermal Filler Treatment - Lips',
        clientName: 'Lisa Brown',
        treatmentType: 'Dermal Fillers',
        createdAt: '2024-02-15T16:45:00Z',
        updatedAt: '2024-02-15T16:45:00Z',
        invoiceNumber: 'INV-2024-003'
      },
      {
        id: 'pay_4',
        amount: 15000, // £150.00 in pence
        currency: 'GBP',
        status: 'refunded',
        paymentMethod: 'card',
        description: 'Chemical Peel Treatment',
        clientName: 'Michael Chen',
        treatmentType: 'Chemical Peel',
        createdAt: '2024-02-10T11:20:00Z',
        updatedAt: '2024-02-12T09:30:00Z',
        stripePaymentId: 'pi_1122334455',
        invoiceNumber: 'INV-2024-004',
        refundAmount: 15000,
        refundReason: 'Client cancelled due to medical contraindications'
      }
    ]
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return 'fas fa-credit-card';
      case 'cash': return 'fas fa-money-bills';
      case 'bank_transfer': return 'fas fa-university';
      default: return 'fas fa-payment';
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    const value = amount / 100; // Convert from pence to pounds
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency
    }).format(value);
  };

  const filteredPayments = payments?.filter(payment => {
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesType = typeFilter === 'all' || 
      (typeFilter === 'treatment' && payment.treatmentType) ||
      (typeFilter === 'course' && payment.courseTitle);
    const matchesSearch = !searchQuery || 
      payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-lea-deep-charcoal`}>
            Payment History
          </h2>
          <p className="text-sm text-lea-charcoal-grey">
            Track all payments and transactions
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <i className="fas fa-download mr-2"></i>
            Export
          </Button>
          <Button size="sm" className="bg-lea-clinical-blue hover:bg-blue-700">
            <i className="fas fa-plus mr-2"></i>
            Record Payment
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="border border-lea-silver-grey">
          <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-4 gap-4'}`}>
              <div>
                <label className="text-sm font-medium text-lea-deep-charcoal mb-2 block">
                  Search
                </label>
                <Input
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-lea-deep-charcoal mb-2 block">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-lea-deep-charcoal mb-2 block">
                  Type
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="treatment">Treatments</SelectItem>
                    <SelectItem value="course">Courses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setStatusFilter('all');
                    setTypeFilter('all');
                    setSearchQuery('');
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Summary */}
      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4`}>
        <Card className="border border-lea-silver-grey">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-lea-deep-charcoal">
              {filteredPayments?.filter(p => p.status === 'completed').length || 0}
            </div>
            <p className="text-sm text-lea-charcoal-grey">Completed</p>
          </CardContent>
        </Card>
        <Card className="border border-lea-silver-grey">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredPayments?.filter(p => p.status === 'pending').length || 0}
            </div>
            <p className="text-sm text-lea-charcoal-grey">Pending</p>
          </CardContent>
        </Card>
        <Card className="border border-lea-silver-grey">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatAmount(
                filteredPayments?.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0) || 0,
                'GBP'
              )}
            </div>
            <p className="text-sm text-lea-charcoal-grey">Total Revenue</p>
          </CardContent>
        </Card>
        <Card className="border border-lea-silver-grey">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatAmount(
                filteredPayments?.filter(p => p.status === 'refunded').reduce((sum, p) => sum + (p.refundAmount || 0), 0) || 0,
                'GBP'
              )}
            </div>
            <p className="text-sm text-lea-charcoal-grey">Refunded</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Table */}
      <Card className="border border-lea-silver-grey shadow-lea-card">
        <CardContent className="p-0">
          {isMobile ? (
            <ScrollArea className="h-96">
              <div className="p-4 space-y-4">
                {filteredPayments?.map((payment) => (
                  <div key={payment.id} className="border border-lea-silver-grey rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <i className={`${getPaymentMethodIcon(payment.paymentMethod)} text-lea-charcoal-grey`}></i>
                        <span className="font-medium text-lea-deep-charcoal">
                          {formatAmount(payment.amount, payment.currency)}
                        </span>
                      </div>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium text-lea-deep-charcoal">{payment.description}</p>
                      <p className="text-sm text-lea-charcoal-grey">
                        {payment.clientName || payment.studentName}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-lea-charcoal-grey">
                      <span>{payment.invoiceNumber}</span>
                      <span>{format(parseISO(payment.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedPayment(payment)}
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </div>
                )) || []}
              </div>
            </ScrollArea>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Client/Student</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments?.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {format(parseISO(payment.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {payment.invoiceNumber}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.description}</p>
                        {payment.treatmentType && (
                          <p className="text-sm text-gray-500">{payment.treatmentType}</p>
                        )}
                        {payment.courseTitle && (
                          <p className="text-sm text-gray-500">{payment.courseTitle}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {payment.clientName || payment.studentName || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <i className={`${getPaymentMethodIcon(payment.paymentMethod)} text-gray-500`}></i>
                        <span className="capitalize">{payment.paymentMethod.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatAmount(payment.amount, payment.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <i className="fas fa-eye"></i>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Payment Details</DialogTitle>
                          </DialogHeader>
                          {selectedPayment && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">Payment Information</h4>
                                  <dl className="space-y-2 text-sm">
                                    <div>
                                      <dt className="text-gray-500">Amount</dt>
                                      <dd className="font-medium">{formatAmount(selectedPayment.amount, selectedPayment.currency)}</dd>
                                    </div>
                                    <div>
                                      <dt className="text-gray-500">Status</dt>
                                      <dd>
                                        <Badge className={getStatusColor(selectedPayment.status)}>
                                          {selectedPayment.status}
                                        </Badge>
                                      </dd>
                                    </div>
                                    <div>
                                      <dt className="text-gray-500">Payment Method</dt>
                                      <dd className="capitalize">{selectedPayment.paymentMethod.replace('_', ' ')}</dd>
                                    </div>
                                    <div>
                                      <dt className="text-gray-500">Invoice Number</dt>
                                      <dd><code>{selectedPayment.invoiceNumber}</code></dd>
                                    </div>
                                  </dl>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">Service Details</h4>
                                  <dl className="space-y-2 text-sm">
                                    <div>
                                      <dt className="text-gray-500">Description</dt>
                                      <dd>{selectedPayment.description}</dd>
                                    </div>
                                    <div>
                                      <dt className="text-gray-500">Client/Student</dt>
                                      <dd>{selectedPayment.clientName || selectedPayment.studentName}</dd>
                                    </div>
                                    <div>
                                      <dt className="text-gray-500">Date</dt>
                                      <dd>{format(parseISO(selectedPayment.createdAt), 'PPP')}</dd>
                                    </div>
                                  </dl>
                                </div>
                              </div>
                              
                              {selectedPayment.refundAmount && (
                                <div className="bg-purple-50 p-4 rounded-lg">
                                  <h4 className="font-medium text-purple-900 mb-2">Refund Information</h4>
                                  <dl className="space-y-2 text-sm">
                                    <div>
                                      <dt className="text-purple-700">Refund Amount</dt>
                                      <dd className="font-medium">{formatAmount(selectedPayment.refundAmount, selectedPayment.currency)}</dd>
                                    </div>
                                    {selectedPayment.refundReason && (
                                      <div>
                                        <dt className="text-purple-700">Reason</dt>
                                        <dd>{selectedPayment.refundReason}</dd>
                                      </div>
                                    )}
                                  </dl>
                                </div>
                              )}
                              
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <i className="fas fa-download mr-2"></i>
                                  Download Invoice
                                </Button>
                                {selectedPayment.status === 'completed' && (
                                  <Button variant="outline" size="sm">
                                    <i className="fas fa-undo mr-2"></i>
                                    Process Refund
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                )) || []}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
