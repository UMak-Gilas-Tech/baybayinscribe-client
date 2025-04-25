"use client";
import React from "react";
import SketchpadComponent from "@/components/quiz/Sketchpad";
import { useInferenceStore } from "@/app/store/store.inference";
import StandaloneSketchpad from "@/components/sketchpad/StandaloneSketchpad";
import { SketchpadProvider } from '@/app/contexts/SketchpadContext';

const Sketchpad = () => {
    const inference = useInferenceStore();
    return (
        <div className="w-full h-full">
            <SketchpadProvider>
                <StandaloneSketchpad />
                
            </SketchpadProvider>
        </div>
    );
};

export default Sketchpad;