"use client";
import React, { useEffect, useState } from "react";
import { LearningMaterialsNav } from "../components/sidebar/learning-materials/nav";
import { ResponsiveNav } from "../components/sidebar/learning-materials/mobile.nav";

// import InferenceWebcam from "@/components/InferenceWebcam";

import { baybayinToLatin } from "@/lib/baybayify";
export default function Home() {
  const [isSmallScreen, setIsSmallScreen] = useState(true);
  
  useEffect(() => {
    // Check if window is available (client-side only)
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsSmallScreen(window.innerWidth < 640); // s-sm breakpoint is 640px
      };
      
      // Set initial value
      handleResize();
      
      // Add event listener
      window.addEventListener('resize', handleResize);
      
      // Clean up
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {isSmallScreen ? (
        <ResponsiveNav />
      ) : (
        <LearningMaterialsNav />
      )}
    </main>
  );
}
