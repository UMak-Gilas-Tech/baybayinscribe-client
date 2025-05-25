"use client";
import React, { useState } from "react";
import StandaloneSketchpad from "@/components/sketchpad/StandaloneSketchpad";
import { SketchpadProvider } from '@/app/contexts/SketchpadContext';

const Sketchpad = () => {
    // Add loading state for model
    const [modelLoading, setModelLoading] = useState(true);

    return (
        <div className="w-full h-full min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f0f4ff] to-[#c7d2fe] flex items-center justify-center">
            <SketchpadProvider>
                {/* Loading overlay for model */}
                {modelLoading && (
                    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0E1425]/80">
                        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-400 mb-6"></div>
                        <span className="text-white text-xl font-semibold tracking-wide drop-shadow-lg">Loading AI Model...</span>
                    </div>
                )}
                <StandaloneSketchpad setModelLoading={setModelLoading} />
            </SketchpadProvider>
        </div>
    );
};

export default Sketchpad;