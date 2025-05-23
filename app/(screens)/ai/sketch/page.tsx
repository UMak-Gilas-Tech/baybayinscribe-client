"use client";
import React from "react";
import StandaloneSketchpad from "@/components/sketchpad/StandaloneSketchpad";
import { SketchpadProvider } from '@/app/contexts/SketchpadContext';

const Sketchpad = () => {
    return (
        <div className="w-full h-full">
            <SketchpadProvider>
                <StandaloneSketchpad />
                
            </SketchpadProvider>
        </div>
    );
};

export default Sketchpad;