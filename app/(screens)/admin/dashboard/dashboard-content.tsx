"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  AreaChartIcon,
  Activity,
  MessageCircle,
  Users,
} from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const systemHealth = [
  {
    label: "API Server",
    status: "Online",
    color: "bg-green-200 text-green-800",
  },
  {
    label: "Database",
    status: "Connected",
    color: "bg-green-200 text-green-800",
  },
  {
    label: "Response Time",
    status: "128ms",
    color: "bg-blue-100 text-blue-800",
  },
  {
    label: "Current Version",
    status: "Alpha v1.0.5",
    color: "bg-blue-100 text-blue-800",
  },
  {
    label: "AI Scanner",
    status: "Offline",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    label: "AI Sketch",
    status: "Online",
    color: "bg-green-200 text-green-800",
  },
  {
    label: "AI Chatbot",
    status: "Online",
    color: "bg-green-200 text-green-800",
  },
  {
    label: "AI Transliterator",
    status: "Online",
    color: "bg-green-200 text-green-800",
  },
];

const logs = [
  {
    type: "info",
    message: "New user registered: @JamalAbsadullah",
    time: "10:24 AM 04-26-2025",
  },
  {
    type: "warning",
    message: "High number of login attempt is detected",
    time: "10:24 AM 04-26-2025",
  },
  {
    type: "error",
    message: "User @Baybyein deleted its account",
    time: "10:24 AM 04-26-2025",
  },
  {
    type: "success",
    message: 'Success: "Lesson 4 published"',
    time: "10:24 AM 04-26-2025",
  },
  {
    type: "success",
    message: "Sample success message here",
    time: "10:24 AM 04-26-2025",
  },
];

const reports = [
  {
    type: "Lesson",
    name: "Baybayin Kudlit",
    issue: "Confusing Instruction",
    reporter: "@Miga",
    date: "04/26/2025",
  },
  {
    type: "General",
    name: "—",
    issue: "Bug Report",
    reporter: "@Ja_mal",
    date: "04/26/2025",
  },
  {
    type: "Quiz",
    name: "Baybayin Kudlit Quiz",
    issue: "Incorrect Answer",
    reporter: "@Jamantoin3t",
    date: "04/26/2025",
  },
];

type OverviewCardTrend = {
  value: number;
  label: string;
};

type OverviewCardProps = {
  icon: React.ReactNode;
  bgColor: string;
  iconBg: string;
  outlineColor?: string;
  title: string;
  value: string | number;
  trend?: OverviewCardTrend;
};

function OverviewCard({
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

const chartData = [
  { month: "Jan", total: 320, daily: 120 },
  { month: "Feb", total: 410, daily: 180 },
  { month: "Mar", total: 350, daily: 140 },
  { month: "Apr", total: 300, daily: 130 },
  { month: "May", total: 370, daily: 150 },
  { month: "Jun", total: 390, daily: 160 },
];

export default function AdminDashboardContent() {
  const [filter, setFilter] = useState("6m");
  return (
    <div className="flex flex-col gap-4 px-2 md:px-6 bg-[var(--color-blue-900)] min-h-screen w-full flex-1 min-w-0 overflow-x-auto">
      {/* Header */}
      <h1 className="text-blue-950 text-4xl font-semibold font-sans leading-10 text-left w-full my-6">
        Admin Dashboard
      </h1>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {/* Column 1 */}
        <div className="flex flex-col">
          {/* Row 1: Overview cards */}
          <p className="justify-center text-blue-950 text-2xl font-semibold font-sans leading-loose text-left w-full">
            Overview
          </p>
          <div className="flex flex-col sm:flex-row gap-x-4">
            <OverviewCard
              icon={<Users className="w-6 h-6 text-blue-950" />}
              bgColor="bg-green-600/25"
              iconBg="bg-green-600/50"
              outlineColor="outline-none"
              title="Total Registered Users"
              value="100"
              trend={{ value: 2.4, label: "this week" }}
            />
            <OverviewCard
              icon={<AreaChartIcon className="w-6 h-6 text-blue-950" />}
              bgColor="bg-blue-700/25"
              iconBg="bg-blue-700/30"
              outlineColor="outline-none"
              title="Daily Active Users"
              value="210"
              trend={{ value: -1.2, label: "this week" }}
            />
          </div>
          {/* Row 2: Analysis */}
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
                    <CartesianGrid
                      stroke="hsla(225, 36%, 39%, 1)"
                      vertical={false}
                    />
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
                <span className="inline-block">↗</span> Daily usage up 5.2% this
                month
              </div>
              <div className="text-blue-400 text-base font-normal">
                Jan–Jun 2025
              </div>
            </div>
          </Card>
        </div>
        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          {/* Row 1: System Health */}
          <Card className="col-span-1 md:col-span-1 flex flex-col gap-2 bg-white border-blue-200 w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-900 text-lg font-semibold">
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 p-2">
              {systemHealth.slice(0, 4).map((item, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 rounded text-xs font-semibold ${item.color}`}
                >
                  {item.label}: {item.status}
                </span>
              ))}
              <div className="w-full border-t border-blue-100 my-1"></div>
              {systemHealth.slice(4).map((item, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 rounded text-xs font-semibold ${item.color}`}
                >
                  {item.label}: {item.status}
                </span>
              ))}
            </CardContent>
          </Card>
          {/* Row 2: System-Generated Logs */}
          <Card className="mt-2 w-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-blue-900 text-lg font-semibold">
                System-Generated Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 rounded bg-blue-50 border border-blue-100 w-full"
                >
                  {log.type === "info" && (
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                  )}
                  {log.type === "warning" && (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  )}
                  {log.type === "error" && (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  {log.type === "success" && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  <span className="flex-1 text-blue-900 text-sm">
                    {log.message}
                  </span>
                  <span className="text-xs text-blue-400">{log.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User-Generated Flag & Reports */}
      <Card className="mt-2 w-full">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-blue-900 text-lg font-semibold">
            User-Generated Flag & Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-blue-900 text-sm">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 text-left font-semibold">Type</th>
                <th className="px-4 py-2 text-left font-semibold">
                  Content Name
                </th>
                <th className="px-4 py-2 text-left font-semibold">Issue</th>
                <th className="px-4 py-2 text-left font-semibold">
                  Reported By
                </th>
                <th className="px-4 py-2 text-left font-semibold">Date</th>
                <th className="px-4 py-2 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, i) => (
                <tr key={i} className="border-b border-blue-100">
                  <td className="px-4 py-2">{report.type}</td>
                  <td className="px-4 py-2">{report.name}</td>
                  <td className="px-4 py-2">{report.issue}</td>
                  <td className="px-4 py-2">{report.reporter}</td>
                  <td className="px-4 py-2">{report.date}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button
                      size="sm"
                      className="bg-blue-400 text-white px-3 py-1 rounded"
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-400 text-blue-400 px-3 py-1 rounded"
                    >
                      Dismiss
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
