"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle,
  Users,
  AreaChartIcon,
  HeartPulse,
  ListIcon,
  Circle,
} from "lucide-react";
import { useState } from "react";
import { OverviewCard } from "./components/OverviewCard";
import { UserEngagementChart } from "./components/UserEngagementChart";
import { SystemHealthCard } from "./components/SystemHealthCard";

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
    <div className="container mx-auto flex flex-col gap-4 px-2 md:px-6 min-h-screen w-full flex-1 min-w-0 overflow-x-auto">
      {/* Header */}
      <h1 className="text-blue-950 text-4xl font-semibold font-sans leading-10 text-left w-full mt-6 mb-2">
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
          {/* Row 2: User Engagement Chart */}
          <UserEngagementChart
            chartData={chartData}
            filter={filter}
            setFilter={setFilter}
          />
        </div>
        {/* Column 2 */}
        <div className="flex flex-col gap-6">
          {/* Row 1: System Health */}
          <div>
            <div className="flex xl:flex-row gap-2 items-center mb-2">
              <span className="p-1 bg-blue-700/30 rounded-xl inline-flex justify-start items-center">
                <HeartPulse strokeWidth={1.5} className="w-9 h-9" />
              </span>
              <p className="text-blue-950 text-2xl font-semibold font-sans leading-loose text-left w-full">
                System Health
              </p>
            </div>
            <SystemHealthCard systemHealth={systemHealth} />
          </div>

          {/* Row 2: System-Generated Logs */}
          <div className="flex xl:flex-row gap-2 items-center">
            <span className="p-1 bg-blue-700/30 rounded-xl inline-flex justify-start items-center">
              <ListIcon strokeWidth={1.5} className="w-9 h-9" />
            </span>
            <p className="text-blue-950 text-2xl font-semibold font-sans leading-loose text-left w-full">
              System-Generated Logs
            </p>
          </div>
          <Card className="w-full border-grey-300 border-1 bg-[hsla(225, 65%, 52%, 0.5)]">
            <CardContent className="flex flex-col gap-2">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 rounded bg-blue-50 border border-blue-100 w-full"
                >
                  {log.type === "info" && (
                    <Circle className="w-4 h-4 text-blue-400 bg-blue-800/70 rounded-full" />
                  )}
                  {log.type === "warning" && (
                    <Circle className="w-4 h-4 text-yellow-500 bg-yellow-300/70 rounded-full" />
                  )}
                  {log.type === "error" && (
                    <Circle className="w-4 h-4 text-red-500 bg-red-300/70 rounded-full" />
                  )}
                  {log.type === "success" && (
                    <Circle className="w-4 h-4 text-green-500 bg-green-300/70 rounded-full" />
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
