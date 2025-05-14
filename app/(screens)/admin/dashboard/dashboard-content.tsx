"use client";

import React, { useState } from "react";
import { UserReportsCard } from "./components/UserReportsCard";
import { DashboardHeader } from "./components/DashboardHeader";
import { OverviewSection } from "./components/OverviewSection";
import { SystemSection } from "./components/SystemSection";
import {
  systemHealthData,
  systemLogsData,
  userReportsData,
  chartData,
  overviewStats,
} from "./data/dashboard-data";

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
      <DashboardHeader isRefreshing={isRefreshing} onRefresh={handleRefresh} />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mb-6 max-h-[760px]">
        {/* Column 1: Overview Section */}
        <OverviewSection
          overviewStats={overviewStats}
          chartData={chartData}
          filter={filter}
          setFilter={setFilter}
        />

        {/* Column 2: System Section */}
        <SystemSection
          systemHealth={systemHealthData}
          systemLogs={systemLogsData}
        />
      </div>

      {/* User-Generated Flag & Reports */}
      <UserReportsCard reports={userReportsData} />
    </div>
  );
}
