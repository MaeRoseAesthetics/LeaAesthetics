import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, FileText, Shield, Award, User, Briefcase } from 'lucide-react';
import { apiRequest } from "@/lib/queryClient";

const practitionerRegistrationSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  
  // Professional Information
  qualifications: z.array(z.string()).min(1, 'Please select at least one qualification'),
  yearsOfExperience: z.string().min(1, 'Years of experience is required'),
  specialties: z.array(z.string()).min(1, 'Please select at least one specialty'),
  professionalBody: z.string().min(1, 'Professional body membership is required'),
  
  // Insurance & Compliance
  insuranceProvider: z.string().min(1, 'Insurance provider is required'),
  insurancePolicyNumber: z.string().min(1, 'Insurance policy number is required'),
  insuranceExpiryDate: z.string().min(1, 'Insurance expiry date is required'),
  indemnityAmount: z.string().min(1, 'Indemnity amount is required'),
  
  // DBS & Compliance
  dbsCheckDate: z.string().optional(),
  dbsCertificateNumber: z.string().optional(),
  jccpMember: z.boolean(),
  jccpNumber: z.string().optional(),
  cqcRegistered: z.boolean(),
  cqcNumber: z.string().optional(),
  
  // Practice Information
  practiceType: z.enum(['mobile', 'clinic', 'home', 'multiple']),
  clinicName: z.string().optional(),
  clinicAddress: z.string().optional(),
  businessInsurance: z.boolean(),
  
  // CPD & Training
  cpdHours: z.string().min(1, 'CPD hours are required'),
  lastCpdDate: z.string().optional(),
  willingToTrain: z.boolean().default(false),
  
  // Documents
  qualificationDocuments: z.array(z.any()).optional(),
  insuranceDocuments: z.array(z.any()).optional(),
  dbsDocument: z.array(z.any()).optional(),
  
  // Agreements
  termsAccepted: z.boolean().refine(val => val, 'You must accept the terms and conditions'),
  dataProcessingConsent: z.boolean().refine(val => val, 'You must consent to data processing'),
  marketingConsent: z.boolean().optional(),
});

type PractitionerFormData = z.infer<typeof practitionerRegistrationSchema>;

const qualificationOptions = [
  'Level 4 Diploma in Aesthetic Treatments',
  'Level 5 Diploma in Aesthetic Practice',
  'Level 6 Diploma in Aesthetic Medicine',
  'Level 7 Postgraduate Certificate in Aesthetics',
  'NVQ Level 3 Beauty Therapy',
  'VTCT Level 4 Diploma',
  'CIBTAC International Diploma',
  'Medical Degree (MBBS/MBChB)',
  'Nursing Qualification (RGN)',
  'Dental Qualification (BDS)',
  'Other Professional Qualification'
];

const specialtyOptions = [
  'Anti-wrinkle injections',
  'Dermal fillers',
  'Chemical peels',
  'Microneedling',
  'Laser treatments',
  'IPL treatments',
  'Radiofrequency',
  'Ultrasound therapy',
  'PDO thread lifts',
  'Plasma treatments',
  'Skin consultations',
  'Skincare prescriptions'
];

const professionalBodies = [
  'JCCP (Joint Council for Cosmetic Practitioners)',
  'BACN (British Association of Cosmetic Nurses)',
  'IACCP (Independent Association of Cosmetic Practitioners)',
  'Save Face',
  'CPSA (Cosmetic Practice Standards Authority)',
  'ACE Group',
  'Other'
];

