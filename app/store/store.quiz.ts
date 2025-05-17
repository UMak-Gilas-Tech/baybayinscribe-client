import { Status } from "@/types/type.loading";
import {
  metadata,
  quiz_answer_question,
  quiz_question,
  QuizSchema,
} from "@/db/schema/quiz-schema";
import { create } from "zustand";
import axios from "@/lib/axios";
import { ModifiedQuizAnswerQuestion, Quiz } from "@/types/type.quiz";
export type QuizStore = {
  status: Status;
  quizAnswerUploadStatus: Status;
  quiz?: Quiz | undefined;
  quizzes?: Quiz[] | undefined;
  quiz_details?:
    | (typeof QuizSchema.$inferSelect & {
        metadata: typeof metadata.$inferSelect;
      } & { questions: (typeof quiz_question.$inferSelect)[] })
    | undefined;
  error?: string;
  answerHistory:
    | ({ quiz: { id: string } } & {
        quiz_answer_question: (typeof quiz_answer_question.$inferSelect)[];
      })
    | undefined;

  saveQuiz: (
    quiz: typeof QuizSchema.$inferSelect & {
      metadata: typeof metadata.$inferSelect;
    } & { questions: (typeof quiz_question.$inferSelect)[] }
  ) => void;

  loadQuiz: (quiz_id: string) => void;
  loadQuizDetails: (quiz_id: string) => void;

  submitQuizAnswers: (
    quiz_id: string,
    answers: ModifiedQuizAnswerQuestion[]
  ) => void;
  loadQuizAnswerHistory: (quiz_id: string) => void;

  saveLocalQuizProgress: (
    answer: typeof quiz_answer_question.$inferSelect
  ) => void;
  loadLocalQuizProgress: (quiz_id: string) => void;
  loadAllLocalQuizProgress: () => void;

  loadAllQuiz: () => void;
  loadMyQuizzes: (userId: string) => void;
};

const useQuizStore = create<QuizStore>((set, get) => ({
  status: "Idle",
  quizAnswerUploadStatus: "Idle",
  answerHistory: undefined,
  loadQuiz: async (quiz_id: string) => {
    set({ status: "Loading" });
    try {
      const response = await axios.get(`/quiz/get/${quiz_id}`);
      if (response.status === 200) {
        const quizData: Quiz = response.data;
        set({ quiz: quizData, status: "Loaded" });
      } else {
        set({ error: response.data.error, status: "Error" });
      }
    } catch (error: any) {
      set({ error: "Couldn't load quiz. Try again!", status: "Error" });
    }
  },
  saveQuiz: async (quiz) => {
    set({ status: "Loading" });
    try {
      const response = await axios.post(`/quiz/save`, quiz);
      if (response.status === 200) {
        set({ quiz: response.data, status: "Loaded" });
      } else {
        set({ error: response.data.error, status: "Error" });
      }
    } catch (error: any) {
      set({ error: error.message || "Error", status: "Error" });
    }
  },
  loadQuizDetails: async (quiz_id: string) => {
    set({ status: "Loading" });
    try {
      const quizResponse = await axios.get(`/quiz/get/${quiz_id}`);
      const quiz: typeof QuizSchema.$inferSelect & {
        metadata: typeof metadata.$inferSelect;
      } & { questions: (typeof quiz_question.$inferSelect)[] } =
        quizResponse.data;
      set({ quiz_details: quiz, status: "Loaded" });
    } catch (error: any) {
      set({ error: error.message || "Error", status: "Error" });
    }
  },
  submitQuizAnswers: async (quiz_id: string, answers) => {
    set({ status: "Loading" });
    try {
      const response = await axios.post(`/quiz/answers/save/`, {
        answers: answers,
      });
      // Optional: set response or further handling here.
    } catch (error: any) {
      set({ error: error.message || "Error", status: "Error" });
    }
  },
  loadQuizAnswerHistory: async (quiz_id: string) => {
    set({ status: "Loading" });
    try {
      const response = await axios.get(`/quiz/answers/${quiz_id}`);
      if (response.status === 200) {
        const answers = response.data;
        set({ answerHistory: answers, status: "Loaded" });
      } else {
        set({ error: response.data.error, status: "Error" });
      }
    } catch (error: any) {
      set({ error: error.message || "Error", status: "Error" });
    }
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
  loadAllQuiz: async () => {
    set({ status: "Loading" });
    try {
      const response = await axios.get(`/quiz/all`);
      if (response.status === 200) {
        const quizzes = response.data;
        set({ quizzes, status: "Loaded" });
      } else {
        set({ error: response.data.error, status: "Error" });
      }
    } catch (error: any) {
      set({ error: error.message || "Error", status: "Error" });
    }
  },
  loadMyQuizzes: async (userId: string) => {
    set({ status: "Loading" });
    try {
      const response = await axios.post(`/quiz/my`, { userId: userId });
      if (response.status === 200) {
        const quizzes = response.data;
        set({ quizzes, status: "Loaded" });
      } else {
        set({ error: response.data.error, status: "Error" });
      }
    } catch (error: any) {
      set({ error: error.message || "Error", status: "Error" });
    }
  },
}));

export default useQuizStore;
