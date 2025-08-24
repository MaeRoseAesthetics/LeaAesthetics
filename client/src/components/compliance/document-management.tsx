import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Download,
  Upload,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  FileSignature,
  Shield,
  User,
  Calendar,
  FileCheck,
  Paperclip
} from 'lucide-react';

const documentSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  type: z.string().min(1, 'Document type is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  templateContent: z.string().min(1, 'Template content is required'),
  requiresSignature: z.boolean(),
  expiryDays: z.number().optional(),
});

type DocumentFormData = z.infer<typeof documentSchema>;

const DOCUMENT_TYPES = [
  { value: 'consent_form', label: 'Consent Form', description: 'Treatment consent and authorization' },
  { value: 'medical_history', label: 'Medical History', description: 'Client medical background' },
  { value: 'treatment_protocol', label: 'Treatment Protocol', description: 'Standard operating procedures' },
  { value: 'safety_data_sheet', label: 'Safety Data Sheet', description: 'Product safety information' },
  { value: 'insurance_document', label: 'Insurance Document', description: 'Insurance and liability forms' },
  { value: 'age_verification', label: 'Age Verification', description: 'Client age confirmation' },
  { value: 'photography_consent', label: 'Photography Consent', description: 'Photo/video permission' },
  { value: 'aftercare_instructions', label: 'Aftercare Instructions', description: 'Post-treatment care guidelines' },
];

const DOCUMENT_CATEGORIES = [
  { value: 'client_forms', label: 'Client Forms' },
  { value: 'clinical_protocols', label: 'Clinical Protocols' },
  { value: 'safety_compliance', label: 'Safety & Compliance' },
  { value: 'insurance_legal', label: 'Insurance & Legal' },
  { value: 'training_materials', label: 'Training Materials' },
];

// Mock documents data
const mockDocuments = [
  {
    id: '1',
    name: 'Botox Treatment Consent Form',
    type: 'consent_form',
    category: 'client_forms',
    status: 'active',
    requiresSignature: true,
    created: '2024-08-01T10:00:00Z',
    lastModified: '2024-08-15T14:30:00Z',
    signaturesCount: 156,
    version: '2.1',
    expiryDays: 365,
  },
  {
    id: '2',
    name: 'Medical History Questionnaire',
    type: 'medical_history',
    category: 'client_forms',
    status: 'active',
    requiresSignature: false,
    created: '2024-07-15T09:00:00Z',
    lastModified: '2024-08-10T11:20:00Z',
    signaturesCount: 0,
    version: '1.3',
    expiryDays: 730,
  },
  {
    id: '3',
    name: 'Dermal Filler Safety Protocol',
    type: 'treatment_protocol',
    category: 'clinical_protocols',
    status: 'draft',
    requiresSignature: false,
    created: '2024-08-20T16:45:00Z',
    lastModified: '2024-08-22T10:15:00Z',
    signaturesCount: 0,
    version: '1.0',
    expiryDays: null,
  },
  {
    id: '4',
    name: 'Hyaluronic Acid Safety Data Sheet',
    type: 'safety_data_sheet',
    category: 'safety_compliance',
    status: 'active',
    requiresSignature: false,
    created: '2024-06-01T14:00:00Z',
    lastModified: '2024-06-01T14:00:00Z',
    signaturesCount: 0,
    version: '1.0',
    expiryDays: 1095,
  },
];

// Mock signed documents
const mockSignedDocuments = [
  {
    id: '1',
    documentName: 'Botox Treatment Consent Form',
    clientName: 'Sarah Johnson',
    practitionerName: 'Dr. Michael Chen',
    signedDate: '2024-08-24T10:30:00Z',
    ipAddress: '192.168.1.100',
    status: 'completed',
    documentId: '1',
  },
  {
    id: '2',
    documentName: 'Photography Consent Form',
    clientName: 'Emma Williams',
    practitionerName: 'Dr. Michael Chen',
    signedDate: '2024-08-23T14:15:00Z',
    ipAddress: '192.168.1.102',
    status: 'completed',
    documentId: '1',
  },
  {
    id: '3',
    documentName: 'Dermal Filler Consent Form',
    clientName: 'James Brown',
    practitionerName: 'Sarah Johnson',
    signedDate: '2024-08-22T11:45:00Z',
    ipAddress: '192.168.1.105',
    status: 'pending_witness',
    documentId: '1',
  },
];

