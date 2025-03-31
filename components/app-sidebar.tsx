"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "../components/nav-main"
import { NavProjects1, NavProjects } from "../components/nav-projects"
import { TeamSwitcher } from "../components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "../components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Username Here",
      logo: GalleryVerticalEnd,
      plan: "User Role Here",
    },
    {
      name: "Username 2 Here",
      logo: AudioWaveform,
      plan: "Usere Role 2 Here",
    },
    {
      name: "Username 3 Here",
      logo: Command,
      plan: "User Role 3 Here",
    },
  ],
  navMain: [
    {
      title: "Scanner AI",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Web Cam",
          url: "#",
        },
        {
          title: "Upload Image",
          url: "#",
        },
      ],
    },
    {
      title: "Sketch",
      url: "#",
      icon: Bot,
    },

    {
      title: "Chat AI",
      url: "#",
      icon: BookOpen,
    },
  ],
  projects: [
    {
      name: "Learning",
      url: "#",
      icon: Frame,
    },
    {
      name: "AI Quiz",
      url: "#",
      icon: PieChart,
    },
  ],

  projects1: [
    {
      name: "Edit Profile",
      url: "#",
      icon: Frame,
    },
    {
      name: "App Settings",
      url: "#",
      icon: PieChart,
    },
    {
      name: "General",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavProjects1 projects={data.projects1} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
