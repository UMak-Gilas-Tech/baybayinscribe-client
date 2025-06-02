"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { motion, AnimatePresence } from "framer-motion";
import { memo } from "react";
import { FormField } from "@/components/ui/form";
import {
  UserInfoFormProps,
  UserInfoFormData,
  userInfoSchema,
  defaultFormValues,
  handleUserInfoSubmit,
} from "./handlers";
import { InputMobileNumber } from "../../components/InputMobileNumber";
import { InputBirthDate } from "../../components/InputBirthDate";
import { InputUsername } from "../../components/InputUsername";
import { InputFirstName } from "../../components/InputFirstName";
import { InputLastName } from "../../components/InputLastName";
import Head from "next/head";
import { useSearchParams } from "next/navigation";

// Custom hook for date handling
const useDatePicker = (initialDate?: string) => {
  const [date, setDate] = useState<Date | undefined>(
    initialDate ? new Date(initialDate) : undefined
  );

  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() - 1); // yesterday

  const minDate = new Date(today);
  minDate.setFullYear(today.getFullYear() - 6);

  return {
    date,
    setDate,
    maxDate,
    minDate,
  };
};

// Memoized error message component with improved accessibility
const ErrorMessage = memo(
  ({
    message,
    className,
    id,
  }: {
    message: string;
    className?: string;
    id?: string;
  }) => (
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`text-red-500 bg-red-100/50 p-3 rounded-md mb-4 ${
        className || ""
      }`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      id={id}
    >
      {message}
    </motion.p>
  )
);

ErrorMessage.displayName = "ErrorMessage";

