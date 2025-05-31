"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { toast } from "sonner";
import {
  Quiz,
  QuizQuestion,
  ModifiedQuizAnswerQuestion,
} from "../../../../../types/type.quiz";
import useQuizStore from "@/app/store/store.quiz";
import { useInferenceStore, InferenceState, InferenceStatus } from "@/app/store/store.inference";

type QuizTakeContextType = {
  quizId?: string;
  quiz?: Quiz;
  progress: number;
  currentQuestion: QuizQuestion | undefined;
  health?: number;
  inference?: InferenceState;
  isModelReady: boolean;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: () => void;
  subscribeToSubmit: (callback: () => void) => void;
  onTimerEnd: (callback: () => void) => void;
  setHealth: React.Dispatch<React.SetStateAction<number>>;
  answerHistory: ModifiedQuizAnswerQuestion[];
  recordAnswer: (record: ModifiedQuizAnswerQuestion) => void;
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
    Array<ModifiedQuizAnswerQuestion>
  >([]);
  const [isModelReady, setIsModelReady] = useState(false);
  const quizStore = useQuizStore();

  // Initialize quiz and model when component mounts
  useEffect(() => {
    const initializeQuizAndModel = async () => {
      // Load quiz first
      await quizStore.loadQuiz(params.quiz_id);

      // Initialize inference model immediately
      if (inference.status === InferenceStatus.IDLE) {
        console.log("Initializing inference model for quiz...");
        inference.initLocalModel();
      }
    };

    initializeQuizAndModel();
  }, [params.quiz_id]);

  // Monitor inference model status
  useEffect(() => {
    setIsModelReady(inference.status === InferenceStatus.READY);

    if (inference.status === InferenceStatus.ERROR) {
      toast.error(
        "Failed to load AI model. Sketch questions may not work properly."
      );
    } else if (inference.status === InferenceStatus.READY) {
      console.log("Inference model is ready!");
    }
  }, [inference.status]);

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
      
      // Clear inference results if transitioning to non-sketch question
      const isSketchQuestion = curr.type === "sketch" || curr.type === "SKT";
      if (!isSketchQuestion && inference.localInferenceResult) {
        console.log("Clearing inference results for non-sketch question");
        inference.clearResults();
      }
    } else {
      console.log("No more questions available.");
    }
  }, [quiz, progress, inference]);

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

  const recordAnswer = (record: ModifiedQuizAnswerQuestion) => {
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
        inference: inference,
        isModelReady,
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
