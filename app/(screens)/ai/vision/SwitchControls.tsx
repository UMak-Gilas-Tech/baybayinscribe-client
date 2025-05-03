"use client";
import React from "react";
import { Switch } from "@/components/ui/switch";

interface SwitchControlsProps {
  realTimeDetection: boolean;
  displayScannerGrid: boolean;

  onToggleScannerGrid: (value: boolean) => void;
  onToggleRealTimeDetection: (value: boolean) => void;
}

const SwitchControls = ({ realTimeDetection, onToggleRealTimeDetection, displayScannerGrid, onToggleScannerGrid }: SwitchControlsProps) => {

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
      <label className="flex items-center gap-2">
        <Switch
          checked={realTimeDetection}
          onCheckedChange={onToggleRealTimeDetection}
        />
        Real-time Detection
      </label>
      <label className="flex items-center gap-2">
        <Switch
          checked={displayScannerGrid}
          onCheckedChange={(checked) => onToggleScannerGrid(checked)}
        />
        Show Scanner Grid
      </label>
    </div>
  );
};

export default SwitchControls;
