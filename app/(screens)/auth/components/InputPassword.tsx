import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  name?: string;
  isConfirmPassword?: boolean;
  passwordFieldName?: string;
}

export const PasswordInput = ({
  label = "Password",
  placeholder = "Enter your password",
  name = "password",
  isConfirmPassword = false,
  passwordFieldName = "password",
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useFormContext();

  // Custom validation for confirm password
  const validateConfirmPassword = (value: string) => {
    if (isConfirmPassword) {
      const password = form.getValues(passwordFieldName);
      return value === password || "Passwords do not match";
    }
    return true;
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      togglePasswordVisibility();
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      rules={{
        validate: validateConfirmPassword,
      }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className="bg-neutral-white border border-blue-400 focus:border-blue-400 focus:ring-blue-400 text-neutral-black text-base"
                {...field}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                onKeyDown={handleKeyDown}
                className="cursor-pointer absolute inset-y-0 right-3 flex items-center text-blue-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-md p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeClosed className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
