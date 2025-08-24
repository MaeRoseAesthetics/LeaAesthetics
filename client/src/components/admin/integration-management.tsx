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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CreditCard, 
  Calendar, 
  Database, 
  Link2, 
  Save, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Settings,
  Key,
  Globe,
  Zap,
  Download,
  Upload,
  RefreshCw,
  Shield,
  Cloud,
  Mail,
  MessageSquare,
  BarChart3,
  Users
} from 'lucide-react';

const paymentGatewaySchema = z.object({
  provider: z.string().min(1, 'Payment provider is required'),
  publicKey: z.string().optional(),
  secretKey: z.string().optional(),
  webhookUrl: z.string().optional(),
  currency: z.string().min(1, 'Currency is required'),
  testMode: z.boolean(),
  enabled: z.boolean(),
});

const calendarIntegrationSchema = z.object({
  provider: z.string().min(1, 'Calendar provider is required'),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  calendarId: z.string().optional(),
  syncInterval: z.number().min(5),
  enabled: z.boolean(),
});

const backupSettingsSchema = z.object({
  provider: z.string().min(1, 'Backup provider is required'),
  frequency: z.string().min(1, 'Backup frequency is required'),
  retention: z.number().min(1),
  encryption: z.boolean(),
  autoBackup: z.boolean(),
});

const apiSettingsSchema = z.object({
  apiKey: z.string().optional(),
  webhookSecret: z.string().optional(),
  rateLimitEnabled: z.boolean(),
  rateLimitRequests: z.number().min(1),
  rateLimitWindow: z.number().min(1),
});

type PaymentGatewayFormData = z.infer<typeof paymentGatewaySchema>;
type CalendarIntegrationFormData = z.infer<typeof calendarIntegrationSchema>;
type BackupSettingsFormData = z.infer<typeof backupSettingsSchema>;
type APISettingsFormData = z.infer<typeof apiSettingsSchema>;

const PAYMENT_PROVIDERS = [
  { value: 'stripe', label: 'Stripe', icon: '💳', description: 'Popular payment processor with comprehensive features' },
  { value: 'paypal', label: 'PayPal', icon: '🅿️', description: 'Widely accepted payment solution' },
  { value: 'square', label: 'Square', icon: '⬜', description: 'All-in-one payment and business solution' },
  { value: 'worldpay', label: 'Worldpay', icon: '🌍', description: 'Global payment processing platform' },
];

const CALENDAR_PROVIDERS = [
  { value: 'google', label: 'Google Calendar', icon: '📅', description: 'Sync with Google Calendar' },
  { value: 'outlook', label: 'Microsoft Outlook', icon: '📧', description: 'Integrate with Outlook calendar' },
  { value: 'apple', label: 'Apple Calendar', icon: '🍎', description: 'Connect with Apple Calendar' },
  { value: 'calendly', label: 'Calendly', icon: '⏰', description: 'Professional scheduling platform' },
];

const BACKUP_PROVIDERS = [
  { value: 'aws', label: 'Amazon S3', icon: '☁️', description: 'Reliable cloud storage' },
  { value: 'google', label: 'Google Cloud Storage', icon: '☁️', description: 'Google cloud backup solution' },
  { value: 'dropbox', label: 'Dropbox', icon: '📦', description: 'Simple cloud storage' },
  { value: 'local', label: 'Local Storage', icon: '💾', description: 'Local server backup' },
];

const MARKETING_TOOLS = [
  { value: 'mailchimp', label: 'Mailchimp', status: 'connected' },
  { value: 'hubspot', label: 'HubSpot', status: 'disconnected' },
  { value: 'klaviyo', label: 'Klaviyo', status: 'available' },
  { value: 'sendgrid', label: 'SendGrid', status: 'connected' },
];

const ANALYTICS_TOOLS = [
  { value: 'google-analytics', label: 'Google Analytics', status: 'connected' },
  { value: 'mixpanel', label: 'Mixpanel', status: 'available' },
  { value: 'hotjar', label: 'Hotjar', status: 'available' },
  { value: 'segment', label: 'Segment', status: 'disconnected' },
];

