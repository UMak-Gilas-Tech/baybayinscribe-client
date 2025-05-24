"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Hammer,
  UserCheck,
  SquarePen,
  User,
  KeyRound,
  Eraser,
  Trash,
} from "lucide-react";
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface User {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  contact: string;
  status: "Active" | "Banned";
}

const TABLE_HEADERS = [
  "Email",
  "Username",
  "First Name",
  "Last Name",
  "Birth Date",
  "Contact number",
  "Status",
  "Action",
] as const;

const StatusBadge = ({ status }: { status: User["status"] }) => (
  <div
    className={`
      h-6 flex items-center justify-center rounded-sm
      text-sm font-medium leading-tight px-2
      ${
        status === "Active"
          ? "bg-green-100 text-green-900"
          : "bg-danger-100 text-danger-600"
      }
    `}
  >
    {status}
  </div>
);

// Minimal VisuallyHidden component
const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      position: "absolute",
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: "hidden",
      clip: "rect(0,0,0,0)",
      whiteSpace: "nowrap",
      border: 0,
    }}
  >
    {children}
  </span>
);

import { DrawerTitle } from "@/components/ui/drawer";

function UserInfoSection({ user }: { user: User }) {
  return (
    <div className="flex flex-row gap-6 min-w-[320px]">
      <div className="rounded-full bg-blue-500 w-[100px] h-[100px] flex items-center justify-center">
        <User className="w-[90px] h-[80px] fill-neutral-white stroke-none" />
      </div>
      <div className="flex flex-col gap-1 justify-center">
        <span className="text-xl font-semibold text-blue-950 leading-tight flex items-center gap-3">
          {user.firstName} {user.lastName}
          <StatusBadge status={user.status} />
        </span>
        <span className="text-base text-blue-400">{user.email}</span>
        <span className="text-base text-blue-400">{user.contact}</span>
        <span className="text-base text-blue-400">
          Date of Birth: {user.birthDate}
        </span>
      </div>
    </div>
  );
}

function UserMetaSection() {
  return (
    <div className="flex flex-col gap-2 items-end min-w-[200px]">
      <span className="text-lg font-semibold text-blue-400">@JuwanDlckruz</span>
      <span className="text-base text-blue-950 font-semibold">
        <span className="text-blue-500 font-normal">Registered:</span> March 12,
        2025
      </span>
      <span className="text-base text-blue-950 font-semibold">
        <span className="text-blue-500 font-normal">Last Login:</span> April 12,
        2025
      </span>
      <DrawerClose asChild>
        <button className="absolute top-4 right-4 text-blue-400 hover:text-blue-700 transition-colors text-2xl font-bold cursor-pointer">
          ×
        </button>
      </DrawerClose>
    </div>
  );
}

function LearningProgressSection() {
  return (
    <>
      <div className="text-xl font-semibold text-blue-950 mb-2">
        Learning Progress
      </div>
      <div className="flex flex-row justify-between gap-8 mb-4">
        <div className="flex flex-col gap-1 text-blue-500 text-base">
          <div>
            Last Completed:{" "}
            <span className="font-semibold text-blue-950">10</span>
          </div>
          <div>
            Quizzes Taken:{" "}
            <span className="font-semibold text-blue-950">6</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-blue-500 text-base text-right">
          <div>
            Average Score:{" "}
            <span className="font-semibold text-blue-950">75%</span>
          </div>
          <div>
            Last Lesson:{" "}
            <span className="font-semibold text-blue-950">Baybayin Virama</span>
          </div>
        </div>
      </div>
    </>
  );
}

function ConfirmActionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  confirmClass,
  onConfirm,
  loading = false,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  confirmClass?: string;
  onConfirm: () => void;
  loading?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-8 rounded-xl border border-blue-400 bg-blue-900 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-950 mb-1 text-left">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base text-blue-700 text-left mb-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-3 justify-end mt-4">
          <DialogClose asChild>
            <button className="px-4 py-2 rounded-md border border-blue-400 bg-neutral-white text-blue-300 font-medium hover:underline cursor-pointer transition-colors">
              Cancel
            </button>
          </DialogClose>
          <button
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${confirmClass}`}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            disabled={loading}
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DrawerActions({
  user,
  onDelete,
  onReset,
  onClear,
  onBan,
  onUnban,
}: {
  user: User;
  onDelete: (user: User) => void;
  onReset: (user: User) => void;
  onClear: (user: User) => void;
  onBan: (user: User) => void;
  onUnban: (user: User) => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  return (
    <div className="flex flex-row gap-4 justify-start">
      {/* Reset Password */}
      <Button
        variant="outline"
        className="border-blue-400 text-blue-400 bg-transparent hover:bg-blue-900 hover:text-blue-500 flex items-center gap-2 px-6 py-2 rounded-lg text-base"
        onClick={() => setResetOpen(true)}
      >
        <KeyRound className="size-4" />
        Reset Password
      </Button>
      <ConfirmActionDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Reset password of the user?"
        description={
          "A password reset link will be sent to the user's registered email address. Continue? (The link sent will expire in 30 minutes)"
        }
        confirmLabel="Send Reset Link"
        confirmClass="bg-blue-500 text-blue-900 hover:bg-blue-400 border border-blue-400 cursor-pointer"
        onConfirm={() => onReset(user)}
      />
      {/* Clear Progress */}
      <Button
        variant="outline"
        className="border-warning-400 text-warning-400 bg-warning-100 hover:bg-warning-50 hover:text-warning-600 flex items-center gap-2 px-6 py-2 rounded-lg text-base"
        onClick={() => setClearOpen(true)}
      >
        <Eraser className="size-4" />
        Clear Progress
      </Button>
      <ConfirmActionDialog
        open={clearOpen}
        onOpenChange={setClearOpen}
        title="Clear User Progress?"
        description={
          "This action will remove all learning progress for this user. This cannot be undone."
        }
        confirmLabel="Clear Progress"
        confirmClass="bg-warning-400 text-warning-100 hover:bg-warning-500 border border-warning-400 cursor-pointer"
        onConfirm={() => onClear(user)}
      />
      {/* Ban/Unban User (no dialog) */}
      {user.status === "Banned" ? (
        <Button
          variant="outline"
          className="border-warning-400 text-warning-400 bg-warning-100 hover:bg-warning-50 hover:text-warning-600 flex items-center gap-2 px-6 py-2 rounded-lg text-base"
          onClick={() => onUnban(user)}
        >
          <UserCheck className="size-4 stroke-1.25" />
          Unban User
        </Button>
      ) : (
        <Button
          variant="outline"
          className="border-danger-500 text-danger-500 bg-danger-100 hover:bg-danger-50 hover:text-danger-600 flex items-center gap-2 px-6 py-2 rounded-lg text-base"
          onClick={() => onBan(user)}
        >
          <Hammer className="size-4 stroke-1.25" />
          Ban User
        </Button>
      )}
      {/* Delete Account */}
      <Button
        variant="outline"
        className="border-danger-500 text-danger-500 bg-danger-100 hover:bg-danger-50 hover:text-danger-600 flex items-center gap-2 px-6 py-2 rounded-lg text-base"
        onClick={() => setDeleteOpen(true)}
      >
        <Trash className="size-4" />
        Delete Account
      </Button>
      <ConfirmActionDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete User Account"
        description={
          "This action will permanently delete the account of user, all associated data, which cannot be undone."
        }
        confirmLabel="Delete Account"
        confirmClass="bg-danger-200/25 text-danger-500 hover:bg-danger-900 border border-danger-600 cursor-pointer"
        onConfirm={() => onDelete(user)}
      />
    </div>
  );
}

function ManageUserDrawer({
  open,
  onOpenChange,
  user,
  onDelete,
  onReset,
  onClear,
  onBan,
  onUnban,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: User | null;
  onDelete: (user: User) => void;
  onReset: (user: User) => void;
  onClear: (user: User) => void;
  onBan: (user: User) => void;
  onUnban: (user: User) => void;
}) {
  if (!user) return null;
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        style={{
          width: 700,
          height: 482,
          position: "fixed",
          bottom: 0,
          right: 0,
          left: "auto",
          borderRadius: 16,
          boxShadow: "0 4px 32px 0 rgba(0,0,0,0.10)",
          background: "var(--color-blue-900, #e6eaff)",
          border: "1.25px solid var(--color-blue-500, #7b8acb)",
          padding: 0,
          zIndex: 50,
        }}
        className="overflow-hidden flex flex-col"
      >
        <VisuallyHidden>
          <DrawerTitle>Manage User Account</DrawerTitle>
        </VisuallyHidden>
        <div className="flex flex-col h-full w-w p-8">
          <div className="text-2xl font-semibold text-blue-300 mb-2">
            Account Info
          </div>
          <div className="flex flex-row justify-between gap-8 mb-4">
            <UserInfoSection user={user} />
            <UserMetaSection />
          </div>
          <div className="border-t border-blue-500 w-full mb-4" />
          <LearningProgressSection />
          <div className="border-t border-blue-500 w-full mb-6" />
          <DrawerActions
            user={user}
            onDelete={onDelete}
            onReset={onReset}
            onClear={onClear}
            onBan={onBan}
            onUnban={onUnban}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

const ActionButtons = ({
  status,
  onManage,
  onBan,
  onUnban,
}: {
  status: User["status"];
  onManage: () => void;
  onBan: () => void;
  onUnban: () => void;
}) => (
  <div className="flex items-center gap-2">
    {status === "Banned" ? (
      <Button
        size="sm"
        className="font-normal min-w-[6rem] bg-warning-100 text-warning-400 border-warning-400 hover:bg-warning-50 hover:text-warning-400 border-1.25 transition-all duration-300"
        onClick={onUnban}
      >
        <UserCheck className="size-4 stroke-1.25" />
        Unban
      </Button>
    ) : (
      <Button
        size="sm"
        className="font-normal min-w-[6rem] bg-danger-100 text-danger-500 border-danger-500 hover:bg-danger-50 hover:text-danger-400 border-1.25 transition-all duration-300"
        onClick={onBan}
      >
        <Hammer className="size-4 stroke-1.25" />
        Ban
      </Button>
    )}
    <Button
      size="sm"
      className="font-normal bg-blue-800 border-blue-200 border-1.25 text-blue-300 hover:bg-blue-900 hover:text-blue-950"
      onClick={onManage}
    >
      <SquarePen className="size-4 stroke-1.25" />
      Manage
    </Button>
  </div>
);

const UserRow = ({
  user,
  index,
  onManage,
  onBan,
  onUnban,
}: {
  user: User;
  index: number;
  onManage: () => void;
  onBan: () => void;
  onUnban: () => void;
}) => (
  <TableRow className={index % 2 === 0 ? "" : "bg-violet-100"}>
    <TableCell className="p-3 text-gray-900 text-sm font-normal leading-tight">
      {user.email}
    </TableCell>
    <TableCell className="p-3 text-gray-900 text-sm font-normal leading-tight">
      {user.username}
    </TableCell>
    <TableCell className="p-3 text-gray-900 text-sm font-normal leading-tight">
      {user.firstName}
    </TableCell>
    <TableCell className="p-3 text-gray-900 text-sm font-normal leading-tight">
      {user.lastName}
    </TableCell>
    <TableCell className="p-3 text-gray-900 text-sm font-normal leading-tight">
      {user.birthDate}
    </TableCell>
    <TableCell className="p-3 text-gray-900 text-sm font-normal leading-tight">
      {user.contact}
    </TableCell>
    <TableCell className="p-3">
      <StatusBadge status={user.status} />
    </TableCell>
    <TableCell className="p-3">
      <ActionButtons
        status={user.status}
        onManage={onManage}
        onBan={onBan}
        onUnban={onUnban}
      />
    </TableCell>
  </TableRow>
);

export function UserTable({ users }: { users?: User[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userList, setUserList] = useState<User[]>(users ?? []);

  // Sync userList with users prop for filtering
  useEffect(() => {
    if (users) setUserList(users);
  }, [users]);

  // Keep selectedUser in sync with userList for real-time updates in the drawer
  useEffect(() => {
    if (selectedUser) {
      const updated = userList.find((u) => u.email === selectedUser.email);
      if (updated) setSelectedUser(updated);
    }
  }, [userList, drawerOpen]);

  // Mock action handlers
  const handleDelete = (user: User) => {
    setUserList((prev) => prev.filter((u) => u.email !== user.email));
    setDrawerOpen(false);
    toast.error("User account deleted.");
    // TODO: Replace this mock with a backend API call to delete the user
  };
  const handleReset = (user: User) => {
    toast.info("Password reset link sent to " + user.email);
    // TODO: Replace this mock with a backend API call to send a password reset link
  };
  const handleClear = (user: User) => {
    toast.warning("Learning progress cleared for " + user.email);
    // TODO: Replace this mock with a backend API call to clear user progress
  };
  const handleBan = (user: User) => {
    setUserList((prev) =>
      prev.map((u) => (u.email === user.email ? { ...u, status: "Banned" } : u))
    );
    toast.error("User has been banned.");
    // TODO: Replace this mock with a backend API call to ban the user
  };
  const handleUnban = (user: User) => {
    setUserList((prev) =>
      prev.map((u) => (u.email === user.email ? { ...u, status: "Active" } : u))
    );
    toast.success("User has been unbanned.");
    // TODO: Replace this mock with a backend API call to unban the user
  };

  return (
    <div className="self-stretch rounded-lg border-1.25 border-blue-500 ">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {TABLE_HEADERS.map((header) => (
              <TableHead
                key={header}
                className="p-3 bg-violet-100 border-b border-slate-500 text-slate-500 text-sm font-medium leading-tight"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-500">
          {userList.map((user, index) => (
            <UserRow
              key={index}
              user={user}
              index={index}
              onManage={() => {
                setSelectedUser(user);
                setDrawerOpen(true);
              }}
              onBan={() => handleBan(user)}
              onUnban={() => handleUnban(user)}
            />
          ))}
        </TableBody>
      </Table>
      <ManageUserDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        user={selectedUser}
        onDelete={handleDelete}
        onReset={handleReset}
        onClear={handleClear}
        onBan={handleBan}
        onUnban={handleUnban}
      />
    </div>
  );
}
