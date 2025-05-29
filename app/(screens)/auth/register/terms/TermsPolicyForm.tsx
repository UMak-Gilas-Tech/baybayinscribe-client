"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { BackButton } from "../../components/BackButton";
import { TermsServices } from "@/components/auth/TermsServices";
import { memo } from "react";
import {
  useTermsHandlers,
  handleTermsChange,
  handleNotificationChange,
  handleSubmit,
} from "./handlers";

// ============================================================================
// Constants & Types
// ============================================================================

// TODO: Add your terms and conditions content here
const TERMS_CONTENT = {
  title: "Terms and Agreement",
  description: "Please review and accept our terms to continue",
  notificationsLabel:
    "I want to be notified of upcoming offers, events, and latest news.",
  buttonText: "Finish Registration",
  loadingText: "Finishing...",
};

// ============================================================================
// Components
// ============================================================================

/**
 * Memoized error message component to prevent unnecessary re-renders
 * Displays error messages with animation and consistent styling
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

// ============================================================================
// Main Component
// ============================================================================

/**
 * TermsPolicyForm Component
 *
 * Handles the terms and conditions acceptance form with the following features:
 * - Terms and conditions agreement using TermsServices component
 * - Notification preferences
 * - Error handling with animations
 * - Loading states
 * - API integration for saving preferences
 */
export const TermsPolicyForm = () => {
  const router = useRouter();
  const {
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
  } = useTermsHandlers();

  return (
    <div className="flex flex-col items-center z-20 w-full max-w-11/12">
      {/* Terms Form Card */}
      <Card
        className="w-full max-w-md bg-neutral-white border border-blue-400 shadow-xl rounded-xl z-30 relative gap-3"
        role="form"
        aria-label="Terms and conditions form"
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-400 text-2xl font-bold">
              {TERMS_CONTENT.title}
            </CardTitle>
            <BackButton />
          </div>
          <CardDescription className="text-grey-300 mt-2">
            {TERMS_CONTENT.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="max-w-full">
          <form className="space-y-6" noValidate>
            <div className="space-y-4">
              {/* Terms Agreement using TermsServices component */}
              <TermsServices
                mode="required"
                checked={agree}
                onCheckedChange={(checked) =>
                  handleTermsChange(checked, setAgree, setError)
                }
              />

              {/* Notification Preferences Checkbox */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="notifications"
                  checked={wantsNotifications}
                  onCheckedChange={() =>
                    handleNotificationChange(
                      wantsNotifications,
                      setWantsNotifications
                    )
                  }
                  className="mt-1"
                />
                <Label
                  htmlFor="notifications"
                  className="text-sm text-gray-700"
                >
                  {TERMS_CONTENT.notificationsLabel}
                </Label>
              </div>
            </div>

            {/* Error Message Display */}
            <AnimatePresence mode="wait">
              {error && (
                <ErrorMessage
                  message={error}
                  className="text-red-800 border border-red-700 bg-red-100/50 rounded-md p-3 mb-2 text-sm font-medium animate-shake"
                />
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <Button
              onClick={() =>
                handleSubmit(
                  agree,
                  wantsNotifications,
                  setError,
                  setIsSubmitting,
                  setIsLoading,
                  router
                )
              }
              disabled={isSubmitting || isLoading}
              variant="blue"
              aria-busy={isLoading}
              className="relative w-full h-10 text-base font-medium"
            >
              {isLoading ? (
                <LoadingSpinner loadingText={TERMS_CONTENT.loadingText} />
              ) : (
                TERMS_CONTENT.buttonText
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
