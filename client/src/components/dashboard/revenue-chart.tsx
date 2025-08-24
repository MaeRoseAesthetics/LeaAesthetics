import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";

type RevenueData = {
  month: string;
  revenue: number;
  treatments: number;
  courses: number;
};

type RevenueChartProps = {
  timeRange?: '6months' | '1year';
  chartType?: 'line' | 'bar';
};

export default function RevenueChart({ timeRange = '6months', chartType = 'line' }: RevenueChartProps) {
  const isMobile = useIsMobile();
  
  const { data: revenueData, isLoading } = useQuery<RevenueData[]>({
    queryKey: [`/api/dashboard/revenue`, timeRange],
    initialData: [
      { month: 'Jan', revenue: 8500, treatments: 45, courses: 12 },
      { month: 'Feb', revenue: 9200, treatments: 52, courses: 15 },
      { month: 'Mar', revenue: 11800, treatments: 58, courses: 18 },
      { month: 'Apr', revenue: 10400, treatments: 48, courses: 14 },
      { month: 'May', revenue: 12100, treatments: 61, courses: 20 },
      { month: 'Jun', revenue: 13750, treatments: 67, courses: 22 }
    ]
  });

  if (isLoading) {
    return (
      <Card className="h-96">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => `£${(value / 1000).toFixed(1)}k`;

  return (
    <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
      <CardHeader className={`${isMobile ? 'pb-4' : 'pb-6'}`}>
        <CardTitle className="text-lea-deep-charcoal flex items-center justify-between">
          <span className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>Revenue Overview</span>
          <div className="flex gap-2">
            <span className="text-sm px-3 py-1 bg-lea-pearl-white rounded-full text-lea-charcoal-grey">
              {timeRange === '6months' ? '6M' : '1Y'}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className={`${isMobile ? 'px-4' : 'px-6'}`}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#666"
                  fontSize={isMobile ? 11 : 12}
                />
                <YAxis 
                  tickFormatter={formatCurrency}
                  stroke="#666"
                  fontSize={isMobile ? 11 : 12}
                />
                <Tooltip 
                  formatter={[(value: number) => [`£${value.toLocaleString()}`, 'Revenue']]}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#1e40af" 
                  strokeWidth={3}
                  dot={{ fill: '#1e40af', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#1e40af', strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#666"
                  fontSize={isMobile ? 11 : 12}
                />
                <YAxis 
                  tickFormatter={formatCurrency}
                  stroke="#666"
                  fontSize={isMobile ? 11 : 12}
                />
                <Tooltip 
                  formatter={[(value: number) => [`£${value.toLocaleString()}`, 'Revenue']]}
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#1e40af"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-lea-pearl-white rounded-lg">
            <div className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-lea-deep-charcoal`}>
              £{revenueData?.reduce((sum, item) => sum + item.revenue, 0).toLocaleString() || '0'}
            </div>
            <div className="text-sm text-lea-charcoal-grey">Total Revenue</div>
          </div>
          <div className="p-3 bg-lea-pearl-white rounded-lg">
            <div className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-lea-deep-charcoal`}>
              {revenueData?.reduce((sum, item) => sum + item.treatments, 0) || 0}
            </div>
            <div className="text-sm text-lea-charcoal-grey">Total Treatments</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
