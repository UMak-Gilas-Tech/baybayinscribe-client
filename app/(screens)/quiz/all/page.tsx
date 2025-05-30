"use client";
import React, { useEffect, useState } from "react";
import useQuizStore from "@/app/store/store.quiz";
import { Quiz } from "@/types/type.quiz";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const FILTER_OPTIONS = [{ label: "All", value: "all" }];

export default function AllQuizzesPage() {
  const { loadAllQuiz, quizzes, status } = useQuizStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        await loadAllQuiz();
      } catch (error) {
        console.error("Failed to load quizzes:", error);
      }
    };
    fetchQuizzes();
  }, [loadAllQuiz]);

  useEffect(() => {
    if (!quizzes) return;
    let filtered = quizzes;
    if (search) {
      filtered = filtered.filter((q) =>
        q.metadata.quiz_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredQuizzes(filtered);
  }, [quizzes, search, filter]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <ChevronLeft
            className="h-6 w-6 text-gray-500 cursor-pointer"
            onClick={() => router.back()}
          />
          <h1 className="text-3xl font-bold mb-6 text-center">All Quizzes</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center justify-between">
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search quizzes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <Button
              onClick={async () => {
                // setError(null);
                // try {
                //   await loadAllQuiz();
                // } catch {
                //   setError("Failed to load quizzes. Please try again later.");
                // }
              }}
              variant="outline"
            >
              Refresh
            </Button>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-40" />
            <SelectContent>
              {FILTER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {status === "Loading" ? (
          <div className="text-center py-10 text-gray-500">
            Loading quizzes...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredQuizzes.length === 0 ? (
              <div className="col-span-full text-center text-gray-400">
                No quizzes found.
              </div>
            ) : (
              filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.metadata.quiz_id}
                  className="relative bg-gradient-to-br from-blue-50 via-white to-slate-100 rounded-xl shadow-lg p-6 flex flex-col group border border-muted/20 hover:border-blue-400 transition-all duration-200 hover:shadow-2xl hover:-translate-y-1"
                >
                  <h2 className="text-xl font-bold mb-1 text-black group-hover:text-blue-700 transition-colors line-clamp-2">
                    {quiz.metadata.quiz_name}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                    {quiz.metadata.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-xs text-muted-foreground">
                      Updated:{" "}
                      {quiz.metadata.updated_at
                        ? new Date(
                            quiz.metadata.updated_at
                          ).toLocaleDateString()
                        : "-"}
                    </span>
                    <button
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-blue-100 text-white font-medium text-xs shadow hover:bg-blue-200 transition"
                      onClick={() => {
                        window.location.href = `/quiz/${quiz.metadata.quiz_id}`;
                      }}
                    >
                      View Quiz
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-6 h-6 text-blue-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13.293 2.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-9 9a1 1 0 01-.293.207l-4 2a1 1 0 01-1.316-1.316l2-4a1 1 0 01.207-.293l9-9z" />
                    </svg>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
