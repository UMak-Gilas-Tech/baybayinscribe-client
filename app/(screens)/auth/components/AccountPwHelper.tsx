import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AccountPwHelperProps {
  rememberMe: boolean;
  onRememberMeChange: (checked: boolean) => void;
}

export const AccountPwHelper = ({
  rememberMe,
  onRememberMeChange,
}: AccountPwHelperProps) => {
  return (
    <div className="w-full max-w-md mt-2 mb-4 text-sm text-center z-30">
      <div className="flex flex-col xs:flex-row gap-y-4 sm:gap-y-0 justify-between items-start mb-4 text-grey-300">
        <div className="flex items-center space-x-2 min-h-5">
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onCheckedChange={(checked) =>
              onRememberMeChange(checked as boolean)
            }
            className="border-blue-400 data-[state=checked]:bg-blue-400 data-[state=checked]:text-white"
          />
          <Label
            htmlFor="remember-me"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </Label>
        </div>

        <Link
          href="/auth/register/resetpassword"
          className="underline text-grey-200/80 hover:no-underline hover:text-grey-300"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
};
