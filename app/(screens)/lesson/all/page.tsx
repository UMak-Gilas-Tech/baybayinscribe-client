"use client";
import React, { useEffect, useState } from "react";
import { useLearningResourceStore } from "@/app/store/store.lr";
import { LearningResource } from "@/types/type.lessons";
import { Input } from "@/components/ui/input"; // Assume you have a styled Input component
import { Button } from "@/components/ui/button"; // Assume you have a styled Button component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"; // Assume you have a styled Select component
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Visible", value: "visible" },
  { label: "Hidden", value: "hidden" },
];

export default function AllLessonsPage() {
  const { getAllLessons, lessons, status } = useLearningResourceStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [filteredLessons, setFilteredLessons] = useState<LearningResource[]>(
    []
  );

  const router = useRouter();

  useEffect(() => {
    getAllLessons();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!lessons) return;
    let filtered = lessons;
    if (search) {
      filtered = filtered.filter((l) =>
        l.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filter === "visible") {
      filtered = filtered.filter((l) => l.is_visible);
    } else if (filter === "hidden") {
      filtered = filtered.filter((l) => !l.is_visible);
    }
    setFilteredLessons(filtered);
  }, [lessons, search, filter]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
            <ChevronLeft className="h-6 w-6 text-gray-500 cursor-pointer" onClick={() => router.back()}  />
          <h1 className="text-3xl font-bold mb-6 text-center">All Lessons</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center justify-between">
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search lessons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <Button onClick={() => getAllLessons()} variant="outline">
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
            Loading lessons...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredLessons.length === 0 ? (
              <div className="col-span-full text-center text-gray-400">
                No lessons found.
              </div>
            ) : (
              filteredLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="relative bg-gradient-to-br from-blue-50 via-white to-slate-100 rounded-xl shadow-lg p-6 flex flex-col group border border-muted/20 hover:border-blue-400 transition-all duration-200 hover:shadow-2xl hover:-translate-y-1"
                >
                 
                  <h2 className="text-xl font-bold mb-1 text-black group-hover:text-blue-700 transition-colors line-clamp-2">
                    {lesson.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                    {lesson.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-xs text-muted-foreground">
                      Updated:{" "}
                      {lesson.updatedAt
                        ? new Date(lesson.updatedAt).toLocaleDateString()
                        : "-"}
                    </span>
                    <button
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-blue-100 text-white font-medium text-xs shadow hover:bg-blue-200 transition"
                      onClick={() => {
                        window.location.href = `/lesson/${lesson.id}`;
                      }}
                    >
                      View Lesson
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-6 h-6 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
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