export default function PractitionerRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({});
  const { toast } = useToast();
  
  const form = useForm<PractitionerFormData>({
    resolver: zodResolver(practitionerRegistrationSchema),
    defaultValues: {
      qualifications: [],
      specialties: [],
      jccpMember: false,
      cqcRegistered: false,
      businessInsurance: false,
      willingToTrain: false,
      practiceType: 'clinic',
      termsAccepted: false,
      dataProcessingConsent: false,
      marketingConsent: false
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: PractitionerFormData) => {
      const formData = new FormData();
      
      // Add form data
      Object.keys(data).forEach(key => {
        const value = data[key as keyof PractitionerFormData];
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (value !== undefined && value !== null) {
          formData.append(key, value as string);
        }
      });
      
      // Add files
      Object.keys(uploadedFiles).forEach(category => {
        uploadedFiles[category].forEach(file => {
          formData.append(`${category}[]`, file);
        });
      });
      
      const response = await apiRequest('POST', '/api/practitioners/register', formData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Registration Submitted',
        description: 'Your practitioner registration has been submitted for review. We\'ll contact you within 2-3 business days.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Registration Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (category: string, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles(prev => ({
        ...prev,
        [category]: [...(prev[category] || []), ...fileArray]
      }));
    }
  };

  const removeFile = (category: string, index: number) => {
    setUploadedFiles(prev => ({
      ...prev,
      [category]: prev[category]?.filter((_, i) => i !== index) || []
    }));
  };

  const handleArrayFieldToggle = (fieldName: keyof PractitionerFormData, value: string) => {
    const currentValues = form.getValues(fieldName) as string[] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    form.setValue(fieldName, newValues);
  };

  const onSubmit = (data: PractitionerFormData) => {
    submitMutation.mutate(data);
  };

  const renderPersonalInformation = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
          <p className="text-gray-600">Your basic personal details</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number *</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  const renderProfessionalInformation = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Award className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Professional Information</h2>
          <p className="text-gray-600">Your qualifications and experience</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium">Qualifications *</Label>
          <div className="grid grid-cols-1 gap-3 mt-3">
            {qualificationOptions.map((qualification) => (
              <div key={qualification} className="flex items-center space-x-3">
                <Checkbox
                  id={qualification}
                  checked={form.watch('qualifications')?.includes(qualification)}
                  onCheckedChange={() => handleArrayFieldToggle('qualifications', qualification)}
                />
                <Label htmlFor={qualification} className="text-sm font-normal">
                  {qualification}
                </Label>
              </div>
            ))}
          </div>
          {form.formState.errors.qualifications && (
            <p className="text-sm text-red-600 mt-2">{form.formState.errors.qualifications.message}</p>
          )}
        </div>
        
        <div>
          <Label className="text-base font-medium">Specialties *</Label>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {specialtyOptions.map((specialty) => (
              <div key={specialty} className="flex items-center space-x-3">
                <Checkbox
                  id={specialty}
                  checked={form.watch('specialties')?.includes(specialty)}
                  onCheckedChange={() => handleArrayFieldToggle('specialties', specialty)}
                />
                <Label htmlFor={specialty} className="text-sm font-normal">
                  {specialty}
                </Label>
              </div>
            ))}
          </div>
          {form.formState.errors.specialties && (
            <p className="text-sm text-red-600 mt-2">{form.formState.errors.specialties.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="2-5">2-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="11-15">11-15 years</SelectItem>
                    <SelectItem value="15+">15+ years</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="professionalBody"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Body *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select professional body" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {professionalBodies.map((body) => (
                      <SelectItem key={body} value={body}>{body}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );

  const renderInsuranceCompliance = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Insurance & Compliance</h2>
          <p className="text-gray-600">Professional indemnity and compliance details</p>
        </div>
      </div>
      
      <Alert className="bg-amber-50 border-amber-200">
        <AlertDescription className="text-amber-800">
          All practitioners must have valid professional indemnity insurance and relevant certifications.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="insuranceProvider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Insurance Provider *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Hamilton Fraser, Cosmetic Insure" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="insurancePolicyNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Policy Number *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="insuranceExpiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Insurance Expiry Date *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="indemnityAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Indemnity Amount *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select coverage amount" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1000000">£1,000,000</SelectItem>
                  <SelectItem value="2000000">£2,000,000</SelectItem>
                  <SelectItem value="5000000">£5,000,000</SelectItem>
                  <SelectItem value="6000000">£6,000,000+</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="jccpMember"
            checked={form.watch('jccpMember')}
            onCheckedChange={(checked) => form.setValue('jccpMember', checked as boolean)}
          />
          <Label htmlFor="jccpMember">JCCP Member</Label>
        </div>
        
        {form.watch('jccpMember') && (
          <FormField
            control={form.control}
            name="jccpNumber"
            render={({ field }) => (
              <FormItem className="ml-6">
                <FormLabel>JCCP Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your JCCP membership number" />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        
        <div className="flex items-center space-x-3">
          <Checkbox
            id="cqcRegistered"
            checked={form.watch('cqcRegistered')}
            onCheckedChange={(checked) => form.setValue('cqcRegistered', checked as boolean)}
          />
          <Label htmlFor="cqcRegistered">CQC Registered</Label>
        </div>
        
        {form.watch('cqcRegistered') && (
          <FormField
            control={form.control}
            name="cqcNumber"
            render={({ field }) => (
              <FormItem className="ml-6">
                <FormLabel>CQC Registration Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your CQC registration number" />
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );

  const renderPracticeInformation = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Practice Information</h2>
          <p className="text-gray-600">Details about your practice setup</p>
        </div>
      </div>
      
      <FormField
        control={form.control}
        name="practiceType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Practice Type *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="clinic">Fixed Clinic</SelectItem>
                <SelectItem value="mobile">Mobile Practice</SelectItem>
                <SelectItem value="home">Home-based</SelectItem>
                <SelectItem value="multiple">Multiple Locations</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {(form.watch('practiceType') === 'clinic' || form.watch('practiceType') === 'multiple') && (
        <>
          <FormField
            control={form.control}
            name="clinicName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clinic Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="clinicAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clinic Address</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} />
                </FormControl>
              </FormItem>
            )}
          />
        </>
      )}
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="businessInsurance"
            checked={form.watch('businessInsurance')}
            onCheckedChange={(checked) => form.setValue('businessInsurance', checked as boolean)}
          />
          <Label htmlFor="businessInsurance">I have business premises insurance</Label>
        </div>
        
        <div className="flex items-center space-x-3">
          <Checkbox
            id="willingToTrain"
            checked={form.watch('willingToTrain')}
            onCheckedChange={(checked) => form.setValue('willingToTrain', checked as boolean)}
          />
          <Label htmlFor="willingToTrain">I'm interested in training opportunities</Label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="cpdHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual CPD Hours *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. 35" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="lastCpdDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last CPD Training Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  const renderDocumentsAgreements = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Documents & Agreements</h2>
          <p className="text-gray-600">Upload supporting documents and accept terms</p>
        </div>
      </div>
      
      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-800">
          Please upload clear, legible copies of your documents. All files should be in PDF, JPG, or PNG format.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">Qualification Documents</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-4">
              Upload your qualification certificates and training documents
            </p>
            <Input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload('qualifications', e.target.files)}
              className="hidden"
              id="qualification-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('qualification-upload')?.click()}
            >
              Choose Files
            </Button>
          </div>
          {uploadedFiles.qualifications && (
            <div className="mt-3 space-y-2">
              {uploadedFiles.qualifications.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile('qualifications', index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <Label className="text-base font-medium mb-3 block">Insurance Documents</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-4">
              Upload your current insurance certificate
            </p>
            <Input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload('insurance', e.target.files)}
              className="hidden"
              id="insurance-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('insurance-upload')?.click()}
            >
              Choose Files
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-semibold">Terms and Agreements</h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={form.watch('termsAccepted')}
              onCheckedChange={(checked) => form.setValue('termsAccepted', checked as boolean)}
            />
            <div>
              <Label htmlFor="terms" className="text-sm">
                I accept the <a href="/terms" className="text-blue-600 underline">Terms and Conditions</a> and 
                <a href="/practitioner-agreement" className="text-blue-600 underline ml-1">Practitioner Agreement</a> *
              </Label>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="dataProcessing"
              checked={form.watch('dataProcessingConsent')}
              onCheckedChange={(checked) => form.setValue('dataProcessingConsent', checked as boolean)}
            />
            <div>
              <Label htmlFor="dataProcessing" className="text-sm">
                I consent to the processing of my personal data as outlined in the 
                <a href="/privacy" className="text-blue-600 underline ml-1">Privacy Policy</a> *
              </Label>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="marketing"
              checked={form.watch('marketingConsent')}
              onCheckedChange={(checked) => form.setValue('marketingConsent', checked as boolean)}
            />
            <div>
              <Label htmlFor="marketing" className="text-sm">
                I would like to receive marketing communications about training opportunities and updates
              </Label>
            </div>
          </div>
        </div>
        
        {(form.formState.errors.termsAccepted || form.formState.errors.dataProcessingConsent) && (
          <div className="text-sm text-red-600">
            {form.formState.errors.termsAccepted?.message || form.formState.errors.dataProcessingConsent?.message}
          </div>
        )}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderPersonalInformation();
      case 2: return renderProfessionalInformation();
      case 3: return renderInsuranceCompliance();
      case 4: return renderPracticeInformation();
      case 5: return renderDocumentsAgreements();
      default: return renderPersonalInformation();
    }
  };

  const stepTitles = [
    'Personal Info',
    'Professional Info',
    'Insurance & Compliance',
    'Practice Info',
    'Documents & Terms'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="border shadow-lg">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Practitioner Registration</CardTitle>
              <div className="text-sm text-gray-600">
                Step {currentStep} of {totalSteps}
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between text-xs text-gray-500">
                {stepTitles.map((title, index) => (
                  <span key={title} className={currentStep === index + 1 ? 'font-medium text-blue-600' : ''}>
                    {title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStepContent()}
              
              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={currentStep === 1 ? 'invisible' : ''}
                >
                  Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {submitMutation.isPending ? 'Submitting...' : 'Submit Registration'}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
