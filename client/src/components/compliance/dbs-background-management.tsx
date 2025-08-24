import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Eye,
  Settings,
  Users,
  FileText,
  Calendar,
  AlertCircle,
  Filter,
  Plus,
} from "lucide-react";
import { format, addMonths, differenceInDays, addYears, addDays } from "date-fns";

interface DbsCheck {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  checkType: 'basic' | 'standard' | 'enhanced' | 'enhanced-barred';
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired' | 'pending' | 'rejected';
  riskLevel: 'low' | 'medium' | 'high';
  disclosures: string[];
  verifiedBy: string;
  verificationDate: string;
  renewalRequired: boolean;
  documents: string[];
  notes: string;
}

interface BackgroundCheck {
  id: string;
  staffId: string;
  staffName: string;
  checkType: 'employment' | 'education' | 'professional' | 'character' | 'medical' | 'right-to-work';
  provider: string;
  status: 'completed' | 'pending' | 'failed' | 'expired';
  completedDate: string;
  expiryDate?: string;
  result: 'satisfactory' | 'satisfactory-with-conditions' | 'unsatisfactory' | 'pending';
  details: string;
  verifiedBy: string;
  documents: string[];
  followUpRequired: boolean;
}

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  startDate: string;
  contractType: 'permanent' | 'temporary' | 'contract' | 'volunteer';
  clearanceLevel: 'standard' | 'enhanced' | 'security-cleared';
  complianceScore: number;
  dbsChecks: DbsCheck[];
  backgroundChecks: BackgroundCheck[];
}

