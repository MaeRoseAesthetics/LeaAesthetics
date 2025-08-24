import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Key, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Save, 
  Lock,
  Unlock,
  Clock,
  Users,
  Monitor,
  Globe,
  Database,
  Fingerprint,
  CheckCircle,
  XCircle,
  Settings,
  Bell,
  Smartphone
} from 'lucide-react';

const securityPolicySchema = z.object({
  passwordMinLength: z.number().min(8, 'Minimum length must be at least 8'),
  passwordRequireUppercase: z.boolean(),
  passwordRequireLowercase: z.boolean(),
  passwordRequireNumbers: z.boolean(),
  passwordRequireSpecialChars: z.boolean(),
  passwordExpiry: z.number().min(30, 'Password expiry must be at least 30 days'),
  sessionTimeout: z.number().min(15, 'Session timeout must be at least 15 minutes'),
  maxFailedAttempts: z.number().min(3, 'Max failed attempts must be at least 3'),
  lockoutDuration: z.number().min(5, 'Lockout duration must be at least 5 minutes'),
  twoFactorRequired: z.boolean(),
  ipWhitelisting: z.boolean(),
  forcePasswordChange: z.boolean(),
});

const encryptionSettingsSchema = z.object({
  encryptionAtRest: z.boolean(),
  encryptionInTransit: z.boolean(),
  keyRotation: z.boolean(),
  keyRotationInterval: z.number().min(30),
  backupEncryption: z.boolean(),
});

const accessControlSchema = z.object({
  roleBasedAccess: z.boolean(),
  apiAccessControl: z.boolean(),
  auditLogging: z.boolean(),
  loginNotifications: z.boolean(),
  suspiciousActivityAlerts: z.boolean(),
  gdprCompliance: z.boolean(),
});

type SecurityPolicyFormData = z.infer<typeof securityPolicySchema>;
type EncryptionSettingsFormData = z.infer<typeof encryptionSettingsSchema>;
type AccessControlFormData = z.infer<typeof accessControlSchema>;

// Mock security metrics
const securityMetrics = {
  overallScore: 87,
  lastSecurityScan: '2024-08-24T02:00:00Z',
  vulnerabilities: {
    critical: 0,
    high: 1,
    medium: 3,
    low: 7,
  },
  activeUsers: 24,
  failedLogins: 12,
  suspiciousActivities: 2,
};

// Mock recent security events
const recentSecurityEvents = [
  {
    id: '1',
    type: 'login_success',
    user: 'Dr. Michael Chen',
    timestamp: '2024-08-24T10:30:00Z',
    location: 'London, UK',
    ipAddress: '192.168.1.100',
    severity: 'info',
  },
  {
    id: '2',
    type: 'failed_login',
    user: 'james@leaaesthetics.com',
    timestamp: '2024-08-24T09:45:00Z',
    location: 'Manchester, UK',
    ipAddress: '192.168.1.103',
    severity: 'warning',
  },
  {
    id: '3',
    type: 'suspicious_activity',
    user: 'Unknown',
    timestamp: '2024-08-24T08:15:00Z',
    location: 'Unknown Location',
    ipAddress: '45.76.123.45',
    severity: 'high',
  },
  {
    id: '4',
    type: 'password_change',
    user: 'Emma Williams',
    timestamp: '2024-08-23T16:20:00Z',
    location: 'Edinburgh, UK',
    ipAddress: '192.168.1.102',
    severity: 'info',
  },
];

