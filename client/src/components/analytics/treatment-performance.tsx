import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target,
  TrendingUp,
  TrendingDown,
  Star,
  Calendar,
  Clock,
  Users,
  Award,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Activity,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Stethoscope
} from 'lucide-react';

interface TreatmentPerformanceProps {
  dateRange: string;
}

// Mock treatment performance data
const getTreatmentData = (dateRange: string) => {
  const baseData = {
    '7d': {
      totalTreatments: 89,
      successRate: 97.8,
      avgSatisfactionScore: 4.8,
      rebookingRate: 78.7,
      treatments: [
        {
          name: 'Botox',
          count: 23,
          successRate: 98.5,
          satisfaction: 4.9,
          revenue: 4600,
          rebookingRate: 85.2,
          avgDuration: 45,
          complications: 0,
        },
        {
          name: 'Dermal Fillers',
          count: 18,
          successRate: 96.8,
          satisfaction: 4.7,
          revenue: 3600,
          rebookingRate: 82.1,
          avgDuration: 60,
          complications: 1,
        },
        {
          name: 'Chemical Peel',
          count: 15,
          successRate: 98.2,
          satisfaction: 4.6,
          revenue: 1800,
          rebookingRate: 75.3,
          avgDuration: 30,
          complications: 0,
        },
        {
          name: 'Microneedling',
          count: 12,
          successRate: 97.1,
          satisfaction: 4.8,
          revenue: 1480,
          rebookingRate: 71.4,
          avgDuration: 90,
          complications: 0,
        },
        {
          name: 'Laser Treatment',
          count: 10,
          successRate: 95.8,
          satisfaction: 4.5,
          revenue: 1000,
          rebookingRate: 68.9,
          avgDuration: 75,
          complications: 1,
        },
      ],
      practitioners: [
        {
          name: 'Dr. Michael Chen',
          treatments: 34,
          successRate: 98.9,
          satisfaction: 4.9,
          specialties: ['Botox', 'Dermal Fillers'],
          bookingRate: 95.2,
          revenue: 6800,
        },
        {
          name: 'Sarah Johnson',
          treatments: 28,
          successRate: 97.8,
          satisfaction: 4.7,
          specialties: ['Chemical Peel', 'Microneedling'],
          bookingRate: 89.3,
          revenue: 4200,
        },
        {
          name: 'Emma Williams',
          treatments: 27,
          successRate: 96.5,
          satisfaction: 4.6,
          specialties: ['Laser Treatment', 'Microneedling'],
          bookingRate: 87.1,
          revenue: 3950,
        },
      ],
      bookingPatterns: {
        byDay: [
          { day: 'Monday', bookings: 8, percentage: 9.0 },
          { day: 'Tuesday', bookings: 12, percentage: 13.5 },
          { day: 'Wednesday', bookings: 15, percentage: 16.9 },
          { day: 'Thursday', bookings: 18, percentage: 20.2 },
          { day: 'Friday', bookings: 21, percentage: 23.6 },
          { day: 'Saturday', bookings: 15, percentage: 16.9 },
          { day: 'Sunday', bookings: 0, percentage: 0.0 },
        ],
        byTime: [
          { time: '09:00-11:00', bookings: 12, percentage: 13.5 },
          { time: '11:00-13:00', bookings: 18, percentage: 20.2 },
          { time: '13:00-15:00', bookings: 25, percentage: 28.1 },
          { time: '15:00-17:00', bookings: 22, percentage: 24.7 },
          { time: '17:00-19:00', bookings: 12, percentage: 13.5 },
        ],
      },
    },
    '30d': {
      totalTreatments: 342,
      successRate: 97.2,
      avgSatisfactionScore: 4.7,
      rebookingRate: 81.4,
      treatments: [
        {
          name: 'Botox',
          count: 89,
          successRate: 98.2,
          satisfaction: 4.8,
          revenue: 17800,
          rebookingRate: 84.7,
          avgDuration: 45,
          complications: 2,
        },
        {
          name: 'Dermal Fillers',
          count: 67,
          successRate: 97.1,
          satisfaction: 4.6,
          revenue: 13400,
          rebookingRate: 81.9,
          avgDuration: 60,
          complications: 3,
        },
        {
          name: 'Chemical Peel',
          count: 54,
          successRate: 97.8,
          satisfaction: 4.7,
          revenue: 6480,
          rebookingRate: 78.2,
          avgDuration: 30,
          complications: 1,
        },
        {
          name: 'Microneedling',
          count: 65,
          successRate: 96.8,
          satisfaction: 4.7,
          revenue: 8130,
          rebookingRate: 76.1,
          avgDuration: 90,
          complications: 2,
        },
        {
          name: 'Laser Treatment',
          count: 67,
          successRate: 95.2,
          satisfaction: 4.5,
          revenue: 8420,
          rebookingRate: 73.4,
          avgDuration: 75,
          complications: 4,
        },
      ],
      practitioners: [
        {
          name: 'Dr. Michael Chen',
          treatments: 142,
          successRate: 98.6,
          satisfaction: 4.8,
          specialties: ['Botox', 'Dermal Fillers'],
          bookingRate: 94.7,
          revenue: 28400,
        },
        {
          name: 'Sarah Johnson',
          treatments: 105,
          successRate: 97.1,
          satisfaction: 4.6,
          specialties: ['Chemical Peel', 'Microneedling'],
          bookingRate: 88.9,
          revenue: 15750,
        },
        {
          name: 'Emma Williams',
          treatments: 95,
          successRate: 95.8,
          satisfaction: 4.5,
          specialties: ['Laser Treatment', 'Microneedling'],
          bookingRate: 86.3,
          revenue: 14250,
        },
      ],
      bookingPatterns: {
        byDay: [
          { day: 'Monday', bookings: 32, percentage: 9.4 },
          { day: 'Tuesday', bookings: 46, percentage: 13.5 },
          { day: 'Wednesday', bookings: 58, percentage: 17.0 },
          { day: 'Thursday', bookings: 68, percentage: 19.9 },
          { day: 'Friday', bookings: 82, percentage: 24.0 },
          { day: 'Saturday', bookings: 56, percentage: 16.4 },
          { day: 'Sunday', bookings: 0, percentage: 0.0 },
        ],
        byTime: [
          { time: '09:00-11:00', bookings: 45, percentage: 13.2 },
          { time: '11:00-13:00', bookings: 68, percentage: 19.9 },
          { time: '13:00-15:00', bookings: 95, percentage: 27.8 },
          { time: '15:00-17:00', bookings: 87, percentage: 25.4 },
          { time: '17:00-19:00', bookings: 47, percentage: 13.7 },
        ],
      },
    },
    '90d': {
      totalTreatments: 987,
      successRate: 96.8,
      avgSatisfactionScore: 4.6,
      rebookingRate: 82.1,
      treatments: [
        {
          name: 'Botox',
          count: 245,
          successRate: 97.9,
          satisfaction: 4.7,
          revenue: 49000,
          rebookingRate: 85.3,
          avgDuration: 45,
          complications: 5,
        },
        {
          name: 'Dermal Fillers',
          count: 198,
          successRate: 96.8,
          satisfaction: 4.5,
          revenue: 39600,
          rebookingRate: 82.7,
          avgDuration: 60,
          complications: 8,
        },
        {
          name: 'Chemical Peel',
          count: 156,
          successRate: 97.4,
          satisfaction: 4.6,
          revenue: 18720,
          rebookingRate: 79.8,
          avgDuration: 30,
          complications: 3,
        },
        {
          name: 'Microneedling',
          count: 189,
          successRate: 96.2,
          satisfaction: 4.6,
          revenue: 25313,
          rebookingRate: 77.2,
          avgDuration: 90,
          complications: 7,
        },
        {
          name: 'Laser Treatment',
          count: 199,
          successRate: 94.8,
          satisfaction: 4.4,
          revenue: 24456,
          rebookingRate: 74.8,
          avgDuration: 75,
          complications: 12,
        },
      ],
      practitioners: [
        {
          name: 'Dr. Michael Chen',
          treatments: 412,
          successRate: 98.3,
          satisfaction: 4.7,
          specialties: ['Botox', 'Dermal Fillers'],
          bookingRate: 94.2,
          revenue: 82400,
        },
        {
          name: 'Sarah Johnson',
          treatments: 298,
          successRate: 96.6,
          satisfaction: 4.5,
          specialties: ['Chemical Peel', 'Microneedling'],
          bookingRate: 87.9,
          revenue: 44700,
        },
        {
          name: 'Emma Williams',
          treatments: 277,
          successRate: 95.3,
          satisfaction: 4.4,
          specialties: ['Laser Treatment', 'Microneedling'],
          bookingRate: 85.7,
          revenue: 41550,
        },
      ],
      bookingPatterns: {
        byDay: [
          { day: 'Monday', bookings: 92, percentage: 9.3 },
          { day: 'Tuesday', bookings: 133, percentage: 13.5 },
          { day: 'Wednesday', bookings: 168, percentage: 17.0 },
          { day: 'Thursday', bookings: 197, percentage: 20.0 },
          { day: 'Friday', bookings: 236, percentage: 23.9 },
          { day: 'Saturday', bookings: 161, percentage: 16.3 },
          { day: 'Sunday', bookings: 0, percentage: 0.0 },
        ],
        byTime: [
          { time: '09:00-11:00', bookings: 130, percentage: 13.2 },
          { time: '11:00-13:00', bookings: 197, percentage: 20.0 },
          { time: '13:00-15:00', bookings: 275, percentage: 27.9 },
          { time: '15:00-17:00', bookings: 251, percentage: 25.4 },
          { time: '17:00-19:00', bookings: 134, percentage: 13.6 },
        ],
      },
    },
    '1y': {
      totalTreatments: 4156,
      successRate: 96.4,
      avgSatisfactionScore: 4.5,
      rebookingRate: 83.7,
      treatments: [
        {
          name: 'Botox',
          count: 1024,
          successRate: 97.6,
          satisfaction: 4.6,
          revenue: 204800,
          rebookingRate: 86.1,
          avgDuration: 45,
          complications: 18,
        },
        {
          name: 'Dermal Fillers',
          count: 876,
          successRate: 96.4,
          satisfaction: 4.4,
          revenue: 175200,
          rebookingRate: 83.5,
          avgDuration: 60,
          complications: 28,
        },
        {
          name: 'Chemical Peel',
          count: 687,
          successRate: 97.1,
          satisfaction: 4.5,
          revenue: 82440,
          rebookingRate: 81.2,
          avgDuration: 30,
          complications: 15,
        },
        {
          name: 'Microneedling',
          count: 798,
          successRate: 95.8,
          satisfaction: 4.5,
          revenue: 103113,
          rebookingRate: 78.9,
          avgDuration: 90,
          complications: 25,
        },
        {
          name: 'Laser Treatment',
          count: 771,
          successRate: 94.2,
          satisfaction: 4.3,
          revenue: 105746,
          rebookingRate: 76.3,
          avgDuration: 75,
          complications: 42,
        },
      ],
      practitioners: [
        {
          name: 'Dr. Michael Chen',
          treatments: 1734,
          successRate: 98.1,
          satisfaction: 4.6,
          specialties: ['Botox', 'Dermal Fillers'],
          bookingRate: 93.8,
          revenue: 346800,
        },
        {
          name: 'Sarah Johnson',
          treatments: 1245,
          successRate: 96.2,
          satisfaction: 4.4,
          specialties: ['Chemical Peel', 'Microneedling'],
          bookingRate: 87.3,
          revenue: 186750,
        },
        {
          name: 'Emma Williams',
          treatments: 1177,
          successRate: 94.8,
          satisfaction: 4.3,
          specialties: ['Laser Treatment', 'Microneedling'],
          bookingRate: 85.1,
          revenue: 176550,
        },
      ],
      bookingPatterns: {
        byDay: [
          { day: 'Monday', bookings: 387, percentage: 9.3 },
          { day: 'Tuesday', bookings: 561, percentage: 13.5 },
          { day: 'Wednesday', bookings: 706, percentage: 17.0 },
          { day: 'Thursday', bookings: 831, percentage: 20.0 },
          { day: 'Friday', bookings: 993, percentage: 23.9 },
          { day: 'Saturday', bookings: 678, percentage: 16.3 },
          { day: 'Sunday', bookings: 0, percentage: 0.0 },
        ],
        byTime: [
          { time: '09:00-11:00', bookings: 549, percentage: 13.2 },
          { time: '11:00-13:00', bookings: 831, percentage: 20.0 },
          { time: '13:00-15:00', bookings: 1159, percentage: 27.9 },
          { time: '15:00-17:00', bookings: 1056, percentage: 25.4 },
          { time: '17:00-19:00', bookings: 561, percentage: 13.5 },
        ],
      },
    },
  };

  return baseData[dateRange as keyof typeof baseData] || baseData['30d'];
};

