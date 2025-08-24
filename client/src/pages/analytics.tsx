import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Calendar, 
  Activity,
  Download,
  Filter,
  RefreshCw,
  Clock,
  Target,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Eye
} from 'lucide-react';
import AnalyticsOverview from '@/components/analytics/analytics-overview';
import RevenueAnalytics from '@/components/analytics/revenue-analytics';
import ClientAnalytics from '@/components/analytics/client-analytics';
import TreatmentPerformance from '@/components/analytics/treatment-performance';
import BusinessReports from '@/components/analytics/business-reports';

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');

  return (
    <div className="min-h-screen bg-lea-pearl-white">
      {/* Header */}
      <div className="bg-white border-b border-lea-elegant-silver">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-lea-sage-green rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-lea-deep-charcoal">Analytics & Insights</h1>
                <p className="text-lea-charcoal-grey">Business intelligence and performance metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Revenue</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Clients</span>
            </TabsTrigger>
            <TabsTrigger value="treatments" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Treatments</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal">Business Overview</CardTitle>
                <CardDescription>
                  Key performance indicators and business metrics for {dateRange === '7d' ? 'the last 7 days' : 
                  dateRange === '30d' ? 'the last 30 days' : 
                  dateRange === '90d' ? 'the last 3 months' : 'the last year'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsOverview dateRange={dateRange} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal">Revenue Analytics</CardTitle>
                <CardDescription>
                  Financial performance, revenue trends, and profit analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueAnalytics dateRange={dateRange} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Client Analytics Tab */}
          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal">Client Analytics</CardTitle>
                <CardDescription>
                  Client behavior insights, retention analysis, and demographic data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientAnalytics dateRange={dateRange} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Treatment Performance Tab */}
          <TabsContent value="treatments">
            <Card>
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal">Treatment Performance</CardTitle>
                <CardDescription>
                  Treatment popularity, success rates, and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TreatmentPerformance dateRange={dateRange} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal">Business Intelligence Reports</CardTitle>
                <CardDescription>
                  Comprehensive reports, automated generation, and data exports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessReports />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
