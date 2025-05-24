"use client";

import * as React from "react";
import {
  Languages,
  ScanText,
  PencilRuler,
  BotMessageSquare,
  BookOpenText,
  ListTodo,
  UserCog,
} from "lucide-react";

import { NavMain } from "./nav.main";
import { NavProjects1, NavProjects } from "./nav.projects";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "../ui/sidebar"
import ProfileModal from "@/components/profile.settings/accounts/modal.profile"
import Image from "next/image"

type UserData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  dateOfBirth?: string;
  provider?: string;
  contactNumber?: string;
  profilePictureUrl?: string;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const { state } = useSidebar();

  const data = {
    user: {
      name: userData?.username || "Guest",
      email: userData?.email || "",
      avatar: "/avatars/shadcn.jpg",
    },

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

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user information (username, email, etc.)
        const userResponse = await fetch("/api/user.information", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        let userDataFromApi: UserData | null = null;

        if (userResponse.ok) {
          userDataFromApi = await userResponse.json();
        } else {
          console.error("Failed to fetch user data");
          // Handle error or set default user data
          userDataFromApi = { username: "Guest", email: "", firstName: "", lastName: "" }; // Provide defaults if fetch fails
        }

        // Set user data
        setUserData(userDataFromApi || { username: "Guest", email: "", firstName: "", lastName: "" });

      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData({ username: "Guest", email: "", firstName: "", lastName: "" });
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
  ];

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          {!isLoading && userData ? (
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <Image
                  src={userData.profilePictureUrl || "/images/user.profile/user.avatar.png"}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full object-cover"
                  width={32}
                  height={32}
                />
              </div>
              {state === "expanded" && (
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{`${userData.firstName || ''} ${userData.lastName || ''}`.trim()}</span>
                  <span className="text-xs text-gray-500">{userData.username || "User"}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-300 animate-pulse"></div>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="h-3 w-20 bg-gray-300 animate-pulse"></div>
                <div className="h-2 w-16 bg-gray-300 animate-pulse"></div>
              </div>
            </div>
          )}
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
