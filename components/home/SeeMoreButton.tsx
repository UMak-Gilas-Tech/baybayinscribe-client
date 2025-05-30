import Link from "next/link";

interface SeeMoreButtonProps {
  href: string;
}

export function SeeMoreButton({ href }: SeeMoreButtonProps) {
  return (
    <nav className="flex justify-center mt-2 mb-4 sm:hidden">
      <Link
        href={href}
        className="inline-block px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium shadow hover:bg-primary/90 transition-colors"
      >
        See More
      </Link>
    </nav>
  );
}
