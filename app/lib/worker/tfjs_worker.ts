import * as tflite from "@tensorflow/tfjs-tflite";

importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core");
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-cpu");
importScripts(
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.9"
);

self.onmessage = async function (event) {
  tflite.setWasmPath(
    "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.9/wasm/"
  );
  const model = await tflite.loadTFLiteModel(
    "models/baybayin_character_recognition_float16.tflite"
  );

  console.log("Loaded Model!", model);
};
function importScripts(arg0: string) {
  throw new Error("Function not implemented.");
}

