import Link from "next/link";

export const FooterLinks = () => {
  return (
    <div className="w-full max-w-md mt-4 text-sm text-center text-neutral-black z-30">
      <div className="flex flex-col xs:flex-row gap-y-1.5 sm:gap-y-0 justify-between mb-4 text-neutral-white">
        <span>
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="underline text-yellow-300 hover:no-underline font-medium"
          >
            Sign up
          </Link>
        </span>
        <Link
          href="/auth/forgotpassword"
          className="underline text-yellow-300 hover:no-underline font-medium"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
};
