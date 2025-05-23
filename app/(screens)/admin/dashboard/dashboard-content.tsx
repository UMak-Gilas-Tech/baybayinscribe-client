"use client";

import { useState, useCallback } from "react";
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
import { toast } from "sonner";

export default function AdminDashboardContent() {
  const [filter, setFilter] = useState("6m");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logs, setLogs] = useState(systemLogsData);
  const [reports, setReports] = useState(userReportsData);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    setShowSkeleton(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate new log entries
      const newLogs = [
        {
          type: "info" as const,
          message: `System refresh completed at ${new Date().toLocaleTimeString()}`,
          time: new Date().toLocaleTimeString(),
        },
        {
          type: "success" as const,
          message: "All systems operational",
          time: new Date().toLocaleTimeString(),
        },
        ...logs.slice(0, 8), // Keep only the 8 most recent logs
      ];

      // Generate new report entries
      const newReports = [
        {
          type: "Content",
          name: "System Update Report",
          issue: "System refresh completed successfully",
          reporter: "@System",
          date: new Date().toLocaleTimeString(),
        },
        ...reports.slice(0, 5), // Keep only the 5 most recent reports
      ];

      // Update states with new data
      setLogs(newLogs);
      setReports(newReports);

      // Show success toast
      toast.success("Dashboard refreshed successfully", {
        description: "All data has been updated",
      });
    } catch (error) {
      console.error("Failed to refresh:", error);
      toast.error("Failed to refresh dashboard", {
        description: "Please try again later",
      });
    } finally {
      // Add a small delay before hiding skeleton to ensure smooth transition
      setTimeout(() => {
        setShowSkeleton(false);
        setIsRefreshing(false);
      }, 500);
    }
  }, [logs, reports, isRefreshing]);

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
          systemLogs={logs}
          showSkeleton={showSkeleton}
        />
      </div>

      {/* User-Generated Flag & Reports */}
      <div>
        <h2 className="text-blue-950 text-2xl font-semibold font-sans leading-loose text-left">
          User-Generated Flag & Reports
        </h2>
        <UserReportsCard reports={reports} showSkeleton={showSkeleton} />
      </div>
    </div>
  );
}
