import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import React from "react";

export type UserEngagementChartProps = {
  chartData: { month: string; total: number; daily: number }[];
  filter: string;
  setFilter: (f: string) => void;
};

export function UserEngagementChart({
  chartData,
  filter,
  setFilter,
}: UserEngagementChartProps) {
  return (
    <Card className="mt-6 w-full rounded-2xl shadow-none border-grey-300 bg-neutral-white">
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-blue-950 text-xl font-semibold font-sans leading-8">
            User Engagement Over Time (6 Months)
          </CardTitle>
          <CardDescription className="text-blue-400 text-lg font-normal font-sans leading-7">
            Tracking new signups and daily activity
          </CardDescription>
        </div>
        <div className="flex flex-col items-end gap-2">
          <select
            className="rounded-lg border border-blue-300 bg-blue-900 px-3 py-1 text-blue-950 font-medium focus:outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="6m">Last 6 Months</option>
            <option value="1m">This Month</option>
            <option value="1w">This Week</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-0">
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ left: 0, right: 0, top: 16, bottom: 0 }}
            >
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <Area
                type="monotone"
                dataKey="total"
                stackId="1"
                stroke="hsla(136, 53%, 43%, 1)"
                fill="hsla(136, 53%, 43%, 0.4)"
                fillOpacity={0.85}
                name="Total User"
              />
              <Area
                type="monotone"
                dataKey="daily"
                stackId="1"
                stroke="hsla(225, 65%, 52%, 1)"
                fill="hsla(225, 65%, 52%, 0.4)"
                fillOpacity={0.85}
                name="Daily Active Users"
              />
              <CartesianGrid stroke="hsla(225, 36%, 39%, 1)" vertical={false} />
              <Tooltip
                contentStyle={{
                  background: "hsla(225, 91%, 95%, 1)",
                  borderRadius: 8,
                  border: "1px solid hsla(225, 39%, 53%, 1)",
                  color: "hsla(225, 65%, 20%, 1)",
                }}
                labelStyle={{
                  color: "hsla(225, 36%, 39%, 1)",
                  fontWeight: 600,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Centered Custom Legend */}
        <div className="flex justify-center gap-8 mt-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-[#34A853] block" />
            <span className="text-blue-950 text-base font-medium">
              Total User
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-blue-700 block" />
            <span className="text-blue-950 text-base font-medium">
              Daily Active Users
            </span>
          </div>
        </div>
      </CardContent>
      <div className="px-6 pb-4 pt-2">
        <div className="flex items-center gap-2 text-blue-950 text-base font-medium">
          <span className="inline-block">↗</span> Daily usage up 5.2% this month
        </div>
        <div className="text-blue-400 text-base font-normal">Jan–Jun 2025</div>
      </div>
    </Card>
  );
}
