"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../../../components/ui/alert";
import { useRouter } from "next/navigation";
import Background from "@/components/background";
import useQuizStore from "@/app/store/store.quiz";
import { authClient } from "@/app/lib/auth-client";

export default function CreateQuizPage() {
  const [quizData, setQuizData] = useState({
    quiz_name: "",
    topic: "",
    description: "",
    difficulty: "Easy",
    question_count: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const router = useRouter();
  const quizStore = useQuizStore();

  useEffect(() => {
    const loadSession = async () => {
      const { data: session, error } = await authClient.getSession();
      if (error) {
        console.error("Error loading session:", error);
        setError("Please log in to create a quiz");
      } else {
        setCurrentSession(session);
      }
    };

    loadSession();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuizData({ ...quizData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSession?.user?.id) {
      setError("Please log in to create a quiz");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        quiz_name: quizData.quiz_name == "" ? undefined : quizData.quiz_name,
        topic: quizData.topic,
        description:
          quizData.description == "" ? undefined : quizData.description,
        difficulty: quizData.difficulty,
        question_count: Number(quizData.question_count),
        created_by: currentSession.user.id,
      };
      const response = await axios.post("/api/quiz", payload);
      console.log(response.data);
      setSuccess(response.data.message || "Quiz created successfully");

      // Invalidate quiz store cache to ensure home page shows the new quiz
      quizStore.loadAllQuiz();

      setQuizData({
        quiz_name: "",
        topic: "",
        description: "",
        difficulty: "Easy",
        question_count: "",
      });
      router.push(`/quiz/view/${response.data.quizId}`);
    } catch (err: unknown) {
      setError((err as Error).message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Background />
      <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[hsl(227,92%,95%)] via-[hsl(225,25%,94%)] to-[hsl(225,36%,39%)]/10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-white/80 backdrop-blur-md p-8 border-2 border-blue-200 rounded-2xl shadow-xl space-y-6"
        >
          <h1 className="text-3xl font-extrabold text-center text-blue-400 mb-2 drop-shadow-sm">
            Create Quiz
          </h1>
          <div className="flex flex-col gap-2">
            <Label className="text-blue-400 font-semibold" htmlFor="quiz_name">
              Quiz Name{" "}
              <span className="text-blue-200 font-normal">(optional)</span>
            </Label>
            <Input
              type="text"
              name="quiz_name"
              id="quiz_name"
              value={quizData.quiz_name}
              onChange={handleChange}
              placeholder="Enter quiz name"
              className="bg-blue-50/50 border-blue-100 focus:border-blue-400 focus:ring-blue-200 text-blue-300 placeholder:text-blue-100 rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-blue-400 font-semibold" htmlFor="topic">
              Topic <span className="text-red-400">*</span>
            </Label>
            <Input
              type="text"
              name="topic"
              id="topic"
              value={quizData.topic}
              onChange={handleChange}
              placeholder="Enter topic"
              required
              className="bg-blue-50/50 border-blue-100 focus:border-blue-400 focus:ring-blue-200 text-blue-300 placeholder:text-blue-100 rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              className="text-blue-400 font-semibold"
              htmlFor="description"
            >
              Description{" "}
              <span className="text-blue-200 font-normal">(optional)</span>
            </Label>
            <Input
              type="text"
              name="description"
              id="description"
              value={quizData.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="bg-blue-50/50 border-blue-100 focus:border-blue-400 focus:ring-blue-200 text-blue-300 placeholder:text-blue-100 rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-blue-400 font-semibold" htmlFor="difficulty">
              Difficulty
            </Label>
            <Select
              value={quizData.difficulty}
              onValueChange={(value) =>
                setQuizData({ ...quizData, difficulty: value })
              }
            >
              <SelectTrigger
                id="difficulty"
                className="bg-blue-50/50 border-blue-100 focus:border-blue-400 focus:ring-blue-200 text-blue-300 rounded-lg"
              >
                <SelectValue
                  className="text-blue-300"
                  placeholder="Select difficulty"
                />
              </SelectTrigger>
              <SelectContent className="bg-white border-blue-100 rounded-lg">
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label
              className="text-blue-400 font-semibold"
              htmlFor="question_count"
            >
              Question Count <span className="text-red-400">*</span>
            </Label>
            <Input
              type="number"
              name="question_count"
              id="question_count"
              value={quizData.question_count}
              onChange={handleChange}
              placeholder="Enter number of questions"
              required
              className="bg-blue-50/50 border-blue-100 focus:border-blue-400 focus:ring-blue-200 text-blue-300 placeholder:text-blue-100 rounded-lg"
            />
          </div>
          {error && (
            <Alert
              variant="destructive"
              className="rounded-lg border-danger-400 bg-danger-100 text-danger-500"
            >
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert
              variant="default"
              className="rounded-lg border-success-400 bg-success-100 text-success-500"
            >
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <Button
            className="bg-blue-400 hover:bg-blue-500 border-blue-300 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors w-full text-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Quiz"}
          </Button>
        </form>
      </div>
    </>
  );
}
