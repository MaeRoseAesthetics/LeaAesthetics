import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Shield, Upload, Camera, AlertTriangle, CheckCircle } from 'lucide-react';
import { format, differenceInYears, parse } from 'date-fns';

const ageVerificationSchema = z.object({
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  idType: z.enum(['passport', 'driving_licence', 'national_id'], {
    required_error: 'Please select a form of ID'
  }),
  idNumber: z.string().min(5, 'ID number is required and must be valid'),
  idDocument: z.any().optional(),
  selfie: z.any().optional(),
  parentalConsent: z.boolean().optional(),
  parentName: z.string().optional(),
  parentEmail: z.string().email().optional(),
  parentPhone: z.string().optional(),
  verificationConsent: z.boolean().refine(val => val, 'You must consent to age verification'),
  dataRetentionConsent: z.boolean().refine(val => val, 'You must consent to data retention'),
}).refine((data) => {
  // If under 18, parental consent is required
  if (data.dateOfBirth) {
    const birthDate = new Date(data.dateOfBirth);
    const age = differenceInYears(new Date(), birthDate);
    
    if (age < 18) {
      return data.parentalConsent && data.parentName && data.parentEmail && data.parentPhone;
    }
  }
  return true;
}, {
  message: "Parental consent and details are required for under 18s",
  path: ["parentalConsent"]
});

type AgeVerificationFormData = z.infer<typeof ageVerificationSchema>;

interface AgeVerificationProps {
  onVerificationComplete: (data: AgeVerificationFormData & { age: number; isMinor: boolean }) => void;
  treatmentType?: string;
  minimumAge?: number;
}

const idTypeLabels = {
  passport: 'UK/EU Passport',
  driving_licence: 'UK Driving Licence',
  national_id: 'National ID Card'
};

