import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  Calculator,
  Percent,
  Eye,
  Download
} from 'lucide-react';

interface RevenueAnalyticsProps {
  dateRange: string;
}

// Mock revenue data for different date ranges
const getRevenueData = (dateRange: string) => {
  const baseData = {
    '7d': {
      totalRevenue: 12480,
      previousRevenue: 11500,
      grossProfit: 8736,
      previousGrossProfit: 8050,
      netProfit: 6240,
      previousNetProfit: 5750,
      costOfGoods: 3744,
      operatingExpenses: 2496,
      profitMargin: 50.0,
      previousProfitMargin: 50.0,
      revenueByTreatment: [
        { name: 'Botox', revenue: 4600, percentage: 36.9, profit: 3220 },
        { name: 'Dermal Fillers', revenue: 3600, percentage: 28.8, profit: 2520 },
        { name: 'Chemical Peel', revenue: 1800, percentage: 14.4, profit: 1260 },
        { name: 'Microneedling', revenue: 1480, percentage: 11.9, profit: 1036 },
        { name: 'Laser Treatment', revenue: 1000, percentage: 8.0, profit: 700 },
      ],
      paymentMethods: [
        { method: 'Card', amount: 7488, percentage: 60.0, count: 52 },
        { method: 'Cash', amount: 2496, percentage: 20.0, count: 18 },
        { method: 'Bank Transfer', amount: 1872, percentage: 15.0, count: 12 },
        { method: 'Finance', amount: 624, percentage: 5.0, count: 3 },
      ],
    },
    '30d': {
      totalRevenue: 54230,
      previousRevenue: 47890,
      grossProfit: 37961,
      previousGrossProfit: 33523,
      netProfit: 27115,
      previousNetProfit: 23945,
      costOfGoods: 16269,
      operatingExpenses: 10846,
      profitMargin: 50.0,
      previousProfitMargin: 50.0,
      revenueByTreatment: [
        { name: 'Botox', revenue: 17800, percentage: 32.8, profit: 12460 },
        { name: 'Dermal Fillers', revenue: 13400, percentage: 24.7, profit: 9380 },
        { name: 'Chemical Peel', revenue: 6480, percentage: 12.0, profit: 4536 },
        { name: 'Microneedling', revenue: 8130, percentage: 15.0, profit: 5691 },
        { name: 'Laser Treatment', revenue: 8420, percentage: 15.5, profit: 5894 },
      ],
      paymentMethods: [
        { method: 'Card', amount: 32538, percentage: 60.0, count: 198 },
        { method: 'Cash', amount: 10846, percentage: 20.0, count: 72 },
        { method: 'Bank Transfer', amount: 8135, percentage: 15.0, count: 48 },
        { method: 'Finance', amount: 2711, percentage: 5.0, count: 12 },
      ],
    },
    '90d': {
      totalRevenue: 168750,
      previousRevenue: 143640,
      grossProfit: 118125,
      previousGrossProfit: 100548,
      netProfit: 84375,
      previousNetProfit: 71820,
      costOfGoods: 50625,
      operatingExpenses: 33750,
      profitMargin: 50.0,
      previousProfitMargin: 50.0,
      revenueByTreatment: [
        { name: 'Botox', revenue: 55687, percentage: 33.0, profit: 38981 },
        { name: 'Dermal Fillers', revenue: 42200, percentage: 25.0, profit: 29540 },
        { name: 'Chemical Peel', revenue: 21094, percentage: 12.5, profit: 14766 },
        { name: 'Microneedling', revenue: 25313, percentage: 15.0, profit: 17719 },
        { name: 'Laser Treatment', revenue: 24456, percentage: 14.5, profit: 17119 },
      ],
      paymentMethods: [
        { method: 'Card', amount: 101250, percentage: 60.0, count: 612 },
        { method: 'Cash', amount: 33750, percentage: 20.0, count: 198 },
        { method: 'Bank Transfer', amount: 25313, percentage: 15.0, count: 144 },
        { method: 'Finance', amount: 8437, percentage: 5.0, count: 36 },
      ],
    },
    '1y': {
      totalRevenue: 687420,
      previousRevenue: 578640,
      grossProfit: 481194,
      previousGrossProfit: 405048,
      netProfit: 343710,
      previousNetProfit: 289320,
      costOfGoods: 206226,
      operatingExpenses: 137484,
      profitMargin: 50.0,
      previousProfitMargin: 50.0,
      revenueByTreatment: [
        { name: 'Botox', revenue: 220778, percentage: 32.1, profit: 154545 },
        { name: 'Dermal Fillers', revenue: 171855, percentage: 25.0, profit: 120299 },
        { name: 'Chemical Peel', revenue: 85928, percentage: 12.5, profit: 60150 },
        { name: 'Microneedling', revenue: 103113, percentage: 15.0, profit: 72179 },
        { name: 'Laser Treatment', revenue: 105746, percentage: 15.4, profit: 74022 },
      ],
      paymentMethods: [
        { method: 'Card', amount: 412452, percentage: 60.0, count: 2487 },
        { method: 'Cash', amount: 137484, percentage: 20.0, count: 798 },
        { method: 'Bank Transfer', amount: 103113, percentage: 15.0, count: 576 },
        { method: 'Finance', amount: 34371, percentage: 5.0, count: 147 },
      ],
    },
  };

  return baseData[dateRange as keyof typeof baseData] || baseData['30d'];
};

