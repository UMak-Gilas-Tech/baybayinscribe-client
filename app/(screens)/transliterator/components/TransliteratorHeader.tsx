"use client";

import Image from "next/image";
import TransliteratorHeaderImage from "@/public/images/TransliteratorHeader.webp";

export function TransliteratorHeader() {
  return (
    <header className="h-24 sm:h-28 md:h-38 my-2 mb-8 sm:my-4 sm:mb-4 md:mb-10 relative -z-0 w-full max-w-screen sm:max-w-[85vw] md:max-w-none">
      <Image
        src={TransliteratorHeaderImage}
        alt="Transliterator Header"
        className="h-full w-auto object-contain mx-auto"
        priority
      />
    </header>
  );
}
