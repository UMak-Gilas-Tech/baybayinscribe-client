
export type InferenceResult = {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  className: string;
};

export type InferenceResultHistory = {
  detectedBaybayinString: string[];
  avgConfidence: number;
  timestamp: string;
}
