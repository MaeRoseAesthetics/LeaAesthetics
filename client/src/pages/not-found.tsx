import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function NotFound() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-lea-pearl-white">
      <Card className="w-full max-w-md mx-4 shadow-lea-card border-lea-silver-grey">
        <CardContent className="pt-6 pb-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-lea-deep-charcoal mb-2">404 - Page Not Found</h1>
              <p className="text-lea-charcoal-grey">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <p className="text-sm text-lea-slate-grey mt-1">
                Current path: <code className="bg-lea-pearl-white px-2 py-1 rounded text-xs">{location}</code>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="flex items-center gap-2 border-lea-silver-grey text-lea-charcoal-grey hover:text-lea-deep-charcoal"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              
              <Button asChild className="bg-lea-deep-charcoal text-lea-platinum-white hover:bg-lea-elegant-charcoal">
                <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  {isAuthenticated ? "Dashboard" : "Home"}
                </Link>
              </Button>
            </div>
            
            {!isAuthenticated && (
              <div className="pt-4 border-t border-lea-silver-grey">
                <p className="text-sm text-lea-charcoal-grey mb-3">
                  Need to access your practice?
                </p>
                <Button 
                  variant="ghost" 
                  onClick={() => window.location.href = '/api/login'}
                  className="text-lea-clinical-blue hover:text-lea-clinical-blue/80"
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
