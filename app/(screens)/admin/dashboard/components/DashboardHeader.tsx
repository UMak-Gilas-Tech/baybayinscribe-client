import { RefreshCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function DashboardHeader({
  isRefreshing,
  onRefresh,
}: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between w-full mt-6 mb-2">
      <h1 className="text-blue-950 text-4xl font-semibold font-sans leading-10 text-left">
        Admin Dashboard
      </h1>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-blue-700/30 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2 hover:scale-110"
            >
              <RefreshCw
                className={`w-5 h-5 text-blue-950 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
              <span className="text-sm text-blue-950 font-medium">Refresh</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Refresh dashboard data</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </header>
  );
}
