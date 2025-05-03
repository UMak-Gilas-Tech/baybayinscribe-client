"use client";
import React, { useEffect, useState } from "react";
import { LearningMaterialsNav } from "../components/sidebar/learning-materials/nav";
import { ResponsiveNav } from "../components/sidebar/learning-materials/mobile.nav";
import SignedInScreen from "./signedinscreen/page";

export default function Home() {
  const [isSmallScreen, setIsSmallScreen] = useState(true);
  
  useEffect(() => {
    // Check if window is available (client-side only)
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
      {isSmallScreen ? (
        <ResponsiveNav />
      ) : (
        <LearningMaterialsNav />
      )}
      <SignedInScreen/>
    </main>
  );
}
