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
import { GraduationCap, User, MapPin, BookOpen, Target, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";

const studentRegistrationSchema = z.object({
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
  
  // Education & Experience
  educationLevel: z.string().min(1, "Education level is required"),
  previousExperience: z.string(),
  cosmetologyLicense: z.string(),
  licenseNumber: z.string(),
  licenseState: z.string(),
  
  // Career Goals
  careerGoals: z.array(z.string()).min(1, "Select at least one career goal"),
  specialtyInterests: z.array(z.string()),
  timeCommitment: z.string().min(1, "Time commitment is required"),
  
  // Learning Preferences
  learningStyle: z.string().min(1, "Learning style is required"),
  techComfortLevel: z.string().min(1, "Technology comfort level is required"),
  
  // Professional Information
  currentEmployment: z.string(),
  workExperience: z.string(),
  portfolioUrl: z.string(),
  
  // Preferences
  communicationPreferences: z.array(z.string()).min(1, "Select at least one communication preference"),
  marketingConsent: z.boolean(),
  
  // Additional Information
  referralSource: z.string(),
  motivation: z.string(),
  notes: z.string(),
});

type StudentRegistrationForm = z.infer<typeof studentRegistrationSchema>;

const careerGoalOptions = [
  "Open own aesthetics practice",
  "Work in medical spa",
  "Work in dermatology clinic", 
  "Freelance aesthetician",
  "Beauty educator/trainer",
  "Product sales representative",
  "Skin care consultant",
  "Wellness coach"
];

const specialtyOptions = [
  "Anti-aging treatments",
  "Acne treatment",
  "Chemical peels",
  "Microdermabrasion",
  "LED light therapy",
  "Facial massage",
  "Product knowledge",
  "Client consultation",
  "Business management"
];

const communicationOptions = [
  "Email",
  "Phone",
  "Text Message",
  "Learning Platform Messages"
];

export default function StudentRegistration() {
  const [step, setStep] = useState(1);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<StudentRegistrationForm>({
    resolver: zodResolver(studentRegistrationSchema),
    defaultValues: {
      careerGoals: [],
      specialtyInterests: [],
      communicationPreferences: [],
      marketingConsent: false,
      previousExperience: "",
      cosmetologyLicense: "",
      licenseNumber: "",
      licenseState: "",
      currentEmployment: "",
      workExperience: "",
      portfolioUrl: "",
      referralSource: "",
      motivation: "",
      notes: "",
    }
  });

  const registerStudent = useMutation({
    mutationFn: async (data: StudentRegistrationForm) => {
      const response = await fetch("/api/students/register", {
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
        description: "Welcome! You can now access your courses and learning materials.",
      });
      navigate("/student-portal");
    },
    onError: () => {
      toast({
        title: "Registration Failed",
        description: "Please try again or contact us for assistance.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: StudentRegistrationForm) => {
    registerStudent.mutate(data);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Registration</h1>
          <p className="text-gray-600">Begin your aesthetics education journey with us</p>
          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
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
                  <BookOpen className="h-5 w-5" />
                  Education & Experience
                </CardTitle>
                <CardDescription>Your background and qualifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="educationLevel">Highest Education Level *</Label>
                  <Select onValueChange={(value) => form.setValue("educationLevel", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="some-college">Some College</SelectItem>
                      <SelectItem value="associates">Associate's Degree</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="doctorate">Doctorate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="previousExperience">Previous Beauty/Wellness Experience</Label>
                  <Textarea {...form.register("previousExperience")} placeholder="Describe any relevant experience..." />
                </div>
                
                <div>
                  <Label htmlFor="cosmetologyLicense">Do you have a cosmetology license?</Label>
                  <Select onValueChange={(value) => form.setValue("cosmetologyLicense", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes, I have a license</SelectItem>
                      <SelectItem value="no">No, I don't have a license</SelectItem>
                      <SelectItem value="in-progress">Currently working toward license</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="licenseNumber">License Number (if applicable)</Label>
                    <Input {...form.register("licenseNumber")} />
                  </div>
                  <div>
                    <Label htmlFor="licenseState">License State (if applicable)</Label>
                    <Input {...form.register("licenseState")} />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="currentEmployment">Current Employment Status</Label>
                  <Select onValueChange={(value) => form.setValue("currentEmployment", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="part-time">Part-time employed</SelectItem>
                      <SelectItem value="full-time">Full-time employed</SelectItem>
                      <SelectItem value="self-employed">Self-employed</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="workExperience">Work Experience</Label>
                  <Textarea {...form.register("workExperience")} placeholder="Describe your work background..." />
                </div>
                
                <div>
                  <Label htmlFor="portfolioUrl">Portfolio/Website URL (if applicable)</Label>
                  <Input {...form.register("portfolioUrl")} placeholder="https://" />
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
                  <Target className="h-5 w-5" />
                  Goals & Preferences
                </CardTitle>
                <CardDescription>Help us customize your learning experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Career Goals * (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {careerGoalOptions.map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <Checkbox
                          id={goal}
                          onCheckedChange={(checked) => {
                            const current = form.getValues("careerGoals");
                            if (checked) {
                              form.setValue("careerGoals", [...current, goal]);
                            } else {
                              form.setValue("careerGoals", current.filter(g => g !== goal));
                            }
                          }}
                        />
                        <Label htmlFor={goal} className="text-sm">{goal}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Specialty Interests (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {specialtyOptions.map((specialty) => (
                      <div key={specialty} className="flex items-center space-x-2">
                        <Checkbox
                          id={specialty}
                          onCheckedChange={(checked) => {
                            const current = form.getValues("specialtyInterests");
                            if (checked) {
                              form.setValue("specialtyInterests", [...current, specialty]);
                            } else {
                              form.setValue("specialtyInterests", current.filter(s => s !== specialty));
                            }
                          }}
                        />
                        <Label htmlFor={specialty} className="text-sm">{specialty}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="timeCommitment">Time Commitment *</Label>
                  <Select onValueChange={(value) => form.setValue("timeCommitment", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How much time can you dedicate?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="part-time">Part-time (5-10 hours/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (10-20 hours/week)</SelectItem>
                      <SelectItem value="full-time">Full-time (20+ hours/week)</SelectItem>
                      <SelectItem value="intensive">Intensive (30+ hours/week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="learningStyle">Learning Style *</Label>
                  <Select onValueChange={(value) => form.setValue("learningStyle", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How do you learn best?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visual">Visual (videos, images, diagrams)</SelectItem>
                      <SelectItem value="hands-on">Hands-on (practical exercises)</SelectItem>
                      <SelectItem value="reading">Reading (text-based materials)</SelectItem>
                      <SelectItem value="mixed">Mixed approach</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="techComfortLevel">Technology Comfort Level *</Label>
                  <Select onValueChange={(value) => form.setValue("techComfortLevel", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How comfortable are you with technology?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Communication Preferences * (Select all that apply)</Label>
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
                  <Label htmlFor="motivation">What motivates you to pursue aesthetics education?</Label>
                  <Textarea {...form.register("motivation")} placeholder="Share your motivation..." />
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
                    I agree to receive course updates and educational content
                  </Label>
                </div>
                
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={registerStudent.isPending}
                  >
                    {registerStudent.isPending ? "Registering..." : "Complete Registration"}
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
