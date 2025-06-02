"use client";

import { Card } from "@/components/ui/card";
import StatsOverviewSect from "./components/StatsOverviewSect";
import { UserTable } from "./components/UserTable";
import { SearchFilter } from "./components/SearchFilter";
import { TablePagination } from "./components/TablePagination";
import { useState, useMemo, useEffect } from "react";
import { authClient } from "../../../lib/auth-client";
import { toast } from "sonner";
import { mockUsers } from "@/constants/mock/mockUsers";

interface User {
  id: string;
  email: string;
  role: string;
  banned: boolean;
  banReason?: string | null;
  banExpires?: Date | null;
  userInformation?: {
    username: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    contactNumber: string;
    profilePictureUrl?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface StatsUser {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  contact: string;
  status: "Active" | "Banned";
}

export default function UserManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users and their information from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch basic user list (Setted to 100 for now should increase if the user registered exceeds more than 100 :P)
        const userListResponse = await authClient.admin.listUsers({
          query: {
            limit: 100,
            offset: 0,
          },
        });

        // Handle different response formats
        let userList;
        if (
          userListResponse &&
          "data" in userListResponse &&
          userListResponse.data
        ) {
          userList = userListResponse.data.users;
        } else if (Array.isArray(userListResponse)) {
          userList = userListResponse;
        } else if (userListResponse && typeof userListResponse === "object") {
          // Try to find users array in the response object
          userList = Object.values(userListResponse).find((val) =>
            Array.isArray(val)
          );
        }

        if (!userList || !Array.isArray(userList)) {
          // Fallback to mock data if backend response is invalid
          console.log(
            "Falling back to mock data due to invalid backend response"
          );
          const mockUserList = mockUsers.data.users;
          const usersWithInfo = mockUserList.map((user) => ({
            id: user.id,
            email: user.email,
            role: user.role || "user",
            banned: user.banned || false,
            banReason: user.banReason,
            banExpires: user.banExpires ? new Date(user.banExpires) : null,
            userInformation: user.userInformation
              ? {
                  ...user.userInformation,
                  profilePictureUrl:
                    user.userInformation.profilePictureUrl || undefined,
                }
              : undefined,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          })) as User[];
          setUsers(usersWithInfo);
          setLastSynced(new Date());
          setLoading(false);
          return;
        }

        // Fetch user information for each user concurrently
        const usersWithInfoPromises = userList.map(async (user) => {
          try {
            const userInfoResponse = await fetch(
              `/api/user.information/${user.id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
              }
            );

            let userInfo = undefined;
            if (userInfoResponse.ok) {
              userInfo = await userInfoResponse.json();
            }

            return {
              id: user.id,
              email: user.email,
              role: user.role || "user",
              banned: user.banned || false,
              banReason: user.banReason,
              banExpires: user.banExpires,
              userInformation: userInfo
                ? {
                    username: userInfo.username || "",
                    firstName: userInfo.firstName || "",
                    lastName: userInfo.lastName || "",
                    dateOfBirth: userInfo.dateOfBirth || "",
                    contactNumber: userInfo.contactNumber || "",
                    profilePictureUrl: userInfo.profilePictureUrl,
                  }
                : undefined,
              createdAt: userInfo?.createdAt,
              updatedAt: userInfo?.updatedAt,
            } as User;
          } catch (error) {
            console.error(
              `Failed to fetch user information for ${user.id}:`,
              error
            );
            return {
              id: user.id,
              email: user.email,
              role: user.role || "user",
              banned: user.banned || false,
              banReason: user.banReason,
              banExpires: user.banExpires,
              userInformation: undefined,
              createdAt: undefined,
              updatedAt: undefined,
            } as User;
          }
        });

        const usersWithInfo = await Promise.all(usersWithInfoPromises);
        setUsers(usersWithInfo);
        setLastSynced(new Date());
      } catch (err: unknown) {
        console.error("Failed to fetch users:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Failed to fetch users: ${errorMessage}`);
        toast.error(`Failed to fetch users: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Transform users for StatsOverviewSect and filtering
  const usersWithStatus = useMemo<StatsUser[]>(() => {
    return users.map((user) => ({
      email: user.email || "",
      username: user.userInformation?.username || "",
      firstName: user.userInformation?.firstName || "",
      lastName: user.userInformation?.lastName || "",
      birthDate: user.userInformation?.dateOfBirth || "",
      contact: user.userInformation?.contactNumber || "",
      status: user.banned ? ("Banned" as const) : ("Active" as const),
    }));
  }, [users]);

  // Filtering logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        (user.userInformation?.username
          ?.toLowerCase()
          .includes(search.toLowerCase()) ??
          false) ||
        (user.userInformation?.firstName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ??
          false) ||
        (user.userInformation?.lastName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ??
          false);

      const matchesStatus =
        status === "all" ||
        (status === "active" && !user.banned) ||
        (status === "banned" && user.banned);

      return matchesSearch && matchesStatus;
    });
  }, [search, status, users]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Action handlers that update state
  const handleDelete = async (userId: string) => {
    try {
      await authClient.admin.removeUser({ userId });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      toast.success("User account deleted.");
    } catch (error: unknown) {
      console.error("Failed to delete user:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`Failed to delete user: ${errorMessage}`);
      throw new Error(`Failed to delete user: ${errorMessage}`);
    }
  };

  const handleReset = async (userId: string) => {
    try {
      console.log("Attempting to send password reset link for user:", userId);
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.info("Password reset link sent (simulated).");
    } catch (error: unknown) {
      console.error("Failed to send reset link:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`Failed to send reset link: ${errorMessage}`);
      throw new Error(`Failed to send reset link: ${errorMessage}`);
    }
  };

  const handleClear = async (userId: string) => {
    try {
      console.log("Attempting to clear learning progress for user:", userId);
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.warning("Learning progress cleared (simulated).");
    } catch (error: unknown) {
      console.error("Failed to clear progress:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`Failed to clear progress: ${errorMessage}`);
      throw new Error(`Failed to clear progress: ${errorMessage}`);
    }
  };

  const handleBan = async (userId: string) => {
    try {
      await authClient.admin.banUser({ userId });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, banned: true } : user
        )
      );
      toast.success("User has been banned.");
    } catch (error: unknown) {
      console.error("Failed to ban user:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`Failed to ban user: ${errorMessage}`);
      throw new Error(`Failed to ban user: ${errorMessage}`);
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      await authClient.admin.unbanUser({ userId });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, banned: false } : user
        )
      );
      toast.success("User has been unbanned.");
    } catch (error: unknown) {
      console.error("Failed to unban user:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`Failed to unban user: ${errorMessage}`);
      throw new Error(`Failed to unban user: ${errorMessage}`);
    }
  };

  if (loading) {
    return <div className="text-center text-blue-500">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center text-danger-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-8xl mx-auto min-h-screen">
      <h1 className="text-3xl xl:text-4xl text-blue-300 font-sans font-semibold">
        User Management
      </h1>

      <StatsOverviewSect users={usersWithStatus} />

      {/* User Table */}
      <Card className="p-8 bg-neutral-white rounded-md shadow-[0px_4px_7px_0px_rgba(0,0,0,0.25)] gap-4">
        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={(newStatus) => setStatus(newStatus)}
        />
        <UserTable
          users={paginatedUsers}
          onDelete={handleDelete}
          onReset={handleReset}
          onClear={handleClear}
          onBan={handleBan}
          onUnban={handleUnban}
        />
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