export default function RevenueAnalytics({ dateRange }: RevenueAnalyticsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const data = useMemo(() => getRevenueData(dateRange), [dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const getChangePercentage = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getChangeIcon = (current: number, previous: number) => {
    const change = current - previous;
    return change >= 0 ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    );
  };

  const getChangeColor = (current: number, previous: number) => {
    const change = current - previous;
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        {/* Revenue Overview */}
        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Key Revenue Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Revenue */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-lea-deep-charcoal">
                        {formatCurrency(data.totalRevenue)}
                      </div>
                      <div className={`flex items-center text-sm ${getChangeColor(data.totalRevenue, data.previousRevenue)}`}>
                        {getChangeIcon(data.totalRevenue, data.previousRevenue)}
                        <span className="ml-1">
                          {getChangePercentage(data.totalRevenue, data.previousRevenue)}% vs last period
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gross Profit */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Gross Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-lea-deep-charcoal">
                        {formatCurrency(data.grossProfit)}
                      </div>
                      <div className={`flex items-center text-sm ${getChangeColor(data.grossProfit, data.previousGrossProfit)}`}>
                        {getChangeIcon(data.grossProfit, data.previousGrossProfit)}
                        <span className="ml-1">
                          {getChangePercentage(data.grossProfit, data.previousGrossProfit)}% vs last period
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Calculator className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Net Profit */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-lea-deep-charcoal">
                        {formatCurrency(data.netProfit)}
                      </div>
                      <div className={`flex items-center text-sm ${getChangeColor(data.netProfit, data.previousNetProfit)}`}>
                        {getChangeIcon(data.netProfit, data.previousNetProfit)}
                        <span className="ml-1">
                          {getChangePercentage(data.netProfit, data.previousNetProfit)}% vs last period
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Target className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profit Margin */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Profit Margin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-lea-deep-charcoal">
                        {data.profitMargin}%
                      </div>
                      <div className={`flex items-center text-sm ${getChangeColor(data.profitMargin, data.previousProfitMargin)}`}>
                        {getChangeIcon(data.profitMargin, data.previousProfitMargin)}
                        <span className="ml-1">
                          {getChangePercentage(data.profitMargin, data.previousProfitMargin)}% vs last period
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Percent className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Revenue Breakdown
                </CardTitle>
                <CardDescription>Revenue distribution across different areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Cost Breakdown */}
                  <div>
                    <h4 className="font-medium text-lea-deep-charcoal mb-4">Cost Structure</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Revenue</span>
                        <span className="font-medium">{formatCurrency(data.totalRevenue)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-red-600">Cost of Goods</span>
                        <span className="text-red-600 font-medium">-{formatCurrency(data.costOfGoods)}</span>
                      </div>
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-sm font-medium">Gross Profit</span>
                        <span className="font-bold text-green-600">{formatCurrency(data.grossProfit)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-red-600">Operating Expenses</span>
                        <span className="text-red-600 font-medium">-{formatCurrency(data.operatingExpenses)}</span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-2">
                        <span className="font-medium">Net Profit</span>
                        <span className="font-bold text-green-600">{formatCurrency(data.netProfit)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Margin Analysis */}
                  <div>
                    <h4 className="font-medium text-lea-deep-charcoal mb-4">Margin Analysis</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Gross Margin</span>
                          <span className="text-sm font-medium">
                            {((data.grossProfit / data.totalRevenue) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={(data.grossProfit / data.totalRevenue) * 100} 
                          className="h-2" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Net Margin</span>
                          <span className="text-sm font-medium">
                            {((data.netProfit / data.totalRevenue) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={(data.netProfit / data.totalRevenue) * 100} 
                          className="h-2" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Cost Ratio</span>
                          <span className="text-sm font-medium">
                            {(((data.costOfGoods + data.operatingExpenses) / data.totalRevenue) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={((data.costOfGoods + data.operatingExpenses) / data.totalRevenue) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Treatment Revenue Breakdown */}
        <TabsContent value="breakdown">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Revenue by Treatment
              </CardTitle>
              <CardDescription>Detailed breakdown of revenue by treatment type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.revenueByTreatment.map((treatment, index) => (
                  <div key={treatment.name} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-lea-sage-green text-white rounded-full text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-lea-deep-charcoal">{treatment.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {treatment.percentage}% of total revenue
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lea-deep-charcoal">
                          {formatCurrency(treatment.revenue)}
                        </p>
                        <p className="text-sm text-green-600">
                          {formatCurrency(treatment.profit)} profit
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Revenue Share</p>
                        <Progress value={treatment.percentage} className="h-2" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Profit Margin: {((treatment.profit / treatment.revenue) * 100).toFixed(1)}%
                        </p>
                        <Progress 
                          value={(treatment.profit / treatment.revenue) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Analysis */}
        <TabsContent value="payments">
          <div className="space-y-6">
            {/* Payment Method Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.paymentMethods.map((payment) => (
                <Card key={payment.method}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {payment.method}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-lea-deep-charcoal">
                        {formatCurrency(payment.amount)}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {payment.count} transactions
                        </span>
                        <Badge variant="outline">
                          {payment.percentage}%
                        </Badge>
                      </div>
                      <Progress value={payment.percentage} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Payment Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method Analysis
                </CardTitle>
                <CardDescription>Detailed breakdown of payment preferences and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {data.paymentMethods.map((payment) => (
                    <div key={payment.method} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {payment.method === 'Card' && <CreditCard className="h-5 w-5" />}
                          {payment.method === 'Cash' && <Banknote className="h-5 w-5" />}
                          {payment.method === 'Bank Transfer' && <DollarSign className="h-5 w-5" />}
                          {payment.method === 'Finance' && <Calculator className="h-5 w-5" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-lea-deep-charcoal">{payment.method}</h4>
                          <p className="text-sm text-muted-foreground">
                            {payment.count} transactions • Avg: {formatCurrency(payment.amount / payment.count)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lea-deep-charcoal">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payment.percentage}% of total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-lea-deep-charcoal mb-4">Payment Insights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                      <p className="font-medium text-blue-900">Card Dominance</p>
                      <p className="text-sm text-blue-700">
                        60% of payments are by card, indicating strong digital payment adoption
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-lg">
                      <p className="font-medium text-green-900">Cash Flow</p>
                      <p className="text-sm text-green-700">
                        20% cash payments provide immediate liquidity for operations
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
                      <p className="font-medium text-purple-900">Finance Options</p>
                      <p className="text-sm text-purple-700">
                        5% financing enables higher-value treatments accessibility
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Forecasting */}
        <TabsContent value="forecasting">
          <div className="space-y-6">
            {/* Forecast Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Next Month Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-lea-deep-charcoal mb-2">
                    {formatCurrency(Math.round(data.totalRevenue * 1.15))}
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+15% projected growth</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Quarter Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-lea-deep-charcoal mb-2">
                    {formatCurrency(Math.round(data.totalRevenue * 3.2))}
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+20% vs last quarter</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Annual Target</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-lea-deep-charcoal mb-2">
                    {formatCurrency(800000)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {((data.totalRevenue * 12 / 800000) * 100).toFixed(1)}% of annual target
                  </div>
                  <Progress 
                    value={(data.totalRevenue * 12 / 800000) * 100} 
                    className="h-2 mt-2" 
                  />
                </CardContent>
              </Card>
            </div>

            {/* Forecast Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Forecast Factors
                </CardTitle>
                <CardDescription>Key factors influencing revenue projections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-lea-deep-charcoal mb-4">Growth Drivers</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm">Seasonal demand (Summer)</span>
                        <span className="text-green-600 font-medium">+25%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm">New treatment launch</span>
                        <span className="text-green-600 font-medium">+15%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm">Marketing campaign</span>
                        <span className="text-green-600 font-medium">+10%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-lea-deep-charcoal mb-4">Risk Factors</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <span className="text-sm">Economic uncertainty</span>
                        <span className="text-red-600 font-medium">-5%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <span className="text-sm">Increased competition</span>
                        <span className="text-red-600 font-medium">-3%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm">Supply chain issues</span>
                        <span className="text-yellow-600 font-medium">-2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Items */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
                <CardDescription>Strategic recommendations to achieve revenue targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Focus on High-Margin Treatments</p>
                      <p className="text-sm text-blue-700">
                        Botox and Dermal Fillers show highest profit margins. Increase capacity and marketing for these services.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-green-50 border-l-4 border-green-500 rounded-lg">
                    <CreditCard className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Promote Digital Payments</p>
                      <p className="text-sm text-green-700">
                        Card payments are preferred. Consider incentives for digital payment adoption to improve cash flow.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
                    <Calculator className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-purple-900">Expand Finance Options</p>
                      <p className="text-sm text-purple-700">
                        Finance options enable higher-value treatments. Consider partnerships with additional financing providers.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
