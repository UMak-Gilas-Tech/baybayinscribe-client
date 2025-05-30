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
    console.log("Model input dimensions:", modelWidth, modelHeight);

    try {
      const input = tf.tidy(() => {
        let imageTensor;
        
        if (isSketch) {
          // For sketches, we need to handle the canvas differently
          // Get the canvas data and preprocess it properly
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error("Cannot get canvas context");
          
          // Create a temporary canvas with white background for better contrast
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          const tempCtx = tempCanvas.getContext('2d');
          if (!tempCtx) throw new Error("Cannot get temp canvas context");
          
          // Fill with white background
          tempCtx.fillStyle = 'white';
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          
          // Draw the original canvas content
          tempCtx.drawImage(canvas, 0, 0);
          
          imageTensor = tf.browser
            .fromPixels(tempCanvas)
            .resizeBilinear([modelWidth, modelHeight])
            .mean(2) // Convert to grayscale
            .expandDims(2) // Add channel dimension back
            .tile([1, 1, 3]) // Convert back to 3 channels
            .div(255.0)
            .expandDims(0);
            
          console.log("Sketch tensor shape:", imageTensor.shape);
        } else {
          imageTensor = tf.browser
            .fromPixels(image ? image : canvas)
            .resizeBilinear([modelWidth, modelHeight])
            .div(255.0)
            .expandDims(0);
        }
        
        return imageTensor;
      });

      console.log("Input tensor shape:", input.shape);
      
      const result: tf.Tensor[] = (await model.executeAsync(
        input
      )) as tf.Tensor[];
      
      console.log("Raw model output shape:", result[0].shape);
      const inferenceResult: number[][][] = result[0].arraySync() as number[][][];
      console.log("Raw inference result:", inferenceResult[0]);
      
      // Lower confidence threshold for sketches
      const confidenceThreshold = isSketch ? 0.3 : 0.5;
      
      const filteredResult = inferenceResult[0]
        .filter((item, index) => {
          console.log(`Detection ${index}: confidence=${item[4]}, class=${item[5]}`);
          return item[4] > confidenceThreshold;
        })
        .map((item) => {
          const className = LABELS[Math.floor(item[5])] || `Unknown_${Math.floor(item[5])}`;
          console.log(`Mapped class: ${className} (index: ${Math.floor(item[5])})`);

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

      console.log("Filtered results:", filteredResult);
      set({ localInferenceResult: filteredResult });

      if (result.length > 0 && renderToCanvas)
        get().renderToCanvas(filteredResult, canvas);

      tf.dispose(input);
      tf.dispose(result);
    } catch (err) {
      console.error("Inference error:", err);
      set({ status: InferenceStatus.ERROR });
    } finally {
      tf.engine().endScope();
    }
  },
  initLocalModel: async () => {
    try {
      await tf.setBackend("webgl");
      await tf.ready();
      set({ status: InferenceStatus.LOADING });
     
      console.log("Loading model from:", "../../models/model.json");
      const model = await tf.loadGraphModel("../../models/model.json");
      console.log("Model loaded successfully");
      console.log("Model input shape:", model.inputs[0].shape);
      console.log("Model output shape:", model.outputs[0].shape);

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
      console.log("Model ready for inference!");
    } catch (error) {
      console.error("Failed to initialize model:", error);
      set({ status: InferenceStatus.ERROR });
    }
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
    
    // Create overlay canvas to avoid clearing the drawing
    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.width = canvas.width;
    overlayCanvas.height = canvas.height;
    const overlayCtx = overlayCanvas.getContext('2d');
    if (!overlayCtx) return;
    
    overlayCtx.font = "14px sans-serif";
    overlayCtx.textBaseline = "top";

    if (!inferenceResult || inferenceResult.length === 0) {
      // Show "No detection" message
      overlayCtx.fillStyle = "rgba(255, 0, 0, 0.8)";
      overlayCtx.fillRect(10, 10, 120, 30);
      overlayCtx.fillStyle = "white";
      overlayCtx.fillText("No detection", 15, 20);
    } else {
      const scaleX = canvas.width / 640;
      const scaleY = canvas.height / 640;

      // Draw individual detections
      inferenceResult.forEach((item, index) => {
        const x = item.x * scaleX;
        const y = item.y * scaleY;
        const width = item.width * scaleX;
        const height = item.height * scaleY;

        // Draw bounding box
        overlayCtx.strokeStyle = "lime";
        overlayCtx.lineWidth = 2;
        overlayCtx.strokeRect(x, y, width, height);

        // Draw label with background
        const label = `${item.className} (${Math.round(item.confidence * 100)}%)`;
        const textMetrics = overlayCtx.measureText(label);
        const textWidth = textMetrics.width + 8;
        
        overlayCtx.fillStyle = "rgba(0, 255, 0, 0.8)";
        overlayCtx.fillRect(x, Math.max(0, y - 25), textWidth, 22);
        overlayCtx.fillStyle = "black";
        overlayCtx.fillText(label, x + 4, Math.max(0, y - 20));
      });
    }

    // Draw overlay on top of the main canvas
    ctx.drawImage(overlayCanvas, 0, 0);
  },
}));
