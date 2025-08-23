import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function CPDTracker() {
  const cpdData = {
    completed: 16,
    required: 20,
    progress: 80
  };

  const recentActivities = [
    {
      name: "Advanced Injection Techniques",
      hours: 6
    },
    {
      name: "Complication Management",
      hours: 4
    },
    {
      name: "Patient Safety Workshop",
      hours: 6
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-maerose-forest font-serif">CPD Progress</CardTitle>
        <p className="text-sm text-maerose-forest/60">Annual continuing education requirements</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-medium text-maerose-forest mb-2">
              <span>Completed Hours</span>
              <span data-testid="cpd-hours">
                {cpdData.completed}/{cpdData.required}
              </span>
            </div>
            <Progress value={cpdData.progress} className="h-2" />
          </div>

          <div className="text-sm text-maerose-forest/70">
            <p className="mb-2 text-maerose-forest">Recent activities:</p>
            <ul className="space-y-1">
              {recentActivities.map((activity, index) => (
                <li key={index} className="flex justify-between">
                  <span data-testid={`activity-name-${index}`}>{activity.name}</span>
                  <span className="font-medium text-maerose-forest" data-testid={`activity-hours-${index}`}>
                    {activity.hours} hours
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Button 
            variant="outline" 
            className="w-full mt-4 border-maerose-forest text-maerose-forest hover:bg-maerose-cream/50" 
            data-testid="button-view-cpd-plan"
          >
            View Full CPD Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
