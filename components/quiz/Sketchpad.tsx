"use client";
import { Pencil, Trash, Undo } from "lucide-react";
import React, {
  useRef,
  useEffect,
  useState,
  HTMLAttributes,
  createContext,
  useContext,
} from "react";
import {
  InferenceStatus,
  InferenceState,
  useInferenceStore,
} from "../../app/store/store.inference";
import { baybayinToLatin } from "../../lib/baybayify";
import { useQuizTakeContext } from "@/app/(screens)/quiz/take/[quiz_id]/QuizTakeContext";
import { parseSentence } from "@/lib/parse_baybayin";

export type SketchpadProps = {
  question?: string;
  characters?: string;
  inference?: ReturnType<typeof useInferenceStore>;
  onDrawingSubmit?: (result: string, isCorrect: boolean) => void;
} & HTMLAttributes<HTMLDivElement>;

const SketchpadPropsContext = createContext<SketchpadProps | null>(null);

export const useSketchpadProps = () => {
  const context = useContext(SketchpadPropsContext);
  if (!context) {
    throw new Error("useSketchpadProps must be used within SketchpadComponent");
  }
  return context;
};

const SketchpadQuestionHolder = () => {
  const props = useSketchpadProps(); // Access props here if needed

  return (
    <div className="z-20 flex flex-col justify-center items-center">
      <div className="z-10 grid place-items-center bg-[#3f5087] border-2 border-[#31384D] w-full md:w-3/4 lg:w-[60%] h-20 rounded-xl shadow-xl">
        <p className="text-center text-yellow-200 font-bold text-2xl">
          {props.question?.includes("==")
            ? parseSentence(props.question)
            : props.question}
          : {props.characters}
        </p>
      </div>
    </div>
  );
};

const SketchpadCanvas = () => {
  const props = useSketchpadProps(); // Access props here if needed
  const quizContext = useQuizTakeContext();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setIsErasing] = useState(false);
  const [baybayinText, setBaybayinText] = useState<string | null>(null);

  // NEW: Reset canvas on render.
  useEffect(() => {
    handleClear();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempContext = tempCanvas.getContext("2d");
        if (tempContext) {
          tempContext.drawImage(canvas, 0, 0);
        }

        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;

        if (tempContext) {
          context.drawImage(tempCanvas, 0, 0);
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    context.lineWidth = 2;
    context.lineCap = "round";
    context.strokeStyle = "#000000";
    context.globalCompositeOperation = "source-over";

    const startDrawing = (e: MouseEvent) => {
      setIsDrawing(true);
      const rect = canvas.getBoundingClientRect();
      context.beginPath();
      context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      context.stroke();
    };

    const stopDrawing = () => {
      if (!canvas || !context) return;
      setIsDrawing(false);
      setHistory((prev) => [
        ...prev,
        context.getImageData(0, 0, canvas.width, canvas.height),
      ]);
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isDrawing]);

  useEffect(() => {
    (props.inference as InferenceState).initLocalModel();
  }, []);

  useEffect(() => {
    const inference: InferenceState =
      props.inference as unknown as InferenceState;

    if (inference.status == InferenceStatus.READY)
      quizContext.subscribeToSubmit(handleSubmit);
  }, [(props.inference as InferenceState).status]);

  useEffect(() => {
    const inference: InferenceState =
      props.inference as unknown as InferenceState;
    if (inference && inference.localInferenceResult) {
      const result = inference.localInferenceResult;
      if (result.length > 0) {
        const builtString = result.map((item) => item.className).join("");
        setBaybayinText(builtString);
        props.onDrawingSubmit?.(builtString, builtString === props.characters);
      } else {
        setBaybayinText(null);
      }
    }
  }, [(props.inference as InferenceState).localInferenceResult]);

  const handleUndo = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context && history.length > 0) {
      const lastState = history[history.length - 1];
      context.putImageData(lastState, 0, 0);
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      setHistory([]);
    }
  };

  const handleDraw = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      setIsErasing(false);
      context.globalCompositeOperation = "source-over";
      context.strokeStyle = "#000000";
    }
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    const inference: InferenceState =
      props.inference as unknown as InferenceState;
    if (
      canvas &&
      inference &&
      inference.status === InferenceStatus.READY &&
      inference.localModel
    ) {
      const inference: InferenceState =
        props.inference as unknown as InferenceState;
      inference.inferLocal(undefined, canvas, false);
    } else {
      console.error("Inference is not ready or canvas is not available");
    }
  };

  const CanvasOptions = () => {
    return (
      <div className="absolute flex flex-col justify-evenly h-full -left-8 z-20">
        <div
          className="aspect-square h-14 bg-blue-500 rounded-lg shadow-lg grid place-items-center cursor-pointer"
          onClick={handleDraw}
        >
          <Pencil size={30} className="text-yellow-200" />
        </div>

        <div
          className="aspect-square h-14 bg-blue-500 rounded-lg shadow-lg grid place-items-center cursor-pointer"
          onClick={handleUndo}
        >
          <Undo size={30} className="text-yellow-200" />
        </div>

        <div
          className="aspect-square h-14 bg-blue-500 rounded-lg shadow-lg grid place-items-center cursor-pointer"
          onClick={handleClear}
        >
          <Trash size={30} className="text-yellow-200" />
        </div>
      </div>
    );
  };

  const PredictionResult: React.FC<{ baybayinText: string | null }> = ({
    baybayinText,
  }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (baybayinText && !isVisible) {
        setIsVisible(true);
      }
    }, [baybayinText]);

    return baybayinText ? (
      <div
        className={`absolute flex flex-col items-center justify-end w-full pointer-events-none -bottom-8 transition-opacity ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute bottom-2 bg-green-300 h-14 z-20 w-1/2 rounded-xl shadow-lg flex items-center justify-center">
          <span className="w-full h-full text-center text-2xl">
            {baybayinText}
          </span>
        </div>
      </div>
    ) : null;
  };

  return (
    <div className="z-10 w-full flex items-center justify-center">
      <div className="relative z-20 flex flex-col justify-center items-center gap-4 w-full md:w-3/4 lg:w-[50%] aspect-[16/9] shadow-xl bg-[#D3DDFD] border-2 border-[#31384D]">
        <canvas
          ref={canvasRef}
          id="sketchpad"
          className="w-full h-full z-20"
        ></canvas>
        <CanvasOptions />
        <PredictionResult
          baybayinText={
            baybayinText ? baybayinToLatin(baybayinText) : baybayinText
          }
        />
        {baybayinText}
      </div>
    </div>
  );
};

const SketchpadComponent = (props: SketchpadProps) => {
  const inference = useInferenceStore();
  return (
    <SketchpadPropsContext.Provider value={{ inference, ...props }}>
      <SketchpadQuestionHolder />
      <SketchpadCanvas />
    </SketchpadPropsContext.Provider>
  );
};

export default SketchpadComponent;
