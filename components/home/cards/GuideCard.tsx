import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface NavCardProps {
  title: string;
  description: string;
  href: string;
  buttonText?: string;
}

export function GuideCard({
  title,
  description,
  href,
  buttonText = "Start Learning",
  image,
  isComingSoon = false,
}: NavCardProps & { image?: string; isComingSoon?: boolean }) {
  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden shadow-sm h-full flex flex-col",
        !isComingSoon
          ? "bg-card border border-border"
          : "bg-muted/50 border-dashed border-2 border-border opacity-30"
      )}
    >
      <div className="flex-1 flex flex-col sm:flex-row">
        <div className="relative h-44 sm:h-full sm:w-44 bg-secondary/20 flex items-center justify-center p-4">
          {image ? (
            <div className="relative w-full h-full">
              <Image
                src={image}
                alt={title}
                className="object-contain"
                fill
                sizes="(max-width: 768px) 100vw, 224px"
              />
            </div>
          ) : (
            <div className="w-12 h-12 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                  fill="currentColor"
                  className="text-primary"
                />
                <path
                  d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                  fill="currentColor"
                  className="text-primary"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-medium text-card-foreground mb-2">{title}</h3>
          <p className="text-xs text-muted-foreground mb-6 line-clamp-2 flex-1">
            {description}
          </p>
          <div className="mt-auto">
            <Link
              href={href}
              className={cn(
                "block w-full py-2 text-center text-primary-foreground rounded-md text-xs font-medium transition-colors",
                isComingSoon
                  ? "bg-muted cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              )}
              tabIndex={isComingSoon ? -1 : 0}
              aria-disabled={isComingSoon}
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
      {isComingSoon && (
        <div className="bg-background/80 flex items-center justify-center absolute inset-0 cursor-not-allowed"></div>
      )}
    </div>
  );
}
