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
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
                </div>
                <div className="ml-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
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
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-maerose-forest rounded-md flex items-center justify-center">
                <i className="fas fa-calendar-check text-maerose-cream text-sm"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-maerose-forest/60">Today's Appointments</p>
              <p className="text-2xl font-semibold text-maerose-forest" data-testid="stat-today-appointments">
                {displayStats.todayAppointments}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-maerose-gold rounded-md flex items-center justify-center">
                <i className="fas fa-coins text-maerose-cream text-sm"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-maerose-forest/60">Monthly Revenue</p>
              <p className="text-2xl font-semibold text-maerose-forest" data-testid="stat-monthly-revenue">
                {displayStats.monthlyRevenue}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-maerose-burgundy rounded-md flex items-center justify-center">
                <i className="fas fa-user-graduate text-maerose-cream text-sm"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-maerose-forest/60">Active Students</p>
              <p className="text-2xl font-semibold text-maerose-forest" data-testid="stat-active-students">
                {displayStats.activeStudents}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-maerose-forest rounded-md flex items-center justify-center">
                <i className="fas fa-award text-maerose-cream text-sm"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-maerose-forest/60">Compliance Score</p>
              <p className="text-2xl font-semibold text-maerose-forest" data-testid="stat-compliance-score">
                {displayStats.complianceScore}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
