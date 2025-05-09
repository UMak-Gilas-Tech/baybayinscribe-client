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
  Settings2,
} from "lucide-react"

import { NavMain } from "./nav.main"
import { NavProjects1, NavProjects } from "./nav.projects"
import { TeamSwitcher } from "./team.switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar"
import ProfileModal from "@/components/profile.settings/accounts/ModalProf"

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
      title: "Text AI (Fil To Baybayin)",
      url: "#",
      icon: SquareTerminal,
    },
    {
      title: "Scanner AI",
      url: "#",
      icon: Bot,
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
      icon: BookOpen,
    },

    {
      title: "Chat AI",
      url: "#",
      icon: Settings2,
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
}

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
      name: "Edit Profile",
      action: openProfileModal,
      icon: Frame,
    },
    {
      name: "App Settings",
      url: "#",
      icon: PieChart,
    },
    {
      name: "General",
      url: "/testdrive",
      icon: Map,
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
