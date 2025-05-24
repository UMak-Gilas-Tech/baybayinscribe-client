import { AreaChartIcon, Users, Hammer } from "lucide-react";
import { OverviewCard } from "@/components/shared/Admin.SummaryCard";

interface User {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  contact: string;
  status: "Active" | "Banned";
}

export default function StatsOverviewSect({ users }: { users: User[] }) {
  const totalUsers = users.length;
  const bannedUsers = users.filter((u) => u.status === "Banned").length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  // Mock: Daily active users is 30% of active users
  const dailyActiveUsers = Math.round(activeUsers * 0.3);

  return (
    <div className="grid grid-cols-3 gap-4 w-11/12 xl:w-10/12 2xl:w-9/12 ml-auto">
      <OverviewCard
        icon={<Users className="w-6 h-6 text-blue-950" />}
        bgColor="bg-green-600/25"
        iconBg="bg-green-600/50"
        title="Total Users"
        value={totalUsers}
        trend={{ value: 2.4, label: "this week" }}
      />
      <OverviewCard
        icon={<AreaChartIcon className="w-6 h-6 text-blue-950" />}
        bgColor="bg-blue-700/25"
        iconBg="bg-blue-700/30"
        title="Daily Active Users"
        value={dailyActiveUsers}
        trend={{ value: 2.4, label: "this week" }}
      />
      <OverviewCard
        icon={<Hammer className="w-6 h-6 text-blue-950" />}
        bgColor="bg-red-400/25"
        iconBg="bg-red-400/50"
        title="Banned"
        value={bannedUsers}
      />
    </div>
  );
}
