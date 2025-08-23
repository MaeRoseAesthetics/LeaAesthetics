import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Landing() {
  return (
    <div className="min-h-screen bg-lea-platinum-grey">
      {/* Header */}
      <header className="bg-lea-platinum-grey/95 backdrop-blur-lg border-b border-lea-warm-grey sticky top-0 z-50 shadow-lea-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
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
              <Badge variant="secondary" className="ml-4 bg-lea-elegant-silver/20 text-lea-deep-charcoal border-lea-elegant-silver/30 font-medium">
                UK LICENSED
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild className="border-lea-deep-charcoal text-lea-deep-charcoal hover:bg-lea-deep-charcoal hover:text-lea-platinum-white transition-all duration-300">
                <a href="/api/login" data-testid="button-login">Practitioner Access</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-lea-platinum-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-lea-elegant-silver to-transparent w-16"></div>
            <span className="text-sm font-medium text-lea-charcoal-grey tracking-wider uppercase">Premium Practice Management</span>
            <div className="h-px bg-gradient-to-r from-transparent via-lea-elegant-silver to-transparent w-16"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-lea-deep-charcoal mb-6 tracking-tight">
            LEA AESTHETICS CLINIC ACADEMY
          </h2>
          <p className="text-xl text-lea-charcoal-grey mb-8 max-w-3xl mx-auto leading-relaxed">
            Elevating aesthetic practice management and professional training with elegance, precision, and regulatory excellence. 
            Where clinical distinction meets educational sophistication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild data-testid="button-get-started">
              <a href="/api/login">Get Started</a>
            </Button>
            <Button size="lg" variant="outline" data-testid="button-learn-more">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-lea-pearl-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-lea-elegant-silver to-transparent w-12"></div>
              <span className="text-sm font-medium text-lea-charcoal-grey tracking-wider uppercase">Platform Capabilities</span>
              <div className="h-px bg-gradient-to-r from-transparent via-lea-elegant-silver to-transparent w-12"></div>
            </div>
            <h3 className="text-3xl font-serif font-bold text-lea-deep-charcoal mb-4">
              Everything You Need in One Platform
            </h3>
            <p className="text-lg text-lea-charcoal-grey">
              Built specifically for UK aesthetic practitioners offering both treatments and training
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
              <CardHeader>
                <div className="w-12 h-12 bg-lea-elegant-silver rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-spa text-lea-deep-charcoal text-xl"></i>
                </div>
                <CardTitle className="text-lea-deep-charcoal font-serif">Treatment Management</CardTitle>
                <CardDescription className="text-lea-charcoal-grey">
                  Complete booking system, client records, and payment processing with age verification compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-lea-charcoal-grey">
                  <li>• Online booking system</li>
                  <li>• Medical history tracking</li>
                  <li>• Consent form management</li>
                  <li>• Aftercare protocols</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
              <CardHeader>
                <div className="w-12 h-12 bg-lea-clinical-blue rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-graduation-cap text-lea-platinum-white text-xl"></i>
                </div>
                <CardTitle className="text-lea-deep-charcoal font-serif">Training & LMS</CardTitle>
                <CardDescription className="text-lea-charcoal-grey">
                  Ofqual-aligned course delivery with assessments, portfolios, and CPD tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-lea-charcoal-grey">
                  <li>• Level 4-7 diploma support</li>
                  <li>• OSCE assessments</li>
                  <li>• RPL/APEL processing</li>
                  <li>• Student progress tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
              <CardHeader>
                <div className="w-12 h-12 bg-lea-deep-charcoal rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-award text-lea-platinum-white text-xl"></i>
                </div>
                <CardTitle className="text-lea-deep-charcoal font-serif">Compliance & Regulation</CardTitle>
                <CardDescription className="text-lea-charcoal-grey">
                  JCCP, CQC, and Ofqual compliance with audit trails and reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-lea-charcoal-grey">
                  <li>• JCCP registration tracking</li>
                  <li>• CQC audit preparation</li>
                  <li>• DBS integration</li>
                  <li>• Licensing tier management</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
              <CardHeader>
                <div className="w-12 h-12 bg-lea-elegant-silver rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-coins text-lea-deep-charcoal text-xl"></i>
                </div>
                <CardTitle className="text-lea-deep-charcoal font-serif">Payment Processing</CardTitle>
                <CardDescription className="text-lea-charcoal-grey">
                  Secure Stripe integration with age verification and deposit management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-lea-charcoal-grey">
                  <li>• Face-to-face mandate compliance</li>
                  <li>• Automatic invoicing</li>
                  <li>• Payment plan support</li>
                  <li>• Course deposits</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
              <CardHeader>
                <div className="w-12 h-12 bg-lea-clinical-blue rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-users text-lea-platinum-white text-xl"></i>
                </div>
                <CardTitle className="text-lea-deep-charcoal font-serif">Client & Student CRM</CardTitle>
                <CardDescription className="text-lea-charcoal-grey">
                  Unified profiles with GDPR-compliant communication and progress tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-lea-charcoal-grey">
                  <li>• Unified contact management</li>
                  <li>• GDPR opt-in tracking</li>
                  <li>• Automated notifications</li>
                  <li>• Progress monitoring</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-lea-silver-grey shadow-lea-card hover:shadow-lea-card-hover transition-all duration-300 bg-lea-platinum-white">
              <CardHeader>
                <div className="w-12 h-12 bg-lea-deep-charcoal rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-chart-line text-lea-platinum-white text-xl"></i>
                </div>
                <CardTitle className="text-lea-deep-charcoal font-serif">Analytics & Reporting</CardTitle>
                <CardDescription className="text-lea-charcoal-grey">
                  Comprehensive dashboards for procedure volumes, CPD metrics, and compliance tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-lea-charcoal-grey">
                  <li>• CQC audit reports</li>
                  <li>• Revenue analytics</li>
                  <li>• Student performance metrics</li>
                  <li>• Compliance dashboards</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-lea-platinum-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-lea-elegant-silver to-transparent w-12"></div>
              <span className="text-sm font-medium text-lea-charcoal-grey tracking-wider uppercase">Regulatory Excellence</span>
              <div className="h-px bg-gradient-to-r from-transparent via-lea-elegant-silver to-transparent w-12"></div>
            </div>
            <h3 className="text-3xl font-serif font-bold text-lea-deep-charcoal mb-4">
              Built for UK Regulatory Compliance
            </h3>
            <p className="text-lg text-lea-charcoal-grey">
              Designed to meet the strictest standards for aesthetic practice and training
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-lea-elegant-silver/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check-circle text-lea-clinical-blue text-2xl"></i>
              </div>
              <h4 className="font-semibold text-lea-deep-charcoal mb-2">JCCP Compliant</h4>
              <p className="text-sm text-lea-charcoal-grey">Full Joint Council for Cosmetic Practitioners compliance and registration tracking</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-lea-elegant-silver/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-certificate text-lea-elegant-silver text-2xl"></i>
              </div>
              <h4 className="font-semibold text-lea-deep-charcoal mb-2">Ofqual Aligned</h4>
              <p className="text-sm text-lea-charcoal-grey">Training courses aligned with Ofqual regulations for vocational qualifications</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-lea-elegant-silver/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-hospital text-lea-clinical-blue text-2xl"></i>
              </div>
              <h4 className="font-semibold text-lea-deep-charcoal mb-2">CQC Ready</h4>
              <p className="text-sm text-lea-charcoal-grey">Audit trail preparation and documentation for Care Quality Commission inspections</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-lea-elegant-silver/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-lea-deep-charcoal text-2xl"></i>
              </div>
              <h4 className="font-semibold text-lea-deep-charcoal mb-2">GDPR Compliant</h4>
              <p className="text-sm text-lea-charcoal-grey">Full data protection compliance with opt-in tracking and consent management</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-lea-deep-charcoal">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-serif font-bold text-lea-platinum-white mb-6">
            Ready to Elevate Your Practice?
          </h3>
          <p className="text-xl text-lea-silver-grey mb-8">
            Join discerning UK aesthetic practitioners who trust Lea Aesthetics for their sophisticated practice needs
          </p>
          <Button size="lg" className="bg-lea-elegant-silver hover:bg-lea-elegant-silver/90 text-lea-deep-charcoal font-semibold" asChild data-testid="button-start-trial">
            <a href="/api/login">Begin Your Journey</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-lea-deep-charcoal border-t border-lea-silver-grey py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-lg font-serif font-semibold text-lea-platinum-white mb-4">Lea Aesthetics Clinic Academy</h4>
            <p className="text-sm text-lea-silver-grey mb-4">
              Elevating aesthetic practice management and professional training with elegance, precision, and regulatory excellence.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-lea-platinum-grey">
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
