"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { LearningMaterialsNav } from "../components/sidebar/learning-materials/nav";
import { ResponsiveNav } from "../components/sidebar/learning-materials/mobile.nav";

// import InferenceWebcam from "@/components/InferenceWebcam";

export default function Home({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSmallScreen, setIsSmallScreen] = useState(true);
  
  useEffect(() => {
    // Check if the router is ready and perform the redirect
    const handleRedirect = () => {
      router.push('/auth/login');
    };
    handleRedirect(); 
  }, [router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsSmallScreen(window.innerWidth < 640); 
      };

      handleResize();
      
      window.addEventListener('resize', handleResize);
      
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {pathname === "/auth/login" || pathname === "/auth/register" ? (
        <main>{children}</main>
      ) : isSmallScreen ? (
        <ResponsiveNav />
      ) : (
        <LearningMaterialsNav />
      )}
    </main>
  );
}
