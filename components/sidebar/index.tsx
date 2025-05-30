"use client";

import React from "react";
import { Sidebar } from "../ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { HomeMainContentScreen } from "@/components/home/Home.MainContent.Screen";
import { ProfileNav } from "./profile/nav";

export function MainSidebar() {
  return (
    <Sidebar collapsible="icon">
      <TeamSwitcher />
      <HomeMainContentScreen />
      <ProfileNav />
    </Sidebar>
  );
}
