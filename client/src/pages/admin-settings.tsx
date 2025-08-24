import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Users, Building2, Bell, Link2, Shield, Clock } from 'lucide-react';
import UserManagement from '@/components/admin/user-management';
import BusinessSettings from '@/components/admin/business-settings';
import NotificationCenter from '@/components/admin/notification-center';
import IntegrationManagement from '@/components/admin/integration-management';
import SecuritySettings from '@/components/admin/security-settings';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen bg-lea-pearl-white">
      {/* Header */}
      <div className="bg-white border-b border-lea-elegant-silver">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-lea-sage-green rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-lea-deep-charcoal">Admin Settings</h1>
                <p className="text-lea-charcoal-grey">Manage system configuration and settings</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-lea-charcoal-grey">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:justify-start">
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Business</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center space-x-2">
              <Link2 className="h-4 w-4" />
              <span className="hidden sm:inline">Integrations</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal">User Management</CardTitle>
                <CardDescription>
                  Manage users, roles, and permissions across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Settings Tab */}
          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal">Business Settings</CardTitle>
                <CardDescription>
                  Configure clinic information, operating hours, and business policies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessSettings />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal">Notification Center</CardTitle>
                <CardDescription>
                  Configure email templates, SMS notifications, and automated reminders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationCenter />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal">Integration Management</CardTitle>
                <CardDescription>
                  Configure payment gateways, calendar systems, and third-party services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IntegrationManagement />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal">Security Settings</CardTitle>
                <CardDescription>
                  Configure security policies, access controls, and audit settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SecuritySettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
