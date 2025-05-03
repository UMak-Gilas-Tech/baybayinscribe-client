"use client"

import * as tf from "@tensorflow/tfjs";
import { create } from "zustand";
import { LABELS } from "@/constants";

// @ts-expect-error
import { InferenceEngine, CVImage } from "inferencejs";
import { InferenceResult } from "@/types/type.inference";

export enum InferenceStatus {
  IDLE,
  LOADING,
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
    const model = get().localModel;
    if (!model)
      throw new Error("Model not initialized. Call initLocalModel() first.");
    if (!model.inputs[0].shape)
      throw new Error("Model input shape is undefined!");

    tf.engine().startScope();

    const [modelWidth, modelHeight] = model.inputs[0].shape.slice(1, 3);
    console.log(modelWidth, modelHeight);
    const ctx = canvas.getContext("2d");

    let originalImageData: ImageData | undefined;
    if (ctx) {
      originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    if (ctx && isSketch) {
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "#D3DDFD";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";
    }
    const input = tf.tidy(() => {
      const imageTensor = tf.browser
        .fromPixels(image ? image : canvas)
        .resizeBilinear([modelWidth, modelHeight])
        .div(255.0)
        .expandDims(0);
      return imageTensor;
    });

    if (ctx && isSketch) {
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
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

    if (result.length > 0 && renderToCanvas)
      get().renderToCanvas(filteredResult, canvas);

    // restore original drawing before disposing
    if (ctx && originalImageData) {
      ctx.putImageData(originalImageData, 0, 0);
    }
    tf.dispose(input);
    tf.engine().endScope();
  },
  initLocalModel: async () => {
    // Ensure TensorFlow is ready before loading the model.
    await tf.ready();
    set({ status: InferenceStatus.LOADING });
    const model = await tf.loadGraphModel("../../models/model.json");

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
    const detectFrame = () => {
      if (!get().modelWorkerId) {
        setTimeout(detectFrame, 100 / 3);
        return;
      }
      if (!video || !canvas) return;
      const img = new CVImage(video);
      get().inferEngine &&
        get()
          .inferEngine.infer(get().modelWorkerId, img)
          .then((predictions: any[]) => {
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
            setTimeout(detectFrame, 100 / 3);
          });
    };
    detectFrame();
  },
  renderToCanvas: (inferenceResult, canvas) => {
    // Set canvas style when rendering to canvas is enabled
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "8px sans-serif";
    ctx.textBaseline = "top";

    if (!inferenceResult) return;

    const scaleX = canvas.width / 640;
    const scaleY = canvas.height / 640;

    console.log("Hello Canvas Renderer")

    if (inferenceResult.length > 0) {
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

      inferenceResult.forEach((item) => {
        const x1 = item.x * scaleX;
        const y1 = item.y * scaleY;
        const x2 = ((item.x + item.width) * scaleX) / 1.9;
        const y2 = ((item.y + item.height) * scaleY) / 1.9;

        if (x1 < minX) minX = x1;
        if (y1 < minY) minY = y1;
        if (x2 > maxX) maxX = x2;
        if (y2 > maxY) maxY = y2;
      });

      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
      ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
      console.log("Rendered to canvas:");
    }
  },
}));
