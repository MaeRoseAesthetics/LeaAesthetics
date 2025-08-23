import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Compliance() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const complianceItems = [
    {
      id: "jccp",
      name: "JCCP Registration",
      status: "active",
      description: "Joint Council for Cosmetic Practitioners",
      expiryDate: "December 2024",
      progress: 100,
      icon: "fas fa-check-circle",
      color: "success"
    },
    {
      id: "cqc",
      name: "CQC Registration",
      status: "compliant",
      description: "Care Quality Commission",
      expiryDate: "Next inspection due March 2024",
      progress: 95,
      icon: "fas fa-hospital",
      color: "success"
    },
    {
      id: "dbs",
      name: "DBS Check",
      status: "action_needed",
      description: "Disclosure and Barring Service",
      expiryDate: "Renewal required",
      progress: 75,
      icon: "fas fa-exclamation-triangle",
      color: "warning"
    },
    {
      id: "ofqual",
      name: "Ofqual Accreditation",
      status: "approved",
      description: "Training provider status",
      expiryDate: "Valid until 2025",
      progress: 100,
      icon: "fas fa-certificate",
      color: "success"
    },
    {
      id: "gdpr",
      name: "GDPR Compliance",
      status: "compliant",
      description: "Data protection compliance",
      expiryDate: "Annual review due",
      progress: 90,
      icon: "fas fa-shield-alt",
      color: "success"
    },
    {
      id: "cpd",
      name: "CPD Requirements",
      status: "on_track",
      description: "Continuing Professional Development",
      expiryDate: "16/20 hours completed",
      progress: 80,
      icon: "fas fa-book-open",
      color: "medical-blue"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'compliant':
        return <Badge className="bg-success text-white">Compliant</Badge>;
      case 'action_needed':
        return <Badge variant="destructive">Action Needed</Badge>;
      case 'on_track':
        return <Badge className="bg-medical-blue text-white">On Track</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'medical-blue':
        return 'text-medical-blue';
      default:
        return 'text-gray-500';
    }
  };

  const auditTrailItems = [
    {
      id: 1,
      action: "DBS Check Renewal Reminder Sent",
      timestamp: "2024-01-15 14:30",
      user: "System",
      category: "Compliance"
    },
    {
      id: 2,
      action: "CPD Training Completed - Advanced Injection Techniques",
      timestamp: "2024-01-14 16:45",
      user: "Dr. Johnson",
      category: "CPD"
    },
    {
      id: 3,
      action: "Client Consent Form Digitally Signed",
      timestamp: "2024-01-14 11:20",
      user: "Emma Thompson",
      category: "Consent"
    },
    {
      id: 4,
      action: "Age Verification Completed",
      timestamp: "2024-01-14 11:18",
      user: "Emma Thompson",
      category: "Verification"
    },
    {
      id: 5,
      action: "CQC Audit Trail Export Generated",
      timestamp: "2024-01-13 09:15",
      user: "Dr. Johnson",
      category: "Reporting"
    }
  ];

  return (
    <div className="min-h-screen bg-clinical-grey">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="bg-white border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
                    Compliance & Regulation
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Monitor regulatory compliance and audit trails
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button data-testid="button-generate-report">
                    <i className="fas fa-download mr-2"></i>Generate Compliance Report
                  </Button>
                  <Button variant="outline" data-testid="button-schedule-audit">
                    <i className="fas fa-calendar mr-2"></i>Schedule Audit
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Overall Compliance Score */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-shield-alt text-medical-blue mr-3"></i>
                  Overall Compliance Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold text-success" data-testid="text-compliance-score">98%</div>
                    <p className="text-sm text-gray-500">Excellent compliance status</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Last Updated</div>
                    <div className="font-medium">Today, 14:30</div>
                  </div>
                </div>
                <Progress value={98} className="h-3" />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Non-Compliant</span>
                  <span>Fully Compliant</span>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {complianceItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <i className={`${item.icon} ${getIconColor(item.color)} mr-3`}></i>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Status:</span>
                        <span className="font-medium" data-testid={`text-status-${item.id}`}>
                          {item.expiryDate}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Compliance</span>
                          <span>{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4"
                      data-testid={`button-view-${item.id}`}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Risk Assessment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-exclamation-triangle text-warning mr-3"></i>
                    Action Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                      <i className="fas fa-circle text-red-500 mt-1.5 text-xs"></i>
                      <div className="flex-1">
                        <h4 className="font-medium text-red-900">DBS Check Renewal Required</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Current DBS check expires in 30 days. Schedule renewal immediately.
                        </p>
                        <p className="text-xs text-red-600 mt-2">Due: February 15, 2024</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <i className="fas fa-circle text-yellow-500 mt-1.5 text-xs"></i>
                      <div className="flex-1">
                        <h4 className="font-medium text-yellow-900">CPD Hours Tracking</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          4 more CPD hours needed to meet annual requirement.
                        </p>
                        <p className="text-xs text-yellow-600 mt-2">Target: 20 hours by Dec 31, 2024</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <i className="fas fa-circle text-medical-blue mt-1.5 text-xs"></i>
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900">CQC Inspection Preparation</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Review documentation and update policies before March inspection.
                        </p>
                        <p className="text-xs text-blue-600 mt-2">Scheduled: March 2024</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-chart-pie text-medical-blue mr-3"></i>
                    Compliance Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Treatment Compliance</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={95} className="w-20 h-2" />
                        <span className="text-sm font-medium">95%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Training Compliance</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={100} className="w-20 h-2" />
                        <span className="text-sm font-medium">100%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Data Protection</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={90} className="w-20 h-2" />
                        <span className="text-sm font-medium">90%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Staff Qualifications</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={85} className="w-20 h-2" />
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Safety Protocols</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={100} className="w-20 h-2" />
                        <span className="text-sm font-medium">100%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <Button variant="outline" className="w-full" data-testid="button-detailed-breakdown">
                      View Detailed Breakdown
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Audit Trail */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-list-alt text-medical-blue mr-3"></i>
                  Audit Trail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditTrailItems.map((item) => (
                    <div key={item.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-medical-blue rounded-full flex items-center justify-center">
                        <i className="fas fa-clock text-white text-xs"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900" data-testid={`text-audit-action-${item.id}`}>
                          {item.action}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span>
                            <i className="fas fa-user mr-1"></i>
                            {item.user}
                          </span>
                          <span>
                            <i className="fas fa-clock mr-1"></i>
                            {item.timestamp}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline" data-testid="button-view-full-audit">
                    View Full Audit Trail
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
