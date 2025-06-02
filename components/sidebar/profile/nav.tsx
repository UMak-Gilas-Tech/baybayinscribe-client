"use client";

import React from "react";
import { Settings, User, LogOut } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";

export function ProfileNav() {
  const profileItems = [
    {
      title: "Edit Profile",
      url: "/profile",
      icon: User,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Logout",
      url: "/logout",
      icon: LogOut,
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Profile / Settings</SidebarGroupLabel>
      <SidebarMenu>
        {profileItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <a href={item.url} className="flex items-center">
                <item.icon className="shrink-0" />
                <span className="ml-2 group-data-[collapsible=icon]:hidden">
                  {item.title}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
