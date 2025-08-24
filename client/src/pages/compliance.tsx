import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileText, Activity, Award, Clock } from 'lucide-react';
import DocumentManagement from '@/components/compliance/document-management';
import AuditTrailSystem from '@/components/compliance/audit-trail-system';
import RegulatoryCompliance from '@/components/compliance/regulatory-compliance';
import CertificationTracking from '@/components/compliance/certification-tracking';

export default function Compliance() {
  const [activeTab, setActiveTab] = useState('documents');

  return (
    <div className="min-h-screen bg-lea-pearl-white">
      {/* Header */}
      <div className="bg-white border-b border-lea-elegant-silver">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-lea-sage-green rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-lea-deep-charcoal">Compliance & Regulatory</h1>
                <p className="text-lea-charcoal-grey">Manage regulatory compliance, documentation, and audit trails</p>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Audit Trail</span>
            </TabsTrigger>
            <TabsTrigger value="regulatory" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Regulatory</span>
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>Certifications</span>
            </TabsTrigger>
          </TabsList>

          {/* Document Management Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal">Document Management</CardTitle>
                <CardDescription>
                  Manage digital consent forms, treatment protocols, and compliance documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentManagement />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Trail Tab */}
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal">Audit Trail System</CardTitle>
                <CardDescription>
                  Comprehensive logging and tracking of all system activities and compliance events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AuditTrailSystem />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regulatory Compliance Tab */}
          <TabsContent value="regulatory">
            <Card>
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal">Regulatory Compliance</CardTitle>
                <CardDescription>
                  GDPR compliance, data protection, and regulatory body reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RegulatoryCompliance />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certification Tracking Tab */}
          <TabsContent value="certifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-lea-deep-charcoal">Certification Tracking</CardTitle>
                <CardDescription>
                  Track practitioner qualifications, continuing education, and certification renewals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CertificationTracking />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
