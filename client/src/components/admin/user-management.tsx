import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Users, 
  Plus, 
  Search, 
  Shield, 
  Mail, 
  Phone, 
  Calendar, 
  Activity,
  Settings,
  UserPlus,
  UserMinus,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit,
  Trash2,
  Key,
  Eye,
  EyeOff,
  Download,
  Upload,
  Filter
} from "lucide-react";

// User roles configuration
const USER_ROLES = {
  admin: {
    name: "Administrator",
    description: "Full system access and management",
    color: "bg-red-100 text-red-800",
    permissions: ["all"]
  },
  practitioner: {
    name: "Practitioner",
    description: "Clinical operations and client management",
    color: "bg-blue-100 text-blue-800", 
    permissions: ["bookings", "clients", "treatments", "payments", "inventory_view"]
  },
  student: {
    name: "Student",
    description: "Training access and limited operations",
    color: "bg-green-100 text-green-800",
    permissions: ["training", "resources", "practice_bookings"]
  },
  client: {
    name: "Client",
    description: "Self-service portal access only",
    color: "bg-purple-100 text-purple-800",
    permissions: ["portal", "bookings_own", "payments_own"]
  }
};

const PERMISSIONS = {
  bookings: "Manage all bookings and appointments",
  clients: "Manage client profiles and records", 
  treatments: "Manage treatment catalog and protocols",
  payments: "Process payments and manage finances",
  inventory: "Full inventory management access",
  inventory_view: "View-only inventory access",
  training: "Access training materials and courses",
  resources: "Access educational resources",
  practice_bookings: "Book practice sessions",
  portal: "Access client self-service portal",
  bookings_own: "Manage own bookings only",
  payments_own: "View own payment history",
  analytics: "View business analytics and reports",
  admin: "System administration and configuration"
};

const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  department: z.string().optional(),
  notes: z.string().optional(),
});

const passwordPolicySchema = z.object({
  minLength: z.number().min(8, "Minimum length must be at least 8"),
  requireUppercase: z.boolean(),
  requireLowercase: z.boolean(),
  requireNumbers: z.boolean(),
  requireSpecialChars: z.boolean(),
  maxAge: z.number().min(30, "Maximum age must be at least 30 days"),
  lockoutAttempts: z.number().min(3, "Lockout attempts must be at least 3"),
  sessionTimeout: z.number().min(15, "Session timeout must be at least 15 minutes"),
});

type UserFormData = z.infer<typeof userSchema>;
type PasswordPolicyFormData = z.infer<typeof passwordPolicySchema>;

// Mock data
const mockUsers = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson", 
    email: "sarah@leaaesthetics.com",
    phone: "+44 20 1234 5678",
    role: "admin",
    department: "Management",
    status: "active",
    lastLogin: "2024-08-24T09:30:00Z",
    createdAt: "2024-01-15T10:00:00Z",
    loginAttempts: 0,
    notes: "Platform administrator"
  },
  {
    id: "2",
    firstName: "Dr. Michael",
    lastName: "Chen",
    email: "michael@leaaesthetics.com", 
    phone: "+44 161 987 6543",
    role: "practitioner",
    department: "Clinical",
    status: "active",
    lastLogin: "2024-08-24T08:45:00Z",
    createdAt: "2024-02-01T14:30:00Z",
    loginAttempts: 0,
    notes: "Senior practitioner and trainer"
  },
  {
    id: "3",
    firstName: "Emma",
    lastName: "Williams",
    email: "emma@student.leaaesthetics.com",
    phone: "+44 131 555 0123", 
    role: "student",
    department: "Training",
    status: "active",
    lastLogin: "2024-08-23T16:20:00Z",
    createdAt: "2024-07-10T09:15:00Z",
    loginAttempts: 0,
    notes: "Advanced training program student"
  },
  {
    id: "4",
    firstName: "James",
    lastName: "Brown",
    email: "james@leaaesthetics.com",
    phone: "+44 20 8765 4321",
    role: "practitioner", 
    department: "Clinical",
    status: "suspended",
    lastLogin: "2024-08-20T12:00:00Z",
    createdAt: "2024-03-15T11:45:00Z",
    loginAttempts: 5,
    notes: "Account suspended pending review"
  }
];

