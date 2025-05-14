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
    message: "High number of login attempts detected from IP 192.168.1.1",
    time: "10:25 AM 04-26-2025",
  },
  {
    type: "error",
    message: "Database connection timeout - Retrying...",
    time: "10:26 AM 04-26-2025",
  },
  {
    type: "success",
    message: "System backup completed successfully",
    time: "10:27 AM 04-26-2025",
  },
  {
    type: "info",
    message: "User @MariaCruz updated profile settings",
    time: "10:28 AM 04-26-2025",
  },
  {
    type: "warning",
    message: "Storage usage above 80% threshold",
    time: "10:29 AM 04-26-2025",
  },
  {
    type: "error",
    message: "Failed to process payment for user @JohnDoe",
    time: "10:30 AM 04-26-2025",
  },
  {
    type: "success",
    message: "New lesson 'Basic Baybayin' published",
    time: "10:31 AM 04-26-2025",
  },
  {
    type: "info",
    message: "System maintenance scheduled for 2:00 PM",
    time: "10:32 AM 04-26-2025",
  },
  {
    type: "warning",
    message: "Unusual activity detected in user @Admin account",
    time: "10:33 AM 04-26-2025",
  },
  {
    type: "error",
    message: "API rate limit exceeded for endpoint /users",
    time: "10:34 AM 04-26-2025",
  },
  {
    type: "success",
    message: "User @SarahLee completed all beginner lessons",
    time: "10:35 AM 04-26-2025",
  },
  {
    type: "info",
    message: "New comment posted on Lesson 3",
    time: "10:36 AM 04-26-2025",
  },
  {
    type: "warning",
    message: "Memory usage approaching critical level",
    time: "10:37 AM 04-26-2025",
  },
  {
    type: "error",
    message: "Failed to send email notification to @User123",
    time: "10:38 AM 04-26-2025",
  },
  {
    type: "success",
    message: "System update v2.1.0 deployed successfully",
    time: "10:39 AM 04-26-2025",
  },
  {
    type: "info",
    message: "New feedback submitted by @TeacherMike",
    time: "10:40 AM 04-26-2025",
  },
  {
    type: "warning",
    message: "Multiple failed login attempts from unknown IP",
    time: "10:41 AM 04-26-2025",
  },
  {
    type: "error",
    message: "Cache synchronization failed",
    time: "10:42 AM 04-26-2025",
  },
  {
    type: "success",
    message: "User @BaybayinMaster achieved expert level",
    time: "10:43 AM 04-26-2025",
  },
  {
    type: "info",
    message: "New content moderator @Moderator1 assigned",
    time: "10:44 AM 04-26-2025",
  },
  {
    type: "warning",
    message: "SSL certificate expiring in 30 days",
    time: "10:45 AM 04-26-2025",
  },
  {
    type: "error",
    message: "Failed to generate PDF report for @Student123",
    time: "10:46 AM 04-26-2025",
  },
  {
    type: "success",
    message: "New language pack 'Tagalog' added successfully",
    time: "10:47 AM 04-26-2025",
  },
  {
    type: "info",
    message: "User @HistoryBuff completed 100 lessons",
    time: "10:48 AM 04-26-2025",
  },
  {
    type: "warning",
    message: "Database query performance degraded",
    time: "10:49 AM 04-26-2025",
  },
  {
    type: "error",
    message: "Failed to upload user avatar for @NewUser",
    time: "10:50 AM 04-26-2025",
  },
  {
    type: "success",
    message: "New feature 'Practice Mode' enabled",
    time: "10:51 AM 04-26-2025",
  },
  {
    type: "info",
    message: "System scan completed - No threats detected",
    time: "10:52 AM 04-26-2025",
  },
  {
    type: "warning",
    message: "High CPU usage detected on server",
    time: "10:53 AM 04-26-2025",
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
    type: "Content",
    name: "Basic Baybayin Lesson 3",
    issue:
      "The pronunciation guide for 'Ka' is incorrect. It shows 'Ga' instead of 'Ka' in the audio examples.",
    reporter: "@MariaCruz",
    date: "2024-03-26 10:24 AM",
  },
  {
    type: "Technical",
    name: "Practice Writing Tool",
    issue:
      "The stroke recognition is not working properly for complex characters. It fails to recognize 'Ng' when written in cursive style.",
    reporter: "@BaybayinMaster",
    date: "2024-03-26 09:15 AM",
  },
  {
    type: "Content",
    name: "History of Baybayin",
    issue:
      "There's a historical inaccuracy in the timeline. The Spanish colonization period is listed as 1521-1898, but Baybayin was still used until early 1900s.",
    reporter: "@HistoryBuff",
    date: "2024-03-25 03:45 PM",
  },
  {
    type: "Technical",
    name: "Mobile App",
    issue:
      "The app crashes when trying to save progress in offline mode. Error occurs specifically when the device has less than 20% battery.",
    reporter: "@MobileUser123",
    date: "2024-03-25 02:30 PM",
  },
  {
    type: "Content",
    name: "Advanced Writing Exercises",
    issue:
      "The exercise 'Combining Characters' has incorrect answers marked as correct. Specifically in the 'Ma' + 'Ya' combination.",
    reporter: "@TeacherMike",
    date: "2024-03-25 11:20 AM",
  },
  {
    type: "Technical",
    name: "AI Translator",
    issue:
      "The AI translator is incorrectly translating modern Tagalog words into Baybayin. It's using ancient forms for modern terms.",
    reporter: "@LinguistPro",
    date: "2024-03-24 04:15 PM",
  },
  {
    type: "Content",
    name: "Cultural Context Module",
    issue:
      "The section about Baybayin in different regions lacks information about the Visayan variants. Should include more about the different styles.",
    reporter: "@CulturalExpert",
    date: "2024-03-24 01:30 PM",
  },
  {
    type: "Technical",
    name: "Progress Tracking",
    issue:
      "The progress bar is not updating correctly after completing lessons. Shows 100% completion even when some exercises are incomplete.",
    reporter: "@Student123",
    date: "2024-03-23 09:45 AM",
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
