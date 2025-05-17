"use client";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { QuizFormCard } from "./QuizFormCard";
import { useQuizContext } from "../context/useQuizContext";
import { Quiz, QuizDifficulty } from "@/types/type.quiz";

// Define schema with Quiz Topic field
const quizSchema = z.object({
  title: z.string().min(1, "Title is required"),
  quizTopic: z.string().min(1, "Quiz Topic is required"),
  description: z.string().min(1, "Description is required"),
  timer: z.string().min(1, "Timer is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
});

interface QuizFormHeaderProps {
  onSubmit: (formData: {
    title: string;
    quizTopic: string;
    description: string;
    timer: string;
    difficulty: string;
  }) => void;
  existingData?: {
    title: string;
    quizTopic: string;
    description: string;
    timer: string;
    difficulty: QuizDifficulty;
  };
}

export const QuizFormHeader = ({
  onSubmit,
  existingData,
}: QuizFormHeaderProps) => {
  // Component state management
  const [title, setTitle] = useState("");
  const [quizTopic, setQuizTopic] = useState("");
  const [description, setDescription] = useState("");
  const [timer, setTimer] = useState("");
  const [difficulty, setDifficulty] = useState<QuizDifficulty>(
    QuizDifficulty.Easy
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    title: false,
    quizTopic: false,
    description: false,
    timer: false,
    difficulty: false,
  });
  const { quizInformation, setQuizInformation } = useQuizContext();

  useEffect(() => {
    if (existingData) {
      setTitle(existingData.title);
      setQuizTopic(existingData.quizTopic);
      setDescription(existingData.description);
      setTimer(existingData.timer);
      setDifficulty(existingData.difficulty);
    }
  }, [existingData]);

  const handleSubmit = () => {
    const result = quizSchema.safeParse({
      title,
      quizTopic,
      description,
      timer,
      difficulty,
    });
    if (!result.success) {
      const newErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
    } else {
      setErrors({});
      onSubmit({ title, quizTopic, description, timer, difficulty });
    }
  };

  useEffect(() => {
    if (!quizInformation) return;
    setQuizInformation({
      quiz_name: title,
      category: quizTopic,
      description,
      time_limit: parseInt(timer) || 0,
      difficulty,
      quiz_id: quizInformation.quiz_id,
      created_at: quizInformation.created_at,
      updated_at: quizInformation.updated_at,
    });
  }, [
    title,
    quizTopic,
    description,
    timer,
    difficulty,
    quizInformation?.quiz_id,
    quizInformation?.created_at,
    quizInformation?.updated_at,
  ]);

  return (
    <QuizFormCard>
      {/* Updated container to take full width */}
      <div className="flex flex-col gap-4 w-full">
        {/* Quiz Title */}
        <div>
          <input
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title && touched.title
                ? "border-red-500"
                : "border-gray-300"
            }`}
            type="text"
            placeholder="Enter Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              setTouched({ ...touched, title: true });
              handleSubmit();
            }}
          />
          {errors.title && touched.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>
        {/* Quiz Topic */}
        <div>
          <input
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.quizTopic && touched.quizTopic
                ? "border-red-500"
                : "border-gray-300"
            }`}
            type="text"
            placeholder="Enter Quiz Category"
            value={quizTopic}
            onChange={(e) => setQuizTopic(e.target.value)}
            onBlur={() => {
              setTouched({ ...touched, quizTopic: true });
              handleSubmit();
            }}
          />
          {errors.quizTopic && touched.quizTopic && (
            <p className="text-red-500 text-sm mt-1">{errors.quizTopic}</p>
          )}
        </div>
        {/* Description */}
        <div>
          <Textarea
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description && touched.description
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Enter Quiz Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => {
              setTouched({ ...touched, description: true });
              handleSubmit();
            }}
          />
          {errors.description && touched.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>
        <div className="flex flex-row gap-4 items-end w-full">
          {/* Timer */}
          <div className="flex-1">
            <input
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.timer && touched.timer
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              type="text"
              placeholder="Enter Timer (in seconds)"
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
              onBlur={() => {
                setTouched({ ...touched, timer: true });
                handleSubmit();
              }}
            />
            {errors.timer && touched.timer && (
              <p className="text-red-500 text-sm mt-1">{errors.timer}</p>
            )}
          </div>
          {/* Difficulty */}
          <div className="flex flex-col mt-4 flex-1">
            <Select
              value={difficulty}
              onValueChange={(value) => {
                if (!touched.difficulty)
                  setTouched({ ...touched, difficulty: true });
                setDifficulty(value as QuizDifficulty);
                handleSubmit();
              }}
            >
              <SelectTrigger
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.difficulty && touched.difficulty
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(QuizDifficulty).map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.difficulty && touched.difficulty && (
              <p className="text-red-500 text-sm mt-1">{errors.difficulty}</p>
            )}
          </div>
        </div>
      </div>
    </QuizFormCard>
  );
};
