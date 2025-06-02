import { useCallback, useMemo } from "react";
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
import { SocialLoginButtons } from "../components/SocialLoginButtons";
import { PasswordInput } from "../components/InputPassword";
import { TermsServices } from "@/components/auth/TermsServices";
import { motion, AnimatePresence } from "framer-motion";
import { memo } from "react";
import { AccountHelper } from "../components/AccountHelper";
import {
  createRegistrationSchema,
  checkPasswordStrength,
  PasswordStrength,
} from "@/lib/auth/passwordValidation";
import { BackButton } from "../components/BackButton";

// Use the modular schema
const registerSchema = createRegistrationSchema();

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (values: RegisterFormData) => Promise<void>;
  onFacebookSignIn: () => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  // onRedditSignIn: () => Promise<void>;
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

export const RegisterForm = ({
  onSubmit,
  onFacebookSignIn,
  onGoogleSignIn,
  // onRedditSignIn,
  error,
  loginError,
  validationError,
  isLoading,
}: RegisterFormProps) => {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
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
    async (values: RegisterFormData) => {
      await onSubmit(values);
    },
    [onSubmit]
  );

  // Memoize social login handlers
  const memoizedSocialHandlers = useMemo(
    () => ({
      onFacebookSignIn,
      onGoogleSignIn,
      // onRedditSignIn,
    }),
    [onFacebookSignIn, onGoogleSignIn /*onRedditSignIn*/]
  );

  return (
    <div className="flex flex-col items-center z-20 w-full max-w-11/12">
      {/* --- Register Form Card --- */}
      <Card
        className="w-full max-w-md bg-neutral-white border border-blue-400 shadow-xl rounded-xl z-30 relative gap-3"
        role="form"
        aria-label="Registration form"
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-400 text-2xl font-bold">
              Create Account
            </CardTitle>
            <BackButton />
          </div>
          <CardDescription className="text-grey-300 mt-2">
            Join us today and start your journey
          </CardDescription>
        </CardHeader>
        <CardContent className="max-w-full">
          <SocialLoginButtons
            {...memoizedSocialHandlers}
            message="Or create an account with email"
          />

          <ShadcnForm {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
              noValidate
            >
              <EmailInput />
              <div className="space-y-2">
                <PasswordInput
                  name="password"
                  label="Password"
                  placeholder="Create a strong password"
                />
                {passwordStrength && (
                  <p
                    className={`text-sm ${getStrengthColor(passwordStrength)}`}
                  >
                    Password Strength: {passwordStrength}
                  </p>
                )}
              </div>
              <PasswordInput
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                isConfirmPassword
                passwordFieldName="password"
              />

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

              <div className="flex-col space-y-1.5">
                <Button
                  type="submit"
                  variant="blue"
                  disabled={isLoading}
                  aria-busy={isLoading}
                  className="relative w-full h-10 text-base font-medium"
                >
                  {isLoading ? (
                    <LoadingSpinner loadingText="Creating your account..." />
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <AccountHelper />
              </div>
            </form>
          </ShadcnForm>
          <TermsServices mode="info" />
        </CardContent>
      </Card>
    </div>
  );
};
