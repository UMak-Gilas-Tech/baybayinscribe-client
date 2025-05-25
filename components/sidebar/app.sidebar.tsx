"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Languages,
  ScanText,
  PencilRuler,
  BotMessageSquare,
  BookOpenText,
  ListTodo,
  UserCog,
  LayoutDashboard,
  Users,
  LogOut,
  ListChecks,
  Pencil,
  SkipBack,
} from "lucide-react";

import { NavMain } from "./nav.main";
import { NavProjects1, NavProjects } from "./nav.projects";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "../ui/sidebar";
import ProfileModal from "@/components/profile.settings/accounts/modal.profile";
import Image from "next/image";

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
  const router = useRouter();

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const { state } = useSidebar();
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // Admin sidebar structure
  const adminNavGroups = [
    {
      label: "Management Panel",
      items: [
        {
          title: "Admin Dashboard",
          url: "/admin/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "User Management",
          url: "/admin/users",
          icon: Users,
        },
        {
          title: "Quiz Management",
          url: "/admin/quiz",
          icon: ListChecks,
        },
        {
          title: "Lesson Editor",
          url: "/admin/lesson",
          icon: Pencil,
        },

        {
          title: "Return to User Dashboard",
          url: "/",
          icon: SkipBack,
        },
        {
          title: "Logout as Admin",
          url: "#logout",
          icon: LogOut,
          isLogout: true,
        },
      ],
    },
  ];

  // Logout handler
  const handleAdminLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/auth/login');
        }
      }
    });
  };

  const data = {
    user: {
      name: isAdminRoute ? "Administrator" : (userData?.username ? `@${userData.username}` : "Guest"),
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
    projects: isAdminRoute
      ? []
      : [
        {
          name: "Lessons",
          url: "/lesson/all",
          icon: BookOpenText,
        },
        {
          name: "Quiz",
          url: "/quiz/all",
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
          userDataFromApi = {
            username: "Guest",
            email: "",
            firstName: "",
            lastName: "",
          }; // Provide defaults if fetch fails
        }

        // Set user data
        setUserData(
          userDataFromApi || {
            username: "Guest",
            email: "",
            firstName: "",
            lastName: "",
          }
        );
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData({
          username: "Guest",
          email: "",
          firstName: "",
          lastName: "",
        });
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
      name: "Admin Panel",
      url: "/admin",
      icon: ListTodo,
      adminOnly: true
    },
  ];

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          {!isLoading && userData ? (
            <div className="flex items-center space-x-2 overflow-hidden">
              <div className="flex-shrink-0">
                <Image
                  src={
                    userData.profilePictureUrl ||
                    "/images/user.profile/user.avatar.png"
                  }
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full object-cover"
                  width={32}
                  height={32}
                />
              </div>
              {state === "expanded" && (
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {isAdminRoute
                      ? "Administrator"
                      : `${userData.firstName || ""} ${userData.lastName || ""
                        }`.trim()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {isAdminRoute ? "Admin Panel" : userData?.username ? `@${userData.username}` : "User"}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <Image
                  src="/images/user.profile/user.avatar.png"
                  alt="User Avatar Loading"
                  className="h-8 w-8 rounded-full object-cover animate-pulse"
                  width={32}
                  height={32}
                />
              </div>
              {state === "expanded" && (
                <div className="flex flex-col space-y-1">
                  <div className="h-3 w-20 bg-gray-300 animate-pulse"></div>
                  <div className="h-2 w-16 bg-gray-300 animate-pulse"></div>
                </div>
              )}
            </div>
          )}
        </SidebarHeader>
        <SidebarContent>
          {isAdminRoute ? (
            <>
              <NavMain
                extraSpacing={false}
                items={adminNavGroups[0].items}
                label={adminNavGroups[0].label}
                labelClassName="text-base font-medium text-blue-400 mb-1"
              />
              <NavMain
                items={adminNavGroups[1].items.map((item) => ({
                  ...item,
                  onClick: item.isLogout ? () => {
                    const dialog = document.createElement('dialog');
                    dialog.innerHTML = `
                      <div class="fixed inset-0 z-50 flex items-center justify-center p-2">
                        <div class="bg-black/50 fixed inset-0"></div>
                        <div class="relative bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                          <h3 class="text-lg font-semibold mb-2">Log out</h3>
                          <p class="text-gray-600 mb-4">Do you want to log out of your session?</p>
                          <div class="flex justify-end gap-3">
                            <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer" id="confirmLogout">
                              Yes, Log me out
                            </button>
                            <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 cursor-pointer" id="cancelLogout">
                              No, don't log me out
                            </button>
                          </div>
                        </div>
                      </div>
                    `;
                    document.body.appendChild(dialog);
                    dialog.showModal();

                    const confirmBtn = dialog.querySelector('#confirmLogout');
                    const cancelBtn = dialog.querySelector('#cancelLogout');

                    confirmBtn?.addEventListener('click', () => {
                      dialog.close();
                      handleAdminLogout();
                    });

                    cancelBtn?.addEventListener('click', () => {
                      dialog.close();
                    });

                    dialog.addEventListener('close', () => {
                      document.body.removeChild(dialog);
                    });
                  } : undefined
                }))}
                label={adminNavGroups[1].label}
                labelClassName="text-base font-medium text-blue-400 mb-1"
              />
            </>
          ) : (
            <>
              <NavMain items={data.navMain} />
              <NavProjects projects={data.projects} />
              <NavProjects1 projects={projects1} />
            </>
          )}
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
  );
}