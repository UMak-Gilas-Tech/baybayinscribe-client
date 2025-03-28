export {};

import type * as tfLiteTypes from "@tensorflow/tfjs-tflite/dist/index";
type tfLiteType = typeof tfLiteTypes;

declare global {
  interface Window {
    tflite: tfLiteType;
  }
}
