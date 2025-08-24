import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'wouter';

type FooterProps = {
  variant?: 'default' | 'minimal' | 'detailed';
  showSocialLinks?: boolean;
  showLegalLinks?: boolean;
};

export default function Footer({ 
  variant = 'default', 
  showSocialLinks = true, 
  showLegalLinks = true 
}: FooterProps) {
  const isMobile = useIsMobile();
  const currentYear = new Date().getFullYear();

  if (variant === 'minimal') {
    return (
      <footer className="bg-lea-platinum-white border-t border-lea-silver-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${isMobile ? 'py-4' : 'py-6'} text-center`}>
            <p className="text-sm text-lea-charcoal-grey">
              © {currentYear} Lea Aesthetics. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  if (variant === 'detailed') {
    return (
      <footer className="bg-lea-deep-charcoal text-lea-platinum-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${isMobile ? 'py-8' : 'py-12'}`}>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'grid-cols-2 md:grid-cols-4 gap-8'}`}>
              {/* Company Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-lea-platinum-white">Lea Aesthetics</h3>
                <p className="text-sm text-lea-pearl-white leading-relaxed">
                  Professional aesthetics training and clinic management platform for modern practitioners.
                </p>
                <div className="text-sm text-lea-pearl-white space-y-1">
                  <p><i className="fas fa-phone w-4 mr-2"></i>+44 (0)20 1234 5678</p>
                  <p><i className="fas fa-envelope w-4 mr-2"></i>info@leaaesthetics.com</p>
                  <p><i className="fas fa-map-marker-alt w-4 mr-2"></i>London, United Kingdom</p>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-lea-platinum-white">Services</h3>
                <ul className="text-sm text-lea-pearl-white space-y-2">
                  <li><Link href="/treatments" className="hover:text-lea-platinum-white transition-colors">Treatments</Link></li>
                  <li><Link href="/courses" className="hover:text-lea-platinum-white transition-colors">Training Courses</Link></li>
                  <li><Link href="/bookings" className="hover:text-lea-platinum-white transition-colors">Book Appointment</Link></li>
                  <li><Link href="/compliance" className="hover:text-lea-platinum-white transition-colors">Compliance</Link></li>
                </ul>
              </div>

              {/* Support */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-lea-platinum-white">Support</h3>
                <ul className="text-sm text-lea-pearl-white space-y-2">
                  <li><span className="hover:text-lea-platinum-white transition-colors cursor-pointer">Help Center</span></li>
                  <li><span className="hover:text-lea-platinum-white transition-colors cursor-pointer">Contact Us</span></li>
                  <li><span className="hover:text-lea-platinum-white transition-colors cursor-pointer">FAQ</span></li>
                  <li><span className="hover:text-lea-platinum-white transition-colors cursor-pointer">Documentation</span></li>
                </ul>
              </div>

              {/* Newsletter & Social */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-lea-platinum-white">Stay Connected</h3>
                <p className="text-sm text-lea-pearl-white">
                  Subscribe to our newsletter for updates and tips.
                </p>
                <div className="flex space-x-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 text-sm bg-lea-elegant-charcoal text-lea-platinum-white placeholder:text-lea-silver-grey border border-lea-silver-grey rounded focus:outline-none focus:border-lea-clinical-blue"
                  />
                  <button className="px-4 py-2 bg-lea-clinical-blue text-lea-platinum-white text-sm rounded hover:bg-blue-700 transition-colors">
                    Subscribe
                  </button>
                </div>
                {showSocialLinks && (
                  <div className="flex space-x-4 pt-2">
                    <a href="#" className="text-lea-pearl-white hover:text-lea-platinum-white transition-colors">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="text-lea-pearl-white hover:text-lea-platinum-white transition-colors">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="text-lea-pearl-white hover:text-lea-platinum-white transition-colors">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="text-lea-pearl-white hover:text-lea-platinum-white transition-colors">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-lea-elegant-charcoal py-6">
            <div className={`${isMobile ? 'text-center space-y-4' : 'flex justify-between items-center'}`}>
              <p className="text-sm text-lea-pearl-white">
                © {currentYear} Lea Aesthetics. All rights reserved.
              </p>
              {showLegalLinks && (
                <div className={`${isMobile ? 'flex flex-col space-y-2' : 'flex space-x-6'} text-sm`}>
                  <span className="text-lea-pearl-white hover:text-lea-platinum-white transition-colors cursor-pointer">
                    Privacy Policy
                  </span>
                  <span className="text-lea-pearl-white hover:text-lea-platinum-white transition-colors cursor-pointer">
                    Terms of Service
                  </span>
                  <span className="text-lea-pearl-white hover:text-lea-platinum-white transition-colors cursor-pointer">
                    Cookie Policy
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Default footer
  return (
    <footer className="bg-lea-platinum-white border-t border-lea-silver-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${isMobile ? 'py-6' : 'py-8'}`}>
          <div className={`${isMobile ? 'text-center space-y-4' : 'flex justify-between items-center'}`}>
            <div className={`${isMobile ? 'space-y-2' : 'flex items-center space-x-4'}`}>
              <div className="text-lg font-semibold text-lea-deep-charcoal">
                Lea Aesthetics
              </div>
              <p className="text-sm text-lea-charcoal-grey">
                Professional aesthetics training and clinic management
              </p>
            </div>
            
            {showSocialLinks && (
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-lea-charcoal-grey hover:text-lea-deep-charcoal transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-lea-charcoal-grey hover:text-lea-deep-charcoal transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-lea-charcoal-grey hover:text-lea-deep-charcoal transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-lea-charcoal-grey hover:text-lea-deep-charcoal transition-colors">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            )}
          </div>
          
          <div className={`${isMobile ? 'mt-6 pt-6' : 'mt-8 pt-8'} border-t border-lea-silver-grey`}>
            <div className={`${isMobile ? 'text-center space-y-2' : 'flex justify-between items-center'}`}>
              <p className="text-sm text-lea-charcoal-grey">
                © {currentYear} Lea Aesthetics. All rights reserved.
              </p>
              {showLegalLinks && (
                <div className={`${isMobile ? 'flex flex-col space-y-2' : 'flex space-x-6'} text-sm`}>
                  <span className="text-lea-charcoal-grey hover:text-lea-deep-charcoal transition-colors cursor-pointer">
                    Privacy Policy
                  </span>
                  <span className="text-lea-charcoal-grey hover:text-lea-deep-charcoal transition-colors cursor-pointer">
                    Terms of Service
                  </span>
                  <span className="text-lea-charcoal-grey hover:text-lea-deep-charcoal transition-colors cursor-pointer">
                    Cookie Policy
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
