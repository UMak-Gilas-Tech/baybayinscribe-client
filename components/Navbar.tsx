"use client";

import React from "react";
import { UserCircle } from "lucide-react";

export default function TopNavbar() {
  
  return (
    <div className="bg-[#576EB6] p-2">
      <div className=" mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
        
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 mx-auto">
              <img
                src="images/BaybayInscribe-AppIcon.png"
                alt="Logo"
                className="w-12 h-12 rounded-md shadow"
              />
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
