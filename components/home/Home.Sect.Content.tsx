import React from "react";
import { cn } from "@/lib/utils";
import { SectionNavigation } from "./Home.Sect.Navigation";
import { SkeletonCard } from "./cards/SkeletonCard";
import { NoContentCard } from "./cards/NoContentCard";
import { HomeCard } from "./cards/HomeCard";

interface ContentSectionProps<
  T extends { id?: string; metadata?: { quiz_id: string } }
> {
  title: string;
  seeMoreHref: string;
  isLoading: boolean;
  items: T[] | undefined;
  renderItem: (item: T) => React.ReactNode;
  emptyMessage: string;
  className?: string;
}

export function ContentSection<
  T extends { id?: string; metadata?: { quiz_id: string } }
>({
  title,
  seeMoreHref,
  isLoading,
  items,
  renderItem,
  emptyMessage,
  className,
}: ContentSectionProps<T>) {
  return (
    <section className={cn("mb-8 w-full", className)}>
      <SectionNavigation title={title} seeMoreHref={seeMoreHref} />
      <div className="w-full max-h-[600px] overflow-y-auto sm:max-h-none sm:overflow-x-auto">
        <div
          className={cn(
            "flex flex-col gap-4 sm:gap-x-6",
            "sm:flex-row sm:space-x-4 sm:space-y-0 sm:pb-2"
          )}
        >
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              {items && items.length > 0 ? (
                items.map((item) => {
                  const key =
                    item.id ||
                    item.metadata?.quiz_id ||
                    Math.random().toString();
                  return <div key={key}>{renderItem(item)}</div>;
                })
              ) : (
                <NoContentCard message={emptyMessage} />
              )}
              {items && items.length <= 3 && items.length > 0 && (
                <article className="w-full sm:w-56 flex-shrink-0">
                  <HomeCard
                    title="Coming Soon"
                    description={`New ${title} are on their way. Stay tuned!`}
                    href="#"
                    image="/images/baybayin.comingsoon.webp"
                    isComingSoon={true}
                    clampTitle={true}
                  />
                </article>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
