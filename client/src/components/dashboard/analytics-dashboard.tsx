import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar as CalendarIcon, 
  Activity,
  Download,
  Eye,
  Heart,
  Award,
  Clock,
  Target,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    target: number;
    byPeriod: Array<{ date: string; amount: number }>;
  };
  clients: {
    total: number;
    new: number;
    retention: number;
    satisfaction: number;
    byTreatment: Array<{ treatment: string; count: number }>;
  };
  treatments: {
    total: number;
    popular: Array<{ name: string; count: number; revenue: number }>;
    completion: number;
  };
  compliance: {
    overall: number;
    jccp: number;
    cqc: number;
    ageVerification: number;
  };
  students: {
    total: number;
    active: number;
    graduated: number;
    avgProgress: number;
  };
}

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<{start: Date; end: Date}>({
    start: subDays(new Date(), 30),
    end: new Date()
  });
  const [reportType, setReportType] = useState<'business' | 'compliance' | 'training'>('business');

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics', dateRange, reportType],
    queryFn: async () => {
      const response = await fetch(
        `/api/analytics?start=${format(dateRange.start, 'yyyy-MM-dd')}&end=${format(dateRange.end, 'yyyy-MM-dd')}&type=${reportType}`
      );
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
  });

  // Mock data fallback
  const defaultAnalytics: AnalyticsData = {
    revenue: {
      total: 24750,
      growth: 12.5,
      target: 30000,
      byPeriod: [
        { date: '2024-01-01', amount: 22000 },
        { date: '2024-02-01', amount: 23500 },
        { date: '2024-03-01', amount: 24750 }
      ]
    },
    clients: {
      total: 156,
      new: 23,
      retention: 85,
      satisfaction: 94,
      byTreatment: [
        { treatment: 'Facial Treatments', count: 45 },
        { treatment: 'Botox', count: 32 },
        { treatment: 'Dermal Fillers', count: 28 },
        { treatment: 'Chemical Peels', count: 18 }
      ]
    },
    treatments: {
      total: 123,
      popular: [
        { name: 'Anti-Aging Facial', count: 23, revenue: 4600 },
        { name: 'Botox Treatment', count: 18, revenue: 7200 },
        { name: 'Lip Enhancement', count: 15, revenue: 4500 }
      ],
      completion: 96
    },
    compliance: {
      overall: 94,
      jccp: 96,
      cqc: 92,
      ageVerification: 94
    },
    students: {
      total: 45,
      active: 38,
      graduated: 7,
      avgProgress: 78
    }
  };

  const data = analytics || defaultAnalytics;

  const exportReport = async (type: 'pdf' | 'csv') => {
    try {
      const response = await fetch('/api/reports/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type,
          reportType,
          dateRange,
          format: type
        }),
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lea-analytics-${reportType}-${format(new Date(), 'yyyy-MM-dd')}.${type}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-lea-pearl-white rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-lea-pearl-white rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-lea-deep-charcoal">Analytics & Reporting</h2>
          <p className="text-lea-charcoal-grey">
            Performance insights and compliance tracking
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business">Business Analytics</SelectItem>
              <SelectItem value="compliance">Compliance Report</SelectItem>
              <SelectItem value="training">Training Analytics</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {format(dateRange.start, 'MMM d')} - {format(dateRange.end, 'MMM d')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDateRange({
                      start: subDays(new Date(), 7),
                      end: new Date()
                    })}
                  >
                    Last 7 days
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDateRange({
                      start: subDays(new Date(), 30),
                      end: new Date()
                    })}
                  >
                    Last 30 days
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDateRange({
                      start: startOfMonth(new Date()),
                      end: endOfMonth(new Date())
                    })}
                  >
                    This month
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const lastMonth = subMonths(new Date(), 1);
                      setDateRange({
                        start: startOfMonth(lastMonth),
                        end: endOfMonth(lastMonth)
                      });
                    }}
                  >
                    Last month
                  </Button>
                </div>
                <Calendar
                  mode="range"
                  numberOfMonths={2}
                  className="rounded-md border"
                />
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => exportReport('csv')}
              className="text-lea-charcoal-grey"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => exportReport('pdf')}
              className="text-lea-charcoal-grey"
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={reportType} onValueChange={(value) => setReportType(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="business">Business Analytics</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Report</TabsTrigger>
          <TabsTrigger value="training">Training Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-6">
          {/* Revenue Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-lea-charcoal-grey">Total Revenue</p>
                    <p className="text-2xl font-bold text-lea-deep-charcoal">
                      £{data.revenue.total.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">+{data.revenue.growth}%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress
                    value={(data.revenue.total / data.revenue.target) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-lea-charcoal-grey mt-1">
                    £{(data.revenue.target - data.revenue.total).toLocaleString()} to target
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-lea-charcoal-grey">Total Clients</p>
                    <p className="text-2xl font-bold text-lea-deep-charcoal">{data.clients.total}</p>
                    <div className="flex items-center mt-2">
                      <Users className="w-4 h-4 text-lea-clinical-blue mr-1" />
                      <span className="text-sm text-lea-clinical-blue">+{data.clients.new} this month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-lea-clinical-blue/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-lea-clinical-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-lea-charcoal-grey">Treatments</p>
                    <p className="text-2xl font-bold text-lea-deep-charcoal">{data.treatments.total}</p>
                    <div className="flex items-center mt-2">
                      <Activity className="w-4 h-4 text-lea-elegant-silver mr-1" />
                      <span className="text-sm text-lea-elegant-silver">{data.treatments.completion}% completion</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-lea-elegant-silver/10 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-lea-elegant-silver" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-lea-charcoal-grey">Client Satisfaction</p>
                    <p className="text-2xl font-bold text-lea-deep-charcoal">{data.clients.satisfaction}%</p>
                    <div className="flex items-center mt-2">
                      <Heart className="w-4 h-4 text-pink-500 mr-1" />
                      <span className="text-sm text-pink-500">{data.clients.retention}% retention</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-pink-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Popular Treatments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal font-serif flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Popular Treatments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.treatments.popular.map((treatment, index) => (
                    <div key={treatment.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-lea-clinical-blue/10 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-medium text-lea-clinical-blue">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-lea-deep-charcoal">{treatment.name}</p>
                          <p className="text-sm text-lea-charcoal-grey">
                            {treatment.count} treatments
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-lea-deep-charcoal">
                          £{treatment.revenue.toLocaleString()}
                        </p>
                        <p className="text-sm text-lea-charcoal-grey">revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal font-serif flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Treatment Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.clients.byTreatment.map((item, index) => {
                    const total = data.clients.byTreatment.reduce((sum, t) => sum + t.count, 0);
                    const percentage = (item.count / total) * 100;
                    
                    return (
                      <div key={item.treatment} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-lea-deep-charcoal">
                            {item.treatment}
                          </span>
                          <span className="text-sm text-lea-charcoal-grey">
                            {item.count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {/* Compliance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-lea-charcoal-grey">Overall Compliance</p>
                    <p className="text-2xl font-bold text-lea-deep-charcoal">{data.compliance.overall}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <Progress value={data.compliance.overall} className="h-2 mt-3" />
              </CardContent>
            </Card>

            <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-lea-charcoal-grey">JCCP Compliance</p>
                    <p className="text-2xl font-bold text-lea-deep-charcoal">{data.compliance.jccp}%</p>
                  </div>
                  <div className="w-12 h-12 bg-lea-clinical-blue/10 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-lea-clinical-blue" />
                  </div>
                </div>
                <Progress value={data.compliance.jccp} className="h-2 mt-3" />
              </CardContent>
            </Card>

            <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-lea-charcoal-grey">CQC Compliance</p>
                    <p className="text-2xl font-bold text-lea-deep-charcoal">{data.compliance.cqc}%</p>
                  </div>
                  <div className="w-12 h-12 bg-lea-elegant-silver/10 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-lea-elegant-silver" />
                  </div>
                </div>
                <Progress value={data.compliance.cqc} className="h-2 mt-3" />
              </CardContent>
            </Card>

            <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-lea-charcoal-grey">Age Verification</p>
                    <p className="text-2xl font-bold text-lea-deep-charcoal">{data.compliance.ageVerification}%</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Eye className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <Progress value={data.compliance.ageVerification} className="h-2 mt-3" />
              </CardContent>
            </Card>
          </div>

          {/* Compliance Details */}
          <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif">Compliance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-lea-deep-charcoal mb-4">Regulatory Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">JCCP Registration</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">CQC Registration</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium">DBS Check</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Renewal Due</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-lea-deep-charcoal mb-4">Recent Actions</h4>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium">Age verification compliance updated</p>
                      <p className="text-lea-charcoal-grey">2 days ago</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">JCCP documentation reviewed</p>
                      <p className="text-lea-charcoal-grey">1 week ago</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">CQC inspection preparation completed</p>
                      <p className="text-lea-charcoal-grey">2 weeks ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          {/* Training Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-lea-charcoal-grey">Total Students</p>
                    <p className="text-2xl font-bold text-lea-deep-charcoal">{data.students.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-lea-clinical-blue/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-lea-clinical-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-lea-charcoal-grey">Active Students</p>
                    <p className="text-2xl font-bold text-lea-deep-charcoal">{data.students.active}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-lea-charcoal-grey">Graduated</p>
                    <p className="text-2xl font-bold text-lea-deep-charcoal">{data.students.graduated}</p>
                  </div>
                  <div className="w-12 h-12 bg-lea-elegant-silver/10 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-lea-elegant-silver" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-lea-charcoal-grey">Avg Progress</p>
                    <p className="text-2xl font-bold text-lea-deep-charcoal">{data.students.avgProgress}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <Progress value={data.students.avgProgress} className="h-2 mt-3" />
              </CardContent>
            </Card>
          </div>

          {/* Training Overview */}
          <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardHeader>
              <CardTitle className="text-lea-deep-charcoal font-serif">Training Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <LineChart className="w-12 h-12 text-lea-charcoal-grey mx-auto mb-4" />
                <h3 className="text-lg font-medium text-lea-deep-charcoal mb-2">Training Analytics</h3>
                <p className="text-lea-charcoal-grey">
                  Detailed training performance metrics and student progress tracking coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