export default function DbsBackgroundManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showDbsDialog, setShowDbsDialog] = useState(false);
  const [showBackgroundDialog, setShowBackgroundDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterExpiryDays, setFilterExpiryDays] = useState<string>("90");
  const { toast } = useToast();

  // Mock data - replace with real API calls
  const { data: staffMembers = [] } = useQuery<StaffMember[]>({
    queryKey: ["/api/staff/background-checks"],
    initialData: [
      {
        id: "staff-1",
        firstName: "Dr. Sarah",
        lastName: "Wilson",
        role: "Lead Practitioner",
        department: "Clinical",
        startDate: "2023-01-15",
        contractType: "permanent",
        clearanceLevel: "enhanced",
        complianceScore: 95,
        dbsChecks: [
          {
            id: "dbs-1",
            staffId: "staff-1",
            staffName: "Dr. Sarah Wilson",
            role: "Lead Practitioner",
            checkType: "enhanced",
            certificateNumber: "DBS123456789",
            issueDate: "2024-02-15",
            expiryDate: "2027-02-15",
            status: "valid",
            riskLevel: "low",
            disclosures: [],
            verifiedBy: "HR Manager",
            verificationDate: "2024-02-20",
            renewalRequired: false,
            documents: ["dbs-certificate.pdf", "verification-form.pdf"],
            notes: "Clear certificate, no issues identified",
          },
        ],
        backgroundChecks: [
          {
            id: "bg-1",
            staffId: "staff-1",
            staffName: "Dr. Sarah Wilson",
            checkType: "professional",
            provider: "GMC Verification Services",
            status: "completed",
            completedDate: "2024-01-10",
            result: "satisfactory",
            details: "Medical registration verified, no sanctions",
            verifiedBy: "HR Manager",
            documents: ["gmc-verification.pdf"],
            followUpRequired: false,
          },
        ],
      },
      {
        id: "staff-2",
        firstName: "Emma",
        lastName: "Thompson",
        role: "Nurse Practitioner",
        department: "Clinical",
        startDate: "2023-06-01",
        contractType: "permanent",
        clearanceLevel: "standard",
        complianceScore: 88,
        dbsChecks: [
          {
            id: "dbs-2",
            staffId: "staff-2",
            staffName: "Emma Thompson",
            role: "Nurse Practitioner",
            checkType: "enhanced",
            certificateNumber: "DBS987654321",
            issueDate: "2023-05-20",
            expiryDate: "2024-11-20",
            status: "expiring",
            riskLevel: "low",
            disclosures: [],
            verifiedBy: "HR Manager",
            verificationDate: "2023-05-25",
            renewalRequired: true,
            documents: ["dbs-certificate.pdf"],
            notes: "Renewal process initiated",
          },
        ],
        backgroundChecks: [],
      },
    ],
  });

  const getDbsStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBackgroundStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'expiring':
        return <AlertTriangle className="w-4 h-4" />;
      case 'expired':
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const calculateExpiringChecks = (days: number = 90) => {
    const cutoffDate = addDays(new Date(), days);
    return staffMembers.filter(staff =>
      staff.dbsChecks.some(check => {
        const expiryDate = new Date(check.expiryDate);
        return expiryDate <= cutoffDate && expiryDate > new Date();
      })
    ).length;
  };

  const getExpiredChecks = () => {
    return staffMembers.filter(staff =>
      staff.dbsChecks.some(check => new Date(check.expiryDate) < new Date())
    ).length;
  };

  const getPendingChecks = () => {
    return staffMembers.filter(staff =>
      staff.dbsChecks.some(check => check.status === 'pending') ||
      staff.backgroundChecks.some(check => check.status === 'pending')
    ).length;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Staff</p>
                <p className="text-3xl font-bold">{staffMembers.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Valid DBS Checks</p>
                <p className="text-3xl font-bold">
                  {staffMembers.filter(staff => 
                    staff.dbsChecks.some(check => check.status === 'valid')
                  ).length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Expiring Soon</p>
                <p className="text-3xl font-bold">{calculateExpiringChecks(90)}</p>
                <p className="text-yellow-100 text-xs">Within 90 days</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Action Required</p>
                <p className="text-3xl font-bold">{getExpiredChecks() + getPendingChecks()}</p>
                <p className="text-red-100 text-xs">Expired + Pending</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Urgent Actions Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {staffMembers
              .filter(staff => {
                const hasExpiredDbs = staff.dbsChecks.some(check => new Date(check.expiryDate) < new Date());
                const hasPendingChecks = staff.dbsChecks.some(check => check.status === 'pending') ||
                  staff.backgroundChecks.some(check => check.status === 'pending');
                return hasExpiredDbs || hasPendingChecks;
              })
              .map((staff) => (
                <div key={staff.id} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {staff.firstName} {staff.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">{staff.role}</p>
                    {staff.dbsChecks.some(check => new Date(check.expiryDate) < new Date()) && (
                      <p className="text-sm text-red-600 font-medium">DBS check expired</p>
                    )}
                    {staff.dbsChecks.some(check => check.status === 'pending') && (
                      <p className="text-sm text-yellow-600 font-medium">DBS check pending</p>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedStaff(staff);
                      setActiveTab("dbs-checks");
                    }}
                  >
                    Review
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>DBS Check Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['enhanced', 'standard', 'basic'].map((type) => {
                const count = staffMembers.reduce((sum, staff) => 
                  sum + staff.dbsChecks.filter(check => check.checkType === type).length, 0
                );
                const percentage = staffMembers.length > 0 ? (count / staffMembers.length) * 100 : 0;
                
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="capitalize font-medium">{type}</span>
                      <span className="text-sm font-semibold">{count} staff</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Status by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Clinical', 'Administration', 'Training', 'Support'].map((dept) => {
                const deptStaff = staffMembers.filter(staff => staff.department === dept);
                const compliantStaff = deptStaff.filter(staff => 
                  staff.dbsChecks.some(check => check.status === 'valid')
                );
                const percentage = deptStaff.length > 0 ? (compliantStaff.length / deptStaff.length) * 100 : 0;
                
                return (
                  <div key={dept} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{dept}</span>
                      <span className="text-sm font-semibold">{Math.round(percentage)}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDbsChecks = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">DBS Checks Management</h2>
        <Button onClick={() => setShowDbsDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add DBS Check
        </Button>
      </div>

      <div className="space-y-4">
        {staffMembers.map((staff) => (
          <Card key={staff.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {staff.firstName} {staff.lastName}
                  </h3>
                  <p className="text-gray-600">{staff.role} - {staff.department}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={staff.contractType === 'permanent' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                      {staff.contractType}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800">
                      {staff.clearanceLevel}
                    </Badge>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{staff.complianceScore}%</div>
                  <p className="text-sm text-gray-600">Compliance Score</p>
                </div>
              </div>

              {staff.dbsChecks.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-medium">DBS Checks</h4>
                  {staff.dbsChecks.map((check) => (
                    <div key={check.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getDbsStatusColor(check.status)}>
                              {getStatusIcon(check.status)}
                              <span className="ml-1 capitalize">{check.status}</span>
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800">
                              {check.checkType.toUpperCase()}
                            </Badge>
                            <Badge className={getRiskLevelColor(check.riskLevel)}>
                              {check.riskLevel.toUpperCase()} RISK
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Certificate: {check.certificateNumber}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-gray-600">Issue Date</p>
                          <p className="font-medium">{format(new Date(check.issueDate), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Expiry Date</p>
                          <p className="font-medium">{format(new Date(check.expiryDate), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Days Remaining</p>
                          <p className={`font-medium ${
                            differenceInDays(new Date(check.expiryDate), new Date()) < 90 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {differenceInDays(new Date(check.expiryDate), new Date())}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Verified By</p>
                          <p className="font-medium">{check.verifiedBy}</p>
                        </div>
                      </div>

                      {check.disclosures.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-red-600 mb-2">Disclosures:</p>
                          <ul className="list-disc list-inside text-sm text-red-600">
                            {check.disclosures.map((disclosure, index) => (
                              <li key={index}>{disclosure}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {check.notes && (
                        <div className="mb-3">
                          <p className="text-sm font-medium mb-1">Notes:</p>
                          <p className="text-sm text-gray-600">{check.notes}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        {check.renewalRequired && (
                          <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                            <Clock className="w-4 h-4 mr-1" />
                            Renew
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No DBS checks recorded</p>
                  <Button 
                    size="sm" 
                    className="mt-2"
                    onClick={() => {
                      setSelectedStaff(staff);
                      setShowDbsDialog(true);
                    }}
                  >
                    Add DBS Check
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderBackgroundChecks = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Background Checks</h2>
        <Button onClick={() => setShowBackgroundDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Background Check
        </Button>
      </div>

      <div className="space-y-4">
        {staffMembers.map((staff) => (
          <Card key={staff.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {staff.firstName} {staff.lastName}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{staff.role}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedStaff(staff);
                    setShowBackgroundDialog(true);
                  }}
                >
                  Add Check
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {staff.backgroundChecks.length > 0 ? (
                <div className="space-y-3">
                  {staff.backgroundChecks.map((check) => (
                    <div key={check.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getBackgroundStatusColor(check.status)}>
                              {getStatusIcon(check.status)}
                              <span className="ml-1 capitalize">{check.status}</span>
                            </Badge>
                            <Badge variant="outline">
                              {check.checkType.replace('-', ' ')}
                            </Badge>
                            <Badge className={
                              check.result === 'satisfactory' ? 'bg-green-100 text-green-800' :
                              check.result === 'satisfactory-with-conditions' ? 'bg-yellow-100 text-yellow-800' :
                              check.result === 'unsatisfactory' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {check.result?.replace('-', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">Provider: {check.provider}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-gray-600">Completed</p>
                          <p className="font-medium">{format(new Date(check.completedDate), 'MMM dd, yyyy')}</p>
                        </div>
                        {check.expiryDate && (
                          <div>
                            <p className="text-gray-600">Expires</p>
                            <p className="font-medium">{format(new Date(check.expiryDate), 'MMM dd, yyyy')}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-600">Verified By</p>
                          <p className="font-medium">{check.verifiedBy}</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">Details:</p>
                        <p className="text-sm text-gray-600">{check.details}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        {check.followUpRequired && (
                          <Button size="sm" variant="outline" className="text-orange-600 border-orange-600">
                            Follow Up Required
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No background checks recorded</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">DBS & Background Checks</h1>
          <p className="text-gray-600 mt-1">Manage staff security clearance and background verification</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dbs-checks">DBS Checks</TabsTrigger>
          <TabsTrigger value="background-checks">Background Checks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="dbs-checks" className="mt-6">
          {renderDbsChecks()}
        </TabsContent>

        <TabsContent value="background-checks" className="mt-6">
          {renderBackgroundChecks()}
        </TabsContent>
      </Tabs>

      {/* DBS Check Dialog */}
      <Dialog open={showDbsDialog} onOpenChange={setShowDbsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add DBS Check</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Staff Member</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="">Select staff member</option>
                  {staffMembers.map(staff => (
                    <option key={staff.id} value={staff.id}>
                      {staff.firstName} {staff.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Check Type</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="basic">Basic DBS</option>
                  <option value="standard">Standard DBS</option>
                  <option value="enhanced">Enhanced DBS</option>
                  <option value="enhanced-barred">Enhanced DBS with Barred List</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Certificate Number</Label>
                <Input className="mt-1" placeholder="DBS certificate number" />
              </div>
              <div>
                <Label>Issue Date</Label>
                <Input type="date" className="mt-1" />
              </div>
            </div>
            
            <div>
              <Label>Notes</Label>
              <Textarea className="mt-1" placeholder="Additional notes about the DBS check" />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDbsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowDbsDialog(false)}>
              Add DBS Check
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Background Check Dialog */}
      <Dialog open={showBackgroundDialog} onOpenChange={setShowBackgroundDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Background Check</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Staff Member</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="">Select staff member</option>
                  {staffMembers.map(staff => (
                    <option key={staff.id} value={staff.id}>
                      {staff.firstName} {staff.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Check Type</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="employment">Employment History</option>
                  <option value="education">Education Verification</option>
                  <option value="professional">Professional References</option>
                  <option value="character">Character References</option>
                  <option value="medical">Medical Clearance</option>
                  <option value="right-to-work">Right to Work</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Provider</Label>
                <Input className="mt-1" placeholder="Background check provider" />
              </div>
              <div>
                <Label>Completed Date</Label>
                <Input type="date" className="mt-1" />
              </div>
            </div>
            
            <div>
              <Label>Details</Label>
              <Textarea className="mt-1" placeholder="Details of the background check results" />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowBackgroundDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowBackgroundDialog(false)}>
              Add Background Check
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