export default function AgeVerification({ 
  onVerificationComplete, 
  treatmentType = 'aesthetic treatment',
  minimumAge = 18 
}: AgeVerificationProps) {
  const [uploadedId, setUploadedId] = useState<File | null>(null);
  const [uploadedSelfie, setUploadedSelfie] = useState<File | null>(null);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [isMinor, setIsMinor] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'details' | 'documents' | 'review'>('details');

  const form = useForm<AgeVerificationFormData>({
    resolver: zodResolver(ageVerificationSchema),
    defaultValues: {
      verificationConsent: false,
      dataRetentionConsent: false,
      parentalConsent: false
    }
  });

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return null;
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = differenceInYears(today, birthDate);
    
    setCalculatedAge(age);
    setIsMinor(age < 18);
    
    return age;
  };

  const handleDateOfBirthChange = (value: string) => {
    form.setValue('dateOfBirth', value);
    calculateAge(value);
  };

  const handleFileUpload = (type: 'id' | 'selfie', files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (type === 'id') {
        setUploadedId(file);
        form.setValue('idDocument', file);
      } else {
        setUploadedSelfie(file);
        form.setValue('selfie', file);
      }
    }
  };

  const removeFile = (type: 'id' | 'selfie') => {
    if (type === 'id') {
      setUploadedId(null);
      form.setValue('idDocument', null);
    } else {
      setUploadedSelfie(null);
      form.setValue('selfie', null);
    }
  };

  const onSubmit = (data: AgeVerificationFormData) => {
    if (calculatedAge !== null) {
      onVerificationComplete({
        ...data,
        age: calculatedAge,
        isMinor: isMinor
      });
    }
  };

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Shield className="h-12 w-12 text-blue-600 mx-auto" />
        <h2 className="text-2xl font-bold">Age Verification Required</h2>
        <p className="text-gray-600">
          We need to verify your age before you can book {treatmentType}. 
          The minimum age requirement is {minimumAge} years.
        </p>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-blue-800">
          This is a legal requirement for aesthetic treatments. Your information is encrypted and stored securely.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth *</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field}
                  onChange={(e) => handleDateOfBirthChange(e.target.value)}
                  max={format(new Date(), 'yyyy-MM-dd')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {calculatedAge !== null && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Calculated Age:</span>
              <div className="flex items-center gap-2">
                <Badge variant={calculatedAge >= minimumAge ? "default" : "destructive"}>
                  {calculatedAge} years old
                </Badge>
                {calculatedAge >= minimumAge ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
            
            {calculatedAge < minimumAge && (
              <Alert className="mt-3 bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  You must be at least {minimumAge} years old to book this treatment.
                  {calculatedAge >= 16 && minimumAge === 18 && 
                    " However, some treatments may be available with parental consent."
                  }
                </AlertDescription>
              </Alert>
            )}
            
            {isMinor && calculatedAge >= 16 && (
              <Alert className="mt-3 bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-amber-800">
                  As you are under 18, parental consent will be required for any treatments.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <FormField
          control={form.control}
          name="idType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Form of ID *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your ID type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(idTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                We accept UK/EU passports, UK driving licences, and national ID cards.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Number *</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  placeholder={
                    form.watch('idType') === 'passport' ? 'Passport number' :
                    form.watch('idType') === 'driving_licence' ? 'Driving licence number' :
                    'ID number'
                  }
                />
              </FormControl>
              <FormDescription>
                Enter the number exactly as it appears on your ID document.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isMinor && (
          <>
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Parental Consent Required</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent/Guardian Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="parentEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent/Guardian Email *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="parentPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent/Guardian Phone *</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="parentalConsent"
                    checked={form.watch('parentalConsent')}
                    onCheckedChange={(checked) => form.setValue('parentalConsent', checked as boolean)}
                  />
                  <Label htmlFor="parentalConsent" className="text-sm">
                    I confirm that my parent/guardian consents to this age verification and any future treatments *
                  </Label>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderDocumentsStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Upload className="h-12 w-12 text-blue-600 mx-auto" />
        <h2 className="text-2xl font-bold">Upload Verification Documents</h2>
        <p className="text-gray-600">
          Please upload a clear photo of your ID document and a selfie for verification.
        </p>
      </div>

      <Alert className="bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-amber-800">
          Ensure all text on your ID is clearly readable and the photo is well-lit. 
          Blurred or unclear images will delay verification.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold">ID Document Photo</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-4">
              Upload a photo of your {idTypeLabels[form.watch('idType') as keyof typeof idTypeLabels] || 'ID document'}
            </p>
            <Input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileUpload('id', e.target.files)}
              className="hidden"
              id="id-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('id-upload')?.click()}
            >
              Choose File
            </Button>
          </div>
          
          {uploadedId && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">ID uploaded</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile('id')}
                >
                  Remove
                </Button>
              </div>
              <p className="text-sm text-green-600 mt-1">{uploadedId.name}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Verification Selfie</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-4">
              Take a clear selfie holding your ID document
            </p>
            <Input
              type="file"
              accept=".jpg,.jpeg,.png"
              capture="user"
              onChange={(e) => handleFileUpload('selfie', e.target.files)}
              className="hidden"
              id="selfie-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('selfie-upload')?.click()}
            >
              Take Selfie
            </Button>
          </div>
          
          {uploadedSelfie && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Selfie uploaded</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile('selfie')}
                >
                  Remove
                </Button>
              </div>
              <p className="text-sm text-green-600 mt-1">{uploadedSelfie.name}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Photo Guidelines</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Ensure all text on your ID is clearly readable</li>
          <li>• Use good lighting - avoid shadows or glare</li>
          <li>• In your selfie, hold your ID document next to your face</li>
          <li>• Make sure both your face and the ID are clearly visible</li>
          <li>• Remove any head coverings unless for religious reasons</li>
        </ul>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
        <h2 className="text-2xl font-bold">Review & Confirm</h2>
        <p className="text-gray-600">
          Please review your information before submitting for verification.
        </p>
      </div>

      <Card className="border">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Verification Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date of Birth:</span>
                  <span>{form.watch('dateOfBirth')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <Badge variant={calculatedAge! >= minimumAge ? "default" : "destructive"}>
                    {calculatedAge} years old
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Type:</span>
                  <span>{idTypeLabels[form.watch('idType') as keyof typeof idTypeLabels]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Number:</span>
                  <span>{form.watch('idNumber')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Documents:</span>
                  <div className="text-right">
                    <div className="text-green-600">✓ ID Document</div>
                    <div className="text-green-600">✓ Verification Selfie</div>
                  </div>
                </div>
              </div>
            </div>

            {isMinor && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Parental Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parent/Guardian:</span>
                    <span>{form.watch('parentName')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{form.watch('parentEmail')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{form.watch('parentPhone')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="verificationConsent"
            checked={form.watch('verificationConsent')}
            onCheckedChange={(checked) => form.setValue('verificationConsent', checked as boolean)}
          />
          <Label htmlFor="verificationConsent" className="text-sm">
            I consent to age verification and confirm that all information provided is accurate and truthful. *
          </Label>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="dataRetentionConsent"
            checked={form.watch('dataRetentionConsent')}
            onCheckedChange={(checked) => form.setValue('dataRetentionConsent', checked as boolean)}
          />
          <Label htmlFor="dataRetentionConsent" className="text-sm">
            I understand that my verification documents will be stored securely for compliance purposes 
            and will be deleted after the required retention period. *
          </Label>
        </div>

        {(form.formState.errors.verificationConsent || form.formState.errors.dataRetentionConsent) && (
          <div className="text-sm text-red-600">
            You must provide consent for age verification to proceed.
          </div>
        )}
      </div>

      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription className="text-green-800">
          <strong>What happens next:</strong><br />
          • Your documents will be reviewed within 24 hours<br />
          • You'll receive email confirmation once verified<br />
          • You can then proceed with booking treatments<br />
          {isMinor && "• Your parent/guardian will be contacted for final consent"}
        </AlertDescription>
      </Alert>
    </div>
  );

  const canProceedToNextStep = () => {
    switch (verificationStep) {
      case 'details':
        return form.watch('dateOfBirth') && form.watch('idType') && form.watch('idNumber') &&
               (!isMinor || (form.watch('parentName') && form.watch('parentEmail') && form.watch('parentPhone') && form.watch('parentalConsent')));
      case 'documents':
        return uploadedId && uploadedSelfie;
      case 'review':
        return form.watch('verificationConsent') && form.watch('dataRetentionConsent');
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (verificationStep === 'details' && canProceedToNextStep()) {
      setVerificationStep('documents');
    } else if (verificationStep === 'documents' && canProceedToNextStep()) {
      setVerificationStep('review');
    }
  };

  const prevStep = () => {
    if (verificationStep === 'documents') {
      setVerificationStep('details');
    } else if (verificationStep === 'review') {
      setVerificationStep('documents');
    }
  };

  const renderStepContent = () => {
    switch (verificationStep) {
      case 'details': return renderDetailsStep();
      case 'documents': return renderDocumentsStep();
      case 'review': return renderReviewStep();
      default: return renderDetailsStep();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Age Verification</CardTitle>
            <div className="flex space-x-2">
              {['details', 'documents', 'review'].map((step, index) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    verificationStep === step ? 'bg-blue-600' :
                    (index < ['details', 'documents', 'review'].indexOf(verificationStep)) ? 'bg-green-600' :
                    'bg-gray-300'
                  }`}
                />
              ))}
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
                  disabled={verificationStep === 'details'}
                  className={verificationStep === 'details' ? 'invisible' : ''}
                >
                  Previous
                </Button>
                
                {verificationStep !== 'review' ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceedToNextStep() || (calculatedAge !== null && calculatedAge < minimumAge)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!canProceedToNextStep()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit for Verification
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
