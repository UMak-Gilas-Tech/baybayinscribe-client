import { Status } from "@/types/type.loading";
import {
  metadata,
  quiz_answer_question,
  quiz_question,
  QuizSchema,
} from "@/db/schema/quiz-schema";
import { create } from "zustand";
import axios from "@/lib/axios";
import { Quiz } from "@/types/type.quiz";
export type QuizStore = {
  status: Status;
  quiz?: Quiz | undefined;
  quiz_details?:
     typeof QuizSchema.$inferSelect & {
      metadata: typeof metadata.$inferSelect;
    } & { questions: (typeof quiz_question.$inferSelect)[] } | undefined;
  error?: string;
  loadQuiz: (quiz_id: string) => void;
  loadQuizDetails: (quiz_id: string) => void;

  submitQuizAnswers: (
    answers: (typeof quiz_answer_question.$inferSelect)[]
  ) => void;
  loadQuizAnswerHistory: (quiz_id: string) => void;

  saveLocalQuizProgress: (
    answer: typeof quiz_answer_question.$inferSelect
  ) => void;
  loadLocalQuizProgress: (quiz_id: string) => void;
  loadAllLocalQuizProgress: () => void;
};

const useQuizStore = create<QuizStore>((set, get) => ({
  status: "Idle",

  loadQuiz: async (quiz_id: string) => {
    set({ status: "Loading" });

    const response = await axios.get(`/quiz/get/${quiz_id}`);

    if (response.status === 200) {
      const quizData: Quiz = response.data;
      set({ quiz: quizData, status: "Loaded" });
    } else {
      set({ error: response.data.error, status: "Error" });
    }
  },
  loadQuizDetails: async (quiz_id: string) => {
    set({ status: "Loading" });
    const quizResponse = await axios.get(`/quiz/get/${quiz_id}`);
    const quiz: typeof QuizSchema.$inferSelect & {
      metadata: typeof metadata.$inferSelect;
    } & { questions: (typeof quiz_question.$inferSelect)[] } =
      quizResponse.data;

    set({ quiz_details: quiz, status: "Loaded" });
  },
  submitQuizAnswers: (
    answers: (typeof quiz_answer_question.$inferSelect)[]
  ) => {
    // implement submitQuizAnswers functionality
  },
  loadQuizAnswerHistory: (quiz_id: string) => {
    // implement loadQuizAnswerHistory functionality
  },
  saveLocalQuizProgress: (answer: typeof quiz_answer_question.$inferSelect) => {
    // implement saveLocalQuizProgress functionality
  },
  loadLocalQuizProgress: (quiz_id: string) => {
    // implement loadLocalQuizProgress functionality
  },
  loadAllLocalQuizProgress: () => {
    // implement loadAllLocalQuizProgress functionality
  },
}));

export default useQuizStore;
