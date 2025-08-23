import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, User, Phone, Mail, MapPin, Heart, FileText, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";

const clientRegistrationSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  
  // Contact Information
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Zip code is required"),
  
  // Emergency Contact
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(10, "Emergency contact phone is required"),
  emergencyContactRelation: z.string().min(1, "Emergency contact relationship is required"),
  
  // Medical Information
  allergies: z.string(),
  medications: z.string(),
  medicalConditions: z.string(),
  skinType: z.string().min(1, "Skin type is required"),
  skinConcerns: z.array(z.string()).min(1, "Select at least one skin concern"),
  previousTreatments: z.string(),
  
  // Preferences
  preferredTreatmentTime: z.string(),
  communicationPreferences: z.array(z.string()).min(1, "Select at least one communication preference"),
  marketingConsent: z.boolean(),
  
  // Additional Information
  referralSource: z.string(),
  goals: z.string(),
  notes: z.string(),
});

type ClientRegistrationForm = z.infer<typeof clientRegistrationSchema>;

const skinConcernOptions = [
  "Acne/Breakouts",
  "Fine Lines/Wrinkles", 
  "Hyperpigmentation",
  "Dryness",
  "Oiliness",
  "Large Pores",
  "Scarring",
  "Dullness",
  "Sensitivity",
  "Redness/Rosacea"
];

const communicationOptions = [
  "Email",
  "Phone",
  "Text Message",
  "Mail"
];

export default function ClientRegistration() {
  const [step, setStep] = useState(1);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<ClientRegistrationForm>({
    resolver: zodResolver(clientRegistrationSchema),
    defaultValues: {
      skinConcerns: [],
      communicationPreferences: [],
      marketingConsent: false,
      allergies: "",
      medications: "",
      medicalConditions: "",
      previousTreatments: "",
      referralSource: "",
      goals: "",
      notes: "",
    }
  });

  const registerClient = useMutation({
    mutationFn: async (data: ClientRegistrationForm) => {
      const response = await fetch("/api/clients/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful!",
        description: "Welcome! You can now book treatments and access your client portal.",
      });
      navigate("/client-portal");
    },
    onError: () => {
      toast({
        title: "Registration Failed",
        description: "Please try again or contact us for assistance.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ClientRegistrationForm) => {
    registerClient.mutate(data);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Registration</h1>
          <p className="text-gray-600">Join our aesthetics practice and start your beauty journey</p>
          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i <= step ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {i}
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Tell us about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input {...form.register("firstName")} />
                    {form.formState.errors.firstName && (
                      <p className="text-red-500 text-sm">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input {...form.register("lastName")} />
                    {form.formState.errors.lastName && (
                      <p className="text-red-500 text-sm">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input type="email" {...form.register("email")} />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input {...form.register("phone")} />
                  {form.formState.errors.phone && (
                    <p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input type="date" {...form.register("dateOfBirth")} />
                    {form.formState.errors.dateOfBirth && (
                      <p className="text-red-500 text-sm">{form.formState.errors.dateOfBirth.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select onValueChange={(value) => form.setValue("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button type="button" onClick={nextStep} className="w-full">
                  Next Step
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Contact & Emergency Information
                </CardTitle>
                <CardDescription>Where can we reach you?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input {...form.register("address")} />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input {...form.register("city")} />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input {...form.register("state")} />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Zip Code *</Label>
                    <Input {...form.register("zipCode")} />
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Emergency Contact</h3>
                  <div>
                    <Label htmlFor="emergencyContactName">Name *</Label>
                    <Input {...form.register("emergencyContactName")} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <Label htmlFor="emergencyContactPhone">Phone *</Label>
                      <Input {...form.register("emergencyContactPhone")} />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContactRelation">Relationship *</Label>
                      <Input {...form.register("emergencyContactRelation")} placeholder="e.g., Spouse, Parent" />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button type="button" onClick={nextStep} className="flex-1">
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Medical & Skin Information
                </CardTitle>
                <CardDescription>Help us provide the best care for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea {...form.register("allergies")} placeholder="List any known allergies..." />
                </div>
                
                <div>
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea {...form.register("medications")} placeholder="List current medications..." />
                </div>
                
                <div>
                  <Label htmlFor="medicalConditions">Medical Conditions</Label>
                  <Textarea {...form.register("medicalConditions")} placeholder="List any relevant medical conditions..." />
                </div>
                
                <div>
                  <Label htmlFor="skinType">Skin Type *</Label>
                  <Select onValueChange={(value) => form.setValue("skinType", value)}>
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
                </div>
                
                <div>
                  <Label>Skin Concerns * (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {skinConcernOptions.map((concern) => (
                      <div key={concern} className="flex items-center space-x-2">
                        <Checkbox
                          id={concern}
                          onCheckedChange={(checked) => {
                            const current = form.getValues("skinConcerns");
                            if (checked) {
                              form.setValue("skinConcerns", [...current, concern]);
                            } else {
                              form.setValue("skinConcerns", current.filter(c => c !== concern));
                            }
                          }}
                        />
                        <Label htmlFor={concern} className="text-sm">{concern}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="previousTreatments">Previous Aesthetic Treatments</Label>
                  <Textarea {...form.register("previousTreatments")} placeholder="Describe any previous treatments..." />
                </div>
                
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button type="button" onClick={nextStep} className="flex-1">
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Preferences & Final Details
                </CardTitle>
                <CardDescription>Let us customize your experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="preferredTreatmentTime">Preferred Appointment Time</Label>
                  <Select onValueChange={(value) => form.setValue("preferredTreatmentTime", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8 AM - 12 PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                      <SelectItem value="evening">Evening (5 PM - 8 PM)</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>How would you like us to contact you? * (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {communicationOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          onCheckedChange={(checked) => {
                            const current = form.getValues("communicationPreferences");
                            if (checked) {
                              form.setValue("communicationPreferences", [...current, option]);
                            } else {
                              form.setValue("communicationPreferences", current.filter(c => c !== option));
                            }
                          }}
                        />
                        <Label htmlFor={option} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="referralSource">How did you hear about us?</Label>
                  <Input {...form.register("referralSource")} placeholder="e.g., Google, Friend, Social Media" />
                </div>
                
                <div>
                  <Label htmlFor="goals">Your Beauty Goals</Label>
                  <Textarea {...form.register("goals")} placeholder="What would you like to achieve?" />
                </div>
                
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea {...form.register("notes")} placeholder="Anything else you'd like us to know?" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="marketingConsent"
                    onCheckedChange={(checked) => form.setValue("marketingConsent", !!checked)}
                  />
                  <Label htmlFor="marketingConsent" className="text-sm">
                    I agree to receive promotional emails and special offers
                  </Label>
                </div>
                
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={registerClient.isPending}
                  >
                    {registerClient.isPending ? "Registering..." : "Complete Registration"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
}
