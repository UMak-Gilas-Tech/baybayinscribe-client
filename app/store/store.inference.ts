"use client";
import * as tf from "@tensorflow/tfjs";
import { Rank, Tensor } from "@tensorflow/tfjs-core";
import { TFLiteModel } from "@tensorflow/tfjs-tflite";
import { create } from "zustand";

// @ts-expect-error
import { InferenceEngine, CVImage } from "inferencejs";

export enum InferenceStatus {
  IDLE,
  LOADING,
  READY,
  ERROR,
}

interface InferenceState {
  status: InferenceStatus;
  modelWorkerId: string | undefined;
  inferEngine: InferenceEngine | undefined;
  init: () => void;
  infer: (image: HTMLImageElement) => void;
  detect: (video: HTMLVideoElement, canvas: HTMLCanvasElement) => void;
}

export const useInferenceStore = create<InferenceState>()((set, get) => ({
  status: InferenceStatus.IDLE,
  modelWorkerId: undefined,
  inferEngine: undefined,
  init: async () => {
    set({ status: InferenceStatus.LOADING });
    const inferEngine = new InferenceEngine();

    const modelWorkerId = await inferEngine.startWorker(
      "baybayinscribe",
      "2",
      "rf_PMVs0s2FKsdITA4ivOJljFQAzrF3"
    );
    set({ status: InferenceStatus.READY, modelWorkerId, inferEngine });
  },
  infer: async (image) => {
    const { inferEngine } = get();
    if (inferEngine === undefined) {
      return;
    }
    set({ status: InferenceStatus.LOADING });
    const result = await inferEngine.infer(image);
    console.log(result);
    set({ status: InferenceStatus.READY });
  },
  detect: (video, canvas) => {
    const detectFrame = () => {
      if (!get().modelWorkerId) {
        setTimeout(detectFrame, 100 / 3);
        return;
      }
      if (!video || !canvas) return;
      const img = new CVImage(video);
      get().inferEngine &&
        get().inferEngine.infer(get().modelWorkerId, img).then((predictions: any[]) => {
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < predictions.length; i++) {
            const prediction = predictions[i];
            ctx.strokeStyle = prediction.color;
            const x = prediction.bbox.x - prediction.bbox.width / 2;
            const y = prediction.bbox.y - prediction.bbox.height / 2;
            const width = prediction.bbox.width;
            const height = prediction.bbox.height;
            ctx.rect(x, y, width, height);
            ctx.fillStyle = "rgba(0, 0, 0, 0)";
            ctx.fill();
            ctx.fillStyle = ctx.strokeStyle;
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, width, height);
            const textMetrics = ctx.measureText(
              prediction.class + " " + Math.round(prediction.confidence * 100) + "%"
            );
            ctx.fillStyle = ctx.strokeStyle;
            ctx.fillRect(x - 2, y - 30, textMetrics.width + 4, 30);
            ctx.font = "15px monospace";
            ctx.fillStyle = "black";
            ctx.fillText(
              prediction.class + " " + Math.round(prediction.confidence * 100) + "%",
              x,
              y - 10
            );
          }
          setTimeout(detectFrame, 100 / 3);
        });
    };
    detectFrame();
  },
}));
