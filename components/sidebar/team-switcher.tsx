"use client";

import React from "react";
import { GalleryVerticalEnd } from "lucide-react";

export function TeamSwitcher() {
  const user = {
    name: "Username Here",
    role: "User Role Here",
    avatar: GalleryVerticalEnd,
  };

  return (
    <div className="flex items-center gap-2 p-2">
      <user.avatar className="h-6 w-6" />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{user.name}</span>
        <span className="text-xs text-gray-500">{user.role}</span>
      </div>
    </div>
  );
} 