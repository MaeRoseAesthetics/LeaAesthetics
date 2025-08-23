import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Client, Treatment } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

const bookingSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  treatmentId: z.string().min(1, "Treatment is required"),
  scheduledDate: z.date({
    required_error: "Date is required",
  }),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface TreatmentBookingProps {
  onSuccess?: () => void;
}

export default function TreatmentBooking({ onSuccess }: TreatmentBookingProps) {
  const [selectedTime, setSelectedTime] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const { data: treatments = [] } = useQuery<Treatment[]>({
    queryKey: ["/api/treatments"],
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormData & { time: string }) => {
      const scheduledDateTime = new Date(data.scheduledDate);
      const [hours, minutes] = data.time.split(':');
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

      const bookingData = {
        clientId: data.clientId,
        treatmentId: data.treatmentId,
        scheduledDate: scheduledDateTime.toISOString(),
        notes: data.notes,
      };

      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Success",
        description: "Booking created successfully",
      });
      reset();
      setSelectedTime("");
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const selectedDate = watch("scheduledDate");

  const onSubmit = (data: BookingFormData) => {
    if (!selectedTime) {
      toast({
        title: "Error",
        description: "Please select a time",
        variant: "destructive",
      });
      return;
    }
    createBookingMutation.mutate({ ...data, time: selectedTime });
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900" data-testid="title-treatment-booking">
          Book Treatment Appointment
        </h2>
        <p className="text-sm text-gray-500">Schedule a new treatment appointment</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="clientId">Client *</Label>
          <Select onValueChange={(value) => setValue("clientId", value)}>
            <SelectTrigger data-testid="select-client">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client: any) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.firstName} {client.lastName} - {client.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.clientId && (
            <p className="text-sm text-red-500 mt-1">{errors.clientId.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="treatmentId">Treatment *</Label>
          <Select onValueChange={(value) => setValue("treatmentId", value)}>
            <SelectTrigger data-testid="select-treatment">
              <SelectValue placeholder="Select a treatment" />
            </SelectTrigger>
            <SelectContent>
              {treatments.map((treatment: any) => (
                <SelectItem key={treatment.id} value={treatment.id}>
                  {treatment.name} - £{treatment.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.treatmentId && (
            <p className="text-sm text-red-500 mt-1">{errors.treatmentId.message}</p>
          )}
        </div>

        <div>
          <Label>Appointment Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                data-testid="button-select-date"
              >
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                <i className="fas fa-calendar ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setValue("scheduledDate", date)}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.scheduledDate && (
            <p className="text-sm text-red-500 mt-1">{errors.scheduledDate.message}</p>
          )}
        </div>

        <div>
          <Label>Appointment Time *</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                type="button"
                variant={selectedTime === time ? "default" : "outline"}
                className="text-sm"
                onClick={() => setSelectedTime(time)}
                data-testid={`time-slot-${time}`}
              >
                {time}
              </Button>
            ))}
          </div>
          {!selectedTime && (
            <p className="text-sm text-gray-500 mt-1">Please select an appointment time</p>
          )}
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...register("notes")}
            placeholder="Additional notes or special requirements"
            data-testid="textarea-notes"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              setSelectedTime("");
              onSuccess?.();
            }}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createBookingMutation.isPending || !selectedTime}
            data-testid="button-create-booking"
          >
            {createBookingMutation.isPending ? "Creating..." : "Create Booking"}
          </Button>
        </div>
      </form>
    </div>
  );
}
