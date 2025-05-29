import React from "react";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { CustomCalendar } from "@/components/customCalendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface InputBirthDateProps {
  value: Date | undefined;
  setValue: (date: Date | undefined) => void;
  error?: string;
}

export const InputBirthDate: React.FC<InputBirthDateProps> = ({
  value,
  setValue,
  error,
}) => {
  // Calculate min and max date for 6 years ago and yesterday
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() - 1); // yesterday
  const minDate = new Date(today);
  minDate.setFullYear(today.getFullYear() - 6);

  return (
    <FormItem>
      <FormLabel>Date of Birth</FormLabel>
      <FormControl>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal",
                !value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? (
                format(value, "PPP")
              ) : (
                <span>Select your birth date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CustomCalendar
              mode="single"
              selected={value}
              onSelect={setValue}
              autoFocus
              disabled={[
                { after: maxDate }, // disables today and future
                { after: minDate }, // disables the last 6 years up to yesterday
              ]}
            />
          </PopoverContent>
        </Popover>
      </FormControl>
      {error && (
        <FormMessage className="text-sm text-red-500">{error}</FormMessage>
      )}
    </FormItem>
  );
};
