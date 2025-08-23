import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile, useDeviceType } from "@/hooks/use-mobile";

type DashboardStats = {
  todayAppointments: number;
  monthlyRevenue: string;
  activeStudents: number;
  complianceScore: string;
};

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });
  
  const isMobile = useIsMobile();
  const { isSmallMobile } = useDeviceType();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className="animate-pulse flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} bg-lea-pearl-white rounded-xl`}></div>
                </div>
                <div className={`${isMobile ? 'ml-3' : 'ml-4'} space-y-2 flex-1 min-w-0`}>
                  <div className="h-3 bg-lea-pearl-white rounded w-3/4"></div>
                  <div className="h-6 bg-lea-silver-grey rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const defaultStats = {
    todayAppointments: 8,
    monthlyRevenue: "£12,450",
    activeStudents: 24,
    complianceScore: "98%"
  };

  const displayStats = stats || defaultStats;

  const statsData = [
    {
      title: "Today's Appointments",
      value: displayStats.todayAppointments,
      icon: "fas fa-calendar-check",
      bgColor: "bg-lea-deep-charcoal",
      iconColor: "text-lea-platinum-white",
      testId: "stat-today-appointments"
    },
    {
      title: "Monthly Revenue",
      value: displayStats.monthlyRevenue,
      icon: "fas fa-coins",
      bgColor: "bg-lea-elegant-silver",
      iconColor: "text-lea-deep-charcoal",
      testId: "stat-monthly-revenue"
    },
    {
      title: "Active Students",
      value: displayStats.activeStudents,
      icon: "fas fa-user-graduate",
      bgColor: "bg-lea-clinical-blue",
      iconColor: "text-lea-platinum-white",
      testId: "stat-active-students"
    },
    {
      title: "Compliance Score",
      value: displayStats.complianceScore,
      icon: "fas fa-award",
      bgColor: "bg-gradient-to-br from-lea-deep-charcoal to-lea-elegant-charcoal",
      iconColor: "text-lea-platinum-white",
      testId: "stat-compliance-score"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {statsData.map((stat, index) => (
        <Card 
          key={index}
          className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white touch-manipulation"
        >
          <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <i className={`${stat.icon} ${stat.iconColor} ${isMobile ? 'text-base' : 'text-lg'}`}></i>
                </div>
              </div>
              <div className={`${isMobile ? 'ml-3' : 'ml-4'} flex-1 min-w-0`}>
                <p className={`${isSmallMobile ? 'text-xs' : 'text-sm'} font-medium text-lea-charcoal-grey mb-1 truncate`}>
                  {stat.title}
                </p>
                <p 
                  className={`${isSmallMobile ? 'text-xl' : isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-lea-deep-charcoal leading-none`} 
                  data-testid={stat.testId}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
