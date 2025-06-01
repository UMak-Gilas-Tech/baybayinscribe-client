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
            "sm:flex-row sm:space-x-4 sm:space-y-0 sm:pb-2 sm:pt-4"
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
                <>
                  {items.map((item) => {
                    const key =
                      item.id ||
                      item.metadata?.quiz_id ||
                      Math.random().toString();
                    return <div key={key}>{renderItem(item)}</div>;
                  })}
                  {items.length <= 4 && ( // 4 is the number of cards in the row
                    <article className="w-full sm:min-w-[300px] sm:max-w-[300px] flex-shrink-0 h-full">
                      <HomeCard
                        title="More coming soon!"
                        description="We're working on new lessons and quizzes to help you learn Baybayin better. Check back soon!"
                        href="#"
                        isComingSoon={true}
                        buttonText="Coming Soon"
                        className="opacity-80"
                      />
                    </article>
                  )}
                </>
              ) : (
                <NoContentCard
                  type={
                    title.toLowerCase().includes("lesson") ? "lesson" : "quiz"
                  }
                  ariaLabel={emptyMessage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
