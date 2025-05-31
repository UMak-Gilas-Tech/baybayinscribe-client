"use client";

import { useState, useCallback, memo } from "react";
import { Clipboard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

type InputContainerProps = {
  title: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  className?: string;
  headerRight?: React.ReactNode;
};

const InputContainer = memo(function InputContainer({
  title,
  value,
  onChange,
  placeholder,
  className = "",
  headerRight,
}: InputContainerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!value) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = value;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand("copy");
        } catch (err) {
          console.error("Failed to copy text: ", err);
          toast.error("Failed to copy text");
          return;
        }

        textArea.remove();
      }

      setCopied(true);
      toast.success("Copied to clipboard!", {
        description: "The text has been copied to your clipboard.",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy text");
    }
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e);
    },
    [onChange]
  );

  return (
    <Card className="flex-1 w-full relative bg-blue-900 border-2 border-blue-300/25 rounded-t-xl lg:rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2 px-3 sm:px-4 md:px-6 flex flex-row items-center justify-between">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-300">
          {title}
        </h2>
        {headerRight}
      </CardHeader>
      <CardContent className="relative px-3 sm:px-4 md:px-6">
        <div className="relative">
          <Textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={`resize-none h-[150px] sm:h-[200px] md:h-[300px] lg:h-[400px] bg-neutral-white/25 backdrop-blur-sm border-blue-300/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-all duration-200 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed whitespace-pre-wrap break-words overflow-x-hidden ${className}`}
            style={{ wordBreak: "break-word" }}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  disabled={!value}
                  className={`absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 hover:bg-blue-800 transition-all duration-200 ${
                    !value ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
                  }`}
                >
                  {copied ? (
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-success-600 animate-heartbeat" />
                  ) : (
                    <Clipboard className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-300" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{value ? "Copy to clipboard" : "Nothing to copy"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
});

export { InputContainer };
