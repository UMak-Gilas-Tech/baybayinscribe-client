import { authClient } from "../../app/lib/auth-client";
import { toast } from "sonner";

interface SocialHandlerProps {
  setLoginError: (error: string) => void;
  callbackURL: string;
}

export const createSocialHandlers = ({
  setLoginError,
  callbackURL,
}: SocialHandlerProps) => {
  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });
      toast.success("Successfully signed in with Google! Please wait...");
    } catch {
      const errorMessage = "Failed to sign in with Google. Please try again.";
      toast.error(errorMessage);
      setLoginError(errorMessage);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "facebook",
        callbackURL,
      });
      toast.success("Successfully signed in with Facebook! Please wait...");
    } catch {
      const errorMessage = "Failed to sign in with Facebook. Please try again.";
      toast.error(errorMessage);
      setLoginError(errorMessage);
    }
  };

  return {
    handleGoogleSignIn,
    handleFacebookSignIn,
  };
};
