import { useRouter } from "next/navigation";
import { authClient } from "../../../lib/auth-client";
import { createRegistrationSchema } from "@/lib/auth/passwordValidation";
import { createSocialHandlers } from "../../../../lib/auth/socialHandlers";
import { z } from "zod";

type RegisterFormData = z.infer<ReturnType<typeof createRegistrationSchema>>;

export const createRegisterHandlers = ({
  router,
  setError,
  setLoginError,
  setValidationError,
  setIsLoading,
}: {
  router: ReturnType<typeof useRouter>;
  setError: (error: string) => void;
  setLoginError: (error: string) => void;
  setValidationError: (error: string) => void;
  setIsLoading: (loading: boolean) => void;
}) => {
  const handleRegister = async (values: RegisterFormData) => {
    setLoginError("");
    setError("");
    setValidationError("");
    setIsLoading(true);

    // If all fields are empty
    if (!values.email && !values.password && !values.confirmPassword) {
      setValidationError("Enter email and password credentials");
      setIsLoading(false);
      return;
    }

    // Validate the form data
    const validationResult = createRegistrationSchema().safeParse(values);
    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      const firstError = errors[0];
      setValidationError(firstError.message);
      setIsLoading(false);
      return;
    }

    try {
      const response = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: "New user",
      });

      console.log("authClient.signUp.email response:", response);

      if (response?.error) {
        console.error("Signup error:", response.error);
        setError(response.error.message || "Registration failed");
        setIsLoading(false);
      } else {
        // Registration successful
        localStorage.setItem("registrationSession", "true"); // Set registration session
        router.push("/auth/register/userinfo");
        setIsLoading(false);
      }
    } catch {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const { handleGoogleSignIn, handleFacebookSignIn } = createSocialHandlers({
    setLoginError,
    callbackURL: "/",
  });

  return {
    handleRegister,
    handleGoogleSignIn,
    handleFacebookSignIn,
  };
};
