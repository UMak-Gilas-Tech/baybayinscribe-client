import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input"; // <-- reused import for Question
import { X } from "lucide-react";
import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { z, ZodError } from "zod";
import { QuizFormCard } from "./QuizFormCard";

// Extend props to include 'question'
export type MultipleChoiceProps = {
  onSubmit?: (data: {
    question: string;
    options: string[];
    correct_answer: string;
  }) => void;
  onSelectionUpdate?: (data: {
    question: string;
    options: string[];
    correct_answer: string;
  }) => void;
  existingEntries?: {
    question: string;
    options: string[];
    correct_answer: string;
    type: string;
  };
};

const validationSchema = z.object({
  question: z.string().min(1, { message: "Please enter the question." }),
  options: z
    .array(z.string().min(1, { message: "All options must be filled out." }))
    .min(1, { message: "At least one option is required." }),
  correct_answer: z
    .string()
    .min(1, { message: "Please select the correct answer." }),
});

// eslint-disable-next-line react/display-name
export const MultipleChoice = forwardRef(
  (
    { onSubmit, onSelectionUpdate, existingEntries }: MultipleChoiceProps,
    ref
  ) => {
    const [question, setQuestion] = useState<string>(""); // new state for question
    const [options, setOptions] = useState<string[]>(
      Array.from({ length: 1 }).map(() => "")
    );
    const [correct_answer, setcorrect_answer] = useState<string>(""); // selection via radio group
    const isMounted = useRef(false);

    useEffect(() => {
      if (
        existingEntries &&
        existingEntries.question !== "" &&
        Array.isArray(existingEntries.options) &&
        existingEntries.options.length > 0 &&
        (existingEntries.correct_answer !== "" ||
          existingEntries.correct_answer !== "") &&
        existingEntries.type === "multipleChoice" &&
        !isMounted.current
      ) {
        setQuestion(existingEntries.question);
        console.log("Existing Entries:", existingEntries.correct_answer);
        setOptions(existingEntries.options);
        // Use the correct_answer property from existing entries
        const correctValue = existingEntries.correct_answer;
        const idx = existingEntries.options.findIndex((v, i) => {
          return i.toString() === correctValue;
        })
        setcorrect_answer(idx !== -1 ? idx.toString() : "");
        isMounted.current = true;
        return;
      }
      isMounted.current = true;
    }, [existingEntries]);

    useEffect(() => {
      if (isMounted.current) {
        onSelectionUpdate?.({ question, options, correct_answer: correct_answer });
      }
    }, [question, options, correct_answer]);

    const addOption = () => {
      setOptions([...options, ""]);
    };

    const removeOption = (index: number) => {
      if (options.length === 1) return;
      setOptions(options.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
      const data = { question, options, correct_answer };

      try {
        await validationSchema.parseAsync(data);
        onSubmit?.(data);
      } catch (err) {
        if (err instanceof ZodError) {
          err.issues.forEach((issue) => {
            alert(issue.message);
          });
        }
      }
    };

    useImperativeHandle(ref, () => ({
      handleSubmit,
    }));

    return (
      <QuizFormCard>
        <div className="flex flex-col w-full items-center justify-start gap-3">
          {/* shadcn Input for Question */}
          <Input
            placeholder="Enter the question"
            value={question}
            onChange={(e) => setQuestion(e.currentTarget.value)}
          />

          {/* restored RadioGroup block */}
          <p className="w-full text-sm font-work-sans">
            Select the correct answer.
          </p>
          <RadioGroup
            className="w-full"
            value={correct_answer}
            onValueChange={(value) => setcorrect_answer(value)}
          >
            {options.map((option, index) => (
              <div
                key={index}
                className="flex flex-row items-end justify-start gap-2"
              >
                <RadioGroupItem
                  value={index.toString()}
                  checked={index.toString() === correct_answer}
                  className="border-gray-900" // modified: darker outline
                />
                <span className="font-work-sans px-2">{index + 1}.</span>
                <input
                  type="text"
                  value={option} // changed from defaultValue to value
                  onChange={(e) => {
                    setOptions((prev) => {
                      const copy = [...prev];
                      copy[index] = e.target.value;
                      return copy;
                    });
                  }}
                  className="w-full h-10 py-2 flex-1 border-b border-black placeholder:font-work-sans font-work-sans"
                />
                <button
                  type="button"
                  className="px-4 opacity-50"
                  onClick={() => removeOption(index)}
                >
                  <X size={16} color="#000" />
                </button>
              </div>
            ))}
          </RadioGroup>

          <button className="w-full py-4 px-6" onClick={addOption}>
            <p className="font-work-sans text-stone-500">Add an option...</p>
          </button>
        </div>
      </QuizFormCard>
    );
  }
);
