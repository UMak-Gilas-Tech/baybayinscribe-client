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
import { BookText, ChevronRight } from "lucide-react";

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
    <Link
      href={isComingSoon ? "#" : href}
      className={cn(
        "transition-all duration-500",
        isComingSoon && "pointer-events-none"
      )}
      tabIndex={isComingSoon ? -1 : 0}
      aria-disabled={isComingSoon}
    >
      <Card
        className={cn(
          "relative pr-4 sm:pr-0 mb-6 sm:mb-0 w-full flex-1 flex flex-row items-center overflow-hidden group",
          "sm:max-h-[459px] sm:min-w-[300px] sm:flex-col sm:items-stretch",
          "transition-all duration-500 hover:-translate-y-2  active:translate-y-0 active:shadow-none active:scale-95"
        )}
      >
        <CardContent className="relative ps-4 sm:px-4 flex gap-x-3 items-center sm:flex-col sm:flex-1 sm:gap-y-6">
          <div className="relative flex items-center justify-center sm:bg-blue-900 sm:w-full sm:h-[200px]">
            {image ? (
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={title}
                  className="object-contain"
                  fill
                />
              </div>
            ) : (
              <div className="w-fit h-fit sm:w-12 sm:h-12 flex items-center justify-center">
                <BookText className="text-blue-400 w-9 h-9" />
              </div>
            )}
          </div>
          <div className="min-w-fit  sm:min-w-auto">
            <CardTitle className="font-semibold text-xl group-hover:text-blue-300 group-hover:font-bold group-hover:transition-all group-hover:duration-500 line-clamp-1">
              {title}
            </CardTitle>
            <CardDescription className="text-base text-grey-300 line-clamp-3 mt-1.5 sm:mt-0">
              {description}
            </CardDescription>
          </div>
        </CardContent>
        <div className="sm:mx-4 sm:mb-4">
          <div
            className={cn(
              "w-fit h-fit py-2 text-center rounded-lg font-medium text-neutral-white duration-500 transition-all",
              "sm:w-full sm:h-10 p-0 sm:py-2 ml-2 sm:ml-0",
              isComingSoon
                ? "bg-muted"
                : "bg-transparent sm:bg-blue-300 sm:group-hover:bg-blue-400 sm:group-hover:text-blue-900"
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="hidden sm:inline">{buttonText}</span>
              <ChevronRight
                className=" text-blue-300 sm:hidden -ml-4"
                size={46}
              />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
