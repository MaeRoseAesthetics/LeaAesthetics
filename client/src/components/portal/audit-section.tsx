import { Card, CardContent } from "@/components/ui/card";

export default function AuditSection() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h2 className="text-2xl lg:text-3xl font-serif font-bold text-lea-deep-charcoal">
          CQC Audit Trail
        </h2>
        <p className="text-lea-charcoal-grey mt-1">
          Complete audit trail management for CQC inspections
        </p>
      </div>

      <Card className="bg-lea-platinum-white border-lea-silver-grey">
        <CardContent className="p-12 text-center text-lea-charcoal-grey">
          <i className="fas fa-clipboard-check text-4xl mb-4 text-lea-elegant-silver"></i>
          <p className="text-lg font-medium mb-2">Audit Management</p>
          <p>Comprehensive audit trail and inspection readiness system</p>
        </CardContent>
      </Card>
    </div>
  );
}
