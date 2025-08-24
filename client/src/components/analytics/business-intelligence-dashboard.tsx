import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar as CalendarIcon,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Activity,
  UserCheck,
  Repeat,
  Star,
  Trophy
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar,
  AreaChart,
  Area,
  ComposedChart,
  ScatterChart,
  Scatter
} from 'recharts';
import { format, startOfMonth, endOfMonth, subMonths, startOfWeek, endOfWeek } from 'date-fns';

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    monthly: Array<{ month: string; revenue: number; treatments: number; courses: number }>;
  };
  clients: {
    total: number;
    active: number;
    new: number;
    retention: number;
    satisfaction: number;
    demographics: Array<{ age: string; count: number; percentage: number }>;
  };
  treatments: {
    total: number;
    mostPopular: string;
    completionRate: number;
    averageRevenue: number;
    effectiveness: Array<{ treatment: string; satisfaction: number; completion: number; revenue: number }>;
  };
  courses: {
    total: number;
    enrolled: number;
    completed: number;
    passRate: number;
    revenue: number;
  };
  staff: {
    total: number;
    utilization: number;
    performance: Array<{ name: string; clients: number; revenue: number; satisfaction: number }>;
  };
}

interface ReportConfig {
  type: 'revenue' | 'clients' | 'treatments' | 'compliance' | 'custom';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  dateRange: { start: Date; end: Date };
  filters: {
    treatments?: string[];
    practitioners?: string[];
    locations?: string[];
  };
  format: 'pdf' | 'excel' | 'csv';
}

const revenueData = [
  { month: 'Jan', revenue: 12500, treatments: 85, courses: 15, target: 15000 },
  { month: 'Feb', revenue: 14200, treatments: 98, courses: 18, target: 15000 },
  { month: 'Mar', revenue: 16800, treatments: 112, courses: 22, target: 16000 },
  { month: 'Apr', revenue: 15600, treatments: 105, courses: 20, target: 16000 },
  { month: 'May', revenue: 18900, treatments: 125, courses: 28, target: 17000 },
  { month: 'Jun', revenue: 21300, treatments: 142, courses: 32, target: 18000 }
];

const clientRetentionData = [
  { month: 'Jan', new: 25, retained: 180, churned: 12 },
  { month: 'Feb', new: 32, retained: 195, churned: 8 },
  { month: 'Mar', new: 28, retained: 210, churned: 15 },
  { month: 'Apr', new: 35, retained: 225, churned: 10 },
  { month: 'May', new: 42, retained: 248, churned: 18 },
  { month: 'Jun', new: 38, retained: 268, churned: 12 }
];

const treatmentEffectiveness = [
  { treatment: 'Botox', satisfaction: 4.8, completion: 95, revenue: 8500, sessions: 65 },
  { treatment: 'Dermal Fillers', satisfaction: 4.6, completion: 92, revenue: 12200, sessions: 48 },
  { treatment: 'Chemical Peel', satisfaction: 4.4, completion: 88, revenue: 3600, sessions: 85 },
  { treatment: 'Laser Treatment', satisfaction: 4.7, completion: 90, revenue: 9800, sessions: 35 },
  { treatment: 'Microneedling', satisfaction: 4.3, completion: 85, revenue: 2800, sessions: 75 }
];

const demographicsData = [
  { age: '18-25', count: 45, percentage: 18, color: '#8884d8' },
  { age: '26-35', count: 98, percentage: 39, color: '#82ca9d' },
  { age: '36-45', count: 67, percentage: 27, color: '#ffc658' },
  { age: '46-55', count: 28, percentage: 11, color: '#ff7c7c' },
  { age: '55+', count: 12, percentage: 5, color: '#8dd1e1' }
];

const staffPerformance = [
  { name: 'Dr. Sarah Smith', clients: 125, revenue: 18500, satisfaction: 4.9, utilization: 92 },
  { name: 'Dr. Michael Chen', clients: 98, revenue: 14200, satisfaction: 4.7, utilization: 85 },
  { name: 'Dr. Emily Johnson', clients: 87, revenue: 12800, satisfaction: 4.8, utilization: 78 },
  { name: 'Dr. James Wilson', clients: 76, revenue: 11200, satisfaction: 4.6, utilization: 72 }
];

