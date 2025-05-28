import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  Form as ShadcnForm,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

interface LoginFormProps {
  onSubmit: (values: { email: string; password: string }) => Promise<void>;
  loginError: string;
  validationError?: string;
  isLoading: boolean;
}

export const LoginForm = ({
  onSubmit,
  loginError,
  validationError,
  isLoading,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <>
      {/* Mobile Title */}
      <h2 className="text-base md:text-lg font-semibold text-[#FAD6A5] mt-16 ml-6 md:hidden">
        Log In
      </h2>

      <ShadcnForm {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 mt-2 ml-4 mr-4"
        >
          {/* Desktop Form Fields */}
          <div className="hidden md:block">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-400 font-semibold">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-neutral-white border border-blue-400 focus:border-blue-400 focus:ring-blue-400 text-neutral-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-400 font-semibold">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="bg-neutral-white border border-blue-400 focus:border-blue-400 focus:ring-blue-400 text-neutral-black"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-blue-400"
                        tabIndex={-1}
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
          </div>

          {/* Error Messages */}
          {validationError && (
            <p className="text-red-800 bg-danger-100 mb-4">{validationError}</p>
          )}
          {loginError && (
            <p className="text-red-800 bg-danger-100 border border-red-700 rounded px-2 py-1 mb-2 text-xs font-medium animate-shake">
              {loginError}
            </p>
          )}

          {/* Submit Buttons */}
          <Button
            type="submit"
            className="w-full bg-blue-400 text-neutral-white hover:bg-blue-600 transition font-bold py-2 rounded-lg shadow hidden md:block"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner loadingText="Logging in..." />
            ) : (
              "Login"
            )}
          </Button>

          <button
            type="submit"
            className="w-full py-3 bg-[#837EFF] text-white font-bold rounded-full hover:bg-[#7C67E8] transition cursor-pointer relative md:hidden"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner loadingText="Signing in..." />
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </ShadcnForm>
    </>
  );
};
