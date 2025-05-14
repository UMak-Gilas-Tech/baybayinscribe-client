// System Health Data
export interface SystemHealthItem {
  label: string;
  status: string;
  color: string;
}

export const systemHealthData: SystemHealthItem[] = [
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

// System Logs Data
export interface Log {
  type: "info" | "warning" | "error" | "success";
  message: string;
  time: string;
}

export const systemLogsData: Log[] = [
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

// User Reports Data
export interface Report {
  type: string;
  name: string;
  issue: string;
  reporter: string;
  date: string;
}

export const userReportsData: Report[] = [
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

// Chart Data
export interface ChartDataPoint {
  month: string;
  total: number;
  daily: number;
}

export const chartData: ChartDataPoint[] = [
  { month: "Jan", total: 320, daily: 120 },
  { month: "Feb", total: 410, daily: 180 },
  { month: "Mar", total: 350, daily: 140 },
  { month: "Apr", total: 300, daily: 130 },
  { month: "May", total: 370, daily: 150 },
  { month: "Jun", total: 390, daily: 160 },
];

// Overview Stats
export interface OverviewStats {
  totalUsers: {
    value: string;
    trend: {
      value: number;
      label: string;
    };
  };
  dailyActiveUsers: {
    value: string;
    trend: {
      value: number;
      label: string;
    };
  };
}

export const overviewStats: OverviewStats = {
  totalUsers: {
    value: "100",
    trend: {
      value: 2.4,
      label: "this week",
    },
  },
  dailyActiveUsers: {
    value: "210",
    trend: {
      value: -1.2,
      label: "this week",
    },
  },
};
