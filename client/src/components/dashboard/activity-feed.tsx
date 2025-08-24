import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatDistanceToNow } from 'date-fns';

type ActivityItem = {
  id: string;
  type: 'booking' | 'payment' | 'registration' | 'compliance' | 'treatment';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  amount?: number;
  status?: 'success' | 'pending' | 'warning' | 'error';
};

type ActivityFeedProps = {
  limit?: number;
  showFilters?: boolean;
};

export default function ActivityFeed({ limit = 10, showFilters = true }: ActivityFeedProps) {
  const isMobile = useIsMobile();
  
  const { data: activities, isLoading } = useQuery<ActivityItem[]>({
    queryKey: [`/api/dashboard/activities`, limit],
    initialData: [
      {
        id: '1',
        type: 'booking',
        title: 'New Appointment Booked',
        description: 'Sarah Johnson booked Botox consultation for tomorrow',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        user: 'Sarah Johnson',
        status: 'success'
      },
      {
        id: '2',
        type: 'payment',
        title: 'Payment Received',
        description: 'Payment processed for facial treatment',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        user: 'Emma Wilson',
        amount: 185,
        status: 'success'
      },
      {
        id: '3',
        type: 'registration',
        title: 'New Student Registration',
        description: 'Michael Chen registered for Advanced Aesthetics course',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        user: 'Michael Chen',
        status: 'success'
      },
      {
        id: '4',
        type: 'compliance',
        title: 'Insurance Renewal Due',
        description: 'Professional indemnity insurance expires in 7 days',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'warning'
      },
      {
        id: '5',
        type: 'treatment',
        title: 'Treatment Completed',
        description: 'Dermal filler treatment completed for Lisa Brown',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        user: 'Lisa Brown',
        status: 'success'
      }
    ]
  });

  if (isLoading) {
    return (
      <Card className="h-96">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return 'fas fa-calendar-plus';
      case 'payment': return 'fas fa-credit-card';
      case 'registration': return 'fas fa-user-plus';
      case 'compliance': return 'fas fa-shield-alt';
      case 'treatment': return 'fas fa-medical';
      default: return 'fas fa-bell';
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'error': return 'destructive';
      case 'pending': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Card className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
      <CardHeader className={`${isMobile ? 'pb-4' : 'pb-6'}`}>
        <CardTitle className="text-lea-deep-charcoal flex items-center justify-between">
          <span className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>Recent Activity</span>
          {showFilters && (
            <Badge variant="outline" className="text-xs">
              Last 24h
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className={`${isMobile ? 'px-4' : 'px-6'}`}>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {activities?.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-lea-pearl-white transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.status || 'success')}`}>
                  <i className={`${getActivityIcon(activity.type)} text-sm`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-lea-deep-charcoal truncate`}>
                      {activity.title}
                    </h4>
                    <span className="text-xs text-lea-charcoal-grey whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-lea-charcoal-grey mb-2 line-clamp-2">
                    {activity.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {activity.user && (
                        <span className="text-xs text-lea-deep-charcoal font-medium">
                          {activity.user}
                        </span>
                      )}
                      {activity.amount && (
                        <span className="text-xs text-green-600 font-semibold">
                          +£{activity.amount}
                        </span>
                      )}
                    </div>
                    {activity.status && activity.status !== 'success' && (
                      <Badge 
                        variant={getStatusBadgeVariant(activity.status)} 
                        className="text-xs"
                      >
                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )) || []}
          </div>
        </ScrollArea>
        
        <div className="mt-4 text-center">
          <button className="text-sm text-lea-clinical-blue hover:text-lea-deep-charcoal font-medium transition-colors">
            View All Activities
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
