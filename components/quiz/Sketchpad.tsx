"use client";
import { Eraser, Pencil, Undo } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";

const SketchpadQuestionHolder = () => {
  return (
    <div className="z-20 flex flex-col justify-center items-center">
      <div className="z-10 grid place-items-center bg-[#3f5087] border-2 border-[#31384D] w-full md:w-3/4 lg:w-[60%] h-20 rounded-xl shadow-xl">
        <p className="text-center text-[#ffd8b9] font-bold text-2xl">
          Sketchpad
        </p>
      </div>
    </div>
  );
};

const SketchpadCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [isErasing, setIsErasing] = useState(false);

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
      setHistory((prev) => [...prev, context.getImageData(0, 0, canvas.width, canvas.height)]);
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

  const handleErase = () => {
    setIsErasing((prev) => !prev);
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      context.globalCompositeOperation = isErasing ? "source-over" : "destination-out";
    }
  };

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
    setIsErasing(false);
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      context.globalCompositeOperation = "source-over";
      context.strokeStyle = "#000000";
    }
  };

  const CanvasOptions = () => {
    return (
      <div className="absolute flex flex-col justify-evenly h-full -left-8">
        <div
          className="aspect-square h-14 bg-[#576eb6] rounded-lg shadow-lg grid place-items-center cursor-pointer"
          onClick={handleDraw}
        >
          <Pencil size={30} className="text-[#ffd8b9]" />
        </div>

        <div
          className="aspect-square h-14 bg-[#576eb6] rounded-lg shadow-lg grid place-items-center cursor-pointer"
          onClick={handleErase}
        >
          <Eraser size={30} className="text-[#ffd8b9]" />
        </div>

        <div
          className="aspect-square h-14 bg-[#576eb6] rounded-lg shadow-lg grid place-items-center cursor-pointer"
          onClick={handleUndo}
        >
          <Undo size={30} className="text-[#ffd8b9]" />
        </div>

        <div
          className="aspect-square h-14 bg-[#576eb6] rounded-lg shadow-lg grid place-items-center cursor-pointer"
          onClick={handleClear}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-[#ffd8b9]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 6h18M9 6v12m6-12v12M4 6l1.5 12.5a2 2 0 002 1.5h9a2 2 0 002-1.5L20 6"
            />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="z-10 w-full flex items-center justify-center">
      <div className="relative z-20 flex flex-col justify-center items-center gap-4 w-full md:w-3/4 lg:w-1/2 h-96 shadow-xl bg-[#D3DDFD] border-2 border-[#31384D]">
        <canvas
          ref={canvasRef}
          id="sketchpad"
          className="w-full h-full z-20"
        ></canvas>
        <CanvasOptions />
      </div>
    </div>
  );
};

const SketchpadComponent = () => {
  return (
    <div className="">
      <SketchpadQuestionHolder />
      <SketchpadCanvas />
    </div>
  );
};

export default SketchpadComponent;
