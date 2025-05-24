import { Users, AreaChartIcon } from "lucide-react";
import { OverviewCard } from "@/components/shared/Admin.SummaryCard";
import { UserEngagementChart } from "./UserEngagementChart";
import { overviewStats, chartData } from "../data/dashboard-data";

interface OverviewSectionProps {
  overviewStats: typeof overviewStats;
  chartData: typeof chartData;
  filter: string;
  setFilter: (filter: string) => void;
}

export function OverviewSection({
  overviewStats,
  chartData,
  filter,
  setFilter,
}: OverviewSectionProps) {
  return (
    <section className="flex flex-col">
      <h2 className="text-blue-950 text-2xl font-semibold font-sans leading-loose text-left mb-2">
        Overview
      </h2>
      <nav className="flex flex-col sm:flex-row gap-x-4">
        <OverviewCard
          icon={<Users className="w-6 h-6 text-blue-950" />}
          bgColor="bg-green-600/25"
          iconBg="bg-green-600/50"
          title="Total Registered Users"
          value={overviewStats.totalUsers.value}
          trend={overviewStats.totalUsers.trend}
        />
        <OverviewCard
          icon={<AreaChartIcon className="w-6 h-6 text-blue-950" />}
          bgColor="bg-blue-700/25"
          iconBg="bg-blue-700/30"
          title="Daily Active Users"
          value={overviewStats.dailyActiveUsers.value}
          trend={overviewStats.dailyActiveUsers.trend}
        />
      </nav>
      <article>
        <UserEngagementChart
          chartData={chartData}
          filter={filter}
          setFilter={setFilter}
        />
      </article>
    </section>
  );
}
