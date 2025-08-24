import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users,
  UserPlus,
  UserMinus,
  Heart,
  Star,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  Smartphone,
  Mail,
  Globe,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Gift,
  Clock,
  Award
} from 'lucide-react';

interface ClientAnalyticsProps {
  dateRange: string;
}

// Mock client data for different date ranges
const getClientData = (dateRange: string) => {
  const baseData = {
    '7d': {
      totalClients: 47,
      newClients: 8,
      returningClients: 39,
      retentionRate: 82.6,
      previousRetentionRate: 78.5,
      avgLifetimeValue: 1450,
      avgSatisfactionScore: 4.8,
      clientAcquisition: [
        { source: 'Social Media', count: 3, percentage: 37.5, cost: 45 },
        { source: 'Referrals', count: 2, percentage: 25.0, cost: 0 },
        { source: 'Google Ads', count: 2, percentage: 25.0, cost: 85 },
        { source: 'Walk-in', count: 1, percentage: 12.5, cost: 0 },
      ],
      demographics: {
        ageGroups: [
          { range: '18-25', count: 4, percentage: 8.5 },
          { range: '26-35', count: 15, percentage: 31.9 },
          { range: '36-45', count: 18, percentage: 38.3 },
          { range: '46-55', count: 8, percentage: 17.0 },
          { range: '55+', count: 2, percentage: 4.3 },
        ],
        gender: [
          { type: 'Female', count: 42, percentage: 89.4 },
          { type: 'Male', count: 5, percentage: 10.6 },
        ],
        location: [
          { area: 'Central London', count: 18, percentage: 38.3 },
          { area: 'North London', count: 12, percentage: 25.5 },
          { area: 'South London', count: 8, percentage: 17.0 },
          { area: 'West London', count: 6, percentage: 12.8 },
          { area: 'East London', count: 3, percentage: 6.4 },
        ],
      },
    },
    '30d': {
      totalClients: 186,
      newClients: 34,
      returningClients: 152,
      retentionRate: 85.2,
      previousRetentionRate: 81.3,
      avgLifetimeValue: 1685,
      avgSatisfactionScore: 4.7,
      clientAcquisition: [
        { source: 'Social Media', count: 12, percentage: 35.3, cost: 42 },
        { source: 'Referrals', count: 10, percentage: 29.4, cost: 0 },
        { source: 'Google Ads', count: 8, percentage: 23.5, cost: 78 },
        { source: 'Walk-in', count: 4, percentage: 11.8, cost: 0 },
      ],
      demographics: {
        ageGroups: [
          { range: '18-25', count: 15, percentage: 8.1 },
          { range: '26-35', count: 61, percentage: 32.8 },
          { range: '36-45', count: 69, percentage: 37.1 },
          { range: '46-55', count: 33, percentage: 17.7 },
          { range: '55+', count: 8, percentage: 4.3 },
        ],
        gender: [
          { type: 'Female', count: 167, percentage: 89.8 },
          { type: 'Male', count: 19, percentage: 10.2 },
        ],
        location: [
          { area: 'Central London', count: 71, percentage: 38.2 },
          { area: 'North London', count: 47, percentage: 25.3 },
          { area: 'South London', count: 32, percentage: 17.2 },
          { area: 'West London', count: 24, percentage: 12.9 },
          { area: 'East London', count: 12, percentage: 6.4 },
        ],
      },
    },
    '90d': {
      totalClients: 532,
      newClients: 89,
      returningClients: 443,
      retentionRate: 87.4,
      previousRetentionRate: 83.7,
      avgLifetimeValue: 1820,
      avgSatisfactionScore: 4.6,
      clientAcquisition: [
        { source: 'Social Media', count: 32, percentage: 36.0, cost: 38 },
        { source: 'Referrals', count: 27, percentage: 30.3, cost: 0 },
        { source: 'Google Ads', count: 21, percentage: 23.6, cost: 72 },
        { source: 'Walk-in', count: 9, percentage: 10.1, cost: 0 },
      ],
      demographics: {
        ageGroups: [
          { range: '18-25', count: 43, percentage: 8.1 },
          { range: '26-35', count: 174, percentage: 32.7 },
          { range: '36-45', count: 198, percentage: 37.2 },
          { range: '46-55', count: 94, percentage: 17.7 },
          { range: '55+', count: 23, percentage: 4.3 },
        ],
        gender: [
          { type: 'Female', count: 478, percentage: 89.8 },
          { type: 'Male', count: 54, percentage: 10.2 },
        ],
        location: [
          { area: 'Central London', count: 203, percentage: 38.2 },
          { area: 'North London', count: 135, percentage: 25.4 },
          { area: 'South London', count: 91, percentage: 17.1 },
          { area: 'West London', count: 69, percentage: 13.0 },
          { area: 'East London', count: 34, percentage: 6.4 },
        ],
      },
    },
    '1y': {
      totalClients: 2184,
      newClients: 387,
      returningClients: 1797,
      retentionRate: 89.1,
      previousRetentionRate: 85.4,
      avgLifetimeValue: 2150,
      avgSatisfactionScore: 4.5,
      clientAcquisition: [
        { source: 'Social Media', count: 139, percentage: 35.9, cost: 35 },
        { source: 'Referrals', count: 116, percentage: 30.0, cost: 0 },
        { source: 'Google Ads', count: 89, percentage: 23.0, cost: 68 },
        { source: 'Walk-in', count: 43, percentage: 11.1, cost: 0 },
      ],
      demographics: {
        ageGroups: [
          { range: '18-25', count: 175, percentage: 8.0 },
          { range: '26-35', count: 715, percentage: 32.7 },
          { range: '36-45', count: 813, percentage: 37.2 },
          { range: '46-55', count: 394, percentage: 18.0 },
          { range: '55+', count: 87, percentage: 4.0 },
        ],
        gender: [
          { type: 'Female', count: 1961, percentage: 89.8 },
          { type: 'Male', count: 223, percentage: 10.2 },
        ],
        location: [
          { area: 'Central London', count: 834, percentage: 38.2 },
          { area: 'North London', count: 554, percentage: 25.4 },
          { area: 'South London', count: 373, percentage: 17.1 },
          { area: 'West London', count: 284, percentage: 13.0 },
          { area: 'East London', count: 139, percentage: 6.4 },
        ],
      },
    },
  };

  return baseData[dateRange as keyof typeof baseData] || baseData['30d'];
};

