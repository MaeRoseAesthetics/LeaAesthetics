import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentsSection() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-serif font-bold text-lea-deep-charcoal">
            Student Management
          </h2>
          <p className="text-lea-charcoal-grey mt-1">
            Track student progress and manage enrollments
          </p>
        </div>
        <Button className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal">
          <i className="fas fa-user-plus mr-2"></i>Enroll Student
        </Button>
      </div>

      <Card className="bg-lea-platinum-white border-lea-silver-grey">
        <CardContent className="p-12 text-center text-lea-charcoal-grey">
          <i className="fas fa-user-graduate text-4xl mb-4 text-lea-elegant-silver"></i>
          <p className="text-lg font-medium mb-2">Student Progress</p>
          <p>Complete student enrollment and progress tracking system</p>
        </CardContent>
      </Card>
    </div>
  );
}
