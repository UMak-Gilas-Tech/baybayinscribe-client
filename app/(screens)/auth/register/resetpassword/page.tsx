"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RequestResetForm } from "./RequestResetForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { createResetPasswordHandlers } from "./handlers";
import { Background } from "../../components/Background";

/**
 * ResetPasswordPage Component
 *
 * This component handles the two-step password reset flow:
 * 1. Request Reset: User enters their email to request a reset link
 * 2. Reset Password: User sets a new password using the reset token
 *
 * The component determines which form to show based on the presence of a token in the URL:
 * - No token: Shows RequestResetForm for email input
 * - With token: Shows ResetPasswordForm for new password input
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Get the reset token from URL query parameters
  const token = searchParams.get("token");

  // State management for form handling
  const [error, setError] = useState(""); // For API errors
  const [validationError, setValidationError] = useState(""); // For form validation errors
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission

  // Create handlers for both forms
  const { handleRequestReset, handleResetPassword } =
    createResetPasswordHandlers({
      router,
      setError,
      setValidationError,
      setIsLoading,
    });

  return (
    <Background>
      {/* Conditional rendering based on token presence */}
      {token ? (
        // Show password reset form if token exists
        <ResetPasswordForm
          onSubmit={handleResetPassword}
          error={error}
          validationError={validationError}
          isLoading={isLoading}
          token={token}
        />
      ) : (
        // Show email request form if no token
        <RequestResetForm
          onSubmit={handleRequestReset}
          error={error}
          validationError={validationError}
          isLoading={isLoading}
        />
      )}
    </Background>
  );
}
