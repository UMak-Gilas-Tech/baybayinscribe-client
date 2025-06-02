import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { BookText, ChevronRight, Clock } from "lucide-react";

const CARD_STYLES = {
  container: "transition-all duration-500",
  disabled: "cursor-not-allowed pointer-events-auto",
  card: {
    base: "relative pr-4 sm:pr-0 mb-6 sm:mb-0 w-full flex-1 flex flex-row items-center overflow-hidden group",
    size: "sm:max-h-[459px] sm:min-h-[459px] sm:min-w-[300px] sm:flex-col sm:items-stretch max-h-[380px]",
    animation:
      "transition-all duration-500 hover:-translate-y-2 active:translate-y-0 active:shadow-none active:scale-95",
    disabled:
      "opacity-75 hover:translate-y-0 active:translate-y-0 active:shadow-none active:scale-100",
  },
  content:
    "relative ps-4 sm:px-4 flex gap-x-3 items-center sm:flex-col sm:flex-1 sm:gap-y-6",
  imageContainer:
    "relative flex items-center justify-center sm:bg-blue-900 sm:w-full sm:h-[200px]",
  iconContainer: "w-fit h-fit sm:w-12 sm:h-12 flex items-center justify-center",
  comingSoon: {
    container: "flex flex-col items-center justify-center gap-1",
    icon: "text-blue-400 w-9 h-9",
    text: "text-xs text-blue-400 font-medium sr-only",
  },
  title: {
    base: "font-semibold text-xl group-hover:text-blue-300 group-hover:font-bold group-hover:transition-all group-hover:duration-500",
    disabled: "group-hover:text-inherit group-hover:font-semibold",
    clamp: "line-clamp-1",
  },
  description: "text-base text-grey-300 line-clamp-3 mt-1.5 sm:mt-0",
  button: {
    container: "sm:mx-4 sm:mb-4",
    base: "w-fit h-fit py-2 text-center rounded-lg font-medium text-neutral-white duration-500 transition-all",
    size: "sm:w-full sm:h-10 p-0 sm:py-2 ml-2 sm:ml-0",
    disabled:
      "sm:bg-blue-500/75 text-blue-900/60 cursor-not-allowed hover:bg-blue-500/75",
    enabled:
      "bg-transparent sm:bg-blue-300 sm:group-hover:bg-blue-400 sm:group-hover:text-blue-900",
    chevron: {
      base: "text-blue-300 sm:hidden -ml-4",
      disabled: "opacity-50",
    },
  },
} as const;

interface NavCardProps {
  title: string;
  description: string;
  href: string;
  buttonText?: string;
  image?: string;
  isComingSoon?: boolean;
  clampTitle?: boolean;
  className?: string;
}

export function HomeCard({
  title,
  description,
  href,
  buttonText = "Start Learning",
  image,
  isComingSoon = false,
  clampTitle = false,
  className,
}: NavCardProps) {
  const cardId = `home-card-${title.toLowerCase().replace(/\s+/g, "-")}`;
  const buttonId = `${cardId}-button`;

  return (
    <Link
      href={isComingSoon ? "#" : href}
      className={cn(
        CARD_STYLES.container,
        isComingSoon && CARD_STYLES.disabled
      )}
      tabIndex={isComingSoon ? -1 : 0}
      aria-disabled={isComingSoon}
      aria-label={`${title} - ${description}`}
      id={cardId}
    >
      <Card
        className={cn(
          CARD_STYLES.card.base,
          CARD_STYLES.card.size,
          CARD_STYLES.card.animation,
          isComingSoon && CARD_STYLES.card.disabled,
          className
        )}
      >
        <CardContent className={CARD_STYLES.content}>
          <div className={CARD_STYLES.imageContainer}>
            {image ? (
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={`${title} thumbnail`}
                  className="object-cover border-bl border-1"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                  loading="lazy"
                />
              </div>
            ) : (
              <div className={CARD_STYLES.iconContainer}>
                {isComingSoon ? (
                  <div className={CARD_STYLES.comingSoon.container}>
                    <Clock
                      className={CARD_STYLES.comingSoon.icon}
                      aria-hidden="true"
                      strokeWidth={1.5}
                    />
                    <span className={CARD_STYLES.comingSoon.text}>
                      Coming Soon
                    </span>
                  </div>
                ) : (
                  <BookText
                    className={CARD_STYLES.comingSoon.icon}
                    aria-hidden="true"
                    strokeWidth={1.5}
                  />
                )}
              </div>
            )}
          </div>
          <div className="min-w-fit sm:min-w-auto">
            <CardTitle
              className={cn(
                CARD_STYLES.title.base,
                isComingSoon && CARD_STYLES.title.disabled,
                clampTitle && CARD_STYLES.title.clamp
              )}
            >
              {title}
            </CardTitle>
            <CardDescription className={CARD_STYLES.description}>
              {description}
            </CardDescription>
          </div>
        </CardContent>
        <div className={CARD_STYLES.button.container}>
          <div
            className={cn(
              CARD_STYLES.button.base,
              CARD_STYLES.button.size,
              isComingSoon
                ? CARD_STYLES.button.disabled
                : CARD_STYLES.button.enabled
            )}
            id={buttonId}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="hidden sm:inline">
                {isComingSoon ? "Coming Soon" : buttonText}
              </span>
              <ChevronRight
                className={cn(
                  CARD_STYLES.button.chevron.base,
                  isComingSoon && CARD_STYLES.button.chevron.disabled
                )}
                size={46}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function ComingSoonCard(props: Omit<NavCardProps, "isComingSoon">) {
  return <HomeCard {...props} isComingSoon={true} />;
}
