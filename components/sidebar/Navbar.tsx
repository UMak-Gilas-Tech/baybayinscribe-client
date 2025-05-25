"use client";

import React from "react";
import Image from "next/image";
import { useSidebar } from "../ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function TopNavbar() {
  const { toggleSidebar, state } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogoClick = () => {
    if (pathname?.startsWith("/admin")) {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="bg-blue-500 border-b-2 border-blue-400 h-16 flex items-center px-4 shadow-md relative">
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Image
                src={
                  pathname?.startsWith("/admin")
                    ? "/images/BaybayInscribe-AppIcon-old.png"
                    : "/images/BaybayInscribe-AppIcon.png"
                }
                alt="Logo"
                width={42}
                height={42}
                className="rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer hover:scale-105 transition-all duration-300 hover:animate-out"
                onClick={handleLogoClick}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Go to {pathname?.startsWith("/admin") ? "Admin" : "User"}{" "}
                Dashboard
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="ml-auto flex items-center">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-white cursor-pointer text-blue-300 hover:bg-blue-800 transition-all duration-300 hover:scale-105 active:scale-95 border-blue-400 border-1.25"
        >
          <span className="sr-only">Toggle Sidebar</span>
          <Menu
            className={`w-5 h-5 transition-transform duration-300 ${
              state === "expanded" ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}
