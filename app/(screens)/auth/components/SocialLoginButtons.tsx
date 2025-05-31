// import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FaReddit } from "react-icons/fa";

interface SocialLoginButtonsProps {
  // onFacebookSignIn: () => void;
  onGoogleSignIn: () => void;
  onRedditSignIn: () => void;
  message?: string;
}

export const SocialLoginButtons = ({
  // onFacebookSignIn,
  onGoogleSignIn,
  onRedditSignIn,
  message = "Or sign in with email",
}: SocialLoginButtonsProps) => {
  return (
    <>
      {/* Social Login Buttons */}
      <div className="flex gap-4 my-3">
        {/* <Button
          variant="outline"
          className="flex-1 flex items-center gap-2 border-blue-400 text-blue-400 bg-neutral-white hover:bg-blue-900 transition"
          onClick={onFacebookSignIn}
          type="button"
        >
          <FaFacebook size={20} />
          <span className="hidden sm:inline">Facebook</span>
        </Button> */}
        <Button
          variant="outline"
          className="flex-1 flex items-center gap-2 border-blue-400 text-blue-400 bg-neutral-white hover:bg-blue-900 transition"
          onClick={onGoogleSignIn}
          type="button"
        >
          <FcGoogle size={20} />
          <span className="hidden sm:inline">Google</span>
        </Button>
        <Button
          variant="outline"
          className="flex-1 flex items-center gap-2 border-blue-400 text-blue-400 bg-neutral-white hover:bg-blue-900 transition"
          onClick={onRedditSignIn}
          type="button"
        >
          <FaReddit size={20} />
          <span className="hidden sm:inline">Reddit</span>
        </Button>
      </div>

      {/* Divider */}
      <div className="flex items-center my-4 w-full justify-center">
        <Separator className="flex-1 bg-blue-400" />
        <span className="px-4 text-xs font-medium text-grey-300 text-center whitespace-nowrap">
          {message}
        </span>
        <Separator className="flex-1 bg-blue-400" />
      </div>
    </>
  );
};
