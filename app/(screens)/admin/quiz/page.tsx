"use client";

import React, { useEffect } from "react";
import useQuizStore from "@/app/store/store.quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";
import { PlusCircle, FileText } from "lucide-react";
import Background from "@/components/background";

const MyQuizzesPage = () => {
  const { quizzes, status, error, loadMyQuizzes } = useQuizStore();
  const [userId, setUserId] = React.useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const session = await authClient.getSession();
      if (session.data && session.data.user) {
        setUserId(session.data.user.id);
      }
    })();
  }, []);

  useEffect(() => {
    if (userId) loadMyQuizzes(userId);
  }, [userId, loadMyQuizzes]);

  const loading = status === "Loading";

  return (
    <>
      <Background />
      <div className="relative min-h-screen px-2 flex flex-col items-center justify-start bg-gradient-to-br from-[hsl(227,92%,95%)] via-[hsl(225,25%,94%)] to-[hsl(225,36%,39%)]/10">
        <div className="max-w-4xl w-full mx-auto py-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-blue-400 mb-1 drop-shadow-sm">
                My Quizzes
              </h1>
              <p className="text-blue-300 text-lg font-medium">
                Manage and edit your quizzes below.
              </p>
            </div>
            <Link href="/admin/quiz/new/edit">
              <Button
                className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-white shadow-md"
                size="lg"
              >
                <PlusCircle className="w-5 h-5" />
                New Quiz
              </Button>
            </Link>
          </div>

          {/* States */}
          {loading && (
            <div className="flex justify-center py-16">
              <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></span>
            </div>
          )}
          {error && (
            <div className="bg-danger-100 border border-danger-400 text-danger-500 px-4 py-3 rounded-lg mb-8 text-center font-semibold shadow">
              {error}
            </div>
          )}
          {!loading && !error && (!quizzes || quizzes.length === 0) && (
            <div className="flex flex-col items-center py-20">
              <FileText className="w-16 h-16 text-blue-200 mb-4" />
              <span className="text-blue-400 text-xl font-semibold mb-2">
                No quizzes found
              </span>
              <span className="text-blue-300 mb-4">
                Start by creating your first quiz!
              </span>
              <Link href="/admin/quiz/create">
                <Button
                  variant="secondary"
                  className="mt-2 bg-blue-400/90 hover:bg-blue-500 text-white shadow"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create your first quiz
                </Button>
              </Link>
            </div>
          )}

          {/* Quiz Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes &&
              quizzes.map((quiz) => (
                <Card
                  key={quiz.metadata.quiz_id}
                  className="relative transition-shadow hover:shadow-xl border-blue-200 bg-white/80 backdrop-blur-md rounded-xl shadow-md group"
                >
                  {/* Status Badge */}
                  <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-sm border-2
                      ${
                        quiz.metadata.is_public
                          ? "bg-success-100 text-success-500 border-success-400"
                          : "bg-warning-100 text-warning-500 border-warning-400"
                      }
                    `}
                    style={{ zIndex: 2 }}
                  >
                    {quiz.metadata.is_public ? "Published" : "Draft"}
                  </div>
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <FileText className="w-7 h-7 text-blue-400 flex-shrink-0" />
                    <CardTitle className="text-lg font-semibold truncate text-blue-300 group-hover:text-blue-500 transition-colors">
                      {quiz.metadata.quiz_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 text-blue-200 min-h-[48px] line-clamp-3">
                      {quiz.metadata.description || (
                        <span className="italic text-blue-100">
                          No description
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <Link href={`/admin/quiz/${quiz.metadata.quiz_id}/edit`}>
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
                          {quiz.questions?.length ?? 0} questions
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyQuizzesPage;
