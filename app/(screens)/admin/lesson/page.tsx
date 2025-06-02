"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, FileText } from "lucide-react";
import { useLearningResourceStore } from "@/app/store/store.lr";
import { LearningResource } from "@/types/type.lessons";
import { authClient } from "@/app/lib/auth-client";
import Background from "@/components/background";

// Helper type guard
function hasModules(obj: unknown): obj is { modules: unknown[] } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "modules" in obj &&
    Array.isArray((obj as { modules: unknown[] }).modules)
  );
}

const MyLessonsPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | undefined>("");

  const learningResourceStore = useLearningResourceStore();

  useEffect(() => {
    const fetchLessons = async () => {
      const session = await authClient.getSession();

      if (!session.data) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const userId = session.data.user.id;
      learningResourceStore.getMyLessons(userId);
    };
    fetchLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  useEffect(() => {
    if (learningResourceStore.status === "Error") {
      setError(learningResourceStore.error);
      setLoading(false);
    }
  }, [learningResourceStore.error, learningResourceStore.status]);

  return (
    <>
      <Background />
      <div className="relative min-h-screen px-2 flex flex-col items-center justify-start">
        <div className="max-w-4xl w-full mx-auto py-12">
          {/* Header */}
          <header className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-blue-400 mb-1 drop-shadow-sm">
                My Lessons
              </h1>
              <p className="text-blue-300 text-lg font-medium">
                Manage and edit your lessons below.
              </p>
            </div>
            <Link href="/admin/lesson/new/edit" aria-label="Create new lesson">
              <Button
                className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-white shadow-md"
                size="lg"
              >
                <PlusCircle className="w-5 h-5" />
                New Lesson
              </Button>
            </Link>
          </header>

          {/* States */}
          {(learningResourceStore.status == "Idle" ||
            learningResourceStore.status == "Loading") && (
            <div className="flex justify-center py-16">
              <span
                className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"
                aria-label="Loading"
              ></span>
            </div>
          )}
          {learningResourceStore.status == "Error" && error && (
            <div
              className="bg-danger-100 border border-danger-400 text-danger-500 px-4 py-3 rounded-lg mb-8 text-center font-semibold shadow"
              role="alert"
            >
              {error}
            </div>
          )}
          {learningResourceStore.status == "Loaded" &&
            !error &&
            (!learningResourceStore.lessons ||
              learningResourceStore.lessons.length === 0) && (
              <div className="flex flex-col items-center py-20">
                <FileText
                  className="w-16 h-16 text-blue-200 mb-4"
                  aria-hidden="true"
                />
                <span className="text-blue-400 text-xl font-semibold mb-2">
                  No lessons found
                </span>
                <span className="text-blue-300 mb-4">
                  Start by creating your first lesson!
                </span>
                <Link
                  href="/admin/lesson/create"
                  aria-label="Create your first lesson"
                >
                  <Button
                    variant="secondary"
                    className="mt-2 bg-blue-400/90 hover:bg-blue-500 text-white shadow"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create your first lesson
                  </Button>
                </Link>
              </div>
            )}

          {/* Lesson Cards */}
          <section
            className="grid grid-cols-1 sm:grid-cols-2 gap-8"
            aria-label="Lessons list"
          >
            {learningResourceStore.lessons &&
              learningResourceStore.lessons.map((lesson: LearningResource) => (
                <Card
                  key={lesson.id}
                  className="relative transition-shadow hover:shadow-xl border-blue-200 bg-white/80 backdrop-blur-md rounded-xl shadow-md group"
                  aria-label={`Lesson: ${lesson.title}`}
                >
                  {/* Status Badge */}
                  <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-sm border-2
                      ${
                        lesson.is_visible
                          ? "bg-success-100 text-success-500 border-success-400"
                          : "bg-warning-100 text-warning-500 border-warning-400"
                      }
                    `}
                    style={{ zIndex: 2 }}
                  >
                    {lesson.is_visible ? "Published" : "Draft"}
                  </div>
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <FileText
                      className="w-7 h-7 text-blue-400 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <CardTitle className="text-lg font-semibold truncate text-blue-300 group-hover:text-blue-500 transition-colors">
                      {lesson.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 text-blue-200 min-h-[48px] line-clamp-3">
                      {lesson.description || (
                        <span className="italic text-blue-100">
                          No description
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/admin/lesson/${lesson.id}/edit`}
                        aria-label={`Edit lesson: ${lesson.title}`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-300 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors"
                        >
                          View Details
                        </Button>
                      </Link>
                      <div className="flex flex-col gap-1 items-end">
                        <span className="text-xs text-blue-200">
                          {hasModules(lesson) ? lesson.modules.length : 0}{" "}
                          modules
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </section>
        </div>
      </div>
    </>
  );
};

export default MyLessonsPage;
