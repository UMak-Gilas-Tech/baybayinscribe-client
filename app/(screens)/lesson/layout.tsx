"use client";

import { useParams } from "next/navigation";
import { LessonProvider } from "./LessonContext";

export default function LessonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const { lesson_id } = useParams<{ lesson_id: string }>();
  return (
    <div className="flex flex-col gap-4 w-full">
      <LessonProvider lessonId={lesson_id}>
        <div className="flex flex-col gap-2">{children}</div>
      </LessonProvider>
    </div>
  );
}
