"use client"
import React from "react";
import { Activity, Bell, Settings } from "lucide-react";

export default function Navrail() {
  return (
    <div className="w-20 h-screen relative bg-[#576EB6] overflow-hidden">
      <div className="w-12 left-6 top-12 absolute inline-flex flex-col justify-start items-start gap-10">
        <div className=" flex items-center justify-center">
          {/* Icon 1 replaced with lucide-react Activity */}
          <Activity size={24} className="text-orange-200" strokeWidth={3} />
        </div>
        <div className=" flex items-center justify-center">
          {/* Icon 2 replaced with lucide-react Bell */}
          <Bell size={24} className="text-orange-200" strokeWidth={3} />
        </div>
        <div className=" flex items-center justify-center">
          {/* Icon 3 replaced with lucide-react Settings */}
          <Settings size={24} className="text-orange-200" strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}
