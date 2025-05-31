"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Background from "@/components/background";
import { Button } from "@/components/ui/button";

const MobileBlockedScreen = () => {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <Background />
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <div className="bg-neutral-white  min-w-72  min-h-fit rounded-2xl shadow-xl p-8 px-4 max-w-2xl gap-y-4 w-full flex flex-col items-center border border-[var(--color-blue-800)]">
          <Image
            src="/images/ai-whale-laptop.png"
            alt="Whale with laptop"
            width={203}
            height={206}
            priority
          />
          <h1 className="text-3xl font-bold text-blue-300 text-center mb-2">
            Oops! This screen needs more space.
          </h1>
          <p className="text-blue-200 text-center mb-6 text-xl leading-8 tracking-normal">
            For your security and the best experience. Admin Panel is only
            available on larger devices. Please switch to a laptop or desktop to
            continue.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="cursor-pointer bg-[var(--color-blue-400)] hover:bg-[var(--color-blue-300)] text-blue-900 font-medium rounded-lg py-4 transition-colors
            min-w-[249px] min-h-[60px] border-1 border-blue-600 text-xl"
          >
            Go Back to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileBlockedScreen;
