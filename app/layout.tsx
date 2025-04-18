"use client";

import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
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
  return (
    <html lang="en">
      <head>
        <title>{`BaybayInscribe | ${siteConfig.name}`}</title>
        <meta name="description" content={siteConfig.description} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden p-0`}
      >
        <SidebarProvider>
          <Toaster />
          <div className="flex flex-col h-screen">
            <div className="flex-shrink-0 z-10">
              <TopNavbar />
            </div>
            <div className="flex flex-1 overflow-hidden">
              <AppSidebar className="sticky top-0 h-screen z-20" />
              <div className="w-full h-full flex flex-row overflow-hidden">
                <div className="relative flex-1 h-full">
                  <Background />
                  <main className="relative w-full h-full overflow-scroll z-10">
                    {children}
                  </main>
                </div>
              </div>
            </div>
          </div>
        </SidebarProvider>
        <ScreenSize />
      </body>
    </html>
  );
}