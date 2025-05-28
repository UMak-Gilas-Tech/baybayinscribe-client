import Image from "next/image";
import { ReactNode } from "react";

interface BackgroundProps {
  children: ReactNode;
}

export const Background = ({ children }: BackgroundProps) => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative overflow-clip"
      style={{
        backgroundImage: "url('/images/bg.phone.login.png')",
      }}
    >
      {children}
      {/* --- Title (Desktop Only) --- */}
      <div className="flex flex-col items-center fixed top-2 left-5">
        <div className="flex flex-row items-center h-fit gap-2 bg-blue-200/25 p-2.5 rounded-md">
          <Image
            src="/images/BaybayInscribe-AppIcon-old.png"
            alt="BaybayInscribe"
            className="rounded-md"
            width={35}
            height={35}
          />
          <h1 className="text-3xl lg:text-4xl font-medium font-sans text-neutral-white ">
            BaybayInscribe
          </h1>
        </div>
      </div>

      <div className="flex flex-col items-center fixed top-7/12 left-6/12 -z-0 -rotate-[20deg] scale-[280%]	">
        <h2 className="text-8xl xl:text-[130px] text-blue-900/10 font-medium font-baybayin">
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
