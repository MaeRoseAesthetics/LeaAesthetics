import { Card, CardContent } from "@/components/ui/card";

interface ComplianceSectionProps {
  mode: 'treatments' | 'training';
}

export default function ComplianceSection({ mode }: ComplianceSectionProps) {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h2 className="text-2xl lg:text-3xl font-serif font-bold text-lea-deep-charcoal">
          {mode === 'treatments' ? 'JCCP Compliance' : 'Ofqual Compliance'}
        </h2>
        <p className="text-lea-charcoal-grey mt-1">
          {mode === 'treatments' 
            ? 'Maintain regulatory compliance for treatments' 
            : 'Ensure training standards meet Ofqual requirements'
          }
        </p>
      </div>

      <Card className="bg-lea-platinum-white border-lea-silver-grey">
        <CardContent className="p-12 text-center text-lea-charcoal-grey">
          <i className="fas fa-shield-alt text-4xl mb-4 text-lea-elegant-silver"></i>
          <p className="text-lg font-medium mb-2">Compliance Dashboard</p>
          <p>Regulatory compliance management and monitoring system</p>
        </CardContent>
      </Card>
    </div>
  );
}
