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

  // const handleRedditSignIn = async () => {
  //   try {
  //     console.log('Starting Reddit social login process...');
  //     console.log('Callback URL:', callbackURL);
      
  //     const response = await authClient.signIn.social({
  //       provider: "reddit",
  //       callbackURL,
  //     });
      
  //     console.log('Reddit social login response:', response);
  //     toast.success("Successfully signed in with Reddit! Please wait...");
  //   } catch (error) {
  //     console.error('Reddit social login error:', error);
  //     const errorMessage = "Failed to sign in with Reddit. Please try again.";
  //     toast.error(errorMessage);
  //     setLoginError(errorMessage);
  //   }
  // };

  return {
    handleGoogleSignIn,
    handleFacebookSignIn,
    // handleRedditSignIn,
  };
};
