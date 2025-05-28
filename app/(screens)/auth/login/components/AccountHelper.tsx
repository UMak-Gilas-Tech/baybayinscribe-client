import Link from "next/link";
import { usePathname } from "next/navigation";

export const AuthFooterLink = () => {
  const pathname = usePathname();
  const isRegisterPage = pathname?.includes("/auth/register");

  const linkText = isRegisterPage ? "Login here" : "Sign up";
  const descriptionText = isRegisterPage
    ? "Already have an account?"
    : "Don't have an account?";

  return (
    <span className="text-grey-300 text-sm mx-auto w-full">
      {descriptionText}{" "}
      <Link
        href={isRegisterPage ? "/auth/login" : "/auth/register"}
        className="underline text-grey-200/80 hover:no-underline hover:text-grey-300 transition-colors duration-200"
      >
        {linkText}
      </Link>
    </span>
  );
};
