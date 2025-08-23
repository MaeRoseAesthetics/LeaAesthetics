import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Landing() {
  const [loginDialog, setLoginDialog] = useState<'practitioner' | 'client' | 'student' | null>(null);
  const [, navigate] = useLocation();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(`${loginDialog} login:`, data);
    // Handle login based on user type
    switch (loginDialog) {
      case 'practitioner':
        // Redirect to practitioner dashboard
        window.location.href = '/';
        break;
      case 'client':
        // Redirect to client portal
        window.location.href = '/client-portal';
        break;
      case 'student':
        // Redirect to student portal
        window.location.href = '/student-portal';
        break;
    }
  };

  const openLoginDialog = (userType: 'practitioner' | 'client' | 'student') => {
    setLoginDialog(userType);
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-maerose-cream via-white to-maerose-cream/50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-serif font-bold text-maerose-gold tracking-wide">MaeRose</h1>
              <Badge variant="secondary" className="ml-3">UK Compliant</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => openLoginDialog('practitioner')}>
                Practitioner Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-maerose-forest mb-6">
            Choose Your MaeRose Experience
          </h2>
          <p className="text-xl text-maerose-forest/70 mb-8 max-w-3xl mx-auto">
            Access our sophisticated platform tailored for practitioners, clients, and students. 
            Each portal designed with the discerning professional in mind.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {/* Practitioner Portal */}
            <Card className="border-2 hover:border-maerose-forest transition-colors cursor-pointer" 
                  onClick={() => openLoginDialog('practitioner')}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-maerose-forest rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-rose text-maerose-cream text-2xl"></i>
                </div>
                <CardTitle className="text-xl text-maerose-forest font-serif">Practitioner Portal</CardTitle>
                <CardDescription>
                  Manage your practice, clients, treatments, and training courses
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-maerose-forest/60 mb-4 space-y-1">
                  <li>• Client & treatment management</li>
                  <li>• Course delivery & student tracking</li>
                  <li>• Payment processing & compliance</li>
                  <li>• Audit trails & reporting</li>
                </ul>
                <Button className="w-full" onClick={(e) => {e.stopPropagation(); openLoginDialog('practitioner');}}>
                  Access Practice Management
                </Button>
              </CardContent>
            </Card>

            {/* Client Portal */}
            <Card className="border-2 hover:border-maerose-burgundy transition-colors cursor-pointer" 
                  onClick={() => openLoginDialog('client')}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-maerose-burgundy rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-user text-maerose-cream text-2xl"></i>
                </div>
                <CardTitle className="text-xl text-maerose-forest font-serif">Client Portal</CardTitle>
                <CardDescription>
                  Book treatments, view your history, and manage appointments
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-maerose-forest/60 mb-4 space-y-1">
                  <li>• Online appointment booking</li>
                  <li>• View treatment history</li>
                  <li>• Digital consent forms</li>
                  <li>• Secure payment processing</li>
                </ul>
                <div className="space-y-2">
                  <Button className="w-full bg-maerose-burgundy hover:bg-maerose-burgundy/90 text-maerose-cream" 
                          onClick={(e) => {e.stopPropagation(); navigate('/client-registration');}}>
                    Register Now
                  </Button>
                  <Button variant="outline" className="w-full" 
                          onClick={(e) => {e.stopPropagation(); openLoginDialog('client');}}>
                    Already Have Account? Login
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Student Portal */}
            <Card className="border-2 hover:border-maerose-gold transition-colors cursor-pointer" 
                  onClick={() => openLoginDialog('student')}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-maerose-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-graduation-cap text-maerose-cream text-2xl"></i>
                </div>
                <CardTitle className="text-xl text-maerose-forest font-serif">Student Portal</CardTitle>
                <CardDescription>
                  Access your courses, track progress, and manage learning
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-maerose-forest/60 mb-4 space-y-1">
                  <li>• Course materials & videos</li>
                  <li>• Assessment submissions</li>
                  <li>• Progress tracking & CPD</li>
                  <li>• Certificate downloads</li>
                </ul>
                <div className="space-y-2">
                  <Button className="w-full bg-maerose-gold hover:bg-maerose-gold/90 text-maerose-forest" 
                          onClick={(e) => {e.stopPropagation(); navigate('/student-registration');}}>
                    Register for Courses
                  </Button>
                  <Button variant="outline" className="w-full" 
                          onClick={(e) => {e.stopPropagation(); openLoginDialog('student');}}>
                    Already Enrolled? Login
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid - Keep the existing features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif font-bold text-maerose-forest mb-4">
              Everything You Need in One Platform
            </h3>
            <p className="text-lg text-maerose-forest/70">
              Built specifically for UK aesthetic practitioners offering both treatments and training
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-maerose-forest rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-spa text-maerose-cream text-xl"></i>
                </div>
                <CardTitle>Treatment Management</CardTitle>
                <CardDescription>
                  Complete booking system, client records, and payment processing with age verification compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Online booking system</li>
                  <li>• Medical history tracking</li>
                  <li>• Consent form management</li>
                  <li>• Aftercare protocols</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-maerose-gold rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-graduation-cap text-maerose-cream text-xl"></i>
                </div>
                <CardTitle>Training & LMS</CardTitle>
                <CardDescription>
                  Ofqual-aligned course delivery with assessments, portfolios, and CPD tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Level 4-7 diploma support</li>
                  <li>• OSCE assessments</li>
                  <li>• RPL/APEL processing</li>
                  <li>• Student progress tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-maerose-burgundy rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-award text-maerose-cream text-xl"></i>
                </div>
                <CardTitle>Compliance & Regulation</CardTitle>
                <CardDescription>
                  JCCP, CQC, and Ofqual compliance with audit trails and reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• JCCP registration tracking</li>
                  <li>• CQC audit preparation</li>
                  <li>• DBS integration</li>
                  <li>• Licensing tier management</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Login Dialog */}
      <Dialog open={!!loginDialog} onOpenChange={() => setLoginDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {loginDialog === 'practitioner' && 'Practitioner Login'}
              {loginDialog === 'client' && 'Client Login'}
              {loginDialog === 'student' && 'Student Login'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              <Button type="button" variant="ghost" className="w-full text-sm">
                Forgot password?
              </Button>
              {loginDialog !== 'practitioner' && (
                <div className="text-center text-sm text-gray-500 mt-4">
                  Don't have an account?{' '}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm text-blue-600"
                    onClick={() => {
                      setLoginDialog(null);
                      navigate(loginDialog === 'client' ? '/client-registration' : '/student-registration');
                    }}
                  >
                    Register here
                  </Button>
                </div>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-maerose-cream border-t border-maerose-gold/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-lg font-serif font-semibold text-maerose-gold mb-4">MaeRose</h4>
            <p className="text-sm text-maerose-forest/70 mb-4">
              Sophisticated aesthetic practice management for discerning professionals
            </p>
            <div className="flex justify-center space-x-6 text-sm text-maerose-forest/60">
              <span>JCCP Compliant</span>
              <span>•</span>
              <span>Ofqual Aligned</span>
              <span>•</span>
              <span>CQC Ready</span>
              <span>•</span>
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
