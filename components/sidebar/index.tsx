"use client";

import React from "react";
import { Sidebar } from "../ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { LearningMaterialsNav } from "./learning-materials/nav";
import { ProfileNav } from "./profile/nav";

export function MainSidebar() {
  return (
    <Sidebar collapsible="icon">
      <TeamSwitcher />
      <LearningMaterialsNav />
      <ProfileNav />
    </Sidebar>
  );
} 