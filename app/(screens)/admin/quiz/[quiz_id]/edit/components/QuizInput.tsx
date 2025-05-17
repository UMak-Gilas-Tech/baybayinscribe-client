import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { Input } from "@/components/ui/input";
import { QuizFormCard } from "./QuizFormCard";
import { z, ZodError } from "zod";
import { Textarea } from "@/components/ui/textarea";

export type QuizInputProps = {
  onSubmit?: (data: {
    question: string;
    display_text: string;
    correct_answer: string;
  }) => void;
  onChange?: (data: {
    question: string;
    display_text: string;
    correct_answer: string;
  }) => void;
  existingEntries?: {
    question: string;
    display_text: string;
    correct_answer: string;
    type: string;
  };
};

const validationSchema = z.object({
  question: z.string().min(1, { message: "Question is required." }),
  display_text: z
    .string()
    .min(1, { message: "Baybayin character is required." }),
  answer: z.string().min(1, { message: "Answer is required." }),
});

export const QuizInput = forwardRef(
  ({ onSubmit, existingEntries, onChange }: QuizInputProps, ref) => {
    const [question, setQuestion] = useState<string>("");
    const [display_text, setdisplay_text] = useState<string>("");
    const [correct_answer, setAnswer] = useState<string>("");

    useEffect(() => {
      if (existingEntries && existingEntries.question !== "" && existingEntries.type === "quiz") {
        console.log("Existing Entries Quiz INput: ", existingEntries);
        setQuestion(existingEntries.question || "");
        setdisplay_text(existingEntries.display_text || "");
        setAnswer(existingEntries.correct_answer || "");
      }
    }, [existingEntries]);

    const handleSubmit = async () => {
      const data = { question, display_text, correct_answer };
      try {
        await validationSchema.parseAsync(data);
        onSubmit?.(data);
      } catch (err) {
        if (err instanceof ZodError) {
          err.issues.forEach((issue) => alert(issue.message));
        }
      }
    };

    useImperativeHandle(ref, () => ({
      handleSubmit,
    }));

    const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newVal = e.currentTarget.value;
      setQuestion(newVal);
      onChange?.({ question: newVal, display_text, correct_answer: correct_answer });
    };

    const handleBaybayinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVal = e.currentTarget.value;
      setdisplay_text(newVal);
      onChange?.({ question, display_text: newVal, correct_answer: correct_answer });
    };

    const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVal = e.currentTarget.value;
      setAnswer(newVal);
      onChange?.({ question, display_text, correct_answer: newVal });
    };

    return (
      <QuizFormCard>
        <div className="flex flex-col gap-4 w-full">
          <p>Identification</p>
          {/* Input for Question */}
          <Textarea
            className="border-black"
            placeholder="Enter the question"
            value={question}
            onChange={handleQuestionChange}
          />
          {/* Input for Baybayin Character */}
          <Input
            placeholder="Enter the Baybayin character to guess"
            className="border-black"
            value={display_text}
            onChange={handleBaybayinChange}
          />
          {/* Input for Answer */}
          <Input
            className="border-black"
            placeholder="Enter the answer"
            value={correct_answer}
            onChange={handleAnswerChange}
          />
        </div>
      </QuizFormCard>
    );
  }
);
