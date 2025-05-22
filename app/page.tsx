"use client";
import SignedinScreen from "./signedinscreen/page";
import React, { useEffect, useState, useMemo } from "react";
import { LearningMaterialsNav } from "../components/sidebar/learning-materials/nav";
import { ResponsiveNav } from "../components/sidebar/learning-materials/mobile.nav";
import { useLearningResourceStore } from "@/app/store/store.lr";
import { Toaster } from "sonner";
import useQuizStore from "./store/store.quiz";

export type HomeContextType = {
  lessonsStore: typeof useLearningResourceStore;
  quizStore: typeof useQuizStore;
};

export const HomeContext = React.createContext<HomeContextType | undefined>(
  undefined
);

export default function Home() {
  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : true
  );
  const lessonsStore = useLearningResourceStore();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsSmallScreen(window.innerWidth < 640);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <HomeContext.Provider value={{ lessonsStore: useLearningResourceStore, quizStore: useQuizStore }}>
      <main className="min-h-screen w-full bg-white flex flex-col items-center justify-center sm:flex-row">
        <div className="flex items-center md:justify-start justify-center w-3/4">
          {isSmallScreen ? <ResponsiveNav /> : <LearningMaterialsNav />}
        </div>
      </main>
      <Toaster />
    </HomeContext.Provider>
  );
}

export const useHomeContext = (): HomeContextType => {
  const context = React.useContext(HomeContext);
  if (!context) {
    throw new Error("useHomeContext must be used within a HomeProvider");
  }
  return context;
};
