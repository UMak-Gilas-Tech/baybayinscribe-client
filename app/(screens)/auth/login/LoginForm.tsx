import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { EmailInput } from "../components/InputEmail";
import { Form as ShadcnForm } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TermsServices } from "@/components/auth/TermsServices";
import { SocialLoginButtons } from "../components/SocialLoginButtons";
import { PasswordInput } from "../components/InputPassword";
import { AccountHelper } from "../components/AccountHelper";
import { AccountPwHelper } from "../components/AccountPwHelper";

// Memoize the schema to prevent recreation on each render
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (values: LoginFormData & { rememberMe: boolean }) => Promise<void>;
  onFacebookSignIn: () => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  error: string;
  loginError: string;
  validationError?: string;
  isLoading: boolean;
}

// Memoized error message component to prevent unnecessary re-renders
const ErrorMessage = memo(
  ({ message, className }: { message: string; className?: string }) => (
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`text-red-500 bg-red-100 mb-4 ${className || ""}`}
      role="alert"
    >
      {message}
    </motion.p>
  )
);

ErrorMessage.displayName = "ErrorMessage";

export const LoginForm = ({
  onSubmit,
  onFacebookSignIn,
  onGoogleSignIn,
  error,
  loginError,
  validationError,
  isLoading,
}: LoginFormProps) => {
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  // Submit handler with remember me
  const handleSubmit = useCallback(
    async (values: LoginFormData) => {
      await onSubmit({ ...values, rememberMe });
    },
    [onSubmit, rememberMe]
  );

  // Memoize social login handlers
  const memoizedSocialHandlers = useMemo(
    () => ({
      onFacebookSignIn,
      onGoogleSignIn,
    }),
    [onFacebookSignIn, onGoogleSignIn]
  );

  return (
    <div className="flex flex-col items-center z-20 w-full max-w-11/12">
      {/* --- Login Form Card --- */}
      <Card
        className="w-full max-w-md bg-neutral-white border border-blue-400 shadow-xl rounded-xl z-30 relative gap-3"
        role="form"
        aria-label="Login form"
      >
        <CardHeader>
          <CardTitle className="text-blue-400 text-2xl font-bold">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-grey-300 mt-2">
            Sign in to continue your journey with BaybayInscribe
          </CardDescription>
        </CardHeader>
        <CardContent className="max-w-full">
          <SocialLoginButtons {...memoizedSocialHandlers} />

          <ShadcnForm {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
              noValidate
            >
              <EmailInput />
              <PasswordInput />

              <AnimatePresence mode="wait">
                {validationError && <ErrorMessage message={validationError} />}
                {loginError && (
                  <ErrorMessage
                    message={loginError}
                    className="text-red-800 border border-red-700 bg-red-100/50 rounded-md p-3 mb-2 text-sm font-medium animate-shake"
                  />
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
              <AccountPwHelper
                rememberMe={rememberMe}
                onRememberMeChange={setRememberMe}
              />
              <Button
                type="submit"
                variant="blue"
                disabled={isLoading}
                aria-busy={isLoading}
                className="relative w-full h-10 text-base font-medium"
              >
                {isLoading ? (
                  <LoadingSpinner loadingText="Signing in..." />
                ) : (
                  "Sign In"
                )}
              </Button>

              <AccountHelper />
            </form>
          </ShadcnForm>
        </CardContent>
        <TermsServices mode="info" />
      </Card>
    </div>
  );
};
