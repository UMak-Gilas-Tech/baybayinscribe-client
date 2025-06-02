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
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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

interface UserTableProps {
  users: User[];
  onDelete: (userId: string) => Promise<void>;
  onReset: (userId: string) => Promise<void>;
  onClear: (userId: string) => Promise<void>;
  onBan: (userId: string) => Promise<void>;
  onUnban: (userId: string) => Promise<void>;
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

const StatusBadge = ({ banned }: { banned: User["banned"] }) => (
  <div
    className={`
      h-6 flex items-center justify-center rounded-sm
      text-sm font-medium leading-tight px-2
      ${
        !banned
          ? "bg-green-100 text-green-900"
          : "bg-danger-100 text-danger-600"
      }
    `}
  >
    {!banned ? "Active" : "Banned"}
  </div>
);

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
import { useLearningResourceStore } from "@/app/store/store.lr";
import useQuizStore from "@/app/store/store.quiz";
import { Skeleton } from "@/components/ui/skeleton";

function UserInfoSection({ user }: { user: User }) {
  const formattedBirthDate = user.userInformation?.dateOfBirth
    ? new Date(user.userInformation.dateOfBirth).toLocaleDateString()
    : "N/A";

  return (
    <div className="flex flex-row gap-6 min-w-[320px]">
      <div className="rounded-full bg-blue-500 w-[100px] h-[100px] flex items-center justify-center">
        <User className="w-[90px] h-[80px] fill-neutral-white stroke-none" />
      </div>
      <div className="flex flex-col gap-1 justify-center">
        <span className="text-xl font-semibold text-blue-950 leading-tight flex items-center gap-3">
          {user.userInformation?.firstName} {user.userInformation?.lastName}
          <StatusBadge banned={user.banned} />
        </span>
        <span className="text-base text-blue-400">{user.email}</span>
        <span className="text-base text-blue-400">
          {user.userInformation?.contactNumber}
        </span>
        <span className="text-base text-blue-400">
          {formattedBirthDate !== "N/A"
            ? `Date of Birth: ${formattedBirthDate}`
            : "Birth Date: N/A"}
        </span>
      </div>
    </div>
  );
}

function UserMetaSection({ user }: { user: User }) {
  const formattedRegisteredDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const formattedLastLoginDate = user.updatedAt
    ? new Date(user.updatedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="flex flex-col gap-2 items-end min-w-[200px]">
      <span className="text-lg font-semibold text-blue-400">
        @{user.userInformation?.username || "N/A"}
      </span>
      <span className="text-base text-blue-950 font-semibold">
        <span className="text-blue-500 font-normal">Registered:</span>{" "}
        {formattedRegisteredDate}
      </span>
      <span className="text-base text-blue-950 font-semibold">
        <span className="text-blue-500 font-normal">Last Login:</span>{" "}
        {formattedLastLoginDate}
      </span>
      <DrawerClose asChild>
        <button className="absolute top-4 right-4 text-blue-400 hover:text-blue-700 transition-colors text-2xl font-bold cursor-pointer">
          ×
        </button>
      </DrawerClose>
    </div>
  );
}

function LearningProgressSection({ user }: { user: User }) {
  const [lastLesson, setLastLesson] = useState<string>("N/A");
  const [quizzesTaken, setQuizzesTaken] = useState<number>(0);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [lastCompletedLesson, setLastCompletedLesson] = useState<string>("N/A");
  const [loading, setLoading] = useState(false);

  const { getQuizScoreAverage } = useQuizStore();
  const { getLastLessonProgress } = useLearningResourceStore();

  useEffect(() => {
    if (user?.id) {
      fetchUserProgress();
    }
  }, [user?.id]);

  const fetchUserProgress = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Fetch both quiz progress and last lesson concurrently
      const [quizData, lastLessonData] = await Promise.all([
        getQuizScoreAverage(user.id).catch(() => ({
          average: 0,
          quizzesAnswered: 0,
          totalAnswers: 0,
          correctAnswers: 0,
        })),
        getLastLessonProgress(user.id).catch(() => null),
      ]);

      // Update quiz data
      setAverageScore(quizData.average || 0);
      setQuizzesTaken(quizData.quizzesAnswered || 0);

      // Update lesson data
      if (lastLessonData) {
        setLastLesson(lastLessonData.title || "N/A");
        setLastCompletedLesson(
          lastLessonData.lesson_number?.toString() || "N/A"
        );
      }
    } catch (error) {
      console.error("Error fetching user progress:", error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  const ProgressSkeleton = () => (
    <div className="flex flex-row justify-between gap-8 mb-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-blue-500 text-base">Last Completed:</span>
          <Skeleton className="h-4 w-8 bg-blue-200" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-blue-500 text-base">Quizzes Taken:</span>
          <Skeleton className="h-4 w-8 bg-blue-200" />
        </div>
      </div>
      <div className="flex flex-col gap-2 text-right">
        <div className="flex items-center gap-2 justify-end">
          <span className="text-blue-500 text-base">Average Score:</span>
          <Skeleton className="h-4 w-12 bg-blue-200" />
        </div>
        <div className="flex items-center gap-2 justify-end">
          <span className="text-blue-500 text-base">Last Lesson:</span>
          <Skeleton className="h-4 w-24 bg-blue-200" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="text-xl font-semibold text-blue-950 mb-2">
        Learning Progress
      </div>
      {loading ? (
        <ProgressSkeleton />
      ) : (
        <div className="flex flex-row justify-between gap-8 mb-4">
          <div className="flex flex-col gap-1 text-blue-500 text-base">
            <div>
              Last Completed:{" "}
              <span className="font-semibold text-blue-950">
                {lastCompletedLesson}
              </span>
            </div>
            <div>
              Quizzes Taken:{" "}
              <span className="font-semibold text-blue-950">
                {quizzesTaken}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-blue-500 text-base text-right">
            <div>
              Average Score:{" "}
              <span className="font-semibold text-blue-950">
                {averageScore}%
              </span>
            </div>
            <div>
              Last Lesson:{" "}
              <span className="font-semibold text-blue-950">{lastLesson}</span>
            </div>
          </div>
        </div>
      )}
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
      <DialogContent className="max-w-sm p-8 rounded-xl border border-blue-400 bg-neutral-white shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-300 mb-1 text-left">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base text-blue-400 text-left mb-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-3 justify-end mt-4">
          <button
            className="px-4 py-2 rounded-md border border-blue-400 bg-neutral-white text-blue-300 font-medium hover:underline cursor-pointer transition-colors"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${confirmClass}`}
            onClick={() => {
              onConfirm();
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
  onDelete: (userId: string) => Promise<void>;
  onReset: (userId: string) => Promise<void>;
  onClear: (userId: string) => Promise<void>;
  onBan: (userId: string) => Promise<void>;
  onUnban: (userId: string) => Promise<void>;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAction = async (
    action: () => Promise<void>,
    dialogSetter: (open: boolean) => void
  ) => {
    setLoading(true);
    try {
      await action();
      dialogSetter(false);
    } catch (error: unknown) {
      console.error("Action failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`Action failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 justify-start">
      <Button
        variant="outline"
        className="border-blue-400 text-blue-400 bg-transparent hover:bg-blue-900 hover:text-blue-500 flex items-center gap-2 px-4 py-2 rounded-lg text-base flex-shrink-0"
        onClick={() => setResetOpen(true)}
        disabled={loading}
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
        confirmLabel={loading ? "Sending..." : "Send Reset Link"}
        confirmClass="bg-blue-400 text-blue-900 hover:bg-blue-500 border border-blue-400 cursor-pointer"
        onConfirm={() => handleAction(() => onReset(user.id), setResetOpen)}
        loading={loading}
      />
      <Button
        variant="outline"
        className="border-warning-400 text-warning-400 bg-warning-100 hover:bg-warning-50 hover:text-warning-600 flex items-center gap-2 px-4 py-2 rounded-lg text-base flex-shrink-0"
        onClick={() => setClearOpen(true)}
        disabled={loading}
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
        confirmLabel={loading ? "Clearing..." : "Clear Progress"}
        confirmClass="bg-warning-100 text-warning-400 hover:bg-warning-100/90 hover:text-warning-300 border border-warning-400 cursor-pointer"
        onConfirm={() => handleAction(() => onClear(user.id), setClearOpen)}
        loading={loading}
      />
      {user.banned ? (
        <Button
          variant="outline"
          className="border-warning-400 text-warning-400 bg-warning-100 hover:bg-warning-50 hover:text-warning-600 flex items-center gap-2 px-6 py-2 rounded-lg text-base"
          onClick={() =>
            handleAction(
              () => onUnban(user.id),
              () => {}
            )
          }
          disabled={loading}
        >
          <UserCheck className="size-4 stroke-1.25" />
          Unban User
        </Button>
      ) : (
        <Button
          variant="outline"
          className="border-danger-500 text-danger-500 bg-danger-100 hover:bg-danger-50 hover:text-danger-600 flex items-center gap-2 px-6 py-2 rounded-lg text-base"
          onClick={() =>
            handleAction(
              () => onBan(user.id),
              () => {}
            )
          }
          disabled={loading}
        >
          <Hammer className="size-4 stroke-1.25" />
          Ban User
        </Button>
      )}
      <Button
        variant="outline"
        className="border-danger-500 text-danger-500 bg-danger-100 hover:bg-danger-50 hover:text-danger-600 flex items-center gap-2 px-4 py-2 rounded-lg text-base flex-shrink-0"
        onClick={() => setDeleteOpen(true)}
        disabled={loading}
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
        confirmLabel={loading ? "Deleting..." : "Delete Account"}
        confirmClass="border-danger-500 text-danger-500 bg-danger-100 hover:bg-danger-50 hover:text-danger-600 border border-danger-600 cursor-pointer"
        onConfirm={() => handleAction(() => onDelete(user.id), setDeleteOpen)}
        loading={loading}
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
  onDelete: (userId: string) => Promise<void>;
  onReset: (userId: string) => Promise<void>;
  onClear: (userId: string) => Promise<void>;
  onBan: (userId: string) => Promise<void>;
  onUnban: (userId: string) => Promise<void>;
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
            <UserMetaSection user={user} />
          </div>
          <div className="border-t border-blue-500 w-full mb-4" />
          <LearningProgressSection user={user} />
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
  onManage,
  onBan,
  onUnban,
  user,
}: {
  onManage: () => void;
  onBan: (userId: string) => Promise<void>;
  onUnban: (userId: string) => Promise<void>;
  user: User;
}) => (
  <div className="flex items-center gap-2">
    {user.banned ? (
      <Button
        size="sm"
        className="font-normal min-w-[6rem] bg-warning-100 text-warning-400 border-warning-400 hover:bg-warning-50 hover:text-warning-400 border-1.25 transition-all duration-300"
        onClick={() => onUnban(user.id)}
      >
        <UserCheck className="size-4 stroke-1.25" />
        Unban
      </Button>
    ) : (
      <Button
        size="sm"
        className="font-normal min-w-[6rem] bg-danger-100 text-danger-500 border-danger-500 hover:bg-danger-50 hover:text-danger-400 border-1.25 transition-all duration-300"
        onClick={() => onBan(user.id)}
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
  onBan: (userId: string) => Promise<void>;
  onUnban: (userId: string) => Promise<void>;
}) => {
  const formattedBirthDate = user.userInformation?.dateOfBirth
    ? new Date(user.userInformation.dateOfBirth).toLocaleDateString()
    : "N/A";

  return (
    <TableRow className={index % 2 === 0 ? "" : "bg-violet-100"}>
      <TableCell className="p-3 text-gray-900 text-sm font-normal leading-tight">
        {user.email}
      </TableCell>
      <TableCell className="p-3 text-gray-900 text-sm font-normal leading-tight">
        {user.userInformation?.username || "N/A"}
      </TableCell>
      <TableCell className="p-3 text-gray-900 text-sm font-normal leading-tight">
        {user.userInformation?.firstName || "N/A"}
      </TableCell>
      <TableCell className="p-3 text-gray-900 text-sm font-normal leading-tight">
        {user.userInformation?.lastName || "N/A"}
      </TableCell>
      <TableCell className="p-3 text-gray-900 text-sm font-normal leading-tight">
        {formattedBirthDate}
      </TableCell>
      <TableCell className="p-3 text-gray-900 text-sm font-normal leading-tight">
        {user.userInformation?.contactNumber || "N/A"}
      </TableCell>
      <TableCell className="p-3">
        <StatusBadge banned={user.banned} />
      </TableCell>
      <TableCell className="p-3">
        <ActionButtons
          onManage={onManage}
          onBan={onBan}
          onUnban={onUnban}
          user={user}
        />
      </TableCell>
    </TableRow>
  );
};

export function UserTable({
  users,
  onDelete,
  onReset,
  onClear,
  onBan,
  onUnban,
}: UserTableProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="self-stretch rounded-lg border-1.25 border-blue-500">
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
          {users.map((user, index) => (
            <UserRow
              key={user.id}
              user={user}
              index={index}
              onManage={() => {
                setSelectedUser(user);
                setDrawerOpen(true);
              }}
              onBan={onBan}
              onUnban={onUnban}
            />
          ))}
        </TableBody>
      </Table>
      <ManageUserDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        user={selectedUser}
        onDelete={onDelete}
        onReset={onReset}
        onClear={onClear}
        onBan={onBan}
        onUnban={onUnban}
      />
    </div>
  );
}
