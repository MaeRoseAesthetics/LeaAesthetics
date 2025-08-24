import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Calendar, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Target,
  Award,
  Star,
  Heart,
  Zap,
  Eye,
  BarChart3
} from 'lucide-react';

interface AnalyticsOverviewProps {
  dateRange: string;
}

// Mock data for different date ranges
const getMockData = (dateRange: string) => {
  const baseData = {
    '7d': {
      totalRevenue: 12480,
      revenueChange: 8.2,
      totalClients: 47,
      clientsChange: 12.5,
      totalTreatments: 89,
      treatmentsChange: 15.3,
      avgSatisfaction: 4.8,
      satisfactionChange: 2.1,
      topTreatments: [
        { name: 'Botox', count: 23, revenue: 4600 },
        { name: 'Dermal Fillers', count: 18, revenue: 3600 },
        { name: 'Chemical Peel', count: 15, revenue: 1800 },
      ],
      revenueByDay: [
        { day: 'Mon', revenue: 1850 },
        { day: 'Tue', revenue: 2100 },
        { day: 'Wed', revenue: 1650 },
        { day: 'Thu', revenue: 2200 },
        { day: 'Fri', revenue: 2480 },
        { day: 'Sat', revenue: 1200 },
        { day: 'Sun', revenue: 1000 },
      ],
    },
    '30d': {
      totalRevenue: 54230,
      revenueChange: 12.8,
      totalClients: 186,
      clientsChange: 18.7,
      totalTreatments: 342,
      treatmentsChange: 22.1,
      avgSatisfaction: 4.7,
      satisfactionChange: 1.5,
      topTreatments: [
        { name: 'Botox', count: 89, revenue: 17800 },
        { name: 'Dermal Fillers', count: 67, revenue: 13400 },
        { name: 'Chemical Peel', count: 54, revenue: 6480 },
      ],
      revenueByDay: [],
    },
    '90d': {
      totalRevenue: 168750,
      revenueChange: 15.2,
      totalClients: 532,
      clientsChange: 24.3,
      totalTreatments: 987,
      treatmentsChange: 28.9,
      avgSatisfaction: 4.6,
      satisfactionChange: 0.8,
      topTreatments: [
        { name: 'Botox', count: 245, revenue: 49000 },
        { name: 'Dermal Fillers', count: 198, revenue: 39600 },
        { name: 'Chemical Peel', count: 156, revenue: 18720 },
      ],
      revenueByDay: [],
    },
    '1y': {
      totalRevenue: 687420,
      revenueChange: 19.6,
      totalClients: 2184,
      clientsChange: 31.4,
      totalTreatments: 4156,
      treatmentsChange: 35.7,
      avgSatisfaction: 4.5,
      satisfactionChange: 0.3,
      topTreatments: [
        { name: 'Botox', count: 1024, revenue: 204800 },
        { name: 'Dermal Fillers', count: 876, revenue: 175200 },
        { name: 'Chemical Peel', count: 687, revenue: 82440 },
      ],
      revenueByDay: [],
    },
  };

  return baseData[dateRange as keyof typeof baseData] || baseData['30d'];
};

export default function AnalyticsOverview({ dateRange }: AnalyticsOverviewProps) {
  const data = useMemo(() => getMockData(dateRange), [dateRange]);

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-lea-deep-charcoal">
                  {formatCurrency(data.totalRevenue)}
                </div>
                <div className={`flex items-center text-sm ${getChangeColor(data.revenueChange)}`}>
                  {getChangeIcon(data.revenueChange)}
                  <span className="ml-1">+{data.revenueChange}% vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Clients */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-lea-deep-charcoal">
                  {data.totalClients.toLocaleString()}
                </div>
                <div className={`flex items-center text-sm ${getChangeColor(data.clientsChange)}`}>
                  {getChangeIcon(data.clientsChange)}
                  <span className="ml-1">+{data.clientsChange}% vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Treatments */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Treatments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-lea-deep-charcoal">
                  {data.totalTreatments.toLocaleString()}
                </div>
                <div className={`flex items-center text-sm ${getChangeColor(data.treatmentsChange)}`}>
                  {getChangeIcon(data.treatmentsChange)}
                  <span className="ml-1">+{data.treatmentsChange}% vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Satisfaction */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-lea-deep-charcoal">
                  {data.avgSatisfaction}/5.0
                </div>
                <div className={`flex items-center text-sm ${getChangeColor(data.satisfactionChange)}`}>
                  {getChangeIcon(data.satisfactionChange)}
                  <span className="ml-1">+{data.satisfactionChange}% vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Treatments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Top Treatments
            </CardTitle>
            <CardDescription>Most popular treatments by volume and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topTreatments.map((treatment, index) => (
                <div key={treatment.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-lea-sage-green text-white rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-lea-deep-charcoal">{treatment.name}</p>
                      <p className="text-sm text-muted-foreground">{treatment.count} treatments</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-lea-deep-charcoal">
                      {formatCurrency(treatment.revenue)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(treatment.revenue / treatment.count)} avg
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Quick Insights
            </CardTitle>
            <CardDescription>Key business insights and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Revenue Growth</p>
                    <p className="text-sm text-green-700">
                      Revenue is up {data.revenueChange}% compared to the previous period. 
                      Botox treatments are driving the majority of this growth.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Client Acquisition</p>
                    <p className="text-sm text-blue-700">
                      New client acquisition is strong with {data.clientsChange}% growth. 
                      Focus on retention strategies to maximize lifetime value.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Client Satisfaction</p>
                    <p className="text-sm text-yellow-700">
                      Satisfaction scores remain high at {data.avgSatisfaction}/5.0. 
                      Continue monitoring feedback to maintain quality standards.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Activity className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-900">Treatment Volume</p>
                    <p className="text-sm text-purple-700">
                      Treatment volume increased by {data.treatmentsChange}%. 
                      Consider expanding available appointment slots during peak times.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Revenue Trend (for 7-day view) */}
      {dateRange === '7d' && data.revenueByDay.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Daily Revenue Trend
            </CardTitle>
            <CardDescription>Revenue breakdown by day of the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.revenueByDay.map((day) => {
                const maxRevenue = Math.max(...data.revenueByDay.map(d => d.revenue));
                const percentage = (day.revenue / maxRevenue) * 100;
                
                return (
                  <div key={day.day} className="flex items-center justify-between">
                    <div className="w-12 text-sm font-medium text-muted-foreground">
                      {day.day}
                    </div>
                    <div className="flex-1 mx-4">
                      <Progress value={percentage} className="h-3" />
                    </div>
                    <div className="w-20 text-right text-sm font-medium text-lea-deep-charcoal">
                      {formatCurrency(day.revenue)}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Performance Goals
          </CardTitle>
          <CardDescription>Track progress towards monthly targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Revenue Goal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Monthly Revenue Target</span>
                <span className="text-sm text-muted-foreground">78%</span>
              </div>
              <Progress value={78} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatCurrency(54230)} achieved</span>
                <span>{formatCurrency(70000)} target</span>
              </div>
            </div>

            {/* Client Goal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New Clients Target</span>
                <span className="text-sm text-muted-foreground">93%</span>
              </div>
              <Progress value={93} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>186 achieved</span>
                <span>200 target</span>
              </div>
            </div>

            {/* Satisfaction Goal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Satisfaction Target</span>
                <span className="text-sm text-muted-foreground">94%</span>
              </div>
              <Progress value={94} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>4.7/5.0 achieved</span>
                <span>5.0/5.0 target</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
