"use client";

import { useRef, useEffect } from "react";
import {
  useInferenceStore,
  InferenceStatus,
} from "@/app/store/store.inference";
// @ts-expect-error
import { InferenceEngine, CVImage } from "inferencejs";

interface InferenceWebcamProps {
  sizeClass?: string;
}

export default function InferenceWebcam({
  sizeClass = "w-96 h-96",
}: InferenceWebcamProps) {
  const inference = useInferenceStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    inference.init();
  }, []);

  useEffect(() => {
    if (inference.status === InferenceStatus.READY) {
      startWebcam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inference.status]);

  const startWebcam = () => {
    const constraints = {
      audio: false,
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
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
            ctx.scale(1, 1);

            inference.detect(videoRef.current, canvasRef.current);
          }
        };
      }
    });
  };

  return (
    <div className={`${sizeClass} relative`}>
      {/* ...existing container styling... */}
      <video
        ref={videoRef}
        autoPlay
        className={`absolute top-0 left-0 w-full h-full -z-10 rounded-md shadow-lg`}
      />
      <canvas
        ref={canvasRef}
        className={`absolute top-0 left-0 w-full h-full z-10 rounded-md shadow-lg`}
      />
    </div>
  );
}
