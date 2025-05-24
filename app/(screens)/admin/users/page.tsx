"use client";

import { Card } from "@/components/ui/card";
import StatsOverviewSect from "./components/StatsOverviewSect";
import { UserTable } from "./components/UserTable";
import { SearchFilter } from "./components/SearchFilter";
import { TablePagination } from "./components/TablePagination";
import { useState, useMemo, useEffect } from "react";
import { users as mockUsers } from "./data/users-data";

export default function UserManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [userList] = useState(
    mockUsers.map((user) => ({
      ...user,
      status:
        user.status === "Active" ? ("Active" as const) : ("Banned" as const),
    }))
  );

  // Optionally, update lastSynced on manual refresh or data fetch
  // For now, it updates on mount
  useEffect(() => {
    setLastSynced(new Date());
  }, []); // Empty dependency array to ensure it only runs once on mount

  // Filtering logic
  const filteredUsers = useMemo(() => {
    return userList
      .map((user) => ({
        ...user,
        status:
          user.status === "Active" ? ("Active" as const) : ("Banned" as const),
      }))
      .filter((user) => {
        const matchesSearch =
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.username.toLowerCase().includes(search.toLowerCase()) ||
          user.firstName.toLowerCase().includes(search.toLowerCase()) ||
          user.lastName.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
          status === "all" ||
          (status === "active" && user.status === "Active") ||
          (status === "banned" && user.status === "Banned");
        return matchesSearch && matchesStatus;
      });
  }, [search, status, userList]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="p-6 space-y-6 max-w-8xl mx-auto min-h-screen">
      <h1 className="text-3xl xl:text-4xl text-blue-300 font-sans font-semibold">
        User Management
      </h1>

      <StatsOverviewSect users={filteredUsers} />

      {/* User Table */}
      <Card className="p-8 bg-neutral-white rounded-md shadow-[0px_4px_7px_0px_rgba(0,0,0,0.25)] gap-4">
        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={(newStatus) => setStatus(newStatus)}
        />
        <UserTable users={paginatedUsers} />
        <TablePagination
          totalItems={filteredUsers.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          lastSynced={lastSynced}
        />
      </Card>
    </div>
  );
}

// TODO: Replace this mock filter with backend API search and filter calls.
