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
    loadAllQuiz();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!quizzes) return;
    let filtered = quizzes;
    if (search) {
      filtered = filtered.filter((q) =>
        q.title.toLowerCase().includes(search.toLowerCase())
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
            <Button onClick={() => loadAllQuiz()} variant="outline">
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
                  className="bg-white rounded-lg shadow-md p-5 flex flex-col hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-semibold mb-2">
                    {quiz.metadata.quiz_name}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {quiz.metadata.description}
                  </p>
                  
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
