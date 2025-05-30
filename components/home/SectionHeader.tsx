import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  seeMoreHref: string;
}

export function SectionHeader({ title, seeMoreHref }: SectionHeaderProps) {
  return (
    <header className="flex items-center justify-between mb-4 w-full align-middle sm:mt-12">
      <h2 className="text-3xl font-medium text-card-foreground uppercase">
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
  );
}
