"use client";

import * as React from "react";
import {
  GalleryVerticalEnd,
  Languages,
  ScanText,
  PencilRuler,
  BotMessageSquare,
  BookOpenText,
  ListTodo,
  UserCog,
  Settings2,
} from "lucide-react";

import { NavMain } from "./nav.main";
import { NavProjects1, NavProjects } from "./nav.projects";
import { TeamSwitcher } from "./team.switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar"
import ProfileModal from "@/components/profile.settings/accounts/modal.profile"

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
  ],
  navMain: [
    {
      title: "Text to Baybayin",
      url: "/transliterator",
      icon: Languages,
    },
    {
      title: "Baybayin Scanner",
      url: "/ai/vision",
      icon: ScanText,
      isActive: true,
    },
    {
      title: "Baybayin Sketch",
      url: "/ai/sketch",
      icon: PencilRuler,
    },

    {
      title: "Baybayin Chat",
      url: "/ai/chat",
      icon: BotMessageSquare,
    },
  ],
  projects: [
    {
      name: "Lessons",
      url: "#",
      icon: BookOpenText,
    },
    {
      name: "Quiz",
      url: "#",
      icon: ListTodo,
    },
  ],
};

type UserData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  dateOfBirth?: string;
  provider?: string;
  contactNumber?: string;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user.information", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const projects1 = [
    {
      name: "Profile",
      action: openProfileModal,
      icon: UserCog,
    },
    {
      name: "Settings",
      url: "#",
      icon: Settings2,
    },
  ];
  
  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavProjects projects={data.projects} />
          <NavProjects1 projects={projects1} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      {/* Profile Modal */}
      {!isLoading && userData && (
        <ProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={closeProfileModal}
          userData={userData}
        />
      )}
    </>
  )
}
