"use client";
import React from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";

export function NavMain({
  items,
  label = "AI-Powered Tools",
  labelClassName = "",
  extraSpacing = false,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
    onClick?: (e: React.MouseEvent) => void;
  }[];
  label?: string;
  labelClassName?: string;
  extraSpacing?: boolean;
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup className={extraSpacing ? "mb-6" : ""}>
      <SidebarGroupLabel className={labelClassName}>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url;
          const inactiveClass = !isActive ? "text-grey-300" : "";
          if (item.onClick) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`cursor-pointer ${inactiveClass}`}
                  isActive={isActive}
                >
                  <button
                    onClick={item.onClick}
                    className="w-full text-left"
                    aria-label={item.title}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
          return item.items && item.items.length > 0 ? (
            // Render collapsible structure for items with sub-items
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`cursor-pointer ${inactiveClass}`}
                    isActive={isActive}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            // Render a simple button for items without sub-items
            <SidebarMenuItem key={item.title}>
              <a href={item.url} aria-label={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={`cursor-pointer ${inactiveClass}`}
                  isActive={isActive}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </a>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
