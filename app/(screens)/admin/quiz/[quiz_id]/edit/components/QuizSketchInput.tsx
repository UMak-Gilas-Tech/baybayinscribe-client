import { Input } from "@/components/ui/input";
import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { z } from "zod";
import { QuizFormCard } from "./QuizFormCard";
import { XIcon } from "lucide-react";

// Updated schema to require a description in addition to options
const validationSchema = z.object({
  description: z.string().min(1, { message: "Description is required." }),
  options: z
    .array(z.string().min(1, { message: "All options must be filled out." }))
    .min(1, { message: "At least one option is required." }),
});

export type SketchInputsProps = {
  onSubmit?: (data: { options: string[]; description: string }) => void;
  onOptionsUpdate?: (options: string[]) => void;
  onChange?: (data: { description: string; options: string[] }) => void;
  existingEntries?: {
    options: string[];
    description?: string;
    character?: string;
  };
};

export const SketchInputs = forwardRef(
  function SketchInputsComponent(
    { onSubmit, onOptionsUpdate, onChange, existingEntries }: SketchInputsProps,
    ref
  ) {
    const [options, setOptions] = useState<string[]>([""]);
    const [description, setDescription] = useState("");
    const isMounted = useRef(false);

    useEffect(() => {
      if (existingEntries && !isMounted.current) {
        // If options exist and are non-empty, use them; else if a character is provided, use it as the sole option.
        if (existingEntries.options && existingEntries.options.length > 0) {
          setOptions(existingEntries.options);
        } else if (existingEntries.character) {
          setOptions([existingEntries.character]);
        } else {
          setOptions([""]);
        }
        // Use existingEntries.description if set; otherwise fallback to existingEntries.question.
        setDescription(existingEntries.description || "");
        isMounted.current = true;
      }
    }, [existingEntries]);

    useEffect(() => {
      if (isMounted.current) {
        onOptionsUpdate?.(options);
        onChange?.({ description, options });
      }
    }, [options, description]);

    const addOption = () => {
      setOptions([...options, ""]);
    };

    const removeOption = (index: number) => {
      if (options.length === 1) return;
      setOptions(options.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
      const result = validationSchema.safeParse({ description, options });
      if (!result.success) {
        result.error.errors.forEach((error) => alert(error.message));
        return;
      }
      onSubmit?.({ options, description });
    };

    useImperativeHandle(ref, () => ({
      handleSubmit,
    }));

    return (
      <QuizFormCard>
        <div className="flex flex-col w-full items-center gap-3">
          <Input
            value={description}
            onChange={(e) => {
              const newVal = e.target.value;
              setDescription(newVal);
              onChange?.({ description: newVal, options });
            }}
            placeholder="Enter the description"
            className="w-full py-2 px-2 mb-4"
          />
          <p className="w-full text-sm font-work-sans">
            Input Characters to Sketch:
          </p>
          {options.map((option, index) => (
            <div key={index} className="flex items-end gap-2 flex-1 w-full">
              <span className="font-work-sans px-2">{index + 1}.</span>
              <Input
                value={option}
                onChange={(e) => {
                  setOptions((prev) => {
                    const copy = [...prev];
                    copy[index] = e.target.value;
                    return copy;
                  });
                }}
                className="w-full h-10 py-2 px-2 bg-transparent text-black placeholder-gray-400 border-t-0 border-l-0 border-r-0 border-b-2 border-b-gray-700 focus:border-b-gray-700 outline-none"
                placeholder="Enter option..."
              />
              <button
                onClick={() => removeOption(index)}
                className="px-4 opacity-50"
                type="button"
              >
                <XIcon className="h-4 w-4 text-gray-800" />
              </button>
            </div>
          ))}
          <button
            className="w-full py-4 px-6"
            onClick={addOption}
            type="button"
          >
            <p className="font-work-sans text-stone-500">Add an option...</p>
          </button>
        </div>
      </QuizFormCard>
    );
  }
);
