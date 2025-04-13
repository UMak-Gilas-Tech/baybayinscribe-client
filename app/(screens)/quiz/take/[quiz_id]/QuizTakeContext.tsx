"use client"
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { toast } from "sonner";
import mockQuiz from "../../../../../mock/quiz.mock.json";
import {
  Quiz,
  QuizQuestion,
  QuestionType,
} from "../../../../../types/type.quiz";
import useQuizStore from "@/app/store/store.quiz";
import { useInferenceStore } from "@/app/store/store.inference";

type QuizTakeContextType = {
  quizId?: string;
  quiz?: Quiz;
  progress: number;
  currentQuestion: QuizQuestion | undefined;
  health?: number;
  inference?: any;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: () => void;
  subscribeToSubmit: (callback: () => void) => void;
  onTimerEnd: (callback: () => void) => void;
  setHealth: React.Dispatch<React.SetStateAction<number>>;
  answerHistory: Array<{
    questionNumber?: number;
    question?: string;
    answer?: any;
    isCorrect: boolean;
    type?: QuestionType;
  }>;
  recordAnswer: (record: {
    questionNumber?: number;
    question?: string;
    answer?: any;
    isCorrect: boolean;
    type?: QuestionType;
  }) => void;
};

const QuizTakeContext = createContext<QuizTakeContextType | undefined>(
  undefined
);

export const useQuizTakeContext = () => {
  const context = useContext(QuizTakeContext);
  if (!context) {
    throw new Error(
      "useQuizTakeContext must be used within a QuizTakeProvider"
    );
  }
  return context;
};

export const QuizTakeProvider: React.FC<{
  children: React.ReactNode;
  params: { quiz_id: string };
}> = ({ children, params }) => {
  const [quiz, setQuiz] = useState<Quiz | undefined>();
  const [currentQuestion, setCurrentQuestion] = useState<
    QuizQuestion | undefined
  >(undefined);
  const [progress, setProgress] = useState(0);
  const inference = useInferenceStore();
  const [health, setHealth] = useState(3);
  const [answerHistory, setAnswerHistory] = useState<
    Array<{
      questionNumber?: number;
      question?: string;
      answer?: any;
      isCorrect: boolean;
      type?: QuestionType;
    }>
  >([]);
  const quizStore = useQuizStore();
  useEffect(() => {
    quizStore.loadQuiz(params.quiz_id);
    console.log(params.quiz_id)
    inference.initLocalModel();
  }, []);

  useEffect(() => {
    if (quizStore.status === "Loaded") {
      const quiz = quizStore.quiz;
      setQuiz(quiz as Quiz);

      setCurrentQuestion(quiz?.questions[progress]);
    } else if (quizStore.status === "Error") {
      toast.error("Failed to load quiz.");
    }
  }, [quizStore.status]);

  useEffect(() => {
    if (!quiz) return;
    const curr = quiz.questions[progress];
    if (curr) {
      setCurrentQuestion(curr);
      console.log(curr.type);
    } else {
      console.log("No more questions available.");
    }
  }, [quiz, progress]);

  const submitCallbacks = useRef<(() => void)[]>([]);
  const timerCallbacks = useRef<(() => void)[]>([]);

  const onSubmit = () => {
    submitCallbacks.current.forEach((callback) => callback());
  };

  const onTimerEnd = (callback: () => void) => {
    if (timerCallbacks.current.findIndex((cb) => cb === callback) === -1)
      timerCallbacks.current.push(callback);
    return () => {
      timerCallbacks.current = timerCallbacks.current.filter(
        (cb) => cb !== callback
      );
    };
  };

  const subscribeToSubmit = (callback: () => void) => {
    if (submitCallbacks.current.findIndex((cb) => cb === callback) === -1)
      submitCallbacks.current.push(callback);
    return () => {
      submitCallbacks.current = submitCallbacks.current.filter(
        (cb) => cb !== callback
      );
    };
  };

  const recordAnswer = (record: {
    questionNumber?: number;
    question?: string;
    answer?: any;
    isCorrect: boolean;
    type?: QuestionType;
  }) => {
    setAnswerHistory((prev) => [...prev, record]);
  };

  return (
    <QuizTakeContext.Provider
      value={{
        progress,
        currentQuestion,
        health,
        answerHistory,
        quiz,
        inference: inference as any,
        setHealth,
        onTimerEnd,
        setProgress,
        onSubmit,
        subscribeToSubmit,
        recordAnswer,
      }}
    >
      {children}
    </QuizTakeContext.Provider>
  );
};
