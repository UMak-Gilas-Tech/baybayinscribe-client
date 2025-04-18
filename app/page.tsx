"use client";
import React from "react";

// import InferenceWebcam from "@/components/InferenceWebcam";

export default function Home({ children }: { children: React.ReactNode }) {

  return (
    <main className="min-h-screen bg-white">
      {children}
    </main>
  );
}