export default function IntegrationManagement() {
  const [activeTab, setActiveTab] = useState('payments');
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  const paymentForm = useForm<PaymentGatewayFormData>({
    resolver: zodResolver(paymentGatewaySchema),
    defaultValues: {
      provider: 'stripe',
      currency: 'GBP',
      testMode: true,
      enabled: true,
    },
  });

  const calendarForm = useForm<CalendarIntegrationFormData>({
    resolver: zodResolver(calendarIntegrationSchema),
    defaultValues: {
      provider: 'google',
      syncInterval: 15,
      enabled: true,
    },
  });

  const backupForm = useForm<BackupSettingsFormData>({
    resolver: zodResolver(backupSettingsSchema),
    defaultValues: {
      provider: 'aws',
      frequency: 'daily',
      retention: 30,
      encryption: true,
      autoBackup: true,
    },
  });

  const apiForm = useForm<APISettingsFormData>({
    resolver: zodResolver(apiSettingsSchema),
    defaultValues: {
      rateLimitEnabled: true,
      rateLimitRequests: 1000,
      rateLimitWindow: 60,
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>;
      case 'disconnected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Disconnected</Badge>;
      case 'available':
        return <Badge className="bg-gray-100 text-gray-800">Available</Badge>;
      case 'error':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const testConnection = async (provider: string) => {
    setTestingConnection(provider);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTestingConnection(null);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payments" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Payments</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Backup</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span>API</span>
          </TabsTrigger>
        </TabsList>

        {/* Payment Gateways Tab */}
        <TabsContent value="payments">
          <div className="space-y-6">
            {/* Payment Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Gateway Configuration
                </CardTitle>
                <CardDescription>
                  Configure payment processors and billing settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={paymentForm.handleSubmit((data) => console.log('Payment Settings:', data))} className="space-y-6">
                  {/* Provider Selection */}
                  <div>
                    <Label>Payment Provider</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {PAYMENT_PROVIDERS.map((provider) => (
                        <div 
                          key={provider.value}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            paymentForm.watch('provider') === provider.value 
                              ? 'border-lea-sage-green bg-lea-sage-green/10' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => paymentForm.setValue('provider', provider.value)}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{provider.icon}</span>
                            <div>
                              <h4 className="font-medium">{provider.label}</h4>
                              <p className="text-sm text-muted-foreground">{provider.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Provider Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="publicKey">Public Key / Client ID</Label>
                      <Input {...paymentForm.register('publicKey')} type="password" />
                    </div>
                    <div>
                      <Label htmlFor="secretKey">Secret Key</Label>
                      <Input {...paymentForm.register('secretKey')} type="password" />
                    </div>
                    <div>
                      <Label htmlFor="webhookUrl">Webhook URL</Label>
                      <Input {...paymentForm.register('webhookUrl')} placeholder="https://your-domain.com/webhooks" />
                    </div>
                    <div>
                      <Label htmlFor="currency">Default Currency</Label>
                      <Select 
                        value={paymentForm.watch('currency')} 
                        onValueChange={(value) => paymentForm.setValue('currency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Test Mode</Label>
                        <p className="text-sm text-muted-foreground">Use test credentials for development</p>
                      </div>
                      <Switch 
                        checked={paymentForm.watch('testMode')}
                        onCheckedChange={(checked) => paymentForm.setValue('testMode', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Enable Payment Gateway</Label>
                        <p className="text-sm text-muted-foreground">Accept payments through this provider</p>
                      </div>
                      <Switch 
                        checked={paymentForm.watch('enabled')}
                        onCheckedChange={(checked) => paymentForm.setValue('enabled', checked)}
                      />
                    </div>
                  </div>

                  {/* Test Connection */}
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => testConnection('payment')}
                      disabled={testingConnection === 'payment'}
                    >
                      {testingConnection === 'payment' ? (
                        <TestTube className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <TestTube className="h-4 w-4 mr-2" />
                      )}
                      Test Connection
                    </Button>
                    <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                      <Save className="h-4 w-4 mr-2" />
                      Save Payment Settings
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Payment Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Methods</p>
                      <p className="text-2xl font-bold text-lea-deep-charcoal">5</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-lea-sage-green" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold text-green-600">98.5%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Processing Fee</p>
                      <p className="text-2xl font-bold text-blue-600">2.9%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Calendar Integration Tab */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Calendar System Integration
              </CardTitle>
              <CardDescription>
                Sync appointments with external calendar systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={calendarForm.handleSubmit((data) => console.log('Calendar Settings:', data))} className="space-y-6">
                {/* Provider Selection */}
                <div>
                  <Label>Calendar Provider</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {CALENDAR_PROVIDERS.map((provider) => (
                      <div 
                        key={provider.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          calendarForm.watch('provider') === provider.value 
                            ? 'border-lea-sage-green bg-lea-sage-green/10' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => calendarForm.setValue('provider', provider.value)}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{provider.icon}</span>
                          <div>
                            <h4 className="font-medium">{provider.label}</h4>
                            <p className="text-sm text-muted-foreground">{provider.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calendar Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="clientId">Client ID</Label>
                    <Input {...calendarForm.register('clientId')} type="password" />
                  </div>
                  <div>
                    <Label htmlFor="clientSecret">Client Secret</Label>
                    <Input {...calendarForm.register('clientSecret')} type="password" />
                  </div>
                  <div>
                    <Label htmlFor="calendarId">Calendar ID</Label>
                    <Input {...calendarForm.register('calendarId')} />
                  </div>
                  <div>
                    <Label htmlFor="syncInterval">Sync Interval (minutes)</Label>
                    <Input 
                      type="number" 
                      min="5" 
                      {...calendarForm.register('syncInterval', { valueAsNumber: true })}
                    />
                  </div>
                </div>

                {/* Sync Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Enable Calendar Sync</Label>
                      <p className="text-sm text-muted-foreground">Automatically sync appointments with external calendar</p>
                    </div>
                    <Switch 
                      checked={calendarForm.watch('enabled')}
                      onCheckedChange={(checked) => calendarForm.setValue('enabled', checked)}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => testConnection('calendar')}
                    disabled={testingConnection === 'calendar'}
                  >
                    {testingConnection === 'calendar' ? (
                      <TestTube className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <TestTube className="h-4 w-4 mr-2" />
                    )}
                    Test Connection
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Force Sync
                  </Button>
                  <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                    <Save className="h-4 w-4 mr-2" />
                    Save Calendar Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Data Tab */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Backup & Data Management
              </CardTitle>
              <CardDescription>
                Configure automated backups and data export settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={backupForm.handleSubmit((data) => console.log('Backup Settings:', data))} className="space-y-6">
                {/* Backup Provider */}
                <div>
                  <Label>Backup Provider</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {BACKUP_PROVIDERS.map((provider) => (
                      <div 
                        key={provider.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          backupForm.watch('provider') === provider.value 
                            ? 'border-lea-sage-green bg-lea-sage-green/10' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => backupForm.setValue('provider', provider.value)}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{provider.icon}</span>
                          <div>
                            <h4 className="font-medium">{provider.label}</h4>
                            <p className="text-sm text-muted-foreground">{provider.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Backup Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="frequency">Backup Frequency</Label>
                    <Select 
                      value={backupForm.watch('frequency')} 
                      onValueChange={(value) => backupForm.setValue('frequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="retention">Retention Period (days)</Label>
                    <Input 
                      type="number" 
                      min="1" 
                      {...backupForm.register('retention', { valueAsNumber: true })}
                    />
                  </div>
                </div>

                {/* Backup Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Enable Encryption</Label>
                      <p className="text-sm text-muted-foreground">Encrypt backup files for security</p>
                    </div>
                    <Switch 
                      checked={backupForm.watch('encryption')}
                      onCheckedChange={(checked) => backupForm.setValue('encryption', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Automatic Backup</Label>
                      <p className="text-sm text-muted-foreground">Run backups automatically on schedule</p>
                    </div>
                    <Switch 
                      checked={backupForm.watch('autoBackup')}
                      onCheckedChange={(checked) => backupForm.setValue('autoBackup', checked)}
                    />
                  </div>
                </div>

                {/* Backup Status */}
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Last Backup: Success</p>
                      <p className="text-sm text-green-700">Completed today at 03:00 AM (2.3 GB)</p>
                    </div>
                  </div>
                </Card>

                {/* Actions */}
                <div className="flex space-x-4">
                  <Button type="button" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Backup
                  </Button>
                  <Button type="button" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Restore from Backup
                  </Button>
                  <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                    <Save className="h-4 w-4 mr-2" />
                    Save Backup Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API & Webhooks Tab */}
        <TabsContent value="api">
          <div className="space-y-6">
            {/* API Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  API Configuration
                </CardTitle>
                <CardDescription>
                  Manage API access and webhook settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={apiForm.handleSubmit((data) => console.log('API Settings:', data))} className="space-y-6">
                  {/* API Keys */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="apiKey">API Key</Label>
                      <div className="flex space-x-2">
                        <Input 
                          {...apiForm.register('apiKey')} 
                          type="password" 
                          placeholder="lea_api_key_..." 
                          className="flex-1"
                        />
                        <Button type="button" variant="outline">
                          <Key className="h-4 w-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="webhookSecret">Webhook Secret</Label>
                      <div className="flex space-x-2">
                        <Input 
                          {...apiForm.register('webhookSecret')} 
                          type="password" 
                          placeholder="whsec_..." 
                          className="flex-1"
                        />
                        <Button type="button" variant="outline">
                          <Key className="h-4 w-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Rate Limiting */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Enable Rate Limiting</Label>
                        <p className="text-sm text-muted-foreground">Limit API requests to prevent abuse</p>
                      </div>
                      <Switch 
                        checked={apiForm.watch('rateLimitEnabled')}
                        onCheckedChange={(checked) => apiForm.setValue('rateLimitEnabled', checked)}
                      />
                    </div>
                    
                    {apiForm.watch('rateLimitEnabled') && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                        <div>
                          <Label htmlFor="rateLimitRequests">Max Requests</Label>
                          <Input 
                            type="number" 
                            min="1" 
                            {...apiForm.register('rateLimitRequests', { valueAsNumber: true })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="rateLimitWindow">Time Window (seconds)</Label>
                          <Input 
                            type="number" 
                            min="1" 
                            {...apiForm.register('rateLimitWindow', { valueAsNumber: true })}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                    <Save className="h-4 w-4 mr-2" />
                    Save API Settings
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Third-party Integrations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Link2 className="h-5 w-5 mr-2" />
                  Third-party Integrations
                </CardTitle>
                <CardDescription>
                  Connect with marketing tools and analytics platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Marketing Tools */}
                  <div>
                    <h4 className="text-lg font-medium mb-4">Marketing Tools</h4>
                    <div className="space-y-3">
                      {MARKETING_TOOLS.map((tool) => (
                        <div key={tool.value} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{tool.label}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(tool.status)}
                            <Button variant="outline" size="sm">
                              {tool.status === 'connected' ? 'Configure' : 'Connect'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Analytics Tools */}
                  <div>
                    <h4 className="text-lg font-medium mb-4">Analytics & Tracking</h4>
                    <div className="space-y-3">
                      {ANALYTICS_TOOLS.map((tool) => (
                        <div key={tool.value} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <BarChart3 className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{tool.label}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(tool.status)}
                            <Button variant="outline" size="sm">
                              {tool.status === 'connected' ? 'Configure' : 'Connect'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
