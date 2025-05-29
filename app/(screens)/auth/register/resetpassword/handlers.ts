import { useRouter } from "next/navigation";
import { authClient } from "../../../../lib/auth-client";
import { z } from "zod";
import { createPasswordSchema } from "@/lib/auth/passwordValidation";

/**
 * Validation schema for the email request form
 * Ensures the email is in a valid format
 */
const requestResetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

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

// Type definitions for form data
type RequestResetFormData = z.infer<typeof requestResetSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Creates handlers for both password reset forms
 *
 * @param router - Next.js router for navigation
 * @param setError - Function to set API error messages
 * @param setValidationError - Function to set form validation errors
 * @param setIsLoading - Function to set loading state
 */
export const createResetPasswordHandlers = ({
  router,
  setError,
  setValidationError,
  setIsLoading,
}: {
  router: ReturnType<typeof useRouter>;
  setError: (error: string) => void;
  setValidationError: (error: string) => void;
  setIsLoading: (loading: boolean) => void;
}) => {
  /**
   * Handles the email request for password reset
   * Sends a reset link to the provided email address
   */
  const handleRequestReset = async (values: RequestResetFormData) => {
    setError("");
    setValidationError("");
    setIsLoading(true);

    // Validate the form data
    const validationResult = requestResetSchema.safeParse(values);
    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      const firstError = errors[0];
      setValidationError(firstError.message);
      setIsLoading(false);
      return;
    }

    try {
      await authClient.forgetPassword(
        {
          email: values.email,
        },
        {
          onSuccess: () => {
            // Show success message and redirect to login
            setTimeout(() => {
              router.push("/auth/login");
            }, 2000);
            setIsLoading(false);
          },
          onError: (ctx) => {
            setError(
              ctx.error?.message ||
                "Failed to send reset link. Please try again."
            );
            setIsLoading(false);
          },
        }
      );
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  /**
   * Handles the actual password reset
   * Updates the user's password using the reset token
   */
  const handleResetPassword = async (values: ResetPasswordFormData) => {
    setError("");
    setValidationError("");
    setIsLoading(true);

    // Validate the form data
    const validationResult = resetPasswordSchema.safeParse(values);
    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      const firstError = errors[0];
      setValidationError(firstError.message);
      setIsLoading(false);
      return;
    }

    try {
      await authClient.resetPassword(
        {
          newPassword: values.password,
          token: window.location.search.split("token=")[1],
        },
        {
          onSuccess: () => {
            // Show success message and redirect to login
            setTimeout(() => {
              router.push("/auth/login");
            }, 2000);
            setIsLoading(false);
          },
          onError: (ctx) => {
            setError(
              ctx.error?.message ||
                "Failed to reset password. Please try again."
            );
            setIsLoading(false);
          },
        }
      );
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return {
    handleRequestReset,
    handleResetPassword,
  };
};
