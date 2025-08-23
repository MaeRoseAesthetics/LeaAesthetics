import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  User, 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Heart,
  Target,
  Clock,
  AlertCircle
} from "lucide-react";

interface Registration {
  id: string;
  type: 'client' | 'student';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  registeredAt: string;
  
  // Client-specific fields
  skinType?: string;
  primaryConcerns?: string[];
  allergies?: string;
  medications?: string;
  
  // Student-specific fields
  educationLevel?: string;
  careerGoals?: string[];
  timeCommitment?: string;
  cosmetologyLicense?: string;
}

export default function NewRegistrations() {
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ['registrations'],
    queryFn: async () => {
      const response = await fetch('/api/registrations');
      if (!response.ok) throw new Error('Failed to fetch registrations');
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds for new registrations
  });

  const clientRegistrations = registrations.filter((reg: Registration) => reg.type === 'client');
  const studentRegistrations = registrations.filter((reg: Registration) => reg.type === 'student');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isRecent = (dateString: string) => {
    const registrationDate = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60);
    return diffHours < 24; // Within last 24 hours
  };

  if (isLoading) {
    return <div>Loading new registrations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">New Registrations</h2>
        <Badge variant={registrations.length > 0 ? "destructive" : "secondary"}>
          {registrations.length} Pending
        </Badge>
      </div>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Clients ({clientRegistrations.length})
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Students ({studentRegistrations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="mt-4">
          {clientRegistrations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No new client registrations</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {clientRegistrations.map((registration) => (
                <Card key={registration.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-pink-600" />
                        </div>
                        <div>
                          <div className="text-lg">{registration.firstName} {registration.lastName}</div>
                          <div className="text-sm text-gray-500 font-normal">New Client</div>
                        </div>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {isRecent(registration.registeredAt) && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            New
                          </Badge>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Client Registration Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">{registration.firstName} {registration.lastName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{formatDate(registration.registeredAt)}</span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-gray-500" />
                                  <a href={`mailto:${registration.email}`} className="text-blue-600 hover:underline">
                                    {registration.email}
                                  </a>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-500" />
                                  <a href={`tel:${registration.phone}`} className="text-blue-600 hover:underline">
                                    {registration.phone}
                                  </a>
                                </div>
                              </div>

                              {registration.skinType && (
                                <div>
                                  <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <Heart className="h-4 w-4" />
                                    Skin Information
                                  </h4>
                                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                                    <p><span className="font-medium">Skin Type:</span> {registration.skinType}</p>
                                    {registration.primaryConcerns && (
                                      <p><span className="font-medium">Primary Concerns:</span> {registration.primaryConcerns.join(', ')}</p>
                                    )}
                                    {registration.allergies && (
                                      <p><span className="font-medium">Allergies:</span> {registration.allergies}</p>
                                    )}
                                    {registration.medications && (
                                      <p><span className="font-medium">Medications:</span> {registration.medications}</p>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex gap-2">
                                <Button className="flex-1">
                                  Contact Client
                                </Button>
                                <Button variant="outline" className="flex-1">
                                  Schedule Consultation
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {registration.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {registration.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(registration.registeredAt)}
                      </div>
                    </div>
                    {registration.skinType && (
                      <div className="mt-2 flex gap-2">
                        <Badge variant="secondary">{registration.skinType} skin</Badge>
                        {registration.primaryConcerns?.slice(0, 2).map((concern) => (
                          <Badge key={concern} variant="outline">{concern}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="students" className="mt-4">
          {studentRegistrations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No new student registrations</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {studentRegistrations.map((registration) => (
                <Card key={registration.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-lg">{registration.firstName} {registration.lastName}</div>
                          <div className="text-sm text-gray-500 font-normal">New Student</div>
                        </div>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {isRecent(registration.registeredAt) && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            New
                          </Badge>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Student Registration Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">{registration.firstName} {registration.lastName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{formatDate(registration.registeredAt)}</span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-gray-500" />
                                  <a href={`mailto:${registration.email}`} className="text-blue-600 hover:underline">
                                    {registration.email}
                                  </a>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-500" />
                                  <a href={`tel:${registration.phone}`} className="text-blue-600 hover:underline">
                                    {registration.phone}
                                  </a>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <Target className="h-4 w-4" />
                                  Education & Goals
                                </h4>
                                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                                  {registration.educationLevel && (
                                    <p><span className="font-medium">Education Level:</span> {registration.educationLevel}</p>
                                  )}
                                  {registration.careerGoals && (
                                    <p><span className="font-medium">Career Goals:</span> {registration.careerGoals.join(', ')}</p>
                                  )}
                                  {registration.timeCommitment && (
                                    <p><span className="font-medium">Time Commitment:</span> {registration.timeCommitment}</p>
                                  )}
                                  {registration.cosmetologyLicense && (
                                    <p><span className="font-medium">Cosmetology License:</span> {registration.cosmetologyLicense}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button className="flex-1">
                                  Contact Student
                                </Button>
                                <Button variant="outline" className="flex-1">
                                  Enroll in Course
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {registration.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {registration.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(registration.registeredAt)}
                      </div>
                    </div>
                    {registration.educationLevel && (
                      <div className="mt-2 flex gap-2">
                        <Badge variant="secondary">{registration.educationLevel}</Badge>
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {registration.timeCommitment}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
