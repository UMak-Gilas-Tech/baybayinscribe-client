import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { EmailInput } from "../components/EmailInput";
import { Form as ShadcnForm } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { memo } from "react";
import { AccountHelper } from "../components/AccountHelper";
import { TermsServices } from "@/components/auth/TermsServices";
import { BackButton } from "../components/BackButton";

/**
 * Validation schema for the email request form
 * Ensures the email is in a valid format
 */
const requestResetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type RequestResetFormData = z.infer<typeof requestResetSchema>;

/**
 * Props for the RequestResetForm component
 * @property onSubmit - Function to handle form submission
 * @property error - API error message
 * @property validationError - Form validation error message
 * @property isLoading - Loading state for form submission
 */
interface RequestResetFormProps {
  onSubmit: (values: RequestResetFormData) => Promise<void>;
  error: string;
  validationError?: string;
  isLoading: boolean;
}

/**
 * Memoized error message component
 * Prevents unnecessary re-renders and adds animation
 */
const ErrorMessage = memo(
  ({ message, className }: { message: string; className?: string }) => (
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`text-red-500 bg-red-100/50 p-3 rounded-md mb-4 ${
        className || ""
      }`}
      role="alert"
    >
      {message}
    </motion.p>
  )
);

ErrorMessage.displayName = "ErrorMessage";

/**
 * RequestResetForm Component
 *
 * A form component for requesting a password reset link
 * Features:
 * - Email validation
 * - Error handling with animations
 * - Loading states
 * - Consistent styling with login/register forms
 */
export const RequestResetForm = ({
  onSubmit,
  error,
  validationError,
  isLoading,
}: RequestResetFormProps) => {
  console.log("RequestResetForm rendered with:", {
    error,
    validationError,
    isLoading,
  });

  // Initialize form with validation
  const form = useForm<RequestResetFormData>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  // Submit handler
  const handleSubmit = useCallback(
    async (values: RequestResetFormData) => {
      console.log("Form submitted with values:", values);
      await onSubmit(values);
    },
    [onSubmit]
  );

  return (
    <div className="flex flex-col items-center z-20 w-full max-w-11/12">
      {/* --- Request Reset Form Card --- */}
      <Card
        className="w-full max-w-md bg-neutral-white border border-blue-400 shadow-xl rounded-xl z-30 relative gap-3"
        role="form"
        aria-label="Request password reset form"
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-400 text-2xl font-bold">
              Reset Password
            </CardTitle>
            <BackButton />
          </div>
          <CardDescription className="text-grey-300 mt-2">
            Enter your email address to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent className="max-w-full">
          <ShadcnForm {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
              noValidate
            >
              {/* Email input with validation */}
              <EmailInput />

              {/* Error messages with animations */}
              <AnimatePresence mode="wait">
                {validationError && <ErrorMessage message={validationError} />}
                {error && (
                  <ErrorMessage
                    message={error}
                    className="text-red-800 border border-red-700 bg-red-100/50 rounded-md p-3 mb-2 text-sm font-medium animate-shake"
                  />
                )}
                {form.formState.errors.root && (
                  <ErrorMessage
                    message={form.formState.errors.root.message || ""}
                  />
                )}
              </AnimatePresence>

              {/* Submit button with loading state */}
              <Button
                type="submit"
                variant="blue"
                disabled={isLoading}
                aria-busy={isLoading}
                className="relative w-full h-10 text-base font-medium"
              >
                {isLoading ? (
                  <LoadingSpinner loadingText="Sending reset link..." />
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              {/* Account helper links */}
              <AccountHelper />
            </form>
          </ShadcnForm>
        </CardContent>
        {/* Terms and services footer */}
        <TermsServices mode="info" />
      </Card>
    </div>
  );
};
