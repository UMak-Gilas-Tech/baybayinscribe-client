import { Card } from "@/components/ui/card";
import {
  Server,
  Database,
  Gauge,
  GitBranch,
  Scan,
  Pencil,
  Bot,
  Languages,
} from "lucide-react";
import React from "react";

export type SystemHealthItem = {
  label: string;
  status: string;
};

function getStatusBadge(status: string) {
  if (["Online", "Connected"].includes(status)) {
    return "bg-green-200 text-green-800";
  }
  if (["Offline", "Disconnected"].includes(status)) {
    return "bg-gray-200 text-gray-700";
  }
  if (["Error", "Failed"].includes(status)) {
    return "bg-red-100 text-red-700";
  }
  return "text-blue-900 font-bold";
}

const healthIcons: Record<string, React.ReactNode> = {
  "API Server": <Server className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  "Response Time": <Gauge className="w-5 h-5" />,
  "Current Version": <GitBranch className="w-5 h-5" />,
  "AI Scanner": <Scan className="w-5 h-5" />,
  "AI Sketch": <Pencil className="w-5 h-5" />,
  "AI Chatbot": <Bot className="w-5 h-5" />,
  "AI Transliterator": <Languages className="w-5 h-5" />,
};

function HealthSection({ items }: { items: SystemHealthItem[] }) {
  return (
    <Card className="bg-neutral-white rounded-2xl p-6 w-full border-grey-300 border-1">
      <div className="grid grid-cols-2 gap-y-4 items-center">
        {items.map((item) => (
          <React.Fragment key={item.label}>
            <div className="flex min-w-[145px] items-center gap-2 text-blue-200">
              {healthIcons[item.label]}
              <span className="w-full text-base">{item.label}</span>
            </div>
            <div className="flex text-blue-20 justify-end">
              {[
                "Online",
                "Connected",
                "Offline",
                "Disconnected",
                "Error",
                "Failed",
              ].includes(item.status) ? (
                <span
                  className={`px-4 py-1 rounded-full font-semibold ${getStatusBadge(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              ) : (
                <span className="font-semibold">{item.status}</span>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
}

export function SystemHealthCard({
  systemHealth,
}: {
  systemHealth: SystemHealthItem[];
}) {
  return (
    <div className="flex flex-col xl:flex-row gap-4">
      <HealthSection items={systemHealth.slice(0, 4)} />
      <HealthSection items={systemHealth.slice(4)} />
    </div>
  );
}
