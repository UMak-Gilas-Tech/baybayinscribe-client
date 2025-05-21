"use client";

import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import TopNavbar from "../components/sidebar/Navbar";
import Background from "@/components/background";
import { Toaster } from "sonner";

import "./globals.css";
import { SidebarProvider } from "../components/ui/sidebar";
import { AppSidebar } from "../components/sidebar/app.sidebar";
import { ScreenSize } from "../components/ScreenSize";
import { siteConfig } from "./metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage =
    pathname === "/auth/login" ||
    pathname === "/auth/register" ||
    pathname === "/auth/userinfo" ||
    pathname === "/auth/profpic" ||
    pathname === "/auth/terms" ||
    pathname === "/auth/forgotpassword" ||
    pathname === "/auth/resetpassword";

  return (
    <html lang="en">
      <head>
        <title>{siteConfig.name}</title>
        <meta name="description" content={siteConfig.description} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster richColors />
        <SidebarProvider>
          {!isLoginPage && (
            <div className="flex flex-col h-screen">
              <div className="flex-shrink-0 z-10">
                <TopNavbar />
              </div>

              <div className="flex flex-1 overflow-hidden">
                <AppSidebar className="sticky top-0 h-screen z-20" />
                <main className="flex-1 overflow-auto z-0 h-full">
                  {children}
                </main>
              </div>
            </div>
          )}
          {isLoginPage && <main>{children}</main>}
        </SidebarProvider>
        <ScreenSize />
      </body>
    </html>
  );
}
