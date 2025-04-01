"use client";

import React from "react";
import Image from "next/image";
import { NavUser } from "./nav.user";

export default function TopNavbar() {
  const user = {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
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
        <NavUser user={user} />
      </div>
    </div>
  );
}