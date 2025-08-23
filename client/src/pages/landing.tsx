import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Landing() {
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
              <Button variant="outline" asChild>
                <a href="/api/login" data-testid="button-login">Sign In</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-maerose-forest mb-6">
            Sophisticated Aesthetics Management
          </h2>
          <p className="text-xl text-maerose-forest/70 mb-8 max-w-3xl mx-auto">
            A refined platform for discerning aesthetics professionals, combining timeless elegance 
            with modern functionality. Excellence through tradition, innovation through heritage.
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
                <CardTitle className="text-maerose-forest font-serif">Treatment Management</CardTitle>
                <CardDescription>
                  Complete booking system, client records, and payment processing with age verification compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-maerose-forest/60">
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
                <CardTitle className="text-maerose-forest font-serif">Training & LMS</CardTitle>
                <CardDescription>
                  Ofqual-aligned course delivery with assessments, portfolios, and CPD tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-maerose-forest/60">
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
                <CardTitle className="text-maerose-forest font-serif">Compliance & Regulation</CardTitle>
                <CardDescription>
                  JCCP, CQC, and Ofqual compliance with audit trails and reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-maerose-forest/60">
                  <li>• JCCP registration tracking</li>
                  <li>• CQC audit preparation</li>
                  <li>• DBS integration</li>
                  <li>• Licensing tier management</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-maerose-gold rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-coins text-maerose-cream text-xl"></i>
                </div>
                <CardTitle className="text-maerose-forest font-serif">Payment Processing</CardTitle>
                <CardDescription>
                  Secure Stripe integration with age verification and deposit management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-maerose-forest/60">
                  <li>• Face-to-face mandate compliance</li>
                  <li>• Automatic invoicing</li>
                  <li>• Payment plan support</li>
                  <li>• Course deposits</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-maerose-burgundy rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-users-crown text-maerose-cream text-xl"></i>
                </div>
                <CardTitle className="text-maerose-forest font-serif">Client & Student CRM</CardTitle>
                <CardDescription>
                  Unified profiles with GDPR-compliant communication and progress tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-maerose-forest/60">
                  <li>• Unified contact management</li>
                  <li>• GDPR opt-in tracking</li>
                  <li>• Automated notifications</li>
                  <li>• Progress monitoring</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-maerose-forest rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-chart-line-up text-maerose-cream text-xl"></i>
                </div>
                <CardTitle className="text-maerose-forest font-serif">Analytics & Reporting</CardTitle>
                <CardDescription>
                  Comprehensive dashboards for procedure volumes, CPD metrics, and compliance tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-maerose-forest/60">
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
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif font-bold text-maerose-forest mb-4">
              Built for UK Regulatory Compliance
            </h3>
            <p className="text-lg text-maerose-forest/70">
              Designed to meet the strictest standards for aesthetic practice and training
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check-circle text-success text-2xl"></i>
              </div>
              <h4 className="font-semibold text-maerose-forest mb-2">JCCP Compliant</h4>
              <p className="text-sm text-maerose-forest/60">Full Joint Council for Cosmetic Practitioners compliance and registration tracking</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-certificate text-medical-blue text-2xl"></i>
              </div>
              <h4 className="font-semibold text-maerose-forest mb-2">Ofqual Aligned</h4>
              <p className="text-sm text-maerose-forest/60">Training courses aligned with Ofqual regulations for vocational qualifications</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-hospital text-warning text-2xl"></i>
              </div>
              <h4 className="font-semibold text-maerose-forest mb-2">CQC Ready</h4>
              <p className="text-sm text-maerose-forest/60">Audit trail preparation and documentation for Care Quality Commission inspections</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-purple-600 text-2xl"></i>
              </div>
              <h4 className="font-semibold text-maerose-forest mb-2">GDPR Compliant</h4>
              <p className="text-sm text-maerose-forest/60">Full data protection compliance with opt-in tracking and consent management</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-maerose-forest">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-serif font-bold text-maerose-cream mb-6">
            Ready to Elevate Your Practice?
          </h3>
          <p className="text-xl text-maerose-cream/80 mb-8">
            Join discerning UK aesthetic practitioners who trust MaeRose for their sophisticated practice needs
          </p>
          <Button size="lg" className="bg-maerose-gold hover:bg-maerose-gold/90 text-maerose-forest font-semibold" asChild data-testid="button-start-trial">
            <a href="/api/login">Begin Your Journey</a>
          </Button>
        </div>
      </section>

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