const mockActivityLog = [
  {
    id: "1",
    userId: "2",
    userName: "Dr. Michael Chen",
    action: "Login successful",
    timestamp: "2024-08-24T08:45:00Z",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome 127.0.0.0"
  },
  {
    id: "2", 
    userId: "1",
    userName: "Sarah Johnson",
    action: "Created new user account",
    timestamp: "2024-08-24T09:15:00Z",
    ipAddress: "192.168.1.101",
    userAgent: "Firefox 128.0.0"
  },
  {
    id: "3",
    userId: "3", 
    userName: "Emma Williams",
    action: "Accessed training module: Advanced Botox Techniques",
    timestamp: "2024-08-23T16:20:00Z",
    ipAddress: "192.168.1.102",
    userAgent: "Safari 17.5"
  },
  {
    id: "4",
    userId: "4",
    userName: "James Brown", 
    action: "Failed login attempt (5/5)",
    timestamp: "2024-08-20T12:05:00Z",
    ipAddress: "192.168.1.103",
    userAgent: "Chrome 127.0.0.0"
  }
];

interface UserManagementProps {
  className?: string;
}

export default function UserManagement({ className = "" }: UserManagementProps) {
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPermissions, setShowPermissions] = useState<string | null>(null);

  const userForm = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const policyForm = useForm<PasswordPolicyFormData>({
    resolver: zodResolver(passwordPolicySchema),
    defaultValues: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true, 
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 90,
      lockoutAttempts: 5,
      sessionTimeout: 60
    }
  });

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Suspended</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = USER_ROLES[role as keyof typeof USER_ROLES];
    if (!roleConfig) return <Badge variant="outline">{role}</Badge>;
    
    return (
      <Badge className={roleConfig.color}>
        <Shield className="w-3 h-3 mr-1" />
        {roleConfig.name}
      </Badge>
    );
  };

  const formatLastLogin = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="security">Security Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4 mt-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">User Management</h3>
              <p className="text-sm text-muted-foreground">Manage user accounts, roles, and access permissions</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Users
              </Button>
              <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-maerose-forest text-maerose-cream">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-maerose-forest/40" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="practitioner">Practitioner</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Users ({filteredUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">User</th>
                      <th className="text-left p-2">Role</th>
                      <th className="text-left p-2">Department</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Last Login</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div>
                            <p className="font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </p>
                            {user.phone && (
                              <p className="text-sm text-muted-foreground flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {user.phone}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-2">{getRoleBadge(user.role)}</td>
                        <td className="p-2">{user.department || "—"}</td>
                        <td className="p-2">{getStatusBadge(user.status)}</td>
                        <td className="p-2">
                          <div className="text-sm">
                            <p>{formatLastLogin(user.lastLogin)}</p>
                            {user.loginAttempts > 0 && (
                              <p className="text-red-600 text-xs">
                                {user.loginAttempts} failed attempts
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm" onClick={() => setShowPermissions(user.id)}>
                              <Shield className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                  <UserMinus className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Suspend User Account?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will suspend {user.firstName} {user.lastName}'s account. They will not be able to log in until reactivated.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                    Suspend Account
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4 mt-6">
          <div>
            <h3 className="text-lg font-medium">Roles & Permissions</h3>
            <p className="text-sm text-muted-foreground">Configure role-based access control and permissions</p>
          </div>

          {/* Roles Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(USER_ROLES).map(([key, role]) => (
              <Card key={key}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{role.name}</CardTitle>
                    <Badge className={role.color}>
                      {mockUsers.filter(u => u.role === key).length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="w-3 h-3 mr-2" />
                    Configure
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Permission Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <p className="text-sm text-muted-foreground">View and modify permissions for each role</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Permission</th>
                      <th className="text-center p-2">Admin</th>
                      <th className="text-center p-2">Practitioner</th>
                      <th className="text-center p-2">Student</th>
                      <th className="text-center p-2">Client</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(PERMISSIONS).map(([key, description]) => (
                      <tr key={key} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div>
                            <p className="font-medium capitalize">{key.replace('_', ' ')}</p>
                            <p className="text-sm text-muted-foreground">{description}</p>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                        </td>
                        <td className="p-2 text-center">
                          {USER_ROLES.practitioner.permissions.includes(key) || key === "analytics" ? 
                            <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> :
                            <div className="w-5 h-5 mx-auto"></div>
                          }
                        </td>
                        <td className="p-2 text-center">
                          {USER_ROLES.student.permissions.includes(key) ? 
                            <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> :
                            <div className="w-5 h-5 mx-auto"></div>
                          }
                        </td>
                        <td className="p-2 text-center">
                          {USER_ROLES.client.permissions.includes(key) ? 
                            <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> :
                            <div className="w-5 h-5 mx-auto"></div>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">User Activity Log</h3>
              <p className="text-sm text-muted-foreground">Monitor user actions and system access</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Log
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivityLog.map((log) => (
                  <div key={log.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{log.userName}</p>
                        <Badge variant="outline" className="text-xs">{log.action}</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                        <span>IP: {log.ipAddress}</span>
                        <span>{log.userAgent}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Security Policy</h3>
              <p className="text-sm text-muted-foreground">Configure password policies and security settings</p>
            </div>
            <Dialog open={showPolicyDialog} onOpenChange={setShowPolicyDialog}>
              <DialogTrigger asChild>
                <Button className="bg-maerose-forest text-maerose-cream">
                  <Settings className="w-4 h-4 mr-2" />
                  Update Policy
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          {/* Security Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Password Policy</p>
                    <p className="text-2xl font-bold text-maerose-forest">Strong</p>
                    <p className="text-xs text-green-600">12+ chars, mixed case, numbers, symbols</p>
                  </div>
                  <Key className="w-8 h-8 text-maerose-sage" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Session Timeout</p>
                    <p className="text-2xl font-bold text-blue-600">60 min</p>
                    <p className="text-xs text-muted-foreground">Automatic logout after inactivity</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Failed Attempts</p>
                    <p className="text-2xl font-bold text-orange-600">5</p>
                    <p className="text-xs text-muted-foreground">Before account lockout</p>
                  </div>
                  <Shield className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Policy Details */}
          <Card>
            <CardHeader>
              <CardTitle>Current Security Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Password Requirements</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Minimum length</span>
                      <Badge>12 characters</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Uppercase letters</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Lowercase letters</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Numbers</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Special characters</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Security Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Password expiry</span>
                      <Badge>90 days</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Session timeout</span>
                      <Badge>60 minutes</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Failed attempts limit</span>
                      <Badge>5 attempts</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Two-factor authentication</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Optional</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with appropriate role and permissions
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={userForm.handleSubmit((data) => console.log(data))}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input {...userForm.register("firstName")} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input {...userForm.register("lastName")} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input type="email" {...userForm.register("email")} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input {...userForm.register("phone")} />
              </div>
              <div>
                <Label htmlFor="role">Role *</Label>
                <Select onValueChange={(value) => userForm.setValue("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(USER_ROLES).map(([key, role]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-2" />
                          <div>
                            <p className="font-medium">{role.name}</p>
                            <p className="text-xs text-muted-foreground">{role.description}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={(value) => userForm.setValue("department", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Management">Management</SelectItem>
                    <SelectItem value="Clinical">Clinical</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea {...userForm.register("notes")} />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowUserDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-maerose-forest text-maerose-cream">
                Create User
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Security Policy Dialog */}
      <Dialog open={showPolicyDialog} onOpenChange={setShowPolicyDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Security Policy</DialogTitle>
            <DialogDescription>
              Configure password requirements and security settings
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={policyForm.handleSubmit((data) => console.log(data))}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="minLength">Minimum Password Length</Label>
                <Input 
                  type="number" 
                  {...policyForm.register("minLength", { valueAsNumber: true })} 
                />
              </div>
              
              <div className="space-y-3">
                <Label>Password Requirements</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      {...policyForm.register("requireUppercase")}
                      defaultChecked
                    />
                    <span className="text-sm">Require uppercase letters</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      {...policyForm.register("requireLowercase")}
                      defaultChecked
                    />
                    <span className="text-sm">Require lowercase letters</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      {...policyForm.register("requireNumbers")}
                      defaultChecked
                    />
                    <span className="text-sm">Require numbers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      {...policyForm.register("requireSpecialChars")}
                      defaultChecked
                    />
                    <span className="text-sm">Require special characters</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="maxAge">Password Expiry (days)</Label>
                <Input 
                  type="number" 
                  {...policyForm.register("maxAge", { valueAsNumber: true })} 
                />
              </div>
              
              <div>
                <Label htmlFor="lockoutAttempts">Failed Attempts Before Lockout</Label>
                <Input 
                  type="number" 
                  {...policyForm.register("lockoutAttempts", { valueAsNumber: true })} 
                />
              </div>
              
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input 
                  type="number" 
                  {...policyForm.register("sessionTimeout", { valueAsNumber: true })} 
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowPolicyDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-maerose-forest text-maerose-cream">
                Update Policy
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
