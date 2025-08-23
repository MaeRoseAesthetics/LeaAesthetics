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
import { motion } from "framer-motion";
import { Calendar, Users, GraduationCap, Shield, CheckCircle2, BookOpen, UserCheck, Award } from "lucide-react";

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

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      // Store the session token in localStorage for client-side auth
      if (result.session?.access_token) {
        localStorage.setItem('supabase_token', result.session.access_token);
      }

      // Handle redirect based on user type and role
      if (loginDialog === 'practitioner' || result.user.role === 'admin') {
        // Redirect to dashboard for practitioners/admins
        window.location.href = '/dashboard';
      } else if (loginDialog === 'client') {
        // Redirect to client portal
        window.location.href = '/client-portal';
      } else if (loginDialog === 'student') {
        // Redirect to student portal
        window.location.href = '/student-portal';
      } else {
        // Fallback redirect
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Login failed. Please try again.');
    }
  };

  const openLoginDialog = (userType: 'practitioner' | 'client' | 'student') => {
    setLoginDialog(userType);
    reset();
  };

  return (
    <div className="min-h-screen bg-lea-platinum-grey">
      {/* Header */}
      <header className="bg-lea-platinum-grey/95 backdrop-blur-lg border-b border-lea-warm-grey sticky top-0 z-50 shadow-lea-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-lea-elegant-silver via-lea-elegant-silver to-gray-500 rounded-lg flex items-center justify-center">
                  <span className="text-lea-deep-charcoal font-bold text-lg font-serif">L</span>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-serif font-bold text-lea-deep-charcoal tracking-tight leading-none">
                    LEA AESTHETICS
                  </h1>
                  <p className="text-xs font-medium text-lea-charcoal-grey tracking-wider uppercase">
                    Clinic Academy
                  </p>
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className="ml-4 bg-lea-elegant-silver/20 text-lea-deep-charcoal border-lea-elegant-silver/30 font-medium"
              >
                UK LICENSED
              </Badge>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button 
                variant="outline" 
                onClick={() => openLoginDialog('practitioner')}
                className="border-lea-deep-charcoal text-lea-deep-charcoal hover:bg-lea-deep-charcoal hover:text-lea-platinum-white transition-all duration-300 px-6 py-2.5 font-medium"
              >
                Practitioner Access
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-lea-platinum-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-lea-elegant-silver to-transparent w-16"></div>
              <span className="text-sm font-medium text-lea-charcoal-grey tracking-wider uppercase">Premium Aesthetics Platform</span>
              <div className="h-px bg-gradient-to-r from-transparent via-lea-elegant-silver to-transparent w-16"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-lea-deep-charcoal mb-8 leading-tight tracking-tight">
              LEA AESTHETICS
              <span className="block text-3xl md:text-4xl font-light text-lea-charcoal-grey mt-2">Clinic Academy</span>
            </h2>
            <p className="text-xl text-lea-charcoal-grey mb-12 max-w-4xl mx-auto leading-relaxed">
              Where clinical excellence meets educational distinction. Our sophisticated platform serves the UK's most discerning aesthetic practitioners, 
              delivering unparalleled practice management and world-class training with complete regulatory compliance.
            </p>
          </motion.div>
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mt-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Practitioner Portal */}
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="border border-lea-silver-grey hover:border-lea-deep-charcoal transition-all duration-300 cursor-pointer shadow-lea-card hover:shadow-lea-card-hover bg-lea-platinum-white" 
                    onClick={() => openLoginDialog('practitioner')}>
                <CardHeader className="text-center pt-8">
                  <div className="w-16 h-16 bg-lea-deep-charcoal rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="text-lea-platinum-white w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl text-lea-deep-charcoal font-serif">Practice Management</CardTitle>
                  <CardDescription className="text-lea-charcoal-grey">
                    Comprehensive suite for discerning aesthetic practitioners
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <ul className="text-sm text-lea-charcoal-grey mb-6 space-y-2 text-left">
                    <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-lea-elegant-silver mr-2" />Service & course management</li>
                    <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-lea-elegant-silver mr-2" />Client & student tracking</li>
                    <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-lea-elegant-silver mr-2" />Compliance & analytics</li>
                    <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-lea-elegant-silver mr-2" />Payment processing</li>
                  </ul>
                  <Button 
                    className="w-full bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal transition-all duration-300" 
                    onClick={(e) => {e.stopPropagation(); openLoginDialog('practitioner');}}
                  >
                    Access Dashboard
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Client Portal */}
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="border border-lea-silver-grey hover:border-lea-elegant-silver transition-all duration-300 cursor-pointer shadow-lea-card hover:shadow-lea-card-hover bg-lea-platinum-white"
                    onClick={() => openLoginDialog('client')}>
                <CardHeader className="text-center pt-8">
                  <div className="w-16 h-16 bg-lea-elegant-silver rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="text-lea-deep-charcoal w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl text-lea-deep-charcoal font-serif">Client Experience</CardTitle>
                  <CardDescription className="text-lea-charcoal-grey">
                    Seamless booking and personalized aesthetic journey management
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <ul className="text-sm text-lea-charcoal-grey mb-6 space-y-2 text-left">
                    <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-lea-elegant-silver mr-2" />Online booking system</li>
                    <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-lea-elegant-silver mr-2" />Treatment history access</li>
                    <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-lea-elegant-silver mr-2" />Digital consent signing</li>
                    <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-lea-elegant-silver mr-2" />Aftercare guidance</li>
                  </ul>
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-lea-elegant-silver text-lea-deep-charcoal hover:bg-opacity-90 transition-all duration-300 font-medium" 
                      onClick={(e) => {e.stopPropagation(); navigate('/client-registration');}}
                    >
                      Book Now
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-lea-silver-grey text-lea-charcoal-grey hover:bg-lea-pearl-white transition-all duration-300" 
                      onClick={(e) => {e.stopPropagation(); openLoginDialog('client');}}
                    >
                      Client Login
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Student Portal */}
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="border border-lea-silver-grey hover:border-lea-clinical-blue transition-all duration-300 cursor-pointer shadow-lea-card hover:shadow-lea-card-hover bg-lea-platinum-white" 
                    onClick={() => openLoginDialog('student')}>
                <CardHeader className="text-center pt-8">
                  <div className="w-16 h-16 bg-lea-clinical-blue rounded-xl flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="text-lea-platinum-white w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl text-lea-deep-charcoal font-serif">Professional Training</CardTitle>
                  <CardDescription className="text-lea-charcoal-grey">
                    Elite Ofqual-aligned aesthetic education and certification
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <ul className="text-sm text-lea-charcoal-grey mb-6 space-y-2 text-left">
                    <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-lea-clinical-blue mr-2" />Interactive course materials</li>
                    <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-lea-clinical-blue mr-2" />Assessment & portfolios</li>
                    <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-lea-clinical-blue mr-2" />CPD tracking system</li>
                    <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-lea-clinical-blue mr-2" />Digital certificates</li>
                  </ul>
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-lea-clinical-blue text-lea-platinum-white hover:bg-opacity-90 transition-all duration-300 font-medium" 
                      onClick={(e) => {e.stopPropagation(); navigate('/student-registration');}}
                    >
                      Explore Courses
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-lea-silver-grey text-lea-charcoal-grey hover:bg-lea-pearl-white transition-all duration-300" 
                      onClick={(e) => {e.stopPropagation(); openLoginDialog('student');}}
                    >
                      Student Login
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-lea-pearl-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-lea-elegant-silver to-transparent w-12"></div>
              <span className="text-sm font-medium text-lea-charcoal-grey tracking-wider uppercase">Platform Capabilities</span>
              <div className="h-px bg-gradient-to-r from-transparent via-lea-elegant-silver to-transparent w-12"></div>
            </div>
            <h3 className="text-4xl font-serif font-bold text-lea-deep-charcoal mb-8 tracking-tight">
              Unparalleled Practice Excellence
            </h3>
            <p className="text-lg text-lea-charcoal-grey max-w-3xl mx-auto leading-relaxed">
              Meticulously crafted for the UK's most distinguished aesthetic practitioners. Our comprehensive suite delivers 
              seamless practice management, world-class training programs, and unwavering regulatory compliance.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
              <CardHeader>
                <div className="w-14 h-14 bg-lea-elegant-silver rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="text-lea-deep-charcoal w-6 h-6" />
                </div>
                <CardTitle className="text-lea-deep-charcoal font-serif">Premium Treatment Suite</CardTitle>
                <CardDescription className="text-lea-charcoal-grey">
                  Sophisticated booking ecosystem with intelligent compliance automation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-lea-charcoal-grey">
                  <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-lea-elegant-silver mr-2" />Intelligent booking orchestration</li>
                  <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-lea-elegant-silver mr-2" />Comprehensive patient profiling</li>
                  <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-lea-elegant-silver mr-2" />Digital consent automation</li>
                  <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-lea-elegant-silver mr-2" />Bespoke aftercare pathways</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
              <CardHeader>
                <div className="w-14 h-14 bg-lea-clinical-blue rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="text-lea-platinum-white w-6 h-6" />
                </div>
                <CardTitle className="text-lea-deep-charcoal font-serif">Elite Education Platform</CardTitle>
                <CardDescription className="text-lea-charcoal-grey">
                  Prestigious Ofqual-accredited programs with advanced assessment methodologies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-lea-charcoal-grey">
                  <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-lea-clinical-blue mr-2" />Advanced diploma frameworks</li>
                  <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-lea-clinical-blue mr-2" />Dynamic assessment engine</li>
                  <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-lea-clinical-blue mr-2" />Professional portfolio curation</li>
                  <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-lea-clinical-blue mr-2" />Intelligent CPD orchestration</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
              <CardHeader>
                <div className="w-14 h-14 bg-lea-deep-charcoal rounded-xl flex items-center justify-center mb-4">
                  <Shield className="text-lea-platinum-white w-6 h-6" />
                </div>
                <CardTitle className="text-lea-deep-charcoal font-serif">Governance Excellence</CardTitle>
                <CardDescription className="text-lea-charcoal-grey">
                  Comprehensive regulatory adherence with intelligent compliance monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-lea-charcoal-grey">
                  <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-lea-deep-charcoal mr-2" />JCCP compliance automation</li>
                  <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-lea-deep-charcoal mr-2" />CQC readiness protocols</li>
                  <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-lea-deep-charcoal mr-2" />Intelligent age verification</li>
                  <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-lea-deep-charcoal mr-2" />Advanced licensing management</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
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
      <footer className="bg-lea-deep-charcoal border-t border-lea-silver-grey py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h4 className="text-2xl font-serif font-bold text-lea-platinum-white mb-4">
                Lea Aesthetics Clinic Academy
              </h4>
              <p className="text-lea-silver-grey mb-8 max-w-2xl mx-auto">
                Elevating aesthetic practice management and training with elegance, precision, and regulatory excellence.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-2 text-sm text-lea-platinum-grey">
                  <Shield className="w-4 h-4 text-lea-elegant-silver" />
                  <span>JCCP Compliant</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-lea-platinum-grey">
                  <Award className="w-4 h-4 text-lea-elegant-silver" />
                  <span>Ofqual Aligned</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-lea-platinum-grey">
                  <UserCheck className="w-4 h-4 text-lea-elegant-silver" />
                  <span>CQC Ready</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-lea-platinum-grey">
                  <Shield className="w-4 h-4 text-lea-elegant-silver" />
                  <span>GDPR Secure</span>
                </div>
              </div>
              
              <div className="text-xs text-lea-warm-grey">
                <p>© 2024 Lea Aesthetics Clinic Academy. All rights reserved.</p>
                <p className="mt-1">Professional aesthetic training and practice management platform.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
}
