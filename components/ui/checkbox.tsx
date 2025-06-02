"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer bg-blue-900/40 border-blue-300 dark:bg-input/30 data-[state=checked]:bg-blue-300 data-[state=checked]:text-neutral-white dark:data-[state=checked]:bg-blue-300 data-[state=checked]:border-blue-300 focus-visible:border-blue-300 focus-visible:ring-blue-300/50 aria-invalid:ring-danger-300/20 dark:aria-invalid:ring-danger-300/40 aria-invalid:border-danger-300 size-4 shrink-0 rounded-[4px] border shadow-xs duration-500 transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
