import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Form as ShadcnForm } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PasswordInput } from "../components/PasswordInput";
import { motion, AnimatePresence } from "framer-motion";
import { memo } from "react";
import {
  createPasswordSchema,
  checkPasswordStrength,
  PasswordStrength,
} from "@/lib/auth/passwordValidation";
import { TermsServices } from "@/components/auth/TermsServices";
import { BackButton } from "../components/BackButton";

/**
 * Validation schema for the password reset form
 * Uses the shared password validation schema and adds confirmation check
 */
const resetPasswordSchema = z
  .object({
    password: createPasswordSchema(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Props for the ResetPasswordForm component
 */
interface ResetPasswordFormProps {
  onSubmit: (values: ResetPasswordFormData) => Promise<void>;
  error: string;
  validationError?: string;
  isLoading: boolean;
  token: string | null;
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
 * ResetPasswordForm Component
 *
 * A responsive form component for resetting user passwords
 * Features:
 * - Responsive design with different layouts for mobile and desktop
 * - Form validation using Zod
 * - Animated error messages
 * - Loading states
 * - Password visibility toggle
 * - Password confirmation check
 */
export const ResetPasswordForm = ({
  onSubmit,
  error,
  validationError,
  isLoading,
  token,
}: ResetPasswordFormProps) => {
  // Initialize form with validation
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  // Add password strength indicator
  const passwordStrength = useMemo(() => {
    const password = form.watch("password");
    return password ? checkPasswordStrength(password) : null;
  }, [form]);

  // Get strength color
  const getStrengthColor = (strength: PasswordStrength | null) => {
    switch (strength) {
      case PasswordStrength.STRONG:
        return "text-green-500";
      case PasswordStrength.MEDIUM:
        return "text-yellow-500";
      case PasswordStrength.WEAK:
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  // Submit handler
  const handleSubmit = useCallback(
    async (values: ResetPasswordFormData) => {
      await onSubmit(values);
    },
    [onSubmit]
  );

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-blue-400 z-0">
      {/* Form container with responsive positioning */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-20 w-full lg:w-[50%] lg:ml-70">
        <Card
          className="w-full max-w-sm bg-neutral-white border border-blue-400 shadow-xl rounded-xl z-30 relative gap-3 lg:translate-x-[-50px]"
          role="form"
          aria-label="Reset password form"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-400 text-2xl font-bold">
                Reset Password
              </CardTitle>
              <BackButton />
            </div>
            <CardDescription className="text-grey-300 mt-2">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent className="max-w-full">
            <ShadcnForm {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
                noValidate
              >
                <div className="space-y-2">
                  <PasswordInput
                    name="password"
                    label="New Password"
                    placeholder="Create a strong password"
                  />
                  {passwordStrength && (
                    <p
                      className={`text-sm ${getStrengthColor(
                        passwordStrength
                      )}`}
                    >
                      Password Strength: {passwordStrength}
                    </p>
                  )}
                </div>
                <PasswordInput
                  name="confirmPassword"
                  label="Confirm New Password"
                  placeholder="Confirm your password"
                  isConfirmPassword
                  passwordFieldName="password"
                />

                {/* Animated error messages */}
                <AnimatePresence mode="wait">
                  {validationError && (
                    <ErrorMessage message={validationError} />
                  )}
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
                  disabled={isLoading || !token}
                  aria-busy={isLoading}
                  className="relative w-full h-10 text-base font-medium"
                >
                  {isLoading ? (
                    <LoadingSpinner loadingText="Resetting password..." />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </ShadcnForm>
          </CardContent>
          <TermsServices mode="info" />
        </Card>
      </div>
    </div>
  );
};
