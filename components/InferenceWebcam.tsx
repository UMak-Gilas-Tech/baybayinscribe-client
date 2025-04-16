"use client";
import React from "react";
import { useRef, useEffect } from "react";
import {
  useInferenceStore,
  InferenceStatus,
} from "../app/store/store.inference";
import { Switch } from "./ui/switch";
import { InferenceResult } from "@/types/inference";

// import { InferenceEngine, CVImage } from "inferencejs";

interface InferenceWebcamProps {
  sizeClass?: string;
  onDetect?: (result: InferenceResult[]) => void;
  test?: boolean;
}

export default function InferenceWebcam({
  sizeClass = "w-96 h-96",
  onDetect,
  test,
}: InferenceWebcamProps) {
  const inference = useInferenceStore();
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [usingLocal, setUsingLocal] = React.useState(true);

  useEffect(() => {
    if (usingLocal) inference.initLocalModel();
    else inference.init();
  }, []);

  useEffect(() => {
    if (inference.status === InferenceStatus.READY) {
      if (test) {
        inference.inferLocal(imageRef.current!, canvasRef.current!);
      } else {
        startWebcam();
      }
      canvasRef.current!.style.width = "100%";
      canvasRef.current!.style.height = "100%";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inference.status]);

  useEffect(() => {
    if (inference.localInferenceResult) {
      onDetect?.(inference.localInferenceResult);
    }
  }, [inference.localInferenceResult]);

  const startWebcam = () => {
    const constraints = {
      audio: false,
      video: {
        width: { ideal: 640 },
        height: { ideal: 640 },
        facingMode: "environment",
      },
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };

        videoRef.current.onplay = () => {
          const ctx = canvasRef.current?.getContext("2d");
          const height = videoRef.current?.videoHeight;
          const width = videoRef.current?.videoWidth;
          if (videoRef.current && canvasRef.current && width && height && ctx) {
            videoRef.current.width = width;
            videoRef.current.height = height;
            canvasRef.current.width = width;
            canvasRef.current.height = height;
            // Set canvas style to fit the parent container.
            canvasRef.current.style.width = "100%";
            canvasRef.current.style.height = "100%";
            ctx.scale(1, 1);

            const inferLoop = () => {
              inference.inferLocal(videoRef.current!, canvasRef.current!);
              setTimeout(inferLoop, 200);
            };
            inferLoop();
          }
        };
      }
    });
  };

  return (
    <div className={`${sizeClass} relative`}>
      <div className="absolute z-20">
        <Switch
          className="m-2 cursor-pointer z-50"
          checked={usingLocal}
          onCheckedChange={(val) => setUsingLocal(val)}
        />
        <span>
          {usingLocal ? "Using Local Inference" : "Using Remote Inference"}
        </span>
      </div>

      {test ? (
        <div className="w-full h-full relative">
          <img
            ref={imageRef}
            className="absolute h-full w-full"
            src="images/bbi_ex2.png"
            alt=""
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 w-full h-full z-10 rounded-md shadow-lg"
          ></canvas>
        </div>
      ) : (
        <div className="w-full h-full relative">
          <video
            ref={videoRef}
            autoPlay
            className="absolute top-0 left-0 w-full h-full -z-10 rounded-md shadow-lg"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full z-10 rounded-md shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
