import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SocialLoginButtonsProps {
  onFacebookSignIn: () => void;
  onGoogleSignIn: () => void;
}

export const SocialLoginButtons = ({
  onFacebookSignIn,
  onGoogleSignIn,
}: SocialLoginButtonsProps) => {
  return (
    <>
      {/* Social Login Buttons */}
      <div className="flex gap-4 mb-6">
        <Button
          variant="outline"
          className="flex-1 flex items-center gap-2 border-blue-400 text-blue-400 bg-neutral-white hover:bg-blue-900 transition"
          onClick={onFacebookSignIn}
          type="button"
        >
          <FaFacebook size={20} />
          <span className="hidden sm:inline">Facebook</span>
        </Button>
        <Button
          variant="outline"
          className="flex-1 flex items-center gap-2 border-blue-400 text-blue-400 bg-neutral-white hover:bg-blue-900 transition"
          onClick={onGoogleSignIn}
          type="button"
        >
          <FcGoogle size={20} />
          <span className="hidden sm:inline">Google</span>
        </Button>
      </div>

      {/* Divider */}
      <div className="flex items-center my-6 w-full justify-center">
        <Separator className="flex-1 bg-blue-400" />
        <span className="px-4 text-sm font-medium text-blue-400 text-center whitespace-nowrap">
          Enter your details below to login
        </span>
        <Separator className="flex-1 bg-blue-400" />
      </div>
    </>
  );
};
