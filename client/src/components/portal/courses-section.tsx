import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CoursesSection() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-serif font-bold text-lea-deep-charcoal">
            Course Management
          </h2>
          <p className="text-lea-charcoal-grey mt-1">
            Manage training courses and educational content
          </p>
        </div>
        <Button className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal">
          <i className="fas fa-plus mr-2"></i>Create Course
        </Button>
      </div>

      <Card className="bg-lea-platinum-white border-lea-silver-grey">
        <CardContent className="p-12 text-center text-lea-charcoal-grey">
          <i className="fas fa-graduation-cap text-4xl mb-4 text-lea-elegant-silver"></i>
          <p className="text-lg font-medium mb-2">Learning Management</p>
          <p>Comprehensive course creation and content management system</p>
        </CardContent>
      </Card>
    </div>
  );
}