export default function DocumentManagement() {
  const [activeTab, setActiveTab] = useState('documents');
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState(null);

  const documentForm = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      requiresSignature: true,
    },
  });

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Draft</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSignatureStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'pending_witness':
        return <Badge className="bg-orange-100 text-orange-800">Pending Witness</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Document Templates</span>
          </TabsTrigger>
          <TabsTrigger value="signatures" className="flex items-center space-x-2">
            <FileSignature className="h-4 w-4" />
            <span>Digital Signatures</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Compliance Status</span>
          </TabsTrigger>
        </TabsList>

        {/* Document Templates Tab */}
        <TabsContent value="documents">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Document Templates</h3>
                <p className="text-sm text-muted-foreground">Manage consent forms, protocols, and compliance documents</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Template
                </Button>
                <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                      <Plus className="w-4 h-4 mr-2" />
                      New Document
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {DOCUMENT_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((document) => (
                <Card key={document.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{document.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">v{document.version}</p>
                      </div>
                      {getStatusBadge(document.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="capitalize">{document.type.replace('_', ' ')}</span>
                      </div>
                      {document.requiresSignature && (
                        <div className="flex items-center text-sm">
                          <FileSignature className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>{document.signaturesCount} signatures</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Modified {new Date(document.lastModified).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Digital Signatures Tab */}
        <TabsContent value="signatures">
          <div className="space-y-6">
            {/* Signature Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Signatures</p>
                      <p className="text-2xl font-bold text-lea-deep-charcoal">1,247</p>
                    </div>
                    <FileSignature className="h-8 w-8 text-lea-sage-green" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">This Month</p>
                      <p className="text-2xl font-bold text-blue-600">156</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-orange-600">3</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-500" />
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
            </div>

            {/* Recent Signatures */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Digital Signatures</CardTitle>
                    <CardDescription>Track and manage e-signature compliance</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Records
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSignedDocuments.map((signature) => (
                    <div key={signature.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-lea-sage-green/10 rounded-lg">
                          <FileSignature className="h-5 w-5 text-lea-sage-green" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-medium">{signature.documentName}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {signature.clientName}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(signature.signedDate).toLocaleDateString()}
                            </span>
                            <span>IP: {signature.ipAddress}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Witnessed by: {signature.practitionerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getSignatureStatusBadge(signature.status)}
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Status Tab */}
        <TabsContent value="compliance">
          <div className="space-y-6">
            {/* Compliance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Document Compliance Overview
                </CardTitle>
                <CardDescription>
                  Monitor compliance status across all document categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {DOCUMENT_CATEGORIES.map((category) => (
                    <div key={category.value} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{category.label}</h4>
                        <p className="text-sm text-muted-foreground">
                          {mockDocuments.filter(doc => doc.category === category.value).length} documents
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">100%</p>
                          <p className="text-xs text-muted-foreground">Compliant</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Action Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Document Review Required</h4>
                      <p className="text-sm text-yellow-800">3 documents require annual compliance review</p>
                      <p className="text-xs text-yellow-700 mt-1">Due: Next month</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <FileCheck className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Template Updates Available</h4>
                      <p className="text-sm text-blue-800">2 templates have regulatory updates available</p>
                      <p className="text-xs text-blue-700 mt-1">Update recommended</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* New Document Dialog */}
      <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Document Template</DialogTitle>
          </DialogHeader>
          <form onSubmit={documentForm.handleSubmit((data) => console.log('Document:', data))} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Document Name</Label>
                <Input {...documentForm.register('name')} />
              </div>
              <div>
                <Label htmlFor="type">Document Type</Label>
                <Select onValueChange={(value) => documentForm.setValue('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => documentForm.setValue('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expiryDays">Expiry (days)</Label>
                <Input 
                  type="number" 
                  {...documentForm.register('expiryDays', { valueAsNumber: true })}
                  placeholder="365"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input {...documentForm.register('description')} />
            </div>
            
            <div>
              <Label htmlFor="templateContent">Template Content</Label>
              <Textarea 
                {...documentForm.register('templateContent')}
                rows={8}
                placeholder="Enter the document template content here..."
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox"
                {...documentForm.register('requiresSignature')}
                className="rounded border-gray-300"
              />
              <Label>Requires digital signature</Label>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowDocumentDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                Create Document
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
