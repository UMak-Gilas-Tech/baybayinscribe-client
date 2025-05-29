import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface TermsHandlers {
  agree: boolean;
  setAgree: (value: boolean) => void;
  wantsNotifications: boolean;
  setWantsNotifications: (value: boolean) => void;
  error: string;
  setError: (value: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

/**
 * Hook to manage terms form handlers
 * @returns Object containing all necessary handlers and state
 */
export const useTermsHandlers = (): TermsHandlers => {
  const [agree, setAgree] = useState(false);
  const [wantsNotifications, setWantsNotifications] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return {
    agree,
    setAgree,
    wantsNotifications,
    setWantsNotifications,
    error,
    setError,
    isSubmitting,
    setIsSubmitting,
    isLoading,
    setIsLoading,
  };
};

/**
 * Handles the terms agreement checkbox change
 * Clears any existing error messages when the user interacts with the checkbox
 */
export const handleTermsChange = (
  checked: boolean,
  setAgree: (value: boolean) => void,
  setError: (value: string) => void
) => {
  setAgree(checked);
  setError("");
};

/**
 * Handles the notification preferences checkbox change
 */
export const handleNotificationChange = (
  wantsNotifications: boolean,
  setWantsNotifications: (value: boolean) => void
) => {
  setWantsNotifications(!wantsNotifications);
};

/**
 * Handles form submission
 * - Validates terms agreement
 * - Updates terms agreement status
 * - Saves notification preferences
 * - Handles errors and loading states
 */
export const handleSubmit = async (
  agree: boolean,
  wantsNotifications: boolean,
  setError: (value: string) => void,
  setIsSubmitting: (value: boolean) => void,
  setIsLoading: (value: boolean) => void,
  router: ReturnType<typeof useRouter>
) => {
  if (!agree) {
    setError("Please agree to the terms and conditions to proceed.");
    setIsSubmitting(false);
    setIsLoading(false);
    return;
  }

  setIsSubmitting(true);
  setIsLoading(true);
  setError(""); // Clear any existing errors when starting submission

  try {
    // First update terms agreement
    const termsResponse = await fetch("/api/auth/agree.terms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agreed: true,
      }),
    });

    if (!termsResponse.ok) {
      const data = await termsResponse.json();
      console.error("Failed to save terms agreement:", data.error);
      setError("Failed to save terms agreement. Please try again.");
      return;
    }

    // Then save the notification preference
    const response = await fetch("/api/user.information", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wantsNotifications,
        agreedToTerms: true,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error("Failed to save notification preference:", data.error);
      // Continue anyway, don't block the user flow
    }

    toast.success("Registration completed successfully! Please wait...");
    router.push("/");
  } catch (err) {
    console.error("Error saving preferences:", err);
    setError("An error occurred. Please try again.");
  } finally {
    setIsSubmitting(false);
    setIsLoading(false);
  }
};