export default function TreatmentPerformance({ dateRange }: TreatmentPerformanceProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const data = useMemo(() => getTreatmentData(dateRange), [dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 97) return 'text-green-600';
    if (rate >= 95) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSuccessRateBadge = (rate: number) => {
    if (rate >= 97) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (rate >= 95) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="treatments">Treatments</TabsTrigger>
          <TabsTrigger value="practitioners">Practitioners</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        {/* Treatment Overview */}
        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Key Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Treatments */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Treatments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-lea-deep-charcoal">
                        {data.totalTreatments.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Completed procedures
                      </div>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Success Rate */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-2xl font-bold ${getSuccessRateColor(data.successRate)}`}>
                        {data.successRate}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Treatment success
                      </div>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Average Satisfaction */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-lea-deep-charcoal">
                        {data.avgSatisfactionScore}/5.0
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Client feedback
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rebooking Rate */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Rebooking Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-lea-deep-charcoal">
                        {data.rebookingRate}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Return clients
                      </div>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Treatments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Top Performing Treatments
                </CardTitle>
                <CardDescription>Treatment performance by key metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.treatments.slice(0, 3).map((treatment, index) => (
                    <div key={treatment.name} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-lea-sage-green text-white rounded-full text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-lea-deep-charcoal">{treatment.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {treatment.count} treatments • {formatCurrency(treatment.revenue)}
                            </p>
                          </div>
                        </div>
                        {getSuccessRateBadge(treatment.successRate)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                          <Progress value={treatment.successRate} className="h-2" />
                          <p className="text-xs mt-1 font-medium">{treatment.successRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Satisfaction</p>
                          <Progress value={(treatment.satisfaction / 5) * 100} className="h-2" />
                          <p className="text-xs mt-1 font-medium">{treatment.satisfaction}/5.0</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Rebooking Rate</p>
                          <Progress value={treatment.rebookingRate} className="h-2" />
                          <p className="text-xs mt-1 font-medium">{treatment.rebookingRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Avg Duration</p>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-full bg-blue-500 rounded-full" 
                              style={{ width: `${(treatment.avgDuration / 120) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs mt-1 font-medium">{treatment.avgDuration} min</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Performance Insights
                </CardTitle>
                <CardDescription>Key insights from treatment performance data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-lea-deep-charcoal">Treatment Quality</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-lg">
                        <p className="font-medium text-green-900">High Success Rates</p>
                        <p className="text-sm text-green-700">
                          {data.successRate}% overall success rate exceeds industry standards
                        </p>
                      </div>
                      
                      <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                        <p className="font-medium text-blue-900">Strong Client Satisfaction</p>
                        <p className="text-sm text-blue-700">
                          {data.avgSatisfactionScore}/5.0 average rating demonstrates quality care
                        </p>
                      </div>
                      
                      <div className="p-3 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
                        <p className="font-medium text-purple-900">Excellent Retention</p>
                        <p className="text-sm text-purple-700">
                          {data.rebookingRate}% of clients return for follow-up treatments
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-lea-deep-charcoal">Areas for Improvement</h4>
                    <div className="space-y-3">
                      {data.treatments
                        .filter(t => t.complications > 0)
                        .slice(0, 2)
                        .map((treatment) => (
                        <div key={treatment.name} className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                          <p className="font-medium text-yellow-900">{treatment.name}</p>
                          <p className="text-sm text-yellow-700">
                            {treatment.complications} complications in {treatment.count} treatments
                          </p>
                        </div>
                      ))}
                      
                      <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                        <p className="font-medium text-blue-900">Optimization Opportunity</p>
                        <p className="text-sm text-blue-700">
                          Consider specialization training for treatments with lower success rates
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Individual Treatment Performance */}
        <TabsContent value="treatments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Treatment Performance Analysis
              </CardTitle>
              <CardDescription>Detailed performance metrics for each treatment type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.treatments.map((treatment) => (
                  <div key={treatment.name} className="border rounded-lg p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-lea-deep-charcoal">{treatment.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span>{treatment.count} treatments</span>
                          <span>{formatCurrency(treatment.revenue)} revenue</span>
                          <span>{treatment.avgDuration} min avg</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getSuccessRateBadge(treatment.successRate)}
                        {treatment.complications > 0 && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {treatment.complications} complications
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {/* Success Rate */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Success Rate</span>
                          <span className={`text-sm font-bold ${getSuccessRateColor(treatment.successRate)}`}>
                            {treatment.successRate}%
                          </span>
                        </div>
                        <Progress value={treatment.successRate} className="h-3" />
                      </div>

                      {/* Client Satisfaction */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Satisfaction</span>
                          <span className="text-sm font-bold text-yellow-600">
                            {treatment.satisfaction}/5.0
                          </span>
                        </div>
                        <Progress value={(treatment.satisfaction / 5) * 100} className="h-3" />
                      </div>

                      {/* Rebooking Rate */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Rebooking</span>
                          <span className="text-sm font-bold text-purple-600">
                            {treatment.rebookingRate}%
                          </span>
                        </div>
                        <Progress value={treatment.rebookingRate} className="h-3" />
                      </div>

                      {/* Revenue per Treatment */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Avg Revenue</span>
                          <span className="text-sm font-bold text-green-600">
                            {formatCurrency(treatment.revenue / treatment.count)}
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ 
                              width: `${Math.min((treatment.revenue / treatment.count) / 300 * 100, 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Metrics */}
                    <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-lea-deep-charcoal">
                          {formatCurrency(treatment.revenue / treatment.count)}
                        </div>
                        <p className="text-xs text-muted-foreground">Revenue per Treatment</p>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-lea-deep-charcoal">
                          {((treatment.count / data.totalTreatments) * 100).toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Share of Total</p>
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${treatment.complications === 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {((treatment.complications / treatment.count) * 100).toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Complication Rate</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Practitioner Performance */}
        <TabsContent value="practitioners">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Practitioner Performance
              </CardTitle>
              <CardDescription>Individual practitioner metrics and specializations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.practitioners.map((practitioner, index) => (
                  <div key={practitioner.name} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-lea-sage-green rounded-full">
                          <Stethoscope className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-lea-deep-charcoal">
                            {practitioner.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            {practitioner.specialties.map((specialty) => (
                              <Badge key={specialty} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-lea-deep-charcoal">
                          #{index + 1}
                        </div>
                        <p className="text-xs text-muted-foreground">Ranking</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Treatments</p>
                        <p className="text-xl font-bold text-lea-deep-charcoal">
                          {practitioner.treatments}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                        <p className={`text-xl font-bold ${getSuccessRateColor(practitioner.successRate)}`}>
                          {practitioner.successRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Satisfaction</p>
                        <p className="text-xl font-bold text-yellow-600">
                          {practitioner.satisfaction}/5.0
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(practitioner.revenue)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Success Rate</span>
                          <span className="text-sm">{practitioner.successRate}%</span>
                        </div>
                        <Progress value={practitioner.successRate} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Booking Rate</span>
                          <span className="text-sm">{practitioner.bookingRate}%</span>
                        </div>
                        <Progress value={practitioner.bookingRate} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Client Satisfaction</span>
                          <span className="text-sm">{practitioner.satisfaction}/5.0</span>
                        </div>
                        <Progress value={(practitioner.satisfaction / 5) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking Patterns */}
        <TabsContent value="patterns">
          <div className="space-y-6">
            {/* Day of Week Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Booking Patterns by Day
                </CardTitle>
                <CardDescription>Treatment booking distribution throughout the week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.bookingPatterns.byDay.map((day) => (
                    <div key={day.day} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 text-sm font-medium">{day.day}</div>
                        <Progress value={day.percentage} className="w-48 h-3" />
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-lea-deep-charcoal">{day.bookings} bookings</p>
                        <p className="text-sm text-muted-foreground">{day.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time of Day Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Booking Patterns by Time
                </CardTitle>
                <CardDescription>Treatment booking distribution by time of day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.bookingPatterns.byTime.map((time) => (
                    <div key={time.time} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-24 text-sm font-medium">{time.time}</div>
                        <Progress value={time.percentage} className="w-48 h-3" />
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-lea-deep-charcoal">{time.bookings} bookings</p>
                        <p className="text-sm text-muted-foreground">{time.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Booking Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Pattern Insights</CardTitle>
                <CardDescription>Key insights from booking pattern analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-lea-deep-charcoal mb-4">Peak Times</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                        <p className="font-medium text-blue-900">Friday Peak</p>
                        <p className="text-sm text-blue-700">
                          24% of weekly bookings occur on Fridays
                        </p>
                      </div>
                      
                      <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-lg">
                        <p className="font-medium text-green-900">Afternoon Rush</p>
                        <p className="text-sm text-green-700">
                          1-3 PM slot has highest demand with 28% of daily bookings
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-lea-deep-charcoal mb-4">Optimization Opportunities</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                        <p className="font-medium text-yellow-900">Monday-Tuesday</p>
                        <p className="text-sm text-yellow-700">
                          Consider promotional offers for lower-demand weekdays
                        </p>
                      </div>
                      
                      <div className="p-3 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
                        <p className="font-medium text-purple-900">Evening Slots</p>
                        <p className="text-sm text-purple-700">
                          Only 14% utilization after 5 PM - opportunity for extended hours
                        </p>
                      </div>
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
