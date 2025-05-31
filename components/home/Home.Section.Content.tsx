import React from "react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import { SeeMoreButton } from "./SeeMoreButton";
import { useDragScroll } from "@/hooks/useDragScroll";
import { SkeletonCard } from "./cards/SkeletonCard";
import { NoContentCard } from "./cards/NoContentCard";
import { GuideCard } from "./cards/GuideCard";

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
  const {
    scrollRef,
    isDragging,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseLeave,
  } = useDragScroll();

  return (
    <section className={cn("mb-8 w-full", className)}>
      <SectionHeader title={title} seeMoreHref={seeMoreHref} />
      <div
        ref={scrollRef}
        className="w-full max-h-[600px] overflow-y-auto sm:max-h-none sm:overflow-x-auto sm:cursor-grab active:sm:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="p-0">
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
                    return (
                      <div
                        key={key}
                        className={cn(
                          "sm:transition-all duration-200",
                          isDragging && "sm:opacity-70 sm:scale-[0.98]"
                        )}
                      >
                        {renderItem(item)}
                      </div>
                    );
                  })
                ) : (
                  <NoContentCard message={emptyMessage} />
                )}
                {items && items.length <= 3 && items.length > 0 && (
                  <article
                    className={cn(
                      "w-full sm:w-56 flex-shrink-0 sm:transition-all duration-200",
                      isDragging && "sm:opacity-70 sm:scale-[0.98]"
                    )}
                  >
                    <GuideCard
                      title="Coming Soon"
                      description={`New ${title} are on their way. Stay tuned!`}
                      href="#"
                      image="/images/baybayin.comingsoon.png"
                      isComingSoon={true}
                    />
                  </article>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {items && items.length > 0 && <SeeMoreButton href={seeMoreHref} />}
    </section>
  );
}
