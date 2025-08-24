import { Card, CardContent } from "@/components/ui/card";

interface AnalyticsSectionProps {
  mode: 'treatments' | 'training';
}

export default function AnalyticsSection({ mode }: AnalyticsSectionProps) {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h2 className="text-2xl lg:text-3xl font-serif font-bold text-lea-deep-charcoal">
          Analytics & Insights
        </h2>
        <p className="text-lea-charcoal-grey mt-1">
          {mode === 'treatments' 
            ? 'Practice performance analytics and business insights' 
            : 'Training program analytics and student progress metrics'
          }
        </p>
      </div>

      <Card className="bg-lea-platinum-white border-lea-silver-grey">
        <CardContent className="p-12 text-center text-lea-charcoal-grey">
          <i className="fas fa-chart-bar text-4xl mb-4 text-lea-elegant-silver"></i>
          <p className="text-lg font-medium mb-2">Business Intelligence</p>
          <p>Advanced analytics and performance monitoring dashboard</p>
        </CardContent>
      </Card>
    </div>
  );
}
