import { authClient } from "../../app/lib/auth-client";

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
    } catch {
      setLoginError("Failed to sign in with Google. Please try again.");
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "facebook",
        callbackURL,
      });
    } catch {
      setLoginError("Failed to sign in with Facebook. Please try again.");
    }
  };

  return {
    handleGoogleSignIn,
    handleFacebookSignIn,
  };
};
