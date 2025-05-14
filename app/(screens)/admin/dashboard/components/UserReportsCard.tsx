import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Report {
  type: string;
  name: string;
  issue: string;
  reporter: string;
  date: string;
}

interface UserReportsCardProps {
  reports: Report[];
  className?: string;
}

export function UserReportsCard({
  reports: initialReports,
  className,
}: UserReportsCardProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>(initialReports);

  const handleView = (report: Report) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  const handleDismiss = (report: Report) => {
    setReports((prevReports) => prevReports.filter((r) => r !== report));
    toast.success("Report dismissed successfully");
  };

  return (
    <>
      <section
        className={`w-full px-4 py-6 bg-blue-700/25 rounded-xl border border-blue-950 flex flex-col gap-2.5 min-h-[12rem] ${
          className || ""
        }`}
      >
        <div className="flex-1 w-full overflow-x-auto rounded-lg border border-slate-500">
          <Table className="min-w-full ">
            <TableHeader>
              <TableRow className="bg-neutral-white border-b border-grey-300 ">
                <TableHead className="p-3 pl-4 text-blue-950 text-lg font-medium">
                  Type
                </TableHead>
                <TableHead className="p-3 text-blue-950 text-lg font-medium">
                  Content Name
                </TableHead>
                <TableHead className="p-3 text-blue-950 text-lg font-medium">
                  Issue
                </TableHead>
                <TableHead className="p-3 text-blue-950 text-lg font-medium">
                  Reported By
                </TableHead>
                <TableHead className="p-3 text-blue-950 text-lg font-medium">
                  Date
                </TableHead>
                <TableHead className="p-3 text-blue-950 text-lg font-medium">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-blue-100">
                      <p className="text-lg font-medium">No Reports</p>
                      <p className="text-sm text-blue-200/80">
                        All reports have been addressed
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report, i) => (
                  <TableRow
                    key={i}
                    className={
                      (i % 2 === 1 ? "bg-neutral-white " : "") +
                      "border-b border-grey-300"
                    }
                  >
                    <TableCell className="pl-4 pr-3 py-3 text-blue-100 text-base">
                      {report.type}
                    </TableCell>
                    <TableCell className="p-3 text-blue-100 text-base">
                      <div className="truncate" title={report.name}>
                        {report.name}
                      </div>
                    </TableCell>
                    <TableCell className="p-3 text-blue-100 text-base max-w-[200px]">
                      <div className="truncate" title={report.issue}>
                        {report.issue}
                      </div>
                    </TableCell>
                    <TableCell className="p-3 text-blue-100 text-base">
                      {report.reporter}
                    </TableCell>
                    <TableCell className="p-3 text-blue-100 text-base">
                      {report.date}
                    </TableCell>
                    <TableCell className="p-3 flex gap-2 min-w-[120px]">
                      <Button
                        size="sm"
                        className="flex-1 px-2 py-1 bg-blue-400 rounded-md  border-2 border-blue-500 text-blue-900 text-base"
                        onClick={() => handleView(report)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 px-2 py-1 rounded-md  border-2 border-blue-950 text-blue-950 hover:bg-red-200 hover:text-red-900  text-base bg-transparent"
                        onClick={() => handleDismiss(report)}
                      >
                        Dismiss
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-blue-900 border border-blue-950 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-blue-950 text-2xl font-semibold">
              Report Details
            </DialogTitle>
            <DialogDescription className="text-blue-100">
              Detailed information about the reported issue
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-blue-950 font-medium">Type</p>
                  <p className="text-blue-100">{selectedReport.type}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-blue-950 font-medium">Content Name</p>
                  <p className="text-blue-100">{selectedReport.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-blue-950 font-medium">Reported By</p>
                  <p className="text-blue-100">{selectedReport.reporter}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-blue-950 font-medium">Date</p>
                  <p className="text-blue-100">{selectedReport.date}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-blue-950 font-medium">Issue Description</p>
                <p className="text-blue-100 bg-blue-900/50 p-4 rounded-lg">
                  {selectedReport.issue}
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  className="px-4 py-2 rounded-md border-2 border-blue-950 text-blue-950 text-base bg-transparent"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="px-4 py-2 bg-blue-400 rounded-md border-2 border-blue-500 text-blue-900 text-base"
                  onClick={() => {
                    handleDismiss(selectedReport);
                    setIsDialogOpen(false);
                  }}
                >
                  Dismiss Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
