import { authClient } from "../../../lib/auth-client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { createSocialHandlers } from "../../../../lib/auth/socialHandlers";
import { toast } from "sonner";

interface LoginValues {
  email: string;
  password: string;
}

interface HandlerProps {
  router: AppRouterInstance;
  setLoginError: (error: string) => void;
  setValidationError: (error: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export const createLoginHandlers = ({
  router,
  setLoginError,
  setValidationError,
  setIsLoading,
}: HandlerProps) => {
  const handleLogin = async (values: LoginValues) => {
    setLoginError("");
    setValidationError("");
    setIsLoading(true);

    try {
      await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
          callbackURL: "/",
        },
        {
          onSuccess: () => {
            toast.success("Successfully signed in! Please wait...");
            router.push("/");
          },
          onError: (ctx) => {
            setLoginError(ctx.error?.message || "This account does not exist.");
            setIsLoading(false);
          },
        }
      );
    } catch {
      setLoginError("Failed to sign in. Please try again.");
      setIsLoading(false);
    }
  };

  const { handleGoogleSignIn, /*handleFacebookSignIn,*/ handleRedditSignIn } = createSocialHandlers({
    setLoginError,
    callbackURL: "/",
  });

  return {
    handleLogin,
    handleGoogleSignIn,
    // handleFacebookSignIn,
    handleRedditSignIn,
  };
};