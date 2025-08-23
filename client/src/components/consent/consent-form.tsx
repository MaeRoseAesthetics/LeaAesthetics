import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const consentSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  treatmentId: z.string().min(1, "Treatment is required"),
  formType: z.string().min(1, "Form type is required"),
  content: z.string().min(1, "Consent content is required"),
  understood: z.boolean().refine(val => val === true, "You must confirm understanding"),
  riskAcceptance: z.boolean().refine(val => val === true, "You must accept the risks"),
  ageConfirmed: z.boolean().refine(val => val === true, "Age confirmation is required"),
});

type ConsentFormData = z.infer<typeof consentSchema>;

interface ConsentFormProps {
  clientId?: string;
  treatmentId?: string;
  onSuccess?: () => void;
}

export default function ConsentForm({ clientId, treatmentId, onSuccess }: ConsentFormProps) {
  const [signatureData, setSignatureData] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createConsentMutation = useMutation({
    mutationFn: async (data: ConsentFormData) => {
      const consentData = {
        clientId: data.clientId,
        treatmentId: data.treatmentId,
        formType: data.formType,
        content: data.content,
      };

      const response = await apiRequest("POST", "/api/consent-forms", consentData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/consent-forms"] });
      toast({
        title: "Success",
        description: "Consent form created successfully",
      });
      reset();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ConsentFormData>({
    resolver: zodResolver(consentSchema),
    defaultValues: {
      clientId: clientId || "",
      treatmentId: treatmentId || "",
      formType: "treatment",
    },
  });

  const selectedFormType = watch("formType");

  const onSubmit = (data: ConsentFormData) => {
    createConsentMutation.mutate(data);
  };

  const getConsentTemplate = (formType: string) => {
    switch (formType) {
      case "treatment":
        return `TREATMENT CONSENT FORM

I acknowledge that I have been informed about the proposed aesthetic treatment and understand:

1. The nature of the treatment and expected outcomes
2. Potential risks and complications
3. Alternative treatment options
4. Post-treatment care requirements
5. Cost of treatment and payment terms

I confirm that:
- I am over 18 years of age
- I have disclosed all relevant medical history
- I understand there are no guarantees of specific results
- I consent to photographs being taken for medical records

JCCP Compliance Statement:
This treatment is performed in accordance with Joint Council for Cosmetic Practitioners guidelines.`;

      case "psychological_screening":
        return `PSYCHOLOGICAL SCREENING ASSESSMENT

Pre-treatment psychological assessment as required by JCCP guidelines:

1. What are your motivations for seeking this treatment?
2. Have you had previous cosmetic treatments?
3. Do you have realistic expectations about the outcomes?
4. Are you currently experiencing any stress or major life changes?
5. Do you have any history of body dysmorphic disorder?

Clinical Assessment:
- Patient appears mentally competent to consent
- Realistic expectations discussed
- No signs of body dysmorphic disorder
- Appropriate motivation for treatment`;

      case "medical_history":
        return `COMPREHENSIVE MEDICAL HISTORY

Please provide complete and accurate information:

Medical Conditions:
- Current medications and supplements
- Allergies and adverse reactions
- Previous surgeries or treatments
- Pregnancy or breastfeeding status
- Blood clotting disorders
- Autoimmune conditions

Lifestyle Factors:
- Smoking and alcohol consumption
- Recent sun exposure or tanning
- Current skincare regimen
- Exercise and activity levels

This information is essential for safe treatment planning.`;

      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900" data-testid="title-consent-form">
          Digital Consent Form
        </h2>
        <p className="text-sm text-gray-500">JCCP/CPSA compliant consent documentation</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="formType">Form Type *</Label>
            <Select
              value={selectedFormType}
              onValueChange={(value) => {
                setValue("formType", value);
                setValue("content", getConsentTemplate(value));
              }}
            >
              <SelectTrigger data-testid="select-form-type">
                <SelectValue placeholder="Select form type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="treatment">Treatment Consent</SelectItem>
                <SelectItem value="psychological_screening">Psychological Screening</SelectItem>
                <SelectItem value="medical_history">Medical History</SelectItem>
              </SelectContent>
            </Select>
            {errors.formType && (
              <p className="text-sm text-red-500 mt-1">{errors.formType.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="content">Consent Form Content *</Label>
          <Textarea
            id="content"
            {...register("content")}
            rows={12}
            className="font-mono text-sm"
            placeholder="Consent form content will populate based on form type selection"
            data-testid="textarea-content"
          />
          {errors.content && (
            <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
          )}
        </div>

        {/* Consent Confirmations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Patient Confirmations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="understood"
                onCheckedChange={(checked) => setValue("understood", checked as boolean)}
                data-testid="checkbox-understood"
              />
              <Label htmlFor="understood" className="text-sm">
                I have read and understood the information provided above *
              </Label>
            </div>
            {errors.understood && (
              <p className="text-sm text-red-500">{errors.understood.message}</p>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="riskAcceptance"
                onCheckedChange={(checked) => setValue("riskAcceptance", checked as boolean)}
                data-testid="checkbox-risks"
              />
              <Label htmlFor="riskAcceptance" className="text-sm">
                I understand and accept the risks associated with this treatment *
              </Label>
            </div>
            {errors.riskAcceptance && (
              <p className="text-sm text-red-500">{errors.riskAcceptance.message}</p>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="ageConfirmed"
                onCheckedChange={(checked) => setValue("ageConfirmed", checked as boolean)}
                data-testid="checkbox-age"
              />
              <Label htmlFor="ageConfirmed" className="text-sm">
                I confirm that I am 18 years of age or older *
              </Label>
            </div>
            {errors.ageConfirmed && (
              <p className="text-sm text-red-500">{errors.ageConfirmed.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Digital Signature Area */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Digital Signature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <i className="fas fa-signature text-3xl text-gray-400 mb-4"></i>
              <p className="text-gray-600 mb-4">Digital signature will be captured here</p>
              <Button
                type="button"
                variant="outline"
                data-testid="button-capture-signature"
              >
                <i className="fas fa-pen mr-2"></i>Capture Signature
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              onSuccess?.();
            }}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createConsentMutation.isPending}
            data-testid="button-create-consent"
          >
            {createConsentMutation.isPending ? "Creating..." : "Create Consent Form"}
          </Button>
        </div>
      </form>
    </div>
  );
}
