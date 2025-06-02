"use client";
import React from "react";
import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRoleStore } from "@/app/store/store.role";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

export function NavProjects({
  projects,
  label = "Learning",
  labelClassName = "",
  extraSpacing = false,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
    adminOnly?: boolean;
  }[];
  label?: string;
  labelClassName?: string;
  extraSpacing?: boolean;
}) {
  const pathname = usePathname();
  const [userRole, setUserRole] = React.useState<string | undefined>();

  React.useEffect(() => {
    const fetchUserRole = async () => {
      const role = await useRoleStore.getState().getCurrentUserRole();
      setUserRole(role);
    };
    fetchUserRole();
  }, []);

  return (
    <SidebarGroup className={extraSpacing ? "mb-6" : ""}>
      <SidebarGroupLabel className={labelClassName}>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => {
          // Skip rendering if item is admin-only and user is not admin
          if (item.adminOnly && userRole !== "admin") {
            return null;
          }

          const isActive = pathname === item.url;
          const inactiveClass = !isActive ? "text-grey-300" : "";
          return (
            <SidebarMenuItem key={item.name}>
              <a href={item.url} aria-label={item.name}>
                <SidebarMenuButton
                  tooltip={item.name}
                  className={`cursor-pointer ${inactiveClass}`}
                  isActive={isActive}
                >
                  <item.icon className="shrink-0" />
                  <span className="ml-2 group-data-[collapsible=icon]:hidden">
                    {item.name}
                  </span>
                </SidebarMenuButton>
              </a>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function NavProjects1({
  projects,
  label = "Settings",
  labelClassName = "",
  extraSpacing = false,
}: {
  projects: {
    name: string;
    url?: string;
    action?: () => void;
    icon: LucideIcon;
    adminOnly?: boolean;
  }[];
  label?: string;
  labelClassName?: string;
  extraSpacing?: boolean;
}) {
  const pathname = usePathname();
  const [userRole, setUserRole] = React.useState<string | undefined>();

  React.useEffect(() => {
    const fetchUserRole = async () => {
      const role = await useRoleStore.getState().getCurrentUserRole();
      setUserRole(role);
    };
    fetchUserRole();
  }, []);

  return (
    <SidebarGroup className={extraSpacing ? "mb-6" : ""}>
      <SidebarGroupLabel className={labelClassName}>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => {
          // Skip rendering if item is admin-only and user is not admin
          if (item.adminOnly && userRole !== "admin") {
            return null;
          }

          const isActive = pathname === item.url;
          const inactiveClass = !isActive ? "text-grey-300" : "";
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                tooltip={item.name}
                className={`cursor-pointer ${inactiveClass}`}
                isActive={isActive}
              >
                {item.action ? (
                  <button
                    onClick={item.action}
                    className="flex items-center cursor-pointer"
                    aria-label={item.name}
                  >
                    <item.icon className="shrink-0" />
                    <span className="ml-2 group-data-[collapsible=icon]:hidden">
                      {item.name}
                    </span>
                  </button>
                ) : (
                  <a
                    href={item.url}
                    className="flex items-center cursor-pointer"
                    aria-label={item.name}
                  >
                    <item.icon className="shrink-0" />
                    <span className="ml-2 group-data-[collapsible=icon]:hidden">
                      {item.name}
                    </span>
                  </a>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
