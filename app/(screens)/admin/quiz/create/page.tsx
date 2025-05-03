"use client";

import React, { useState } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "../../../../../components/ui/alert";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuizData({ ...quizData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        quiz_name: quizData.quiz_name == "" ? undefined : quizData.quiz_name,
        topic: quizData.topic,
        description: quizData.description == "" ? undefined : quizData.description,
        difficulty: quizData.difficulty,
        question_count: Number(quizData.question_count),
      };
      const response = await axios.post("/api/quiz", payload);
      console.log(response.data)
      setSuccess(response.data.message || "Quiz created successfully");
      setQuizData({ quiz_name: "", topic: "", description: "", difficulty: "Easy", question_count: "" });
      router.push(`/quiz/view/${response.data.quizId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold text-center">Create Quiz</h1>
        <div className="flex flex-col">
          <Label htmlFor="quiz_name">Quiz Name (optional)</Label>
          <Input
            type="text"
            name="quiz_name"
            id="quiz_name"
            value={quizData.quiz_name}
            onChange={handleChange}
            placeholder="Enter quiz name"
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="topic">Topic</Label>
          <Input
            type="text"
            name="topic"
            id="topic"
            value={quizData.topic}
            onChange={handleChange}
            placeholder="Enter topic"
            required
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="description">Description (optional)</Label>
          <Input
            type="text"
            name="description"
            id="description"
            value={quizData.description}
            onChange={handleChange}
            placeholder="Enter description"
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            value={quizData.difficulty}
            onValueChange={(value) => setQuizData({ ...quizData, difficulty: value })}
          >
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Moderate">Moderate</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <Label htmlFor="question_count">Question Count</Label>
          <Input
            type="number"
            name="question_count"
            id="question_count"
            value={quizData.question_count}
            onChange={handleChange}
            placeholder="Enter number of questions"
            required
          />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="default">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Quiz"}
        </Button>
      </form>
    </div>
  );
}