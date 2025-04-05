type QuizMetadata = {
  quiz_name: string;
  difficulty: "Easy" | "Moderate" | "Hard";
  category: "Common Words" | "Historical Terms" | "Slang in Baybayin";
  time_limit: number;
};

enum QuestionType {
  MCQ = "MCQ",
  IDT = "IDT",
  SKT = "SKT",
  WM = "WM",
}

type QuizQuestion = {
  question_number: number;
  type: QuestionType;
  language?: "Tagalog" | "Baybayin";
  question?: string;
  options?: [string, string, string, string];
  correct_answer?: string;
  character?: string;
  description?: string;
  pairs?: WordMatchingPair[];
  correct_order?: string;
};

type WordMatchingPair = {
  left: string;
  right: string;
};

type Quiz = {
  metadata: QuizMetadata;
  questions: QuizQuestion[];
};
