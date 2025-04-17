"use client";

import React, { useRef, useState, useEffect } from "react";
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
import InferenceWebcam from "@/components/InferenceWebcam";
import BaybayinLatin from "@/components/baybayin_latin";
import { InferenceResult } from "@/types/inference";

interface WebcamConfigProps {
  onSelectCamera: (deviceId: string) => void;
  cameras: MediaDeviceInfo[];
  disable: boolean;
}

const WebcamConfig = ({ onSelectCamera, cameras, disable: disableCamera }: WebcamConfigProps) => {
  return (
    <div className="z-20 w-full flex flex-row justify-evenly items-center">
      <Webcam size={30} />

      <Popover>
        <PopoverTrigger disabled={disableCamera} asChild>
          <Button disabled={disableCamera} className="bg-transparent hover:bg-transparent text-black flex-1 flex flex-row justify-evenly items-center gap-3">
            <div className="flex flex-row gap-2 items-center justify-center">
              <Settings size={20} />
              <span className="underline">Camera Preference</span>
            </div>

            <ChevronsUpDown size={20} className="text-black" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="translate-x-1/4 w-96 bg-white shadow-lg rounded-md p-4">
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
              <DropdownMenuContent className="w-90 rounded-xl shadow-xl bg-white p-2">
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
        <DropdownMenuContent className="w-80 flex-1 rounded-xl shadow-xl bg-white p-2">
          <DropdownMenuItem>Agos AI - Local</DropdownMenuItem>
          <DropdownMenuItem>Agos AI - Online</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const VisionScreen = () => {
  const webcamRef = useRef<any>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);

  const [detectedBaybayinText, setDetectedBaybayinText] = useState<
    InferenceResult[] | undefined
  >();
  const [bubbleText, setBubbleText] = useState<string>("Hi, i'm Butty!");
  const [realTimeDetection, setRealTimeDetection] = useState(false);
  const [displayScannerGrid, setDisplayScannerGrid] = useState(false);
  const [seenText, setSeenText] = useState(false);
  useEffect(() => {
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
    <div className="flex flex-row h-full w-full gap-10 p-10">
      <div className="h-full w-full flex flex-col items-center z-10 flex-1">
        <WebcamConfig disable={!realTimeDetection} onSelectCamera={handleSelectCamera} cameras={cameras} />

        <InferenceWebcam
          imageOnly={!realTimeDetection}
          onDetect={(text) => {
            setDetectedBaybayinText(text);
          }}
          ref={webcamRef}
          sizeClass="aspect-[8/6] w-full"
          showScannerGrid={displayScannerGrid}
        />

        <SwitchControls
          displayScannerGrid={displayScannerGrid}
          onToggleScannerGrid={(v) => setDisplayScannerGrid(v)}
          onToggleRealTimeDetection={(v) => setRealTimeDetection(v)}
          realTimeDetection={realTimeDetection}
        />
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <Tabs defaultValue="translit" className="w-full h-full">
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
            <Card className="h-[90%] mt-4">
              <CardContent className="h-[80%]">
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
        </Tabs>

        <div className="flex flex-row justify-end items-end h-[20%]">
          {/* Butty Character */}
          <div className="h-24 w-54 relative">
            <img
              className="-translate-x-10 -translate-y-20 absolute"
              src={ButtyTextBubble.src}
            />
            <span className="text-center -translate-x-9 -translate-y-14 absolute w-44">
              {bubbleText}
            </span>
          </div>
          <img className="h-full scale-150" src={ButtyRead.src} />
        </div>
      </div>
    </div>
  );
};

export default VisionScreen;
