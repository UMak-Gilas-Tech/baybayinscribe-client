"use client";

import React from "react";
import Image from "next/image";
import { useSidebar } from "../ui/sidebar";

export default function TopNavbar() {
  const { toggleSidebar } = useSidebar();
  const user = {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/images/BaybayInscribe-AppIcon.png"
  };

  return (
    <div className="bg-[#576EB6] h-16 flex items-center px-4 shadow-md relative">

      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Image
          src="/images/BaybayInscribe-AppIcon.png"
          alt="Logo"
          width={48}
          height={48}
          className="rounded-md shadow"
        />
      </div>

      <div className="ml-auto flex items-center">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#576EB6] hover:bg-gray-200 transition-colors"
        >
          <span className="sr-only">Open Sidebar</span>
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full object-cover cursor-pointer"
          />
        </button>
      </div>
    </div>
  );
}