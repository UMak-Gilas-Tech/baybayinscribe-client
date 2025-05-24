"use client";

import React, { useEffect } from "react";
import useQuizStore from "@/app/store/store.quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";
import { PlusCircle, FileText } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-2">
      <div className="max-w-4xl mx-auto py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 mb-1">
              My Quizzes
            </h1>
            <p className="text-slate-500 text-lg">
              Manage and edit your quizzes below.
            </p>
          </div>
          <Link href="/admin/quiz/new/edit">
            <Button className="flex items-center gap-2" size="lg">
              <PlusCircle className="w-5 h-5" />
              New Quiz
            </Button>
          </Link>
        </div>

        {/* States */}
        {loading && (
          <div className="flex justify-center py-10">
            <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></span>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6 text-center">
            {error}
          </div>
        )}
        {!loading && !error && (!quizzes || quizzes.length === 0) && (
          <div className="flex flex-col items-center py-16">
            <FileText className="w-12 h-12 text-slate-300 mb-3" />
            <span className="text-slate-500 text-lg mb-2">
              No quizzes found.
            </span>
            <Link href="/admin/quiz/create">
              <Button variant="secondary" className="mt-2">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create your first quiz
              </Button>
            </Link>
          </div>
        )}

        {/* Quiz Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes &&
            quizzes.map((quiz) => (
              <Card
                key={quiz.metadata.quiz_id}
                className="relative transition-shadow hover:shadow-xl border-slate-200 bg-white/90"
              >
                {/* Status Badge */}
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-sm
                    ${
                      quiz.metadata.is_public
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-orange-100 text-orange-700 border border-orange-300"
                    }
                  `}
                  style={{ zIndex: 2 }}
                >
                  {quiz.metadata.is_public ? "Published" : "Draft"}
                </div>
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <FileText className="w-7 h-7 text-indigo-500 flex-shrink-0" />
                  <CardTitle className="text-lg font-semibold truncate">
                    {quiz.metadata.quiz_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 text-slate-600 min-h-[48px] line-clamp-3">
                    {quiz.metadata.description || (
                      <span className="italic text-slate-400">
                        No description
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <Link href={`/admin/quiz/${quiz.metadata.quiz_id}/edit`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>

                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-xs text-slate-400">
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
  );
};

export default MyQuizzesPage;