export default function ClientAnalytics({ dateRange }: ClientAnalyticsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const data = useMemo(() => getClientData(dateRange), [dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
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
          <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
        </TabsList>

        {/* Client Overview */}
        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Key Client Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Clients */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-lea-deep-charcoal">
                        {data.totalClients.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Active client base
                      </div>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* New Clients */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">New Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-lea-deep-charcoal">
                        {data.newClients}
                      </div>
                      <div className="text-sm text-green-600">
                        {((data.newClients / data.totalClients) * 100).toFixed(1)}% of total
                      </div>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <UserPlus className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Retention Rate */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Retention Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-lea-deep-charcoal">
                        {data.retentionRate}%
                      </div>
                      <div className={`flex items-center text-sm ${getChangeColor(data.retentionRate, data.previousRetentionRate)}`}>
                        {getChangeIcon(data.retentionRate, data.previousRetentionRate)}
                        <span className="ml-1">
                          {(data.retentionRate - data.previousRetentionRate).toFixed(1)}% vs last period
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Heart className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Average Lifetime Value */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Lifetime Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-lea-deep-charcoal">
                        {formatCurrency(data.avgLifetimeValue)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Per client value
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Client Satisfaction and Loyalty */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Client Satisfaction */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Client Satisfaction
                  </CardTitle>
                  <CardDescription>Overall satisfaction metrics and feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-lea-deep-charcoal mb-2">
                        {data.avgSatisfactionScore}/5.0
                      </div>
                      <p className="text-muted-foreground">Average satisfaction score</p>
                    </div>

                    <div className="space-y-4">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const percentage = rating === 5 ? 68 : rating === 4 ? 22 : rating === 3 ? 7 : rating === 2 ? 2 : 1;
                        return (
                          <div key={rating} className="flex items-center space-x-3">
                            <span className="text-sm w-6">{rating}★</span>
                            <Progress value={percentage} className="flex-1 h-2" />
                            <span className="text-sm w-12 text-right">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client Loyalty Programs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gift className="h-5 w-5 mr-2" />
                    Loyalty Insights
                  </CardTitle>
                  <CardDescription>Client loyalty and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-700 mb-1">
                          {Math.round(data.returningClients * 0.35)}
                        </div>
                        <p className="text-sm text-green-600">Loyalty Members</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-700 mb-1">
                          {Math.round(data.returningClients * 0.15)}
                        </div>
                        <p className="text-sm text-blue-600">VIP Clients</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Referral Rate</span>
                          <span className="text-sm font-medium">32%</span>
                        </div>
                        <Progress value={32} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Repeat Visit Rate</span>
                          <span className="text-sm font-medium">{data.retentionRate.toFixed(0)}%</span>
                        </div>
                        <Progress value={data.retentionRate} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Social Engagement</span>
                          <span className="text-sm font-medium">78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Client Acquisition */}
        <TabsContent value="acquisition">
          <div className="space-y-6">
            {/* Acquisition Channels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Client Acquisition Channels
                </CardTitle>
                <CardDescription>How new clients discover your services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.clientAcquisition.map((source, index) => (
                    <div key={source.source} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-lea-sage-green text-white rounded-full text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-lea-deep-charcoal">{source.source}</h4>
                            <p className="text-sm text-muted-foreground">
                              {source.count} new clients ({source.percentage}%)
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-lea-deep-charcoal">
                            {source.cost > 0 ? formatCurrency(source.cost) : 'Free'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {source.cost > 0 ? 'Cost per acquisition' : 'Organic channel'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Performance</span>
                          <span className="text-xs font-medium">{source.percentage}%</span>
                        </div>
                        <Progress value={source.percentage} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Acquisition Cost Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Acquisition Cost Analysis
                </CardTitle>
                <CardDescription>Cost effectiveness of different marketing channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Cost Metrics */}
                  <div>
                    <h4 className="font-medium text-lea-deep-charcoal mb-4">Cost Metrics</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm">Average Cost per Acquisition</span>
                        <span className="font-medium">
                          {formatCurrency(
                            data.clientAcquisition
                              .filter(s => s.cost > 0)
                              .reduce((sum, s) => sum + s.cost, 0) /
                            data.clientAcquisition.filter(s => s.cost > 0).length
                          )}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm">Organic Acquisition Rate</span>
                        <span className="font-medium text-green-600">
                          {(
                            (data.clientAcquisition
                              .filter(s => s.cost === 0)
                              .reduce((sum, s) => sum + s.count, 0) / data.newClients) * 100
                          ).toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm">Return on Ad Spend</span>
                        <span className="font-medium text-purple-600">4.2x</span>
                      </div>
                    </div>
                  </div>

                  {/* Channel Insights */}
                  <div>
                    <h4 className="font-medium text-lea-deep-charcoal mb-4">Channel Insights</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-lg">
                        <p className="font-medium text-green-900">Referrals Leading</p>
                        <p className="text-sm text-green-700">
                          30% of new clients come from referrals with zero acquisition cost
                        </p>
                      </div>
                      
                      <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                        <p className="font-medium text-blue-900">Social Media Growth</p>
                        <p className="text-sm text-blue-700">
                          Social media is the top paid channel with strong conversion rates
                        </p>
                      </div>
                      
                      <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                        <p className="font-medium text-yellow-900">Google Ads ROI</p>
                        <p className="text-sm text-yellow-700">
                          Higher cost per click but excellent conversion to high-value clients
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Demographics */}
        <TabsContent value="demographics">
          <div className="space-y-6">
            {/* Age Demographics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Age Demographics
                </CardTitle>
                <CardDescription>Client distribution by age groups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.demographics.ageGroups.map((group) => (
                    <div key={group.range} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 text-sm font-medium">{group.range}</div>
                        <Progress value={group.percentage} className="w-48 h-2" />
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-lea-deep-charcoal">{group.count} clients</p>
                        <p className="text-sm text-muted-foreground">{group.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gender and Location */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gender Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                  <CardDescription>Client base by gender</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.demographics.gender.map((gender) => (
                      <div key={gender.type} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{gender.type}</span>
                          <span className="text-sm text-muted-foreground">
                            {gender.count} ({gender.percentage}%)
                          </span>
                        </div>
                        <Progress value={gender.percentage} className="h-3" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Location Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Location Distribution
                  </CardTitle>
                  <CardDescription>Client base by area</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.demographics.location.map((location) => (
                      <div key={location.area} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{location.area}</span>
                          <span className="text-sm text-muted-foreground">
                            {location.count} ({location.percentage}%)
                          </span>
                        </div>
                        <Progress value={location.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Client Behavior */}
        <TabsContent value="behavior">
          <div className="space-y-6">
            {/* Behavioral Patterns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Visit Frequency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-lea-deep-charcoal mb-2">
                    3.2 months
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Between appointments
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Peak Booking Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-lea-deep-charcoal mb-2">
                    Fri-Sat
                  </div>
                  <div className="text-sm text-muted-foreground">
                    45% of bookings
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Preferred Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-lea-deep-charcoal mb-2">
                    2-4 PM
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Most popular slot
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Treatment Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Treatment Preferences</CardTitle>
                <CardDescription>Most popular treatments by client segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-medium text-lea-deep-charcoal mb-4">By Age Group</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm">18-35: Prevention Focus</span>
                          <span className="text-blue-600 font-medium">Botox, Chemical Peels</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <span className="text-sm">36-50: Enhancement</span>
                          <span className="text-purple-600 font-medium">Fillers, Laser</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm">50+: Restoration</span>
                          <span className="text-green-600 font-medium">Advanced Procedures</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-lea-deep-charcoal mb-4">Seasonal Trends</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <span className="text-sm">Spring (Mar-May)</span>
                          <span className="text-yellow-600 font-medium">+15% bookings</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm">Summer (Jun-Aug)</span>
                          <span className="text-green-600 font-medium">+25% bookings</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm">Holiday Season</span>
                          <span className="text-blue-600 font-medium">+20% bookings</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Journey Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Client Journey Analysis
                </CardTitle>
                <CardDescription>Understanding the client lifecycle and touchpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-700 mb-1">2.3 days</div>
                      <p className="text-sm text-blue-600">Discovery to Booking</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-700 mb-1">4.7/5</div>
                      <p className="text-sm text-green-600">First Visit Rating</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-xl font-bold text-purple-700 mb-1">87%</div>
                      <p className="text-sm text-purple-600">Return Rate</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-xl font-bold text-yellow-700 mb-1">3.2</div>
                      <p className="text-sm text-yellow-600">Avg Referrals</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-lea-deep-charcoal">Key Behavior Insights</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                        <p className="font-medium text-blue-900">High Digital Engagement</p>
                        <p className="text-sm text-blue-700">
                          78% of clients follow social media and engage with content regularly
                        </p>
                      </div>
                      
                      <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-lg">
                        <p className="font-medium text-green-900">Strong Word-of-Mouth</p>
                        <p className="text-sm text-green-700">
                          Each satisfied client refers an average of 3.2 new clients
                        </p>
                      </div>
                      
                      <div className="p-3 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
                        <p className="font-medium text-purple-900">Loyalty Program Success</p>
                        <p className="text-sm text-purple-700">
                          Loyalty members visit 40% more frequently than regular clients
                        </p>
                      </div>
                      
                      <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                        <p className="font-medium text-yellow-900">Mobile-First Preference</p>
                        <p className="text-sm text-yellow-700">
                          65% of bookings are made via mobile devices and apps
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
