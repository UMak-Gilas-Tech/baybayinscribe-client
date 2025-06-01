import React from "react";
import Image from "next/image";

interface BackgroundProps {
  children: React.ReactNode;
}

export const Background = ({ children }: BackgroundProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-clip">
      <Image
        src="/images/bg.login.webp"
        alt="Login background"
        fill
        priority
        quality={85}
        className="object-cover -z-10"
        sizes="100vw"
      />
      {children}
      {/* --- Title (Desktop Only) --- */}
      <div className="flex flex-col items-center fixed top-2 left-5 z-50 pointer-events-none">
        <div className="flex flex-row items-center h-fit gap-2 bg-blue-200/25 p-2.5 rounded-md">
          <Image
            src="/images/BaybayInscribe-AppIcon-old.webp"
            alt="BaybayInscribe App Icon"
            className="rounded-md"
            width={35}
            height={35}
            priority
          />
          <h1 className="text-3xl lg:text-4xl font-medium font-sans text-neutral-white">
            BaybayInscribe
          </h1>
        </div>
      </div>
      <div className="flex flex-col items-center fixed top-7/12 left-6/12 -z-0 -rotate-[20deg] scale-[280%] pointer-events-none">
        <h2 className="text-8xl xl:text-[130px] text-blue-900/10 font-baybayin">
          mtuto
        </h2>
        <p className="text-2xl text-blue-900/10 font-medium">ma . tu . to</p>
      </div>
      <div className="text-blue-900/40 text-xs font-medium fixed bottom-2 right-2">
        v1.0 Alpha
      </div>
    </div>
  );
};
