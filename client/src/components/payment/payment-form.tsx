import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const paymentSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  clientId: z.string().optional(),
  studentId: z.string().optional(),
  bookingId: z.string().optional(),
  enrollmentId: z.string().optional(),
  ageVerified: z.boolean().refine(val => val === true, "Age verification is required"),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  amount: number;
  clientId?: string;
  studentId?: string;
  bookingId?: string;
  enrollmentId?: string;
  description?: string;
  onSuccess?: () => void;
}

function CheckoutForm({ 
  amount, 
  clientId, 
  studentId, 
  bookingId, 
  enrollmentId, 
  description, 
  onSuccess 
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount,
      clientId,
      studentId,
      bookingId,
      enrollmentId,
    },
  });

  const handlePaymentSubmit = async (data: PaymentFormData) => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "Thank you for your payment!",
        });
        onSuccess?.();
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Amount:</span>
            <span className="text-lg font-bold text-medical-blue" data-testid="text-payment-amount">
              £{amount.toFixed(2)}
            </span>
          </div>
          {description && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Description:</span>
              <span className="text-sm text-gray-600">{description}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(handlePaymentSubmit)} className="space-y-6">
        {/* Age Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-warning">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Age Verification Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-yellow-800">
                UK regulations require face-to-face age verification for aesthetic treatments.
                This payment confirms you have completed the required verification process.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ageVerified"
                onCheckedChange={(checked) => setValue("ageVerified", checked as boolean)}
                data-testid="checkbox-age-verified"
              />
              <Label htmlFor="ageVerified" className="text-sm">
                I confirm that age verification has been completed in person *
              </Label>
            </div>
            {errors.ageVerified && (
              <p className="text-sm text-red-500 mt-1">{errors.ageVerified.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Payment Element */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentElement />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full"
          data-testid="button-process-payment"
        >
          {isProcessing ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Processing...
            </>
          ) : (
            <>
              <i className="fas fa-credit-card mr-2"></i>
              Process Payment £{amount.toFixed(2)}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

export default function PaymentForm(props: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const { toast } = useToast();

  const createPaymentIntentMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount: props.amount,
        clientId: props.clientId,
        studentId: props.studentId,
        bookingId: props.bookingId,
        enrollmentId: props.enrollmentId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  React.useEffect(() => {
    createPaymentIntentMutation.mutate();
  }, []);

  if (createPaymentIntentMutation.isPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center py-8">
        <i className="fas fa-exclamation-triangle text-warning text-3xl mb-4"></i>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Initialize Payment</h3>
        <p className="text-gray-500">Please try again or contact support</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
