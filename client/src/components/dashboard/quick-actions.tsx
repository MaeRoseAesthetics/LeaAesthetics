import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile, useDeviceType } from "@/hooks/use-mobile";

export default function QuickActions() {
  const isMobile = useIsMobile();
  const { isSmallMobile } = useDeviceType();

  const quickActions = [
    {
      id: "consent",
      icon: "fas fa-file-signature",
      label: "New Consent Form",
      description: "Generate patient consent documentation",
      color: "text-lea-clinical-blue"
    },
    {
      id: "age-verification",
      icon: "fas fa-id-card",
      label: "Age Verification",
      description: "Verify patient age compliance",
      color: "text-lea-elegant-silver"
    },
    {
      id: "aftercare",
      icon: "fas fa-heart",
      label: "Send Aftercare",
      description: "Send post-treatment instructions",
      color: "text-lea-deep-charcoal"
    },
    {
      id: "upload",
      icon: "fas fa-upload",
      label: "Upload Course Material",
      description: "Add new training content",
      color: "text-lea-clinical-blue"
    }
  ];

  return (
    <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
      <CardHeader className={`${isMobile ? 'p-4 pb-3' : 'p-6 pb-4'}`}>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-lea-deep-charcoal rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="fas fa-bolt text-lea-platinum-white text-xs"></i>
          </div>
          <CardTitle className="text-lea-deep-charcoal font-serif text-lg">
            Quick Actions
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4 pt-0' : 'p-6 pt-0'} space-y-2`}>
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            className={`w-full flex items-center justify-start ${isMobile ? 'px-3 py-3' : 'px-4 py-3'} ${isSmallMobile ? 'min-h-[52px]' : 'min-h-[56px]'} h-auto text-left hover:bg-lea-pearl-white hover:shadow-lea-subtle transition-all duration-200 rounded-lg touch-manipulation`}
            data-testid={`quick-action-${action.id}`}
          >
            <i className={`${action.icon} ${isMobile ? 'mr-3' : 'mr-4'} ${action.color} ${isMobile ? 'text-base' : 'text-lg'} flex-shrink-0`}></i>
            <div className="flex-1 min-w-0">
              <div className={`font-medium text-lea-deep-charcoal ${isSmallMobile ? 'text-sm' : 'text-base'} leading-tight truncate`}>
                {action.label}
              </div>
              <div className={`${isSmallMobile ? 'text-xs' : 'text-sm'} text-lea-charcoal-grey mt-0.5 leading-tight ${isSmallMobile ? 'truncate' : ''}`}>
                {action.description}
              </div>
            </div>
            <i className="fas fa-chevron-right text-lea-silver-grey text-xs ml-2 opacity-60"></i>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
