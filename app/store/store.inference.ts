"use client"

import * as tf from "@tensorflow/tfjs";
import { create } from "zustand";
import { LABELS } from "@/constants";

import { InferenceResult } from "@/types/type.inference";
import "@tensorflow/tfjs-backend-webgl"
import { InferenceEngine, CVImage } from "inferencejs";

// import { InferenceEngine } from "@tensorflow/tfjs-tflite";
// TODO: Replace with correct import or implementation for InferenceEngine

export enum InferenceStatus {
  IDLE,
  LOADING,
  WARMING_UP, // <-- Add this
  READY,
  ERROR,
}

export interface InferenceState {
  status: InferenceStatus;
  modelWorkerId: string | undefined;
  inferEngine: InferenceEngine | undefined;
  localModel: tf.GraphModel | undefined;
  localInferenceResult: InferenceResult[] | undefined;
  init: () => void;
  initLocalModel: () => void;
  inferLocal: (
    image: HTMLVideoElement | HTMLImageElement | undefined,
    canvas: HTMLCanvasElement,
    renderToCanvas?: boolean,
    isSketch?: boolean
  ) => void;

  renderToCanvas: (
    inferenceResult: InferenceResult[],
    canvas: HTMLCanvasElement
  ) => void;

  infer: (image: HTMLImageElement) => void;
  detect: (video: HTMLVideoElement, canvas: HTMLCanvasElement) => void;
}

export const useInferenceStore = create<InferenceState>()((set, get) => ({
  status: InferenceStatus.IDLE,
  modelWorkerId: undefined,
  inferEngine: undefined,
  localModel: undefined,
  localInferenceResult: undefined,
  inferLocal: async (image, canvas, renderToCanvas = false, isSketch = false) => {
    // Ensure TensorFlow is ready before inference
    await tf.ready();

    const model = get().localModel;
    if (!model)
      throw new Error("Model not initialized. Call initLocalModel() first.");
    if (!model.inputs[0].shape)
      throw new Error("Model input shape is undefined!");

    tf.engine().startScope();

    const [modelWidth, modelHeight] = model.inputs[0].shape.slice(1, 3);
    console.log(modelWidth, modelHeight);

    try {
      const input = tf.tidy(() => {
        const imageTensor = tf.browser
          .fromPixels(image ? image : canvas)
          .resizeBilinear([modelWidth, modelHeight])
          .div(255.0)
          .expandDims(0);
        return imageTensor;
      });

      const result: tf.Tensor[] = (await model.executeAsync(
        input
      )) as tf.Tensor[];
      const inferenceResult: number[][][] = result[0].arraySync() as number[][][];
      console.log("Inference result:", inferenceResult[0]);
      const filteredResult = inferenceResult[0]
        .filter((item) => item[4] > 0.5)
        .map((item) => {
          const className = LABELS[item[5]];

          return {
            x: item[0],
            y: item[1],
            width: item[2],
            height: item[3],
            confidence: item[4],
            className: className,
          } as InferenceResult;
        })
        .sort((a, b) => {
          return a.x - b.x;
        });

      set({ localInferenceResult: filteredResult });

      // DO NOT restore originalImageData here!
      // The canvas should already have the image drawn by the component.
      // Only draw the bounding box on top.

      if (result.length > 0 && renderToCanvas)
        get().renderToCanvas(filteredResult, canvas);

      tf.dispose(input);
    } catch (err) {
      console.error("Inference error:", err);
      set({ status: InferenceStatus.ERROR });
    } finally {
      tf.engine().endScope();
    }
  },
  initLocalModel: async () => {
    await tf.setBackend("webgl");
    await tf.ready();
    set({ status: InferenceStatus.LOADING });
   
    const model = await tf.loadGraphModel("../../models/model.json");

    // Set warming up state
    set({ status: InferenceStatus.WARMING_UP });

    console.log("Warming up model...");
    if (model.inputs[0].shape) {
      const dummy = tf.ones(model.inputs[0].shape);
      const response = await model.executeAsync(dummy);

      tf.dispose(response);
      tf.dispose(dummy);
    }

    set({ status: InferenceStatus.READY, localModel: model });
    console.log("Loaded Model!");
  },
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
    const detectFrame = async () => {
      if (!get().modelWorkerId) {
        setTimeout(detectFrame, 100 / 3);
        return;
      }
      if (!video || !canvas) return;
      const img = new CVImage(video);
      const inferEngine = get().inferEngine;
      if (inferEngine) {
        inferEngine
          .infer(get().modelWorkerId, img)
          .then((predictions: Array<{ 
            color: string; 
            bbox: { x: number; y: number; width: number; height: number }; 
            class: string; 
            confidence: number; 
          }>) => {
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
                prediction.class +
                  " " +
                  Math.round(prediction.confidence * 100) +
                  "%"
              );
              ctx.fillStyle = ctx.strokeStyle;
              ctx.fillRect(x - 2, y - 30, textMetrics.width + 4, 30);
              ctx.font = "15px monospace";
              ctx.fillStyle = "black";
              ctx.fillText(
                prediction.class +
                  " " +
                  Math.round(prediction.confidence * 100) +
                  "%",
                x,
                y - 10
              );
            }
          });
      }
      setTimeout(detectFrame, 100 / 3);
    };
    detectFrame();
  },
  renderToCanvas: (inferenceResult, canvas) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Always clear before drawing new detections
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px sans-serif";
    ctx.textBaseline = "top";

    if (!inferenceResult || inferenceResult.length === 0) {
      // Optionally, show "No detection"
      ctx.fillStyle = "red";
      ctx.fillText("No detection", 10, 10);
      return;
    }

    const scaleX = canvas.width / 640;
    const scaleY = canvas.height / 640;

    // Compute combined bounding box
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    inferenceResult.forEach((item) => {
      const x1 = item.x * scaleX;
      const y1 = item.y * scaleY;
      const x2 = (item.x + item.width) * scaleX;
      const y2 = (item.y + item.height) * scaleY;

      if (x1 < minX) minX = x1;
      if (y1 < minY) minY = y1;
      if (x2 > maxX) maxX = x2;
      if (y2 > maxY) maxY = y2;
    });

    // Clamp to canvas bounds
    minX = Math.max(0, minX);
    minY = Math.max(0, minY);
    maxX = Math.min(canvas.width, maxX);
    maxY = Math.min(canvas.height, maxY);

    // Debug log
    console.log("Combined bounding box:", { minX, minY, maxX, maxY });

    // Draw the combined bounding box
    ctx.save();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;
    ctx.globalAlpha = 1.0;
    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
    ctx.restore();

    // Draw label for the combined box
    const label = `Detected: ${inferenceResult.length} chars`;
    const textWidth = ctx.measureText(label).width;
    ctx.fillStyle = "rgba(255,0,0,0.7)";
    ctx.fillRect(minX, Math.max(0, minY - 24), textWidth + 12, 22);
    ctx.fillStyle = "white";
    ctx.fillText(label, minX + 6, Math.max(0, minY - 18));
  },
}));
