import { Card, CardContent } from "@/components/ui/card";

export default function AdminSection() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h2 className="text-2xl lg:text-3xl font-serif font-bold text-lea-deep-charcoal">
          Admin Settings
        </h2>
        <p className="text-lea-charcoal-grey mt-1">
          System configuration and administrative controls
        </p>
      </div>

      <Card className="bg-lea-platinum-white border-lea-silver-grey">
        <CardContent className="p-12 text-center text-lea-charcoal-grey">
          <i className="fas fa-cog text-4xl mb-4 text-lea-elegant-silver"></i>
          <p className="text-lg font-medium mb-2">System Administration</p>
          <p>Complete system configuration and user management interface</p>
        </CardContent>
      </Card>
    </div>
  );
}