export const BusinessIntelligenceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('monthly');
  const [dateRange, setDateRange] = useState({ start: subMonths(new Date(), 5), end: new Date() });
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [showReportBuilder, setShowReportBuilder] = useState(false);
  const [reportConfig, setReportConfig] = useState<Partial<ReportConfig>>({
    type: 'revenue',
    period: 'monthly',
    format: 'pdf'
  });

  useEffect(() => {
    // Mock data - would come from API
    setAnalyticsData({
      revenue: {
        total: 126300,
        growth: 15.8,
        monthly: revenueData
      },
      clients: {
        total: 350,
        active: 268,
        new: 38,
        retention: 89.5,
        satisfaction: 4.6,
        demographics: demographicsData
      },
      treatments: {
        total: 485,
        mostPopular: 'Botox',
        completionRate: 91.2,
        averageRevenue: 260,
        effectiveness: treatmentEffectiveness
      },
      courses: {
        total: 8,
        enrolled: 145,
        completed: 98,
        passRate: 87.3,
        revenue: 28500
      },
      staff: {
        total: 4,
        utilization: 81.8,
        performance: staffPerformance
      }
    });
  }, [timeframe, dateRange]);

  const generateReport = () => {
    console.log('Generating report with config:', reportConfig);
    // Implementation for report generation
  };

  const exportData = (format: string) => {
    console.log(`Exporting data in ${format} format`);
    // Implementation for data export
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (!analyticsData) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Business Intelligence Dashboard</h2>
        <div className="flex space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => setShowReportBuilder(true)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </Button>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="treatments">Treatments</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-3xl font-bold">{formatCurrency(analyticsData.revenue.total)}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-green-600 text-sm font-medium">
                          +{formatPercentage(analyticsData.revenue.growth)}
                        </span>
                      </div>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                      <p className="text-3xl font-bold">{analyticsData.clients.active}</p>
                      <div className="flex items-center mt-2">
                        <UserCheck className="h-4 w-4 text-blue-600 mr-1" />
                        <span className="text-blue-600 text-sm font-medium">
                          {formatPercentage(analyticsData.clients.retention)} retention
                        </span>
                      </div>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Treatments</p>
                      <p className="text-3xl font-bold">{analyticsData.treatments.total}</p>
                      <div className="flex items-center mt-2">
                        <CheckCircle className="h-4 w-4 text-purple-600 mr-1" />
                        <span className="text-purple-600 text-sm font-medium">
                          {formatPercentage(analyticsData.treatments.completionRate)} completion
                        </span>
                      </div>
                    </div>
                    <Activity className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Staff Utilization</p>
                      <p className="text-3xl font-bold">{formatPercentage(analyticsData.staff.utilization)}</p>
                      <div className="flex items-center mt-2">
                        <Target className="h-4 w-4 text-orange-600 mr-1" />
                        <span className="text-orange-600 text-sm font-medium">
                          {analyticsData.staff.total} practitioners
                        </span>
                      </div>
                    </div>
                    <BarChart3 className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue and Client Growth Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(Number(value)) : value,
                        name === 'revenue' ? 'Revenue' : name === 'target' ? 'Target' : 'Sessions'
                      ]} />
                      <Legend />
                      <Bar yAxisId="right" dataKey="treatments" fill="#8884d8" name="Treatments" />
                      <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={3} name="Revenue" />
                      <Line yAxisId="left" type="monotone" dataKey="target" stroke="#ff7c7c" strokeDasharray="5 5" name="Target" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Client Retention Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={clientRetentionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="retained" stackId="1" stroke="#8884d8" fill="#8884d8" name="Retained" />
                      <Area type="monotone" dataKey="new" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="New" />
                      <Area type="monotone" dataKey="churned" stackId="2" stroke="#ff7c7c" fill="#ff7c7c" name="Churned" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-gold-500" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {staffPerformance.slice(0, 3).map((staff, index) => (
                      <div key={staff.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-gold-100 text-gold-700' : 
                            index === 1 ? 'bg-gray-200 text-gray-700' : 
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="font-medium">{staff.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(staff.revenue)}</div>
                          <div className="text-xs text-muted-foreground">{staff.clients} clients</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Popular Treatments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {treatmentEffectiveness.slice(0, 3).map((treatment) => (
                      <div key={treatment.treatment} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{treatment.treatment}</div>
                          <div className="text-xs text-muted-foreground">
                            {treatment.sessions} sessions
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-sm font-medium">{treatment.satisfaction}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(treatment.revenue)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Alerts & Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Revenue up 15.8%</p>
                        <p className="text-xs text-muted-foreground">Compared to last period</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Users className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">38 new clients this month</p>
                        <p className="text-xs text-muted-foreground">12% increase from last month</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Clock className="h-4 w-4 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Peak booking times</p>
                        <p className="text-xs text-muted-foreground">2-4 PM and 6-8 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <div className="space-y-6">
            {/* Revenue Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                      <p className="text-2xl font-bold">{formatCurrency(21300)}</p>
                    </div>
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mt-4">
                    <div className="text-xs text-green-600">↗ 12.5% from last month</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Treatment Revenue</p>
                      <p className="text-2xl font-bold">{formatCurrency(16800)}</p>
                    </div>
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-4">
                    <div className="text-xs text-blue-600">79% of total revenue</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Course Revenue</p>
                      <p className="text-2xl font-bold">{formatCurrency(4500)}</p>
                    </div>
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="mt-4">
                    <div className="text-xs text-purple-600">21% of total revenue</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Average Per Client</p>
                      <p className="text-2xl font-bold">{formatCurrency(450)}</p>
                    </div>
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="mt-4">
                    <div className="text-xs text-orange-600">↗ 8.3% increase</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Revenue Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown by Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Botox', value: 8500, color: '#8884d8' },
                          { name: 'Dermal Fillers', value: 12200, color: '#82ca9d' },
                          { name: 'Chemical Peels', value: 3600, color: '#ffc658' },
                          { name: 'Laser Treatment', value: 9800, color: '#ff7c7c' },
                          { name: 'Courses', value: 4500, color: '#8dd1e1' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Botox', value: 8500, color: '#8884d8' },
                          { name: 'Dermal Fillers', value: 12200, color: '#82ca9d' },
                          { name: 'Chemical Peels', value: 3600, color: '#ffc658' },
                          { name: 'Laser Treatment', value: 9800, color: '#ff7c7c' },
                          { name: 'Courses', value: 4500, color: '#8dd1e1' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue vs Target</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `£${value/1000}k`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" name="Actual Revenue" />
                      <Bar dataKey="target" fill="#82ca9d" name="Target Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Analysis Table */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis by Practitioner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffPerformance.map((staff) => (
                    <div key={staff.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="font-medium">{staff.name}</div>
                        <Badge variant="outline">{formatPercentage(staff.utilization)} utilization</Badge>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div>
                          <div className="font-medium">{formatCurrency(staff.revenue)}</div>
                          <div className="text-muted-foreground">Revenue</div>
                        </div>
                        <div>
                          <div className="font-medium">{staff.clients}</div>
                          <div className="text-muted-foreground">Clients</div>
                        </div>
                        <div>
                          <div className="font-medium flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            {staff.satisfaction}
                          </div>
                          <div className="text-muted-foreground">Rating</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients">
          <div className="space-y-6">
            {/* Client Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                      <p className="text-2xl font-bold">{analyticsData.clients.total}</p>
                    </div>
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Retention Rate</p>
                      <p className="text-2xl font-bold">{formatPercentage(analyticsData.clients.retention)}</p>
                    </div>
                    <Repeat className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                      <p className="text-2xl font-bold">{analyticsData.clients.satisfaction}/5.0</p>
                    </div>
                    <Star className="h-6 w-6 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">New This Month</p>
                      <p className="text-2xl font-bold">{analyticsData.clients.new}</p>
                    </div>
                    <UserCheck className="h-6 w-6 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Client Analysis Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={demographicsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {demographicsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Client Acquisition & Retention</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={clientRetentionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="new" stroke="#82ca9d" strokeWidth={2} name="New Clients" />
                      <Line type="monotone" dataKey="retained" stroke="#8884d8" strokeWidth={2} name="Retained Clients" />
                      <Line type="monotone" dataKey="churned" stroke="#ff7c7c" strokeWidth={2} name="Churned Clients" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Client Lifecycle Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Client Lifecycle Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Acquisition Funnel</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Website Visitors</span>
                        <span className="font-medium">2,450</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Consultation Bookings</span>
                        <span className="font-medium">156 (6.4%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>First Treatment</span>
                        <span className="font-medium">89 (57.1%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Returning Clients</span>
                        <span className="font-medium">67 (75.3%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Average Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Lifetime Value</span>
                        <span className="font-medium">{formatCurrency(1250)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Visit Frequency</span>
                        <span className="font-medium">Every 3.2 months</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Session Duration</span>
                        <span className="font-medium">45 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Referrals Made</span>
                        <span className="font-medium">1.8 per client</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Risk Analysis</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>At-Risk Clients</span>
                        <span className="font-medium text-amber-600">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overdue Follow-ups</span>
                        <span className="font-medium text-red-600">8</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Satisfaction < 4.0</span>
                        <span className="font-medium text-red-600">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span>No Show Rate</span>
                        <span className="font-medium">3.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="treatments">
          <div className="space-y-6">
            {/* Treatment Performance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Treatments</p>
                      <p className="text-2xl font-bold">{analyticsData.treatments.total}</p>
                    </div>
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                      <p className="text-2xl font-bold">{formatPercentage(analyticsData.treatments.completionRate)}</p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Average Revenue</p>
                      <p className="text-2xl font-bold">{formatCurrency(analyticsData.treatments.averageRevenue)}</p>
                    </div>
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Most Popular</p>
                      <p className="text-2xl font-bold text-purple-600">{analyticsData.treatments.mostPopular}</p>
                    </div>
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Treatment Effectiveness Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Treatment Effectiveness Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart data={treatmentEffectiveness}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      dataKey="satisfaction" 
                      name="Satisfaction" 
                      unit=""
                      domain={[4.0, 5.0]}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="completion" 
                      name="Completion Rate" 
                      unit="%"
                      domain={[80, 100]}
                    />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value, name) => [
                        name === 'satisfaction' ? `${value}/5.0` : `${value}%`,
                        name === 'satisfaction' ? 'Satisfaction' : 'Completion Rate'
                      ]}
                      labelFormatter={(label) => treatmentEffectiveness.find(t => t.satisfaction === label)?.treatment}
                    />
                    <Scatter dataKey="satisfaction" fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Treatment Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Treatment Performance Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {treatmentEffectiveness.map((treatment) => (
                    <div key={treatment.treatment} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="font-medium">{treatment.treatment}</div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{treatment.satisfaction}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div>
                          <div className="font-medium">{formatCurrency(treatment.revenue)}</div>
                          <div className="text-muted-foreground">Revenue</div>
                        </div>
                        <div>
                          <div className="font-medium">{treatment.sessions}</div>
                          <div className="text-muted-foreground">Sessions</div>
                        </div>
                        <div>
                          <div className="font-medium">{formatPercentage(treatment.completion)}</div>
                          <div className="text-muted-foreground">Completion</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="space-y-6">
            {/* Staff Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Staff Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={staffPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>

                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={staffPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="clients" fill="#82ca9d" name="Clients Served" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Individual Performance Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {staffPerformance.map((staff) => (
                <Card key={staff.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {staff.name}
                      <Badge variant={staff.utilization >= 85 ? "default" : "secondary"}>
                        {formatPercentage(staff.utilization)} Utilization
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{formatCurrency(staff.revenue)}</div>
                        <div className="text-xs text-muted-foreground">Revenue</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{staff.clients}</div>
                        <div className="text-xs text-muted-foreground">Clients</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold flex items-center justify-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          {staff.satisfaction}
                        </div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="space-y-6">
            {/* Report Builder */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Report Builder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Report Type</label>
                    <Select 
                      value={reportConfig.type} 
                      onValueChange={(value: 'revenue' | 'clients' | 'treatments' | 'compliance' | 'custom') =>
                        setReportConfig({ ...reportConfig, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="revenue">Revenue Report</SelectItem>
                        <SelectItem value="clients">Client Analysis</SelectItem>
                        <SelectItem value="treatments">Treatment Effectiveness</SelectItem>
                        <SelectItem value="compliance">Compliance Report</SelectItem>
                        <SelectItem value="custom">Custom Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Period</label>
                    <Select 
                      value={reportConfig.period} 
                      onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual') =>
                        setReportConfig({ ...reportConfig, period: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Format</label>
                    <Select 
                      value={reportConfig.format} 
                      onValueChange={(value: 'pdf' | 'excel' | 'csv') =>
                        setReportConfig({ ...reportConfig, format: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Report</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button onClick={generateReport} className="w-full">
                      Generate Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Monthly Revenue Report - June 2024', type: 'Revenue', date: '2024-07-01', status: 'Ready' },
                    { name: 'Client Retention Analysis - Q2 2024', type: 'Clients', date: '2024-06-30', status: 'Ready' },
                    { name: 'Treatment Effectiveness Report', type: 'Treatments', date: '2024-06-28', status: 'Ready' },
                    { name: 'Staff Performance Review - June', type: 'Performance', date: '2024-06-25', status: 'Ready' }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <BarChart3 className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-muted-foreground">{report.type} • Generated {report.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge>{report.status}</Badge>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scheduled Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Weekly Performance Summary</p>
                      <p className="text-sm text-muted-foreground">Every Monday at 9:00 AM</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Active</Badge>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Monthly Financial Report</p>
                      <p className="text-sm text-muted-foreground">1st of each month</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Active</Badge>
                      <Button variant="outline" size="sm">Edit</Button>
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
};

export default BusinessIntelligenceDashboard;
