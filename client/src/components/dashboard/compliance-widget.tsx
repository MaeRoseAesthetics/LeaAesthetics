import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ComplianceWidget() {
  const complianceItems = [
    {
      id: "jccp",
      name: "JCCP Registration",
      status: "Active",
      validity: "Valid until Dec 2024",
      statusColor: "text-success",
      icon: "fas fa-check"
    },
    {
      id: "cqc",
      name: "CQC Registration",
      status: "Compliant",
      validity: "Next inspection due",
      statusColor: "text-success",
      icon: "fas fa-check"
    },
    {
      id: "dbs",
      name: "DBS Check",
      status: "Action Needed",
      validity: "Renewal required",
      statusColor: "text-warning",
      icon: "fas fa-exclamation"
    },
    {
      id: "ofqual",
      name: "Ofqual Accreditation",
      status: "Approved",
      validity: "Training provider status",
      statusColor: "text-success",
      icon: "fas fa-check"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-maerose-forest font-serif">Compliance Status</CardTitle>
        <p className="text-sm text-maerose-forest/60">Regulatory compliance overview</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {complianceItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-8 h-8 ${item.statusColor === 'text-success' ? 'bg-maerose-forest' : 'bg-maerose-gold'} rounded-full flex items-center justify-center mr-3`}>
                <i className={`${item.icon} text-maerose-cream text-xs`}></i>
              </div>
              <div>
                <p className="text-sm font-medium text-maerose-forest" data-testid={`compliance-name-${item.id}`}>
                  {item.name}
                </p>
                <p className="text-xs text-maerose-forest/60">{item.validity}</p>
              </div>
            </div>
            <span className={`${item.statusColor} font-medium text-sm`} data-testid={`compliance-status-${item.id}`}>
              {item.status}
            </span>
          </div>
        ))}

        <div className="mt-4 pt-4 border-t border-maerose-gold/30">
          <Button 
            className="w-full bg-maerose-forest text-maerose-cream hover:bg-maerose-forest/90" 
            data-testid="button-generate-compliance-report"
          >
            <i className="fas fa-download mr-2"></i>Generate Compliance Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
