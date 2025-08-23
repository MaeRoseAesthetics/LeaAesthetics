import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Payment } from "@shared/schema";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Payments() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  const { data: payments = [], isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
    enabled: isAuthenticated,
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

  const formatAmount = (amount: string) => {
    return `£${parseFloat(amount).toFixed(2)}`;
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

  // Calculate summary stats
  const totalRevenue = payments
    .filter((p: any) => p.status === 'completed')
    .reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0);

  const pendingAmount = payments
    .filter((p: any) => p.status === 'pending')
    .reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0);

  const todayPayments = payments.filter((p: any) => {
    const paymentDate = new Date(p.createdAt);
    const today = new Date();
    return paymentDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayPayments
    .filter((p: any) => p.status === 'completed')
    .reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0);

  return (
    <div className="min-h-screen bg-clinical-grey">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="bg-white border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
                    Payment Processing
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Secure payments with age verification compliance
                  </p>
                </div>
                <Button data-testid="button-export-payments">
                  <i className="fas fa-download mr-2"></i>Export Report
                </Button>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Payment Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-success rounded-md flex items-center justify-center">
                        <i className="fas fa-pound-sign text-white text-sm"></i>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
                      <p className="text-2xl font-semibold text-gray-900" data-testid="text-today-revenue">
                        {formatAmount(todayRevenue.toString())}
                      </p>
                      <p className="text-sm text-gray-500" data-testid="text-today-count">
                        {todayPayments.length} transactions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-warning rounded-md flex items-center justify-center">
                        <i className="fas fa-clock text-white text-sm"></i>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Pending Payments</p>
                      <p className="text-2xl font-semibold text-gray-900" data-testid="text-pending-amount">
                        {formatAmount(pendingAmount.toString())}
                      </p>
                      <p className="text-sm text-gray-500" data-testid="text-pending-count">
                        {payments.filter((p: any) => p.status === 'pending').length} outstanding
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-medical-blue rounded-md flex items-center justify-center">
                        <i className="fas fa-chart-line text-white text-sm"></i>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                      <p className="text-2xl font-semibold text-gray-900" data-testid="text-total-revenue">
                        {formatAmount(totalRevenue.toString())}
                      </p>
                      <p className="text-sm text-gray-500">
                        {payments.filter((p: any) => p.status === 'completed').length} completed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <i className="fas fa-shield-alt text-white text-sm"></i>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Age Verified</p>
                      <p className="text-2xl font-semibold text-gray-900" data-testid="text-verified-count">
                        {payments.filter((p: any) => p.ageVerified).length}
                      </p>
                      <p className="text-sm text-gray-500">
                        {Math.round((payments.filter((p: any) => p.ageVerified).length / payments.length) * 100) || 0}% compliance
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="fas fa-credit-card text-4xl text-gray-400 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
                    <p className="text-gray-500">
                      Payment transactions will appear here once bookings are made
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Client/Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Age Verified
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {payments.map((payment: any) => (
                          <tr key={payment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {payment.clientId ? 'Client' : 'Student'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {payment.bookingId ? 'Treatment' : payment.enrollmentId ? 'Course Enrollment' : 'Payment'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`text-amount-${payment.id}`}>
                              {formatAmount(payment.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={getStatusBadgeVariant(payment.status)}>
                                {payment.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {payment.ageVerified ? (
                                <i className="fas fa-check-circle text-success" data-testid={`icon-verified-${payment.id}`}></i>
                              ) : (
                                <i className="fas fa-exclamation-triangle text-warning" data-testid={`icon-unverified-${payment.id}`}></i>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(payment.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button
                                variant="ghost"
                                size="sm"
                                data-testid={`button-view-payment-${payment.id}`}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
