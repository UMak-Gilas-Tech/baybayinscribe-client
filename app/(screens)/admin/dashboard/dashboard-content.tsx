"use client";

import React, { useState } from "react";
import {
  Users,
  AreaChartIcon,
  HeartPulse,
  ListIcon,
  RefreshCw,
} from "lucide-react";
import { OverviewCard } from "./components/OverviewCard";
import { UserEngagementChart } from "./components/UserEngagementChart";
import { SystemHealthCard } from "./components/SystemHealthCard";
import { SystemLogsCard } from "./components/SystemLogsCard";
import { UserReportsCard } from "./components/UserReportsCard";
import {
  systemHealthData,
  systemLogsData,
  userReportsData,
  chartData,
  overviewStats,
} from "./dashboard-data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AdminDashboardContent() {
  const [filter, setFilter] = useState("6m");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <div className="container mx-auto flex flex-col gap-4 px-2 md:px-6 min-h-screen w-full flex-1 min-w-0 overflow-x-auto">
      {/* Header */}
      <div className="flex items-center justify-between w-full mt-6 mb-2">
        <h1 className="text-blue-950 text-4xl font-semibold font-sans leading-10 text-left">
          Admin Dashboard
        </h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 hover:bg-blue-700/30 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2 hover:scale-110"
              >
                <RefreshCw
                  className={`w-5 h-5 text-blue-950 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                <span className="text-sm text-blue-950 font-medium">
                  Refresh
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh dashboard data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {/* Column 1 */}
        <div className="flex flex-col">
          {/* Row 1: Overview cards */}
          <p className="text-blue-950 text-2xl font-semibold font-sans leading-loose text-left mb-2">
            Overview
          </p>
          <div className="flex flex-col sm:flex-row gap-x-4">
            <OverviewCard
              icon={<Users className="w-6 h-6 text-blue-950" />}
              bgColor="bg-green-600/25"
              iconBg="bg-green-600/50"
              outlineColor="outline-none"
              title="Total Registered Users"
              value={overviewStats.totalUsers.value}
              trend={overviewStats.totalUsers.trend}
            />
            <OverviewCard
              icon={<AreaChartIcon className="w-6 h-6 text-blue-950" />}
              bgColor="bg-blue-700/25"
              iconBg="bg-blue-700/30"
              outlineColor="outline-none"
              title="Daily Active Users"
              value={overviewStats.dailyActiveUsers.value}
              trend={overviewStats.dailyActiveUsers.trend}
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
              <p className="text-blue-950 text-2xl font-semibold font-sans leading-loose text-left">
                System Health
              </p>
            </div>
            <SystemHealthCard systemHealth={systemHealthData} />
          </div>

          {/* Row 2: System-Generated Logs */}
          <div className="flex xl:flex-row gap-2 items-center">
            <span className="p-1 bg-blue-700/30 rounded-xl inline-flex justify-start items-center">
              <ListIcon strokeWidth={1.5} className="w-9 h-9" />
            </span>
            <p className="text-blue-950 text-2xl font-semibold font-sans leading-loose text-left">
              System-Generated Logs
            </p>
          </div>
          <SystemLogsCard logs={systemLogsData} />
        </div>
      </div>

      {/* User-Generated Flag & Reports */}
      <UserReportsCard reports={userReportsData} />
    </div>
  );
}
