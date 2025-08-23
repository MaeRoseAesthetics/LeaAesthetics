import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuickActions() {
  const quickActions = [
    {
      id: "consent",
      icon: "fas fa-file-signature",
      label: "New Consent Form",
      description: "Generate patient consent documentation"
    },
    {
      id: "age-verification",
      icon: "fas fa-id-card",
      label: "Age Verification",
      description: "Verify patient age compliance"
    },
    {
      id: "aftercare",
      icon: "fas fa-heart",
      label: "Send Aftercare",
      description: "Send post-treatment instructions"
    },
    {
      id: "upload",
      icon: "fas fa-upload",
      label: "Upload Course Material",
      description: "Add new training content"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-maerose-forest font-serif">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            className="w-full flex items-center justify-start px-4 py-3 h-auto text-left border-maerose-gold/30 hover:bg-maerose-cream/50"
            data-testid={`quick-action-${action.id}`}
          >
            <i className={`${action.icon} mr-3 text-maerose-forest`}></i>
            <div className="flex-1">
              <div className="font-medium text-maerose-forest">{action.label}</div>
              <div className="text-xs text-maerose-forest/60 mt-0.5">{action.description}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
