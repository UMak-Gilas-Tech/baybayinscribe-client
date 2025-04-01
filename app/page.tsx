"use client";

import React, { useState } from "react";
import InferenceWebcam from "@/components/InferenceWebcam";
import { ArrowRightLeft } from "lucide-react";

import { baybayinToLatin } from "@/lib/baybayify";
export default function Home() {
  const [detectedText, setDetectedText] = useState<string | undefined>(
    undefined
  );

  return (
    <div className="flex flex-row items-center justify-evenly w-screen h-[85vh] m-0 p-0">
      <InferenceWebcam
        sizeClass="w-[500px] h-[500px]"
        onDetect={(result) =>
          setDetectedText(result.map((v) => v.className).join(""))
        }
      />

      <div className="flex flex-col items-center justify-center gap-20">
        <ArrowRightLeft size={24} />
      </div>

      <div className="w-[500px] h-[500px] shadow-xl border-xl p-4">
        <span>
          {detectedText
            ? baybayinToLatin(detectedText)
            : "Detected Text will be here"}
        </span>
      </div>
    </div>
  );
}
