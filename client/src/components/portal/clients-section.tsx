import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ClientsSection() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-serif font-bold text-lea-deep-charcoal">
            Client Management
          </h2>
          <p className="text-lea-charcoal-grey mt-1">
            Manage your client database and medical records
          </p>
        </div>
        <Button className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal">
          <i className="fas fa-user-plus mr-2"></i>Add Client
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-lea-clinical-blue/10 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-lea-clinical-blue"></i>
              </div>
              <div>
                <p className="text-sm text-lea-charcoal-grey">Total Clients</p>
                <p className="text-xl font-bold text-lea-deep-charcoal">248</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-user-plus text-green-600"></i>
              </div>
              <div>
                <p className="text-sm text-lea-charcoal-grey">New This Month</p>
                <p className="text-xl font-bold text-lea-deep-charcoal">18</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-lea-elegant-silver/10 rounded-lg flex items-center justify-center">
                <i className="fas fa-heart text-lea-elegant-silver"></i>
              </div>
              <div>
                <p className="text-sm text-lea-charcoal-grey">Active Clients</p>
                <p className="text-xl font-bold text-lea-deep-charcoal">189</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-lea-platinum-white border-lea-silver-grey">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-file-medical text-amber-600"></i>
              </div>
              <div>
                <p className="text-sm text-lea-charcoal-grey">Pending Reviews</p>
                <p className="text-xl font-bold text-lea-deep-charcoal">7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="bg-lea-platinum-white border-lea-silver-grey">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lea-deep-charcoal font-serif">Client Database</CardTitle>
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm border-lea-silver-grey"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-lea-charcoal-grey">
            <i className="fas fa-users text-4xl mb-4 text-lea-elegant-silver"></i>
            <p className="text-lg font-medium mb-2">Client Management System</p>
            <p>This section will contain the full client management interface</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
