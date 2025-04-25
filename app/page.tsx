"use client";
import React from "react";
import SignedinScreen from "./signedinscreen/page";
// import InferenceWebcam from "@/components/InferenceWebcam";


export default function Home({ children }: { children: React.ReactNode }) {

  return (
    <main className="min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center h-screen">  
        <h1 className="text-2xl font-bold mt-10">Hello homepage  I am the homepage, I am logged in and locked in</h1>
        <SignedinScreen />
      </div>
      {children}
    </main>
  );
}
