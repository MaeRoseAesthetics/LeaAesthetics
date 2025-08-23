import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Award, 
  Shield, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  UserCheck,
  GraduationCap,
  Building2,
  Calendar
} from "lucide-react";

const certifications = [
  {
    name: "JCCP Registration",
    authority: "Joint Council for Cosmetic Practitioners",
    status: "Active",
    validUntil: "2025-12-31",
    description: "Registered practitioner with full compliance certification"
  },
  {
    name: "CQC Compliant",
    authority: "Care Quality Commission",
    status: "Approved",
    validUntil: "2025-06-30",
    description: "Meeting all CQC standards for health and social care"
  },
  {
    name: "Ofqual Aligned Training",
    authority: "Office of Qualifications and Examinations Regulation",
    status: "Accredited",
    validUntil: "2026-08-15",
    description: "Delivering qualifications that meet national standards"
  },
  {
    name: "Professional Indemnity Insurance",
    authority: "Hamilton Fraser Cosmetic Insurance",
    status: "Active",
    validUntil: "2025-03-20",
    description: "£6M professional indemnity and public liability coverage"
  }
];

const qualifications = [
  "Level 4 Diploma in Aesthetic Medicine",
  "Advanced Chemical Peel Certification",
  "Microneedling & Dermal Therapy Diploma",
  "VTCT Level 3 Beauty Therapy",
  "CIBTAC International Certification",
  "Laser Safety Officer Certification",
  "First Aid & CPR Certified",
  "GDPR Data Protection Certification"
];

const achievements = [
  {
    year: "2024",
    title: "Excellence in Aesthetic Training Award",
    organization: "UK Beauty Professional Association",
    description: "Recognized for outstanding contribution to aesthetic education"
  },
  {
    year: "2023",
    title: "CQC Outstanding Rating",
    organization: "Care Quality Commission",
    description: "Achieved highest possible rating for safety and effectiveness"
  },
  {
    year: "2023",
    title: "Industry Innovation Award",
    organization: "Aesthetic Medicine Society",
    description: "For pioneering digital training methodologies"
  },
  {
    year: "2022",
    title: "Best New Training Provider",
    organization: "Professional Beauty Awards",
    description: "Recognized as leading provider of aesthetic education"
  }
];

