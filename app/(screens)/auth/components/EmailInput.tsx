import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EmailInputProps {
  label?: string;
  placeholder?: string;
}

export const EmailInput = ({
  label = "Email",
  placeholder = "Enter your email",
}: EmailInputProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="email"
              placeholder={placeholder}
              className="bg-neutral-white border border-blue-400 focus:border-blue-400 focus:ring-blue-400 text-neutral-black text-base mb-3"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
