"use client";
import React, { useRef, useState, useEffect } from "react";
import { Pencil, Undo, Trash, ChevronDown, InfoIcon } from "lucide-react";
import {
  useInferenceStore,
  InferenceState,
} from "@/app/store/store.inference";
import { baybayinToLatin } from "@/lib/baybayify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  CharacterSelectionDrawer,
  CharacterSelectionItem,
} from "./CharacterSelection";
import { useSketchpad } from "@/app/contexts/SketchpadContext";
import SketchpadInformation from "./SketchpadInformation";
import { isPromise } from "@/lib/isPromise";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface StandaloneSketchpadProps {
  setModelLoading?: (loading: boolean) => void;
}

const StandaloneSketchpad: React.FC<StandaloneSketchpadProps> = ({ setModelLoading }) => {
  const sketchpadContext = useSketchpad();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [strokeWidth, setStrokeWidth] = useState<number>(5);
  const [openGuide, setOpenGuide] = useState(false);
  const [showResultDrawer, setShowResultDrawer] = useState(false);
  const widthDragRef = useRef<{ startY: number; startWidth: number } | null>(
    null
  );
  const inference = useInferenceStore() as InferenceState;

  // initialise model
  useEffect(() => {
    let cancelled = false;
    if (setModelLoading) setModelLoading(true);
    const maybePromise = inference.initLocalModel();
    if (isPromise(maybePromise)) {
      maybePromise.finally(() => {
        if (!cancelled && setModelLoading) setModelLoading(false);
      });
    } else {
      if (setModelLoading) setModelLoading(false);
    }
    return () => {
      cancelled = true;
    };
  }, []);

  // redraw on resize
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      const temp = document.createElement("canvas");
      temp.width = c.width;
      temp.height = c.height;
      temp.getContext("2d")?.drawImage(c, 0, 0);
      c.width = c.parentElement!.clientWidth;
      c.height = c.parentElement!.clientHeight;
      ctx.drawImage(temp, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // inference result watcher
  useEffect(() => {
    if (inference.localInferenceResult?.length) {
      const str = inference.localInferenceResult
        .map((i) => i.className)
        .join("");
      setResult(str);
      setShowResultDrawer(true); // open drawer when results are available
    }
  }, [inference.localInferenceResult]);

  const handleWidthMouseMove = (e: MouseEvent) => {
    if (!widthDragRef.current) return;
    const delta = widthDragRef.current.startY - e.clientY;
    const newW = Math.min(
      50,
      Math.max(1, widthDragRef.current.startWidth + Math.round(delta / 2))
    );
    setStrokeWidth(newW);
  };

  const handleWidthMouseUp = () => {
    window.removeEventListener("mousemove", handleWidthMouseMove);
    window.removeEventListener("mouseup", handleWidthMouseUp);
    widthDragRef.current = null;
  };

  const handleWidthMouseDown = (e: React.MouseEvent) => {
    widthDragRef.current = { startY: e.clientY, startWidth: strokeWidth };
    window.addEventListener("mousemove", handleWidthMouseMove);
    window.addEventListener("mouseup", handleWidthMouseUp);
  };

  const start = (e: MouseEvent) => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    setHistory((h) => [...h, ctx.getImageData(0, 0, c.width, c.height)]);
    ctx.lineWidth = strokeWidth;
    setDrawing(true);
    const r = c.getBoundingClientRect();
    const scaleX = c.width / r.width;
    const scaleY = c.height / r.height;
    const x = (e.clientX - r.left) * scaleX;
    const y = (e.clientY - r.top) * scaleY;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: MouseEvent) => {
    if (!drawing) return;
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const r = c.getBoundingClientRect();
    const scaleX = c.width / r.width;
    const scaleY = c.height / r.height;
    const x = (e.clientX - r.left) * scaleX;
    const y = (e.clientY - r.top) * scaleY;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const end = () => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    setDrawing(false);
  };

  const undo = () => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (c && ctx && history.length) {
      const prev = history[history.length - 1];
      ctx.putImageData(prev, 0, 0);
      setHistory((h) => h.slice(0, -1));
    }
  };

  const clear = () => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (c && ctx) {
      ctx.clearRect(0, 0, c.width, c.height);
      setHistory([]);
      setResult(null);
    }
  };

  // add submit handler
  const handleSubmit = () => {
    inference.inferLocal(undefined, canvasRef.current!, false, true);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="flex flex-row flex-nowrap items-center gap-4 w-full md:w-3/4 h-14">
        <div className="w-56 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full bg-transparent border-2 border-stone-500 text-black">
                <span className="text-start w-full">AI Model</span>{" "}
                <ChevronDown size={40} />{" "}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem textValue="hi">Hello</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="w-[0.5px] h-full bg-black flex-shrink-0"></div>

        <div className="w-full h-36 flex flex-row gap-4 overflow-x-auto">
          {sketchpadContext.selectedCharacters.map((label, index) => (
            <CharacterSelectionItem
              key={index}
              label={label}
              character={baybayinToLatin(label)}
              onClick={() => {
                sketchpadContext.setSelectedCharacters(
                  sketchpadContext.selectedCharacters.filter((c) => c !== label)
                );
              }}
            />
          ))}
          <CharacterSelectionItem
            onClick={() => {
              sketchpadContext.setBaybayinCharacterDrawerOpen(true);
            }}
            className="aspect-square h-full"
            label={""}
            character={""}
            arrow={sketchpadContext.selectedCharacters.length > 0}
          />
        </div>
      </div>
      <CharacterSelectionDrawer />
      <div className="flex flex-col-reverse md:flex-row items-start gap-4 w-full md:w-3/4 h-[60%]">
        <div className="flex flex-row px-10 md:px-0 md:flex-col space-x-2 md:space-x-0 md:space-y-2">
          <button
            onClick={clear}
            className="p-4 rounded-full shadow-xl transition duration-300 ease-in-out bg-[#576eb6] hover:bg-[#6e81b9] hover:scale-95"
          >
            <Trash size={20} className="text-[#ffd8b9]" />
          </button>
          <button
            onClick={undo}
            className="p-4 rounded-full shadow-xl transition duration-300 ease-in-out bg-[#576eb6] hover:bg-[#6e81b9] hover:scale-95"
          >
            <Undo size={20} className="text-[#ffd8b9]" />
          </button>
          <button className="p-4 rounded-full shadow-xl transition duration-300 ease-in-out bg-[#576eb6] hover:bg-[#6e81b9] hover:scale-95">
            <Pencil size={20} className="text-[#ffd8b9]" />
          </button>
          <div className="h-full w-[1px] md:w-full md:h-[1px] my-0 md:my-4  bg-black"></div>
          <div
            onMouseDown={handleWidthMouseDown}
            className="w-13 h-13 aspect-square rounded-full bg-[#576eb6] flex items-center justify-center cursor-ns-resize shadow-xl transition"
          >
            <div
              className="bg-[#ffd8b9] rounded-full"
              style={{
                width: `${Math.max(4, strokeWidth)}px`,
                height: `${Math.max(4, strokeWidth)}px`,
              }}
            />
          </div>

          <button onClick={() => setOpenGuide(true)} className="p-4 rounded-full shadow-xl transition duration-300 ease-in-out bg-[#576eb6] hover:bg-[#6e81b9] hover:scale-95">
            <InfoIcon size={20} className="text-[#ffd8b9]" />
          </button>
        </div>
        <div className="relative w-full h-full">
          <canvas
            ref={canvasRef}
            className="w-full h-full aspect-video bg-[#f0f0f0] shadow-lg border-2 border-stone-200 rounded-lg"
            onMouseDown={(e) => start(e.nativeEvent)}
            onMouseMove={(e) => draw(e.nativeEvent)}
            onMouseUp={end}
            onMouseLeave={end}
          />
          {sketchpadContext.selectedCharacters.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
              <span
                className="text-gray-400 whitespace-pre font-[Baybayin_Simple_TAWBID]"
                style={{
                  fontSize: `${
                    Math.min(
                      (canvasRef.current?.width || 0) /
                        sketchpadContext.selectedCharacters.length,
                      (canvasRef.current?.height || 0)
                    ) || 20
                  }px`,
                }}
              >
                {sketchpadContext.selectedCharacters.join("")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* submit button below canvas */}
      <div className="mt-4 w-full px-10 lg:w-3/4 lg:px-2 ">
        <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600">
          Submit
        </Button>
      </div>

      {/* Results Drawer using shadcn/ui */}
      <Dialog open={showResultDrawer} onOpenChange={setShowResultDrawer}>
        <DialogContent side="right" className="sm:max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Recognition Results</DialogTitle>
            <DialogDescription>
              Feedback for each detected character.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            {inference.localInferenceResult && inference.localInferenceResult.length > 0 ? (
              inference.localInferenceResult.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-3 rounded-md bg-muted border"
                >
                  <span className="text-3xl font-[Baybayin_Simple_TAWBID]">{item.className}</span>
                  <span className="text-lg text-muted-foreground">{baybayinToLatin(item.className)}</span>
                  <span className="ml-auto text-xs text-gray-500">
                    {(item.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-center">No results</div>
            )}
            {inference.localInferenceResult && inference.localInferenceResult.length > 0 && (
              <div className="mt-2 text-xs text-muted-foreground">
                <b>Bounding Boxes:</b>
                <ul className="list-disc ml-5">
                  {inference.localInferenceResult.map((item, idx) => (
                    <li key={idx}>
                      x: {item.x.toFixed(1)}, y: {item.y.toFixed(1)}, w: {item.width.toFixed(1)}, h: {item.height.toFixed(1)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <SketchpadInformation open={openGuide} setOpen={setOpenGuide} />
    </div>
  );
};

export default StandaloneSketchpad;
