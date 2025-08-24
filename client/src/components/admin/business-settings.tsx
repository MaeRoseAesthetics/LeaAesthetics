import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Clock, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Image,
  Save,
  Upload,
  Calendar,
  DollarSign,
  Percent,
  FileText,
  Users,
  Star,
  Award
} from 'lucide-react';

const businessInfoSchema = z.object({
  clinicName: z.string().min(1, 'Clinic name is required'),
  businessRegistration: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Valid email is required'),
  website: z.string().optional(),
  description: z.string().optional(),
});

const operatingHoursSchema = z.object({
  monday: z.object({
    isOpen: z.boolean(),
    openTime: z.string().optional(),
    closeTime: z.string().optional(),
  }),
  tuesday: z.object({
    isOpen: z.boolean(),
    openTime: z.string().optional(),
    closeTime: z.string().optional(),
  }),
  wednesday: z.object({
    isOpen: z.boolean(),
    openTime: z.string().optional(),
    closeTime: z.string().optional(),
  }),
  thursday: z.object({
    isOpen: z.boolean(),
    openTime: z.string().optional(),
    closeTime: z.string().optional(),
  }),
  friday: z.object({
    isOpen: z.boolean(),
    openTime: z.string().optional(),
    closeTime: z.string().optional(),
  }),
  saturday: z.object({
    isOpen: z.boolean(),
    openTime: z.string().optional(),
    closeTime: z.string().optional(),
  }),
  sunday: z.object({
    isOpen: z.boolean(),
    openTime: z.string().optional(),
    closeTime: z.string().optional(),
  }),
});

const pricingSettingsSchema = z.object({
  currency: z.string().min(1, 'Currency is required'),
  taxRate: z.number().min(0).max(100),
  displayPricesWithTax: z.boolean(),
  allowDiscounts: z.boolean(),
  maxDiscountPercent: z.number().min(0).max(100),
  depositRequired: z.boolean(),
  depositPercentage: z.number().min(0).max(100),
  paymentTerms: z.number().min(1),
});

const policiesSchema = z.object({
  cancellationPeriod: z.number().min(1, 'Cancellation period must be at least 1 hour'),
  cancellationFee: z.number().min(0),
  noShowFee: z.number().min(0),
  refundPolicy: z.string().min(1, 'Refund policy is required'),
  privacyPolicy: z.string().min(1, 'Privacy policy is required'),
  termsOfService: z.string().min(1, 'Terms of service is required'),
  minBookingNotice: z.number().min(0),
  maxBookingAdvance: z.number().min(1),
});

type BusinessInfoFormData = z.infer<typeof businessInfoSchema>;
type OperatingHoursFormData = z.infer<typeof operatingHoursSchema>;
type PricingSettingsFormData = z.infer<typeof pricingSettingsSchema>;
type PoliciesFormData = z.infer<typeof policiesSchema>;

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const CURRENCIES = [
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$' },
];

