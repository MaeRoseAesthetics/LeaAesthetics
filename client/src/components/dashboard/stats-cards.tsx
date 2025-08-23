import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
            <CardContent className="p-6">
              <div className="animate-pulse flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-lea-pearl-white rounded-xl"></div>
                </div>
                <div className="ml-4 space-y-2">
                  <div className="h-4 bg-lea-pearl-white rounded w-24"></div>
                  <div className="h-8 bg-lea-silver-grey rounded w-20"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const defaultStats = {
    todayAppointments: 0,
    monthlyRevenue: "£0.00",
    activeStudents: 0,
    complianceScore: "98%"
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-lea-deep-charcoal rounded-xl flex items-center justify-center">
                <i className="fas fa-calendar-check text-lea-platinum-white text-lg"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-lea-charcoal-grey mb-1">Today's Appointments</p>
              <p className="text-3xl font-bold text-lea-deep-charcoal" data-testid="stat-today-appointments">
                {displayStats.todayAppointments}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-lea-soft-gold rounded-xl flex items-center justify-center">
                <i className="fas fa-coins text-lea-deep-charcoal text-lg"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-lea-charcoal-grey mb-1">Monthly Revenue</p>
              <p className="text-3xl font-bold text-lea-deep-charcoal" data-testid="stat-monthly-revenue">
                {displayStats.monthlyRevenue}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-lea-clinical-blue rounded-xl flex items-center justify-center">
                <i className="fas fa-user-graduate text-lea-platinum-white text-lg"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-lea-charcoal-grey mb-1">Active Students</p>
              <p className="text-3xl font-bold text-lea-deep-charcoal" data-testid="stat-active-students">
                {displayStats.activeStudents}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-lea-deep-charcoal to-lea-elegant-charcoal rounded-xl flex items-center justify-center">
                <i className="fas fa-award text-lea-platinum-white text-lg"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-lea-charcoal-grey mb-1">Compliance Score</p>
              <p className="text-3xl font-bold text-lea-deep-charcoal" data-testid="stat-compliance-score">
                {displayStats.complianceScore}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
