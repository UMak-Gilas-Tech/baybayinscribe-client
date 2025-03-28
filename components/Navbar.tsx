"use client";

import React from "react";
import { AlignJustify, UserCircle } from "lucide-react";

export default function TopNavbar() {
  return (
    <div className="bg-[#576EB6] p-4 ">
      <div className=" mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2">
            <AlignJustify className="w-8 h-8 text-orange-200" />
          </button>
          <div className="flex items-center gap-4">
            <img
              src="images/BaybayInscribe-AppIcon.png"
              alt="Logo"
              className="w-12 h-12 rounded-md shadow"
            />
            <span className="text-orange-200 text-xl font-bold font-sans">
              BaybayInscribe
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Simplified menu icon with three outlined boxes */}
          <div className="flex flex-col gap-1">
            <UserCircle className="w-full h-10 text-orange-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