export const UserInfoForm = ({
  onSubmit,
  error,
  validationError,
  isLoading,
}: UserInfoFormProps) => {
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [announcement, setAnnouncement] = useState<string>("");
  const [generalError, setGeneralError] = useState<string>("");

  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for registration session in localStorage or query parameter on component mount
    const registrationSessionInStorage = localStorage.getItem("registrationSession");
    const registrationSessionParam = searchParams.get("registrationSession");

    if (!registrationSessionInStorage && registrationSessionParam === "true") {
      // If not in storage but in query param, set it in storage
      localStorage.setItem("registrationSession", "true");
      setSessionError(null); // Clear the error if the session is now set
    } else if (!registrationSessionInStorage) {
      // If not in storage and not in query param, show the error
      setSessionError(
        "Registration session not found. Please start registration again."
      );
    } else {
       // If already in storage, clear any session error
       setSessionError(null);
    }
  }, [searchParams]); // Depend on searchParams to re-run if query params change

  const form = useForm<UserInfoFormData>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
  });

  const { date, setDate } = useDatePicker(form.getValues("dateOfBirth"));

  useEffect(() => {
    if (date) {
      form.setValue("dateOfBirth", date.toISOString(), {
        shouldValidate: true,
      });
    }
  }, [date, form]);

  const handleSubmit: SubmitHandler<UserInfoFormData> = useCallback(
    async (values) => {
      setIsSubmitting(true);
      setAnnouncement("Submitting your information...");
      try {
        await handleUserInfoSubmit(values, onSubmit);
        setAnnouncement("Information submitted successfully!");
      } catch (error) {
        console.error("Form submission error:", error);
        setGeneralError(""); // Clear any general errors before displaying field errors

        if (typeof error === 'object' && error !== null && 'type' in error && error.type === 'apiError' && 'data' in error && typeof error.data === 'object' && error.data !== null && 'error'
           in error.data && error.data.error === "Username already taken") {
          // Handle username already taken error
          form.setError("username", { message: error.data.error });
          setAnnouncement("Error: Username already taken.");
        } else if (error instanceof Error) {
          if (error.message.includes("session")) {
            setSessionError(error.message);
            setAnnouncement("Error: " + error.message);
          } else {
             // Handle other generic errors from handleUserInfoSubmit
             setGeneralError(error.message);
             setAnnouncement("Error: " + error.message);
          }
        } else {
           // Handle unexpected error types
           setGeneralError("An unexpected error occurred.");
           setAnnouncement("An unexpected error occurred.");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, form]
  );

  const formContent = (
    <ShadcnForm {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
        noValidate
        aria-label="User information form"
      >
        {/* Status announcement for screen readers */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <InputUsername
              field={field}
              error={form.formState.errors.username}
              aria-required="true"
              aria-invalid={!!form.formState.errors.username}
              aria-describedby={
                form.formState.errors.username ? "username-error" : undefined
              }
            />
          )}
        />

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <InputFirstName
              field={field}
              error={form.formState.errors.firstName}
              aria-required="true"
              aria-invalid={!!form.formState.errors.firstName}
              aria-describedby={
                form.formState.errors.firstName ? "firstName-error" : undefined
              }
            />
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <InputLastName
              field={field}
              error={form.formState.errors.lastName}
              aria-required="true"
              aria-invalid={!!form.formState.errors.lastName}
              aria-describedby={
                form.formState.errors.lastName ? "lastName-error" : undefined
              }
            />
          )}
        />

        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <InputMobileNumber
              field={field}
              error={form.formState.errors.contactNumber}
              aria-required="true"
              aria-invalid={!!form.formState.errors.contactNumber}
              aria-describedby={
                form.formState.errors.contactNumber
                  ? "contactNumber-error"
                  : undefined
              }
            />
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={() => (
            <InputBirthDate
              value={date}
              setValue={setDate}
              error={form.formState.errors.dateOfBirth?.message}
              aria-required="true"
              aria-invalid={!!form.formState.errors.dateOfBirth}
              aria-describedby={
                form.formState.errors.dateOfBirth
                  ? "dateOfBirth-error"
                  : undefined
              }
            />
          )}
        />

        <AnimatePresence mode="wait">
          {sessionError && (
            <ErrorMessage
              message={sessionError}
              className="text-red-800 border border-red-700 bg-red-100/50 rounded-md p-3 mb-2 text-sm font-medium animate-shake"
              id="session-error"
            />
          )}
          {validationError && (
            <ErrorMessage message={validationError} id="validation-error" />
          )}
          {generalError && (
             <ErrorMessage
               message={generalError}
               className="text-red-800 border border-red-700 bg-red-100/50 rounded-md p-3 mb-2 text-sm font-medium animate-shake"
               id="general-error"
             />
          )}
          {error && (
            <ErrorMessage
              message={error}
              className="text-red-800 border border-red-700 bg-red-100/50 rounded-md p-3 mb-2 text-sm font-medium animate-shake"
              id="form-error"
            />
          )}
          {form.formState.errors.root && (
            <ErrorMessage
              message={form.formState.errors.root.message || ""}
              id="root-error"
            />
          )}
        </AnimatePresence>

        <Button
          type="submit"
          variant="blue"
          disabled={
            isLoading ||
            isSubmitting ||
            !!sessionError ||
            !form.formState.isValid
          }
          aria-busy={isLoading || isSubmitting}
          aria-disabled={
            isLoading ||
            isSubmitting ||
            !!sessionError ||
            !form.formState.isValid
          }
          className={`relative w-full h-10 text-base font-medium ${
            isLoading ||
            isSubmitting ||
            !!sessionError ||
            !form.formState.isValid
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {isLoading || isSubmitting ? (
            <LoadingSpinner loadingText="Saving your information..." />
          ) : (
            "Continue"
          )}
        </Button>
      </form>
    </ShadcnForm>
  );

  return (
    <>
      <Head>
        <title>Complete Your Profile - BaybayInscribe</title>
        <meta
          name="description"
          content="Complete your profile information to continue with BaybayInscribe registration"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main
        className="flex flex-col items-center z-20 w-full max-w-11/12 mx-auto my-6"
        role="main"
        aria-label="User profile completion form"
      >
        <Card
          className="w-full max-w-md bg-neutral-white border border-blue-400 shadow-xl rounded-xl z-30 relative gap-3"
          role="form"
          aria-label="User information form"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-400 text-2xl font-bold">
                Complete Your Profile
              </CardTitle>
            </div>
            <CardDescription className="text-grey-300 mt-2">
              Please provide your details to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="max-w-full">
            {formContent}
          </CardContent>
        </Card>
      </main>
    </>
  );
};
