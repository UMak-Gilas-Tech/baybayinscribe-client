"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ErrorDialogProps = {
  error: string;
  open: boolean;
  onClose: () => void;
};

const ErrorDialog: React.FC<ErrorDialogProps> = ({ error, open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Error</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>{error}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorDialog;