export default function SecuritySettings() {
  const [showPasswords, setShowPasswords] = useState(false);

  const securityForm = useForm<SecurityPolicyFormData>({
    resolver: zodResolver(securityPolicySchema),
    defaultValues: {
      passwordMinLength: 12,
      passwordRequireUppercase: true,
      passwordRequireLowercase: true,
      passwordRequireNumbers: true,
      passwordRequireSpecialChars: true,
      passwordExpiry: 90,
      sessionTimeout: 60,
      maxFailedAttempts: 5,
      lockoutDuration: 15,
      twoFactorRequired: false,
      ipWhitelisting: false,
      forcePasswordChange: false,
    },
  });

  const encryptionForm = useForm<EncryptionSettingsFormData>({
    resolver: zodResolver(encryptionSettingsSchema),
    defaultValues: {
      encryptionAtRest: true,
      encryptionInTransit: true,
      keyRotation: true,
      keyRotationInterval: 90,
      backupEncryption: true,
    },
  });

  const accessForm = useForm<AccessControlFormData>({
    resolver: zodResolver(accessControlSchema),
    defaultValues: {
      roleBasedAccess: true,
      apiAccessControl: true,
      auditLogging: true,
      loginNotifications: true,
      suspiciousActivityAlerts: true,
      gdprCompliance: true,
    },
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>;
      case 'critical':
        return <Badge className="bg-red-200 text-red-900">Critical</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login_success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed_login':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'suspicious_activity':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'password_change':
        return <Key className="h-4 w-4 text-blue-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(securityMetrics.overallScore)}`}>
                  {securityMetrics.overallScore}%
                </p>
              </div>
              <Shield className={`h-8 w-8 ${getScoreColor(securityMetrics.overallScore)}`} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-lea-deep-charcoal">{securityMetrics.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-lea-sage-green" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed Logins</p>
                <p className="text-2xl font-bold text-orange-600">{securityMetrics.failedLogins}</p>
              </div>
              <XCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vulnerabilities</p>
                <p className="text-2xl font-bold text-red-600">
                  {securityMetrics.vulnerabilities.critical + securityMetrics.vulnerabilities.high}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Security Policy
            </CardTitle>
            <CardDescription>
              Configure password policies and authentication settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={securityForm.handleSubmit((data) => console.log('Security Policy:', data))} className="space-y-6">
              {/* Password Requirements */}
              <div className="space-y-4">
                <h4 className="font-medium">Password Requirements</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="passwordMinLength">Minimum Length</Label>
                    <Input 
                      type="number" 
                      min="8" 
                      max="64"
                      {...securityForm.register('passwordMinLength', { valueAsNumber: true })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Require uppercase letters</Label>
                      <Switch 
                        checked={securityForm.watch('passwordRequireUppercase')}
                        onCheckedChange={(checked) => securityForm.setValue('passwordRequireUppercase', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Require lowercase letters</Label>
                      <Switch 
                        checked={securityForm.watch('passwordRequireLowercase')}
                        onCheckedChange={(checked) => securityForm.setValue('passwordRequireLowercase', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Require numbers</Label>
                      <Switch 
                        checked={securityForm.watch('passwordRequireNumbers')}
                        onCheckedChange={(checked) => securityForm.setValue('passwordRequireNumbers', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Require special characters</Label>
                      <Switch 
                        checked={securityForm.watch('passwordRequireSpecialChars')}
                        onCheckedChange={(checked) => securityForm.setValue('passwordRequireSpecialChars', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Session & Account Security */}
              <div className="space-y-4">
                <h4 className="font-medium">Session & Account Security</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                    <Input 
                      type="number" 
                      min="30"
                      {...securityForm.register('passwordExpiry', { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input 
                      type="number" 
                      min="15"
                      {...securityForm.register('sessionTimeout', { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxFailedAttempts">Max Failed Attempts</Label>
                    <Input 
                      type="number" 
                      min="3" 
                      max="10"
                      {...securityForm.register('maxFailedAttempts', { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                    <Input 
                      type="number" 
                      min="5"
                      {...securityForm.register('lockoutDuration', { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Security */}
              <div className="space-y-4">
                <h4 className="font-medium">Advanced Security</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication Required</Label>
                      <p className="text-sm text-muted-foreground">Require 2FA for all user accounts</p>
                    </div>
                    <Switch 
                      checked={securityForm.watch('twoFactorRequired')}
                      onCheckedChange={(checked) => securityForm.setValue('twoFactorRequired', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>IP Whitelisting</Label>
                      <p className="text-sm text-muted-foreground">Only allow access from approved IP addresses</p>
                    </div>
                    <Switch 
                      checked={securityForm.watch('ipWhitelisting')}
                      onCheckedChange={(checked) => securityForm.setValue('ipWhitelisting', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Force Password Change</Label>
                      <p className="text-sm text-muted-foreground">Force all users to change passwords on next login</p>
                    </div>
                    <Switch 
                      checked={securityForm.watch('forcePasswordChange')}
                      onCheckedChange={(checked) => securityForm.setValue('forcePasswordChange', checked)}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                <Save className="h-4 w-4 mr-2" />
                Save Security Policy
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Security Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="h-5 w-5 mr-2" />
              Recent Security Events
            </CardTitle>
            <CardDescription>
              Monitor user activities and security incidents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSecurityEvents.map((event) => (
                <div key={event.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    {getEventIcon(event.type)}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm">{event.user}</p>
                        {getSeverityBadge(event.severity)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.location} • {event.ipAddress}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Security Events
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Encryption & Data Protection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Encryption & Data Protection
          </CardTitle>
          <CardDescription>
            Configure encryption settings and data protection policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={encryptionForm.handleSubmit((data) => console.log('Encryption Settings:', data))} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Encryption Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Encryption at Rest</Label>
                      <p className="text-sm text-muted-foreground">Encrypt data stored in databases</p>
                    </div>
                    <Switch 
                      checked={encryptionForm.watch('encryptionAtRest')}
                      onCheckedChange={(checked) => encryptionForm.setValue('encryptionAtRest', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Encryption in Transit</Label>
                      <p className="text-sm text-muted-foreground">Use HTTPS/TLS for all communications</p>
                    </div>
                    <Switch 
                      checked={encryptionForm.watch('encryptionInTransit')}
                      onCheckedChange={(checked) => encryptionForm.setValue('encryptionInTransit', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Backup Encryption</Label>
                      <p className="text-sm text-muted-foreground">Encrypt backup files</p>
                    </div>
                    <Switch 
                      checked={encryptionForm.watch('backupEncryption')}
                      onCheckedChange={(checked) => encryptionForm.setValue('backupEncryption', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Key Management</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Automatic Key Rotation</Label>
                      <p className="text-sm text-muted-foreground">Regularly rotate encryption keys</p>
                    </div>
                    <Switch 
                      checked={encryptionForm.watch('keyRotation')}
                      onCheckedChange={(checked) => encryptionForm.setValue('keyRotation', checked)}
                    />
                  </div>
                  
                  {encryptionForm.watch('keyRotation') && (
                    <div>
                      <Label htmlFor="keyRotationInterval">Key Rotation Interval (days)</Label>
                      <Input 
                        type="number" 
                        min="30"
                        {...encryptionForm.register('keyRotationInterval', { valueAsNumber: true })}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
              <Save className="h-4 w-4 mr-2" />
              Save Encryption Settings
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Access Control & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Fingerprint className="h-5 w-5 mr-2" />
            Access Control & Compliance
          </CardTitle>
          <CardDescription>
            Configure access controls and compliance settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={accessForm.handleSubmit((data) => console.log('Access Control:', data))} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Access Control</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Role-Based Access Control</Label>
                      <p className="text-sm text-muted-foreground">Enforce role-based permissions</p>
                    </div>
                    <Switch 
                      checked={accessForm.watch('roleBasedAccess')}
                      onCheckedChange={(checked) => accessForm.setValue('roleBasedAccess', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>API Access Control</Label>
                      <p className="text-sm text-muted-foreground">Control API access with tokens</p>
                    </div>
                    <Switch 
                      checked={accessForm.watch('apiAccessControl')}
                      onCheckedChange={(checked) => accessForm.setValue('apiAccessControl', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Comprehensive Audit Logging</Label>
                      <p className="text-sm text-muted-foreground">Log all user actions</p>
                    </div>
                    <Switch 
                      checked={accessForm.watch('auditLogging')}
                      onCheckedChange={(checked) => accessForm.setValue('auditLogging', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Monitoring & Compliance</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Login Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send alerts for new logins</p>
                    </div>
                    <Switch 
                      checked={accessForm.watch('loginNotifications')}
                      onCheckedChange={(checked) => accessForm.setValue('loginNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Suspicious Activity Alerts</Label>
                      <p className="text-sm text-muted-foreground">Alert on unusual behavior</p>
                    </div>
                    <Switch 
                      checked={accessForm.watch('suspiciousActivityAlerts')}
                      onCheckedChange={(checked) => accessForm.setValue('suspiciousActivityAlerts', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>GDPR Compliance</Label>
                      <p className="text-sm text-muted-foreground">Ensure GDPR compliance</p>
                    </div>
                    <Switch 
                      checked={accessForm.watch('gdprCompliance')}
                      onCheckedChange={(checked) => accessForm.setValue('gdprCompliance', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
              <Save className="h-4 w-4 mr-2" />
              Save Access Control Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
