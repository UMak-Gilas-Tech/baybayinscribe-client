import { QuizStore } from "@/app/store/store.quiz";
import { QuizMetadata, QuizQuestion } from "@/types/type.quiz";
import { createContext, Dispatch, useContext } from "react";

type QuizEditorContextType = {
  quizInformation?: QuizMetadata;
  quizQuestions?: QuizQuestion[];
  quizStore?: QuizStore;

  setQuizInformation: Dispatch<React.SetStateAction<QuizMetadata>>;
  setQuizQuestions: Dispatch<React.SetStateAction<QuizQuestion[]>>;
};

export const useQuizContext = () => {
  const context = useContext(QuizEditorContext);
  if (!context) {
    throw new Error("useQuizContext must be used within a QuizProvider");
  }
  return context;
};

export const QuizEditorContext = createContext<QuizEditorContextType | null>(
  null
);
export const QuizEditorProvider = QuizEditorContext.Provider;
