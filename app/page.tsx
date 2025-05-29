"use client";
import React, { useEffect } from "react";
import { LearningMaterialsNav } from "../components/home/LearningMaterialsNav";
import { useLearningResourceStore } from "@/app/store/store.lr";
import { Toaster } from "sonner";

export function useHomeContext() {
  return {
    // Add any context values here if needed
  };
}

export default function Home() {
  const lessonsStatus = useLearningResourceStore((state) => state.status);
  const getAllLessons = useLearningResourceStore(
    (state) => state.getAllLessons
  );

  useEffect(() => {
    if (lessonsStatus !== "Loaded" && lessonsStatus !== "Loading") {
      getAllLessons();
    }
    // eslint-disable-next-line
  }, [lessonsStatus]);

  return (
    <>
      <Toaster />
      <main className="min-h-screen w-full bg-blue-900/25 flex flex-col items-center justify-center sm:flex-row">
        <div className="flex items-center md:justify-start justify-center w-10/12 sm:w-11/12">
          <div className="flex-1 overflow-hidden">
            <LearningMaterialsNav />
          </div>
        </div>
      </main>
    </>
  );
}
