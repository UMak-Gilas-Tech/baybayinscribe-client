"use client";

import React, { useRef, useState, useEffect} from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown.menu";
import { Popover } from "@/components/ui/popover";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import {
  ChevronDown,
  ChevronsUpDown,
  History,
  Settings,
  TextQuote,
  Webcam,
} from "lucide-react";
import SwitchControls from "./SwitchControls";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Card, CardContent } from "@/components/ui/card";
import ButtyTextBubble from "@/public/images/ButtyTextBubble.png";
import ButtyRead from "@/public/images/ButtyRead.png";
import InferenceWebcam, {
  InferenceWebcamHandle,
} from "@/components/InferenceWebcam";
import BaybayinLatin from "@/components/baybayin_latin";
import {
  InferenceResult,
  InferenceResultHistory,
} from "@/types/type.inference";

interface WebcamConfigProps {
  onSelectCamera: (deviceId: string) => void;
  cameras: MediaDeviceInfo[];
  disable: boolean;
}

const WebcamConfig = ({
  onSelectCamera,
  cameras,
  disable: disableCamera,
}: WebcamConfigProps) => {
  return (
    <div className="z-20 w-full flex flex-row justify-evenly items-center">
      <Webcam size={30} />

      <Popover>
        <PopoverTrigger disabled={disableCamera} asChild>
          <Button
            disabled={disableCamera}
            className="bg-transparent hover:bg-transparent text-black flex-1 flex flex-row justify-evenly items-center gap-3"
          >
            <div className="flex flex-row gap-2 items-center justify-center">
              <Settings size={20} />
              <span className="underline">Camera Preference</span>
            </div>

            <ChevronsUpDown size={20} className="text-black" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="translate-x-1/4 w-full max-w-sm bg-white shadow-lg rounded-md p-4">
          <div className="flex flex-col">
            <h2 className="text-xl">Camera Preferences</h2>
            <p>Camera</p>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full mt-2 text-start">
                  <span className="w-full text-start">
                    {cameras.length > 0 ? cameras[0].label : "Select Camera"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full max-w-xs rounded-xl shadow-xl bg-white p-2">
                {cameras.map((camera, index) => (
                  <DropdownMenuItem
                    key={camera.deviceId}
                    onClick={() => onSelectCamera(camera.deviceId)}
                  >
                    {camera.label || `Camera ${index + 1}`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex flex-row justify-end items-end gap-1 pt-4">
              <Button className="border-2">Cancel</Button>
              <Button className="border-2 bg-black text-white">Save</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex-1 mt-2 text-start bg-transparent hover:bg-transparent rounded-full"
          >
            <span className="w-full text-start">AI Model</span>
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full max-w-xs rounded-xl shadow-xl bg-white p-2">
          <DropdownMenuItem>Agos AI - Local</DropdownMenuItem>
          <DropdownMenuItem>Agos AI - Online</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const VisionScreen = () => {
  const webcamRef = useRef<InferenceWebcamHandle | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);

  const [detectedBaybayinText, setDetectedBaybayinText] = useState<
    InferenceResult[] | undefined
  >();
  const [bubbleText, setBubbleText] = useState<string>("Hi, i'm Butty!");
  const [realTimeDetection, setRealTimeDetection] = useState(false);
  const [displayScannerGrid, setDisplayScannerGrid] = useState(false);
  const [history, setHistory] = useState<InferenceResultHistory[] | undefined>(
    undefined
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [seenText, setSeenText] = useState(false);
  useEffect(() => {
    // load history
    loadHistory();

    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        setCameras(videoDevices);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (detectedBaybayinText && !seenText) {
      changeButtyCharacterBubbleText();
    }
  }, [detectedBaybayinText]);

  const loadHistory = () => {
    const history = localStorage.getItem("detectedBaybayinText");
    console.log(history == "undefined");

    if (history != "undefined") {
      const parsedHistory = JSON.parse(history!) as InferenceResultHistory[];
      console.log(parsedHistory);
      setHistory(parsedHistory);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("detectedBaybayinText");
    setHistory([]);
  };

  const changeButtyCharacterBubbleText = () => {
    const confidenceAvg =
      detectedBaybayinText!.reduce((acc, curr) => acc + curr.confidence, 0) /
      detectedBaybayinText!.length;

    console.log(confidenceAvg);
    if (confidenceAvg > 0.8) {
      setBubbleText("Wow! I can read Baybayin!");
    } else if (confidenceAvg > 0.5) {
      setBubbleText("I think I can read Baybayin!");
    } else if (confidenceAvg > 0.3) {
      setBubbleText("I can read some Baybayin!");
    } else if (confidenceAvg > 0.1) {
      setBubbleText("I can read a little Baybayin!");
    } else {
      setBubbleText("Let me see those characters!");
    }
  };

  const handleSelectCamera = (deviceId: string) => {
    webcamRef.current?.setCameraDevice(deviceId);
  };

  return (
    <div className="relative flex flex-col md:flex-row h-full w-full gap-6 p-4 md:gap-10 md:p-10">
      <div className="flex-1 w-full flex flex-col items-center z-10 mb-6 md:mb-0">
        <WebcamConfig
          disable={!realTimeDetection}
          onSelectCamera={handleSelectCamera}
          cameras={cameras}
        />

        <InferenceWebcam
          imageOnly={!realTimeDetection}
          onDetect={(text) => {
            // If text is null/undefined or empty, do nothing.
            if (!text || text.length === 0) return;

            // Create a list of current characters.
            const currentDetection = text.map((i) => i.className);

            // Prevent duplicate submissions: compare with the last history entry.
            if (history && history.length > 0) {
              const lastDetection =
                history[history.length - 1].detectedBaybayinString;
              if (
                JSON.stringify(lastDetection) ===
                JSON.stringify(currentDetection)
              ) {
                return;
              }
            }

            setDetectedBaybayinText(text);

            if (!realTimeDetection) {
              const confidenceAvg =
                text.reduce((acc, curr) => acc + curr.confidence, 0) /
                text.length;
              const tempHistory = history ?? [];

              tempHistory.push({
                detectedBaybayinString: currentDetection,
                timestamp: new Date().toISOString(),
                avgConfidence: confidenceAvg,
              } as InferenceResultHistory);

              console.log(tempHistory);
              localStorage.setItem(
                "detectedBaybayinText",
                JSON.stringify(tempHistory)
              );

              setHistory(tempHistory);
            }
          }}
          ref={webcamRef}
          sizeClass="w-full aspect-[4/3] md:aspect-[8/6]"
          showScannerGrid={displayScannerGrid}
        />

        <SwitchControls
          displayScannerGrid={displayScannerGrid}
          onToggleScannerGrid={(v) => setDisplayScannerGrid(v)}
          onToggleRealTimeDetection={(v) => setRealTimeDetection(v)}
          realTimeDetection={realTimeDetection}
        />
      </div>

      <div className="flex-1 w-full flex flex-col gap-4">
        <Tabs defaultValue="translit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="translit"
              className="flex flex-row justify-evenly"
            >
              <TextQuote /> Detected Transliteration
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex flex-row justify-evenly"
            >
              <History />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="translit">
            <Card className="w-full h-auto mt-4 flex flex-col">
              <CardContent className="w-full flex-grow">
                {detectedBaybayinText == undefined ? (
                  <span>Detected baybayin text will go here.</span>
                ) : (
                  <BaybayinLatin
                    characters={detectedBaybayinText.map((i) => i.className)}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="w-full h-auto mt-4 overflow-y-auto">
              <CardContent className="w-full">
                <div className="flex justify-end mb-2">
                  <Button onClick={clearHistory}>Clear History</Button>
                </div>
                {history && history.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {history.map((i, index) => {
                      return (
                        <>
                          <div className="flex flex-row items-end">
                            <span className="pl-2 pr-6">{index + 1}. </span>
                            <div className="flex-1">
                              <BaybayinLatin
                                key={index}
                                characters={i.detectedBaybayinString}
                              />
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <span>
                                Avg Confidence:{" "}
                                {Math.round(i.avgConfidence * 100)}%
                              </span>
                              <span>
                                Scanned on:{" "}
                                {new Date(i.timestamp).toDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="h-[0.2px] opacity-50 bg-gray-500 w-full"></div>
                        </>
                      );
                    })}
                  </div>
                ) : (
                  <span>History of detected baybayin text will go here.</span>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Butty Character */}
        <div className="mt-6 w-full flex justify-center md:justify-end md:absolute md:bottom-4 md:right-4">
          <div className="relative w-40 h-24 md:w-48 md:h-32">
            <img
              src={ButtyRead.src}
              className="absolute bottom-0 right-0 w-full h-full object-contain"
            />
            <img
              src={ButtyTextBubble.src}
              className="absolute top-0 left-0 w-3/4 object-contain"
            />
            <span className="absolute top-4 left-6 w-24 text-center text-sm px-1">
              {bubbleText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionScreen;
