import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Report {
  type: string;
  name: string;
  issue: string;
  reporter: string;
  date: string;
}

interface UserReportsCardProps {
  reports: Report[];
}

export function UserReportsCard({ reports }: UserReportsCardProps) {
  return (
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
              <th className="px-4 py-2 text-left font-semibold">Reported By</th>
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
  );
}
