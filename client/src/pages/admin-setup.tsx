import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, AlertTriangle, Shield } from "lucide-react";

const adminSetupSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AdminSetupFormData = z.infer<typeof adminSetupSchema>;

export default function AdminSetup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminSetupFormData>({
    resolver: zodResolver(adminSetupSchema),
  });

  const onSubmit = async (data: AdminSetupFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create admin user');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-lea-platinum-grey flex items-center justify-center p-4">
        <Card className="max-w-md w-full border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-lea-deep-charcoal font-serif">Admin Created Successfully!</CardTitle>
            <CardDescription className="text-lea-charcoal-grey">
              Your admin account has been created. You can now access the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <a href="/practitioner">Go to Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lea-platinum-grey flex items-center justify-center p-4">
      <Card className="max-w-md w-full border border-lea-silver-grey shadow-lea-card bg-lea-platinum-white">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-lea-elegant-silver via-lea-elegant-silver to-gray-500 rounded-lg flex items-center justify-center">
              <span className="text-lea-deep-charcoal font-bold text-lg font-serif">L</span>
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-xl font-serif font-bold text-lea-deep-charcoal tracking-tight leading-none">
                LEA AESTHETICS
              </h1>
              <p className="text-xs font-medium text-lea-charcoal-grey tracking-wider uppercase">
                Clinic Academy
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="mb-4 bg-lea-elegant-silver/20 text-lea-deep-charcoal border-lea-elegant-silver/30">
            <Shield className="w-3 h-3 mr-1" />
            Admin Setup
          </Badge>
          <CardTitle className="text-lea-deep-charcoal font-serif">Create Admin Account</CardTitle>
          <CardDescription className="text-lea-charcoal-grey">
            Set up the first admin account to access your Lea Aesthetics platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Smith"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@leaaesthetics.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-lea-deep-charcoal hover:bg-lea-elegant-charcoal"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Admin..." : "Create Admin Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-lea-charcoal-grey">
            <p>This will create the first admin user for your platform.</p>
            <p className="mt-1">After setup, you can create additional users through the dashboard.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
