import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { apiRequest } from "@/lib/queryClient";

const baseSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  registrationType: z.enum(['client', 'student', 'practitioner'])
});

const clientSchema = baseSchema.extend({
  skinType: z.string().min(1, 'Skin type is required'),
  skinConcerns: z.array(z.string()).min(1, 'Please select at least one concern'),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  previousTreatments: z.array(z.string()).optional(),
  healthConditions: z.string().optional(),
  emergencyContactName: z.string().min(1, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().min(10, 'Emergency contact phone is required'),
});

const studentSchema = baseSchema.extend({
  educationLevel: z.string().min(1, 'Education level is required'),
  relevantExperience: z.string().optional(),
  careerGoals: z.array(z.string()).min(1, 'Please select at least one career goal'),
  timeCommitment: z.string().min(1, 'Time commitment is required'),
  financingOption: z.string().min(1, 'Financing option is required'),
  referralSource: z.string().optional(),
  cosmetologyLicense: z.boolean().default(false),
  licenseDetails: z.string().optional(),
});

const practitionerSchema = baseSchema.extend({
  qualifications: z.array(z.string()).min(1, 'Please select at least one qualification'),
  yearsOfExperience: z.string().min(1, 'Years of experience is required'),
  specialties: z.array(z.string()).min(1, 'Please select at least one specialty'),
  insuranceProvider: z.string().min(1, 'Insurance provider is required'),
  insurancePolicyNumber: z.string().min(1, 'Insurance policy number is required'),
  clinicName: z.string().optional(),
  clinicAddress: z.string().optional(),
  gccNumber: z.string().optional(),
  cpdHours: z.string().optional(),
});

type FormData = z.infer<typeof clientSchema> | z.infer<typeof studentSchema> | z.infer<typeof practitionerSchema>;

type MultiStepFormProps = {
  onComplete?: (data: FormData) => void;
  initialType?: 'client' | 'student' | 'practitioner';
};

export default function MultiStepRegistrationForm({ onComplete, initialType }: MultiStepFormProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationType, setRegistrationType] = useState<'client' | 'student' | 'practitioner'>(initialType || 'client');
  
  const getSchema = () => {
    switch (registrationType) {
      case 'client': return clientSchema;
      case 'student': return studentSchema;
      case 'practitioner': return practitionerSchema;
      default: return baseSchema;
    }
  };
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<FormData>({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      registrationType: registrationType,
      skinConcerns: [],
      previousTreatments: [],
      careerGoals: [],
      qualifications: [],
      specialties: []
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest('POST', '/api/registrations', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Registration Successful',
        description: 'Your registration has been submitted successfully. We\'ll contact you soon!',
      });
      onComplete?.(data);
    },
    onError: (error: Error) => {
      toast({
        title: 'Registration Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const totalSteps = registrationType === 'client' ? 4 : registrationType === 'student' ? 4 : 5;
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

  const onSubmit = (data: FormData) => {
    submitMutation.mutate(data);
  };

  const handleArrayFieldChange = (fieldName: string, value: string, checked: boolean) => {
    const currentValues = getValues(fieldName as any) || [];
    if (checked) {
      setValue(fieldName as any, [...currentValues, value]);
    } else {
      setValue(fieldName as any, currentValues.filter((item: string) => item !== value));
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-lea-deep-charcoal mb-2">Welcome to Lea Aesthetics</h2>
        <p className="text-lea-charcoal-grey">Let's start with some basic information</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="registrationType">I want to register as a:</Label>
          <Select 
            value={registrationType} 
            onValueChange={(value: 'client' | 'student' | 'practitioner') => {
              setRegistrationType(value);
              setValue('registrationType', value);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">Client - I want aesthetic treatments</SelectItem>
              <SelectItem value="student">Student - I want to learn aesthetics</SelectItem>
              <SelectItem value="practitioner">Practitioner - I want to join the network</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              {...register('firstName')}
              className="mt-1"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              {...register('lastName')}
              className="mt-1"
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>
        
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="mt-1"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              className="mt-1"
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            {...register('dateOfBirth')}
            className="mt-1"
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderClientStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-lea-deep-charcoal mb-2">Skin Information</h2>
        <p className="text-lea-charcoal-grey">Help us understand your skin better</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="skinType">Skin Type *</Label>
          <Select onValueChange={(value) => setValue('skinType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your skin type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oily">Oily</SelectItem>
              <SelectItem value="dry">Dry</SelectItem>
              <SelectItem value="combination">Combination</SelectItem>
              <SelectItem value="sensitive">Sensitive</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>
          {errors.skinType && (
            <p className="text-sm text-red-500 mt-1">{errors.skinType.message}</p>
          )}
        </div>
        
        <div>
          <Label>Primary Skin Concerns *</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {['Wrinkles', 'Fine Lines', 'Acne', 'Scarring', 'Pigmentation', 'Rosacea', 'Volume Loss', 'Skin Texture'].map((concern) => (
              <div key={concern} className="flex items-center space-x-2">
                <Checkbox
                  id={concern}
                  onCheckedChange={(checked) => handleArrayFieldChange('skinConcerns', concern, checked as boolean)}
                />
                <Label htmlFor={concern} className="text-sm">{concern}</Label>
              </div>
            ))}
          </div>
          {errors.skinConcerns && (
            <p className="text-sm text-red-500 mt-1">{errors.skinConcerns.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="allergies">Known Allergies</Label>
          <Textarea
            id="allergies"
            {...register('allergies')}
            placeholder="Please list any known allergies or sensitivities"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="medications">Current Medications</Label>
          <Textarea
            id="medications"
            {...register('medications')}
            placeholder="Please list any medications you're currently taking"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );

  const renderStudentStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-lea-deep-charcoal mb-2">Educational Background</h2>
        <p className="text-lea-charcoal-grey">Tell us about your education and experience</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="educationLevel">Highest Education Level *</Label>
          <Select onValueChange={(value) => setValue('educationLevel', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high-school">High School / GCSE</SelectItem>
              <SelectItem value="a-levels">A-Levels / BTEC</SelectItem>
              <SelectItem value="undergraduate">Undergraduate Degree</SelectItem>
              <SelectItem value="postgraduate">Postgraduate Degree</SelectItem>
              <SelectItem value="professional">Professional Qualification</SelectItem>
            </SelectContent>
          </Select>
          {errors.educationLevel && (
            <p className="text-sm text-red-500 mt-1">{errors.educationLevel.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="relevantExperience">Relevant Experience</Label>
          <Textarea
            id="relevantExperience"
            {...register('relevantExperience')}
            placeholder="Describe any relevant experience in beauty, healthcare, or customer service"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label>Career Goals *</Label>
          <div className="grid grid-cols-1 gap-3 mt-2">
            {['Start own aesthetics clinic', 'Work in established clinic', 'Mobile aesthetics service', 'Training and education', 'Product development', 'Medical aesthetics specialization'].map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={goal}
                  onCheckedChange={(checked) => handleArrayFieldChange('careerGoals', goal, checked as boolean)}
                />
                <Label htmlFor={goal} className="text-sm">{goal}</Label>
              </div>
            ))}
          </div>
          {errors.careerGoals && (
            <p className="text-sm text-red-500 mt-1">{errors.careerGoals.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderFinalStep = () => {
    const isClient = registrationType === 'client';
    const isStudent = registrationType === 'student';
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-lea-deep-charcoal mb-2">Review & Submit</h2>
          <p className="text-lea-charcoal-grey">Please review your information before submitting</p>
        </div>
        
        <Card className="border border-lea-silver-grey">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lea-deep-charcoal mb-2">Personal Information</h3>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Name:</span> {getValues('firstName')} {getValues('lastName')}</p>
                  <p><span className="font-medium">Email:</span> {getValues('email')}</p>
                  <p><span className="font-medium">Phone:</span> {getValues('phone')}</p>
                  <p><span className="font-medium">Date of Birth:</span> {getValues('dateOfBirth')}</p>
                  <p><span className="font-medium">Registration Type:</span> 
                    <Badge className="ml-2 capitalize">{registrationType}</Badge>
                  </p>
                </div>
              </div>
              
              {isClient && (
                <div>
                  <h3 className="font-semibold text-lea-deep-charcoal mb-2">Skin Information</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Skin Type:</span> {getValues('skinType')}</p>
                    <p><span className="font-medium">Concerns:</span> {(getValues('skinConcerns') as string[])?.join(', ')}</p>
                    {getValues('allergies') && (
                      <p><span className="font-medium">Allergies:</span> {getValues('allergies')}</p>
                    )}
                    {getValues('medications') && (
                      <p><span className="font-medium">Medications:</span> {getValues('medications')}</p>
                    )}
                  </div>
                </div>
              )}
              
              {isStudent && (
                <div>
                  <h3 className="font-semibold text-lea-deep-charcoal mb-2">Educational Background</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Education Level:</span> {getValues('educationLevel')}</p>
                    <p><span className="font-medium">Career Goals:</span> {(getValues('careerGoals') as string[])?.join(', ')}</p>
                    {getValues('relevantExperience') && (
                      <p><span className="font-medium">Experience:</span> {getValues('relevantExperience')}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            {isClient && (
              <>
                <li>• We'll review your registration within 24 hours</li>
                <li>• A member of our team will contact you to schedule a consultation</li>
                <li>• We'll discuss treatment options tailored to your needs</li>
              </>
            )}
            {isStudent && (
              <>
                <li>• We'll review your application within 48 hours</li>
                <li>• You'll receive information about available courses</li>
                <li>• We'll schedule an interview to discuss your career goals</li>
              </>
            )}
          </ul>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return registrationType === 'client' ? renderClientStep2() : renderStudentStep2();
      case 3: return registrationType === 'client' ? renderFinalStep() : renderStudentStep2();
      case 4: return renderFinalStep();
      default: return renderStep1();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border border-lea-silver-grey shadow-lea-card">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lea-deep-charcoal">Registration</CardTitle>
              <div className="text-sm text-lea-charcoal-grey">
                Step {currentStep} of {totalSteps}
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-lea-charcoal-grey">
                <span>Personal Info</span>
                <span>{registrationType === 'client' ? 'Skin Info' : 'Education'}</span>
                {totalSteps > 3 && <span>Additional</span>}
                <span>Review</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {renderStepContent()}
            
            <div className="flex justify-between pt-6">
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
                  className="bg-lea-clinical-blue hover:bg-blue-700"
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
        </CardContent>
      </Card>
    </div>
  );
}
