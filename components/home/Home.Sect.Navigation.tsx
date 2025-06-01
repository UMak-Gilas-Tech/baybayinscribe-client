import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionNavigationProps {
  title: string;
  seeMoreHref: string;
  className?: string;
}

export function SectionNavigation({
  title,
  seeMoreHref,
  className,
}: SectionNavigationProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop Header */}
      <header className="flex items-center justify-between mb-4 w-full align-middle sm:mt-12">
        <h2 className="text-3xl font-medium text-card-foreground uppercase mx-auto sm:mx-0">
          {title}
        </h2>
        <nav>
          <Link
            href={seeMoreHref}
            className="hidden sm:block text-xs text-card-foreground font-medium bg-secondary hover:bg-secondary/90 rounded-md px-4 py-2 transition-colors"
          >
            See more
          </Link>
        </nav>
      </header>

      {/* Mobile Button */}
      <nav className="flex justify-center mt-2 mb-4 sm:hidden">
        <Link
          href={seeMoreHref}
          className="inline-block px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium shadow hover:bg-primary/90 transition-colors"
        >
          See More
        </Link>
      </nav>
    </div>
  );
}