export default function BusinessSettings() {
  const [activeTab, setActiveTab] = useState('info');

  const businessForm = useForm<BusinessInfoFormData>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      clinicName: 'Lea Aesthetics',
      businessRegistration: 'REG123456789',
      address: '123 Harley Street',
      city: 'London',
      country: 'United Kingdom',
      postcode: 'W1G 7JU',
      phone: '+44 20 7123 4567',
      email: 'contact@leaaesthetics.com',
      website: 'https://leaaesthetics.com',
      description: 'Premier aesthetic clinic and training academy offering advanced cosmetic treatments and professional certification programs.',
    },
  });

  const hoursForm = useForm<OperatingHoursFormData>({
    resolver: zodResolver(operatingHoursSchema),
    defaultValues: {
      monday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      tuesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      wednesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      thursday: { isOpen: true, openTime: '09:00', closeTime: '19:00' },
      friday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      saturday: { isOpen: true, openTime: '10:00', closeTime: '16:00' },
      sunday: { isOpen: false, openTime: '', closeTime: '' },
    },
  });

  const pricingForm = useForm<PricingSettingsFormData>({
    resolver: zodResolver(pricingSettingsSchema),
    defaultValues: {
      currency: 'GBP',
      taxRate: 20,
      displayPricesWithTax: true,
      allowDiscounts: true,
      maxDiscountPercent: 50,
      depositRequired: true,
      depositPercentage: 25,
      paymentTerms: 30,
    },
  });

  const policiesForm = useForm<PoliciesFormData>({
    resolver: zodResolver(policiesSchema),
    defaultValues: {
      cancellationPeriod: 24,
      cancellationFee: 25,
      noShowFee: 50,
      refundPolicy: 'Refunds are processed within 5-10 business days for cancellations made more than 48 hours in advance.',
      privacyPolicy: 'We are committed to protecting your privacy and personal data in accordance with GDPR regulations.',
      termsOfService: 'By using our services, you agree to our terms and conditions.',
      minBookingNotice: 2,
      maxBookingAdvance: 90,
    },
  });

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Business Info</span>
          </TabsTrigger>
          <TabsTrigger value="hours" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Hours</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Pricing</span>
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Policies</span>
          </TabsTrigger>
        </TabsList>

        {/* Business Information Tab */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Business Information
              </CardTitle>
              <CardDescription>
                Configure your clinic's basic information and branding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={businessForm.handleSubmit((data) => console.log('Business Info:', data))} className="space-y-6">
                {/* Logo Upload Section */}
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-lea-pearl-white border-2 border-dashed border-lea-elegant-silver rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Image className="h-8 w-8 mx-auto mb-2 text-lea-charcoal-grey" />
                        <p className="text-sm text-lea-charcoal-grey">Clinic Logo</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Button variant="outline" className="flex items-center">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Recommended: PNG or JPG, minimum 400x400px
                    </p>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="clinicName">Clinic Name *</Label>
                    <Input {...businessForm.register('clinicName')} />
                  </div>
                  <div>
                    <Label htmlFor="businessRegistration">Business Registration</Label>
                    <Input {...businessForm.register('businessRegistration')} />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input {...businessForm.register('phone')} className="pl-10" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input {...businessForm.register('email')} className="pl-10" />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input {...businessForm.register('website')} className="pl-10" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Address</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input {...businessForm.register('address')} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input {...businessForm.register('city')} />
                      </div>
                      <div>
                        <Label htmlFor="postcode">Postcode *</Label>
                        <Input {...businessForm.register('postcode')} />
                      </div>
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Select onValueChange={(value) => businessForm.setValue('country', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                            <SelectItem value="Ireland">Ireland</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Clinic Description</Label>
                  <Textarea 
                    {...businessForm.register('description')}
                    placeholder="Describe your clinic's services and specialties..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                  <Save className="h-4 w-4 mr-2" />
                  Save Business Information
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operating Hours Tab */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Operating Hours
              </CardTitle>
              <CardDescription>
                Set your clinic's operating hours for each day of the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={hoursForm.handleSubmit((data) => console.log('Operating Hours:', data))} className="space-y-6">
                <div className="space-y-4">
                  {DAYS_OF_WEEK.map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-20">
                          <Label className="font-medium">{label}</Label>
                        </div>
                        <Switch 
                          checked={hoursForm.watch(`${key as keyof OperatingHoursFormData}.isOpen`)}
                          onCheckedChange={(checked) => 
                            hoursForm.setValue(`${key as keyof OperatingHoursFormData}.isOpen`, checked)
                          }
                        />
                        <span className="text-sm text-muted-foreground">
                          {hoursForm.watch(`${key as keyof OperatingHoursFormData}.isOpen`) ? 'Open' : 'Closed'}
                        </span>
                      </div>
                      
                      {hoursForm.watch(`${key as keyof OperatingHoursFormData}.isOpen`) && (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="time"
                            {...hoursForm.register(`${key as keyof OperatingHoursFormData}.openTime`)}
                            className="w-32"
                          />
                          <span className="text-muted-foreground">to</span>
                          <Input
                            type="time"
                            {...hoursForm.register(`${key as keyof OperatingHoursFormData}.closeTime`)}
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      DAYS_OF_WEEK.slice(0, 5).forEach(({ key }) => {
                        hoursForm.setValue(`${key as keyof OperatingHoursFormData}.isOpen`, true);
                        hoursForm.setValue(`${key as keyof OperatingHoursFormData}.openTime`, '09:00');
                        hoursForm.setValue(`${key as keyof OperatingHoursFormData}.closeTime`, '17:00');
                      });
                    }}
                  >
                    Set Weekdays 9-5
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      DAYS_OF_WEEK.forEach(({ key }) => {
                        hoursForm.setValue(`${key as keyof OperatingHoursFormData}.isOpen`, false);
                      });
                    }}
                  >
                    Close All Days
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      DAYS_OF_WEEK.forEach(({ key }) => {
                        hoursForm.setValue(`${key as keyof OperatingHoursFormData}.isOpen`, true);
                        hoursForm.setValue(`${key as keyof OperatingHoursFormData}.openTime`, '09:00');
                        hoursForm.setValue(`${key as keyof OperatingHoursFormData}.closeTime`, '17:00');
                      });
                    }}
                  >
                    Open All Days 9-5
                  </Button>
                </div>

                <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                  <Save className="h-4 w-4 mr-2" />
                  Save Operating Hours
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Settings Tab */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Pricing & Payment Settings
              </CardTitle>
              <CardDescription>
                Configure pricing models, tax settings, and payment terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={pricingForm.handleSubmit((data) => console.log('Pricing Settings:', data))} className="space-y-6">
                {/* Currency and Tax */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select 
                      value={pricingForm.watch('currency')} 
                      onValueChange={(value) => pricingForm.setValue('currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            <div className="flex items-center">
                              <span className="font-medium">{currency.symbol}</span>
                              <span className="ml-2">{currency.name} ({currency.code})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <div className="relative">
                      <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number" 
                        step="0.1" 
                        min="0" 
                        max="100"
                        {...pricingForm.register('taxRate', { valueAsNumber: true })}
                        className="pr-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Price Display Settings */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Price Display Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Display prices with tax included</Label>
                        <p className="text-sm text-muted-foreground">Show final prices including tax to clients</p>
                      </div>
                      <Switch 
                        checked={pricingForm.watch('displayPricesWithTax')}
                        onCheckedChange={(checked) => pricingForm.setValue('displayPricesWithTax', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Discount Settings */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Discount Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Allow discounts</Label>
                        <p className="text-sm text-muted-foreground">Enable discount application for treatments</p>
                      </div>
                      <Switch 
                        checked={pricingForm.watch('allowDiscounts')}
                        onCheckedChange={(checked) => pricingForm.setValue('allowDiscounts', checked)}
                      />
                    </div>
                    
                    {pricingForm.watch('allowDiscounts') && (
                      <div>
                        <Label htmlFor="maxDiscountPercent">Maximum Discount (%)</Label>
                        <Input 
                          type="number" 
                          step="1" 
                          min="0" 
                          max="100"
                          {...pricingForm.register('maxDiscountPercent', { valueAsNumber: true })}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Deposit Settings */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Deposit Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Require deposit for bookings</Label>
                        <p className="text-sm text-muted-foreground">Require clients to pay a deposit when booking</p>
                      </div>
                      <Switch 
                        checked={pricingForm.watch('depositRequired')}
                        onCheckedChange={(checked) => pricingForm.setValue('depositRequired', checked)}
                      />
                    </div>
                    
                    {pricingForm.watch('depositRequired') && (
                      <div>
                        <Label htmlFor="depositPercentage">Deposit Percentage (%)</Label>
                        <Input 
                          type="number" 
                          step="1" 
                          min="0" 
                          max="100"
                          {...pricingForm.register('depositPercentage', { valueAsNumber: true })}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Terms */}
                <div>
                  <Label htmlFor="paymentTerms">Payment Terms (days)</Label>
                  <Input 
                    type="number" 
                    min="1"
                    {...pricingForm.register('paymentTerms', { valueAsNumber: true })}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Number of days clients have to pay outstanding balances
                  </p>
                </div>

                <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                  <Save className="h-4 w-4 mr-2" />
                  Save Pricing Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Business Policies
              </CardTitle>
              <CardDescription>
                Configure cancellation policies, terms of service, and booking rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={policiesForm.handleSubmit((data) => console.log('Policies:', data))} className="space-y-6">
                {/* Booking Policies */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Booking Policies</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="cancellationPeriod">Cancellation Period (hours)</Label>
                      <Input 
                        type="number" 
                        min="1"
                        {...policiesForm.register('cancellationPeriod', { valueAsNumber: true })}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Minimum hours before appointment to cancel without fee
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="minBookingNotice">Minimum Booking Notice (hours)</Label>
                      <Input 
                        type="number" 
                        min="0"
                        {...policiesForm.register('minBookingNotice', { valueAsNumber: true })}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Minimum hours in advance clients must book
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="maxBookingAdvance">Maximum Booking Advance (days)</Label>
                      <Input 
                        type="number" 
                        min="1"
                        {...policiesForm.register('maxBookingAdvance', { valueAsNumber: true })}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Maximum days in advance clients can book
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fee Structure */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Fee Structure</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="cancellationFee">Late Cancellation Fee (£)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0"
                          {...policiesForm.register('cancellationFee', { valueAsNumber: true })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="noShowFee">No-Show Fee (£)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0"
                          {...policiesForm.register('noShowFee', { valueAsNumber: true })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Policy Documents */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Policy Documents</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="refundPolicy">Refund Policy</Label>
                      <Textarea 
                        {...policiesForm.register('refundPolicy')}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="privacyPolicy">Privacy Policy</Label>
                      <Textarea 
                        {...policiesForm.register('privacyPolicy')}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="termsOfService">Terms of Service</Label>
                      <Textarea 
                        {...policiesForm.register('termsOfService')}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="bg-lea-sage-green text-white hover:bg-lea-sage-green/90">
                  <Save className="h-4 w-4 mr-2" />
                  Save Business Policies
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