export default function Background() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-lea-elegant-silver via-lea-elegant-silver to-gray-500 rounded-xl flex items-center justify-center">
            <span className="text-lea-deep-charcoal font-bold text-2xl font-serif">L</span>
          </div>
          <div className="flex flex-col text-left">
            <h1 className="text-3xl font-cursive font-semibold text-lea-deep-charcoal tracking-tight leading-none">
              Lea Aesthetics
            </h1>
            <p className="text-lg font-medium text-lea-charcoal-grey tracking-wider uppercase">
              Clinic Academy
            </p>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-lea-deep-charcoal mb-6">
            Excellence in Aesthetic Practice & Education
          </h2>
          <p className="text-xl text-lea-charcoal-grey leading-relaxed">
            Founded on the principles of clinical excellence, educational distinction, and unwavering commitment 
            to regulatory compliance, Lea Aesthetics Clinic Academy represents the pinnacle of professional 
            aesthetic practice management and training in the United Kingdom.
          </p>
        </div>
      </div>

      {/* Company Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-6 h-6 mr-2 text-lea-deep-charcoal" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lea-charcoal-grey leading-relaxed">
              To elevate the standards of aesthetic practice through innovative technology, 
              comprehensive training programs, and meticulous attention to regulatory compliance. 
              We empower practitioners with the tools, knowledge, and confidence needed to deliver 
              exceptional client care while maintaining the highest professional standards.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-lea-elegant-silver text-lea-deep-charcoal">Clinical Excellence</Badge>
              <Badge className="bg-lea-clinical-blue text-white">Educational Innovation</Badge>
              <Badge className="bg-lea-deep-charcoal text-white">Regulatory Compliance</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-6 h-6 mr-2 text-lea-deep-charcoal" />
              Our Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-lea-deep-charcoal">Integrity & Trust</h4>
                  <p className="text-sm text-lea-charcoal-grey">Building lasting relationships through transparency and reliability</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-lea-deep-charcoal">Continuous Innovation</h4>
                  <p className="text-sm text-lea-charcoal-grey">Embracing new technologies and methodologies</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-lea-deep-charcoal">Educational Excellence</h4>
                  <p className="text-sm text-lea-charcoal-grey">Delivering world-class training and development</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-lea-deep-charcoal">Client-Centered Care</h4>
                  <p className="text-sm text-lea-charcoal-grey">Prioritizing safety, comfort, and exceptional outcomes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certifications & Compliance */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-6 h-6 mr-2 text-lea-deep-charcoal" />
            Professional Certifications & Compliance
          </CardTitle>
          <CardDescription>
            Maintaining the highest standards of professional accreditation and regulatory compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lea-deep-charcoal">{cert.name}</h4>
                    <p className="text-sm text-lea-charcoal-grey">{cert.authority}</p>
                  </div>
                  <Badge 
                    className={
                      cert.status === "Active" || cert.status === "Approved" || cert.status === "Accredited"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {cert.status}
                  </Badge>
                </div>
                <p className="text-sm text-lea-charcoal-grey mb-2">{cert.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Valid until: {new Date(cert.validUntil).toLocaleDateString()}</span>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Professional Qualifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="w-6 h-6 mr-2 text-lea-clinical-blue" />
              Professional Qualifications
            </CardTitle>
            <CardDescription>Comprehensive training and certification portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {qualifications.map((qualification, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Award className="w-4 h-4 text-lea-clinical-blue" />
                  <span className="text-lea-charcoal-grey">{qualification}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-6 h-6 mr-2 text-lea-elegant-silver" />
              Awards & Recognition
            </CardTitle>
            <CardDescription>Industry acknowledgments and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="border-l-4 border-lea-elegant-silver pl-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline" className="text-xs">{achievement.year}</Badge>
                    <h4 className="font-semibold text-lea-deep-charcoal">{achievement.title}</h4>
                  </div>
                  <p className="text-sm text-lea-clinical-blue font-medium">{achievement.organization}</p>
                  <p className="text-sm text-lea-charcoal-grey">{achievement.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-lea-deep-charcoal" />
            Professional Contact Information
          </CardTitle>
          <CardDescription>Get in touch with our professional team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-lea-elegant-silver rounded-lg">
                <Phone className="w-5 h-5 text-lea-deep-charcoal" />
              </div>
              <div>
                <p className="font-medium text-lea-deep-charcoal">Phone</p>
                <p className="text-sm text-lea-charcoal-grey">+44 (0) 20 7123 4567</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-lea-clinical-blue rounded-lg">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-lea-deep-charcoal">Email</p>
                <p className="text-sm text-lea-charcoal-grey">info@leaaesthetics.co.uk</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-lea-deep-charcoal rounded-lg">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-lea-deep-charcoal">Website</p>
                <p className="text-sm text-lea-charcoal-grey">www.leaaesthetics.co.uk</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-lea-deep-charcoal">Established</p>
                <p className="text-sm text-lea-charcoal-grey">2022</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Standards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="w-6 h-6 mr-2 text-lea-deep-charcoal" />
            Professional Standards & Ethics
          </CardTitle>
          <CardDescription>Our commitment to excellence and ethical practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <Shield className="w-12 h-12 text-lea-deep-charcoal mx-auto mb-4" />
              <h4 className="font-semibold text-lea-deep-charcoal mb-2">Safety First</h4>
              <p className="text-sm text-lea-charcoal-grey">
                All procedures follow strict safety protocols with comprehensive risk assessments
              </p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <BookOpen className="w-12 h-12 text-lea-clinical-blue mx-auto mb-4" />
              <h4 className="font-semibold text-lea-deep-charcoal mb-2">Evidence-Based Practice</h4>
              <p className="text-sm text-lea-charcoal-grey">
                All treatments and training based on latest research and clinical evidence
              </p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <Users className="w-12 h-12 text-lea-elegant-silver mx-auto mb-4" />
              <h4 className="font-semibold text-lea-deep-charcoal mb-2">Continuous Development</h4>
              <p className="text-sm text-lea-charcoal-grey">
                Regular CPD and training to maintain the highest professional standards
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="text-center">
            <p className="text-sm text-lea-charcoal-grey mb-4">
              Lea Aesthetics Clinic Academy is committed to maintaining the highest standards of professional 
              practice, ethical conduct, and regulatory compliance. We are dedicated to advancing the field of 
              aesthetic medicine through innovation, education, and unwavering commitment to client safety and satisfaction.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" className="border-lea-deep-charcoal text-lea-deep-charcoal">
                <BookOpen className="w-4 h-4 mr-2" />
                View Policies
              </Button>
              <Button className="bg-lea-deep-charcoal hover:bg-lea-elegant-charcoal">
                <Mail className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
