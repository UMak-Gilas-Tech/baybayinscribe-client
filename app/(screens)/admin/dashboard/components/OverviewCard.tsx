import { Card } from "@/components/ui/card";
import React from "react";

type OverviewCardTrend = {
  value: number;
  label: string;
};

export type OverviewCardProps = {
  icon: React.ReactNode;
  bgColor: string;
  iconBg: string;
  outlineColor?: string;
  title: string;
  value: string | number;
  trend?: OverviewCardTrend;
};

export function OverviewCard({
  icon,
  bgColor,
  iconBg,
  outlineColor,
  title,
  value,
  trend,
}: OverviewCardProps) {
  const isPositive = trend && trend.value >= 0;
  return (
    <Card
      className={`flex-1 px-4 py-6 ${bgColor} rounded-xl outline-2 outline-offset-[-1px] outline-slate-500 flex flex-col justify-center items-start gap-2.5`}
    >
      <div className="self-stretch flex justify-start items-center gap-2.5 w-full">
        <div
          className={`p-1.5 ${iconBg} rounded-xl flex justify-center items-center`}
        >
          <div className="w-9 h-9 relative flex items-center justify-center">
            <div
              className={`w-7 h-7 absolute outline-2 outline-offset-[-1px] ${outlineColor} flex items-center justify-center`}
            >
              {icon}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-">
          <div className="text-blue-950 text-base font-normal font-sans leading-normal w-full">
            {title}
          </div>
          <div className="h-9 text-blue-950 text-5xl font-semibold font-sans leading-12 w-full mb-4">
            {value}
          </div>
          {trend && (
            <div
              className={`text-sm font-medium font-sans leading-tight w-full flex items-center gap-1 ${
                isPositive ? "text-green-700" : "text-red-700"
              }`}
            >
              {isPositive ? (
                <>
                  +{Math.abs(trend.value)}% {trend.label}{" "}
                  <span aria-label="up" className="inline-block">
                    ↑
                  </span>
                </>
              ) : (
                <>
                  -{Math.abs(trend.value)}% {trend.label}{" "}
                  <span aria-label="down" className="inline-block">
                    ↓
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
