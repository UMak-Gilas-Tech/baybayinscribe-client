"use client";
import React, { useState, useEffect, memo } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { QuizFormHeader } from "./components/QuizEditHeader";
import { MultipleChoice } from "./components/QuizMultipleChoice";
import { SketchInputs } from "./components/QuizSketchInput";
import { QuizInput } from "./components/QuizInput";
import { useQuizContext, QuizEditorProvider } from "./context/useQuizContext";
// ShadCN Dialog imports (assumed available)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  List,
  PenTool,
  FileText,
  Sparkles,
  Save,
  Trash,
  ChevronLeft,
} from "lucide-react";
import { generateQuiz } from "@/lib/genai";
import { QuizDifficulty, QuizQuestion, QuizMetadata } from "@/types/type.quiz";
import useQuizStore from "@/app/store/store.quiz";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { authClient } from "@/app/lib/auth-client";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type FieldType = "multipleChoice" | "sketch" | "quiz";

type Field = { id: string; type: FieldType; data: any };

// Define prop types for MemoizedField
interface MemoizedFieldProps {
  field: Field;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateFieldData: (id: string, newData: any) => void;
  removeField: (id: string) => void;
}

// Memoize the field rendering to prevent unnecessary re-renders
const MemoizedField = memo(
  ({ field, updateFieldData, removeField }: MemoizedFieldProps) => {
    return (
      <div key={field.id} className="p-4 rounded-lg  relative">
        <button
          className="absolute top-2 right-2 p-2 bg-red-200 rounded-full shadow-sm  hover:text-red-500"
          onClick={() => removeField(field.id)}
        >
          <Trash size={16} />
        </button>
        {field.type === "multipleChoice" && (
          <MultipleChoice
            existingEntries={field.data}
            onSelectionUpdate={(data) => updateFieldData(field.id, data)}
          />
        )}
        {field.type === "sketch" && (
          <SketchInputs
            existingEntries={field.data}
            onChange={(data) => updateFieldData(field.id, data)}
          />
        )}
        {field.type === "quiz" && (
          <QuizInput
            existingEntries={field.data}
            onChange={(data) => updateFieldData(field.id, data)}
          />
        )}
      </div>
    );
  }
);

const EditQuizScreenInner = () => {
  const params = useParams();
  const router = useRouter();
  const [currentSession, setCurrentSession] = useState<any>();
  const [fields, setFields] = useState<Field[]>([]);
  const { setQuizQuestions, quizInformation, setQuizInformation, quizStore } =
    useQuizContext();
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiCount, setAiCount] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false); // loading state for AI generation
  const [showFabOptions, setShowFabOptions] = useState(false); // new state for FAB options
  const [errorMessage, setErrorMessage] = useState(""); // new state for error message
  const [showErrorDialog, setShowErrorDialog] = useState(false); // new state for error dialog
  const [errorAction, setErrorAction] = useState<VoidFunction | undefined>(
    undefined
  ); // new state for error action
  const [isPublic, setIsPublic] = useState(false); // new state for public toggle
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (params.quiz_id != "new") {
      loadExistingQuiz();
    } 

    return () => {
      quizStore?.clearQuiz();
    }
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      const { data: session, error } = await authClient.getSession();
      if (error) {
        console.error("Error loading session:", error);
      } else {
        setCurrentSession(session);
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    setQuizQuestions(
      fields.map((field, index) => {
        const base = {
          id: field.id,
          quiz_id: quizInformation?.quiz_id || "",
          created_at: new Date(),
          updated_at: new Date(),
          question_number: index + 1,
          type: field.type,
          language: field.data.language || null,
        };
        if (field.type === "sketch") {
          return {
            ...base,
            question: field.data.description || "",
            character: field.data.character || "",
            ...field.data,
            type: "sketch",
          };
        } else if (field.type === "multipleChoice") {
          return {
            ...base,
            question: field.data.question || "",
            options: field.data.options || [],
            type: "multipleChoice",
            correctAnswer:
              field.data.correct_answer || field.data.correctAnswer || "",
            display_text: field.data.display_text || "",
            is_options_baybayin: field.data.is_options_baybayin,
            is_question_baybayin: field.data.is_question_baybayin,
            ...field.data,
          };
        } else if (field.type === "quiz") {
          return {
            ...base,
            question: field.data.question || "",
            type: "quiz",
            baybayinCharacter:
              field.data.baybayinCharacter || field.data.display_text || "",
            answer: field.data.correct_answer || "",
            ...field.data,
          };
        } else {
          return {
            ...base,
            question: field.data.question || "",
            ...field.data,
          };
        }
      })
    );
    console.log("Quiz Questions", fields);
  }, [fields, setQuizQuestions]);

  useEffect(() => {
    if (params.quiz_id === "new") {
      return;
    }

    if (quizStore?.error) {
      setErrorMessage(quizStore.error);
      setShowErrorDialog(true);
      setErrorAction(() => () => {
        router.back();
      });
      return;
    }

    if (quizStore?.quiz) {
      const quiz = quizStore.quiz;
      // Only update fields if they are different
      const newFields = quiz.questions
        ? quiz.questions.map((question, index) => {
            const data: any = { ...question, question_number: index + 1 };
            if (question.type === "MCQ" || question.type === "multipleChoice") {
              data.correctAnswer =
                question.correct_answer || question.correct_answer || "";
            }
            if (question.type === "IDT" || question.type === "quiz") {
              data.correct_answer = question.correct_answer || "";
              data.display_text = question.display_text || "";
            }
            if (
              (question.type === "SKT" || question.type === "sketch") &&
              !data.options &&
              data.character
            ) {
              data.options = [data.character];
            }
            return {
              id: question.id ? String(question.id) : crypto.randomUUID(),
              type:
                question.type === "MCQ"
                  ? "multipleChoice"
                  : question.type === "SKT"
                  ? "sketch"
                  : question.type === "IDT"
                  ? "quiz"
                  : (question.type as FieldType),
              data,
            };
          })
        : [];
      const fieldsChanged =
        JSON.stringify(fields) !== JSON.stringify(newFields);
      if (fieldsChanged) {
        setFields(newFields);
      }
      console.log(quiz);
      // Only update quizInformation if it is different
      const newQuizInfo = {
        quiz_id: params.quiz_id || "",
        quiz_name: quiz.metadata.quiz_name || "",
        category: quiz.metadata.category || "",
        description: quiz.metadata.description || "",
        time_limit: quiz.metadata.time_limit || 0,
        difficulty: quiz.metadata.difficulty || "Easy",
        is_public: quiz.metadata.is_public || false,
        created_at: quiz.metadata.created_at
          ? new Date(quiz.metadata.created_at)
          : new Date(),
        updated_at: quiz.metadata.updated_at
          ? new Date(quiz.metadata.updated_at)
          : new Date(),
      };
      const quizInfoChanged =
        JSON.stringify(quizInformation) !== JSON.stringify(newQuizInfo);
      if (quizInfoChanged) {
        setQuizInformation(newQuizInfo);
      }
      setIsPublic(quiz.metadata.is_public || false);
    }
  }, [quizStore?.quiz, quizStore?.error, params.quiz_id]);

  const loadExistingQuiz = async () => {
    const quizId = params.quiz_id as string;
    if (quizId) {
      quizStore?.loadQuiz(quizId);
    }
  };

  const addField = (type: FieldType) => {
    setFields((prev) => [...prev, { id: crypto.randomUUID(), type, data: {} }]);
  };

  const updateFieldData = (id: string, newData: any) => {
    unstable_batchedUpdates(() =>
      setFields((prev) =>
        prev.map((field) => {
          if (field.id !== id) return field;

          // 1) normalize incoming payload (Event, primitive or object)
          let dataPatch: any = {};
          if (newData?.target?.value !== undefined) {
            // native onChange event
            dataPatch =
              field.type === "sketch"
                ? { description: newData.target.value }
                : { question: newData.target.value };
          } else if (Array.isArray(newData)) {
            // array of options
            dataPatch = { options: newData };
          } else if (typeof newData === "object" && newData !== null) {
            // full data object
            dataPatch = newData;
          } else {
            // raw string/number
            dataPatch =
              field.type === "sketch"
                ? { description: newData }
                : { question: newData };
          }

          // 2) merge into existing data
          const mergedData = { ...field.data, ...dataPatch };

          // 3) keep MCQ answer keys in sync
          if (field.type === "multipleChoice") {
            if (mergedData.correctAnswer && !mergedData.correct_answer)
              mergedData.correct_answer = mergedData.correctAnswer;
            if (mergedData.correct_answer && !mergedData.correctAnswer)
              mergedData.correctAnswer = mergedData.correct_answer;
          }

          // 4) keep quiz answer keys in sync
          if (field.type === "quiz") {
            if (mergedData.answer && !mergedData.correct_answer)
              mergedData.correct_answer = mergedData.answer;
            if (mergedData.correct_answer && !mergedData.answer)
              mergedData.answer = mergedData.correct_answer;
          }

          return { ...field, data: mergedData };
        })
      )
    );
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((field) => field.id !== id));
  };

  const handleGenerateAI = async () => {
    const count = parseInt(aiCount, 10);
    if (isNaN(count) || count <= 0) return;
    setAiGenerating(true);
    try {
      const quizGenerationResult = await generateQuiz(
        count,
        quizInformation?.category ?? "",
        (quizInformation?.difficulty as QuizDifficulty) ?? "Easy",
        quizInformation?.quiz_name ?? ""
      );
      const aiFields = quizGenerationResult.questions.map((question) => {
        const fieldType: FieldType = question.type as FieldType;
        const data: any = { ...question };
        if (fieldType === "multipleChoice") {
          data.correctAnswer = question.correct_answer || "";
        }
        if (fieldType === "quiz") {
          data.correct_answer = question.correct_answer || "";
          data.answer = question.display_text || "";
        }
        if (fieldType === "sketch" && !data.options && data.character) {
          data.options = [data.character];
        }
        return {
          id: crypto.randomUUID(),
          type: fieldType,
          data,
        };
      });
      setFields((prev) => [...prev, ...aiFields]);
      setAiDialogOpen(false);
      setAiCount("");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSaveQuiz = async () => {
    if (!quizInformation) {
      setErrorMessage("Quiz information is missing.");
      setShowErrorDialog(true);
      return;
    }

    // Validate quizInformation properties
    if (!quizInformation.quiz_name) {
      setErrorMessage("Quiz name is required.");
      setShowErrorDialog(true);
      return;
    }
    if (!quizInformation.category) {
      setErrorMessage("Quiz category is required.");
      setShowErrorDialog(true);
      return;
    }
    if (quizInformation.time_limit <= 0) {
      setErrorMessage("Time limit must be greater than 0.");
      setShowErrorDialog(true);
      return;
    }

    for (const field of fields) {
      if (field.type === "multipleChoice") {
        if (
          !field.data.question ||
          !field.data.options ||
          field.data.options.length === 0 ||
          (!field.data.correct_answer && !field.data.correctAnswer)
        ) {
          setErrorMessage(
            "Each multiple choice question must have a question, at least one option, and a correct answer."
          );
          setShowErrorDialog(true);
          return;
        }
      } else if (field.type === "sketch") {
        if (!field.data.options || field.data.options.length === 0) {
          setErrorMessage("Each sketch question must have a character.");
          setShowErrorDialog(true);
          return;
        }
      } else if (field.type === "quiz") {
        if (
          !field.data.question ||
          !field.data.answer ||
          !field.data.correct_answer
        ) {
          setErrorMessage(
            "Each quiz question must have a question, baybayin character, and an answer."
          );
          setShowErrorDialog(true);
          return;
        }
      }
    }

    // Always generate a quizId if missing or invalid
    let quizId = quizInformation.quiz_id;
    if (
      !quizId ||
      typeof quizId !== "string" ||
      quizId.trim() === "" ||
      quizId === "new" ||
      quizId === undefined ||
      params.quiz_id === "new" // <-- Ensure new quiz gets a new ID
    ) {
      quizId = crypto.randomUUID();
      setQuizInformation((prev) => ({
        ...prev,
        quiz_id: quizId,
      }));
    }

    // Prepare metadata
    const metadata = {
      quiz_id: quizId,
      quiz_name: quizInformation.quiz_name,
      difficulty: quizInformation.difficulty,
      category: quizInformation.category,
      time_limit: quizInformation.time_limit,
      description: quizInformation.description,
      is_public: isPublic,
      created_at: quizInformation.created_at || new Date(),
      updated_at: new Date(),
    };

    // Prepare questions
    const questions = fields.map((field, index) => {
      let correct_answer = field.data.correct_answer;
      if (field.type === "multipleChoice") {
        correct_answer =
          field.data.correct_answer || field.data.correctAnswer || "";
      }
      if (field.type === "quiz") {
        correct_answer = field.data.correct_answer || field.data.answer || "";
      }
      return {
        id: field.id,
        quiz_id: quizId,
        created_at: field.data.created_at || new Date(),
        updated_at: new Date(),
        question_number: field.data.question_number || index + 1,
        type: field.type,
        question: field.data.question || "",
        options: field.data.options || [],
        correct_answer: correct_answer,
        description: field.data.description || "",
        character: field.data.character || "",
        is_options_baybayin: field.data.is_options_baybayin || false,
        is_question_baybayin: field.data.is_question_baybayin || false,
        is_input_baybayin: field.data.is_input_baybayin || false,
        display_text:
          field.data.display_text ||
          field.data.baybayinCharacter ||
          field.data.answer ||
          "",
        language: field.data.language || null,
        pairs: field.data.pairs || [],
        answer: field.data.answer || correct_answer || "",
      };
    });

    // Compose payload
    const payload = {
      id: quizId,
      created_by: currentSession?.user?.id ?? "",
      metadata,
      questions,
    };

    try {
      await quizStore?.saveQuiz(payload);
      router.push("/admin/quiz/" + quizId + "/edit");
    } catch (err: any) {
      setErrorMessage("Failed to save quiz: " + (err?.message || err));
      setShowErrorDialog(true);
    }
  };

  const handleConfirmDelete = async () => {
    setShowDeleteDialog(false);
    if (params.quiz_id) {
      await quizStore?.deleteQuiz(params.quiz_id as string);
      router.back();
    }
  };

  // Add a dataLoaded variable to check if all required data is loaded
  const isNewQuiz = params.quiz_id === "new";
  const dataLoaded =
    (isNewQuiz && quizInformation) ||
    (!isNewQuiz &&
      quizStore &&
      quizStore.status === "Loaded" &&
      quizInformation);

  return (
    <>
      <div className="relative w-screen h-screen">
        {(!dataLoaded && !isNewQuiz) ||
        (quizStore?.status == "Loading" && !isNewQuiz) ? (
          <div className="flex flex-col items-center justify-center absolute w-screen h-screen backdrop-blur-sm bg-black/20 z-50">
            <LoadingSpinner loadingText="Loading Quiz..." />
          </div>
        ) : null}
        {dataLoaded && (
          <div className="flex flex-col items-center w-full h-screen p-4">
            <div className="md:w-3/4 w-[90%]">
              <div className="py-6 flex items-center justify-between">
                <ChevronLeft onClick={() => router.back()} />
                <div className="flex flex-row gap-4 items-center justify-end">
                  <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                  <span>Is public</span>
                  {params.quiz_id != "new" && (
                    <div
                      className="bg-red-400 px-4 py-4 rounded-full hover:bg-red-500 shadow-xl hover:shadow-2xl transition-colors cursor-pointer"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash />
                    </div>
                  )}
                </div>
              </div>
              {quizInformation && (
                <QuizFormHeader
                  onSubmit={() => {}}
                  existingData={{
                    title:
                      quizStore?.quiz?.metadata?.quiz_name ??
                      quizInformation.quiz_name ??
                      "",
                    quizTopic:
                      quizStore?.quiz?.metadata?.category ??
                      quizInformation.category ??
                      "",
                    description:
                      quizStore?.quiz?.metadata?.description ??
                      quizInformation.description ??
                      "",
                    timer:
                      (
                        quizStore?.quiz?.metadata?.time_limit ??
                        quizInformation.time_limit ??
                        ""
                      )?.toString() || "",
                    difficulty: (quizStore?.quiz?.metadata?.difficulty ??
                      quizInformation.difficulty ??
                      "") as QuizDifficulty,
                  }}
                  onChange={(data) => {
                    setQuizInformation((prev) => ({
                      ...prev,
                      quiz_name: data.title ?? prev.quiz_name,
                      category: data.quizTopic ?? prev.category,
                      description: data.description ?? prev.description,
                      time_limit: data.timer
                        ? parseInt(data.timer)
                        : prev.time_limit,
                      difficulty: (data.difficulty ??
                        prev.difficulty) as QuizDifficulty,
                    }));
                  }}
                />
              )}

              {/* Updated FAB implementation */}
              <div className="p-10 fixed bottom-4 right-4 flex flex-col items-end">
                <div
                  className={`mt-2 flex flex-col gap-2 transform origin-bottom transition-all duration-300 pb-6 ${
                    showFabOptions
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  {params.quiz_id != "new" ? (
                    <>
                      <button
                        className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md hover:bg-indigo-600 focus:bg-indigo-700"
                        onClick={() => {
                          addField("multipleChoice");
                          setShowFabOptions(false);
                        }}
                      >
                        <List size={16} />
                      </button>
                      <button
                        className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md hover:bg-indigo-600 focus:bg-indigo-700"
                        onClick={() => {
                          addField("sketch");
                          setShowFabOptions(false);
                        }}
                      >
                        <PenTool size={16} />
                      </button>
                      <button
                        className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md hover:bg-indigo-600 focus:bg-indigo-700"
                        onClick={() => {
                          addField("quiz");
                          setShowFabOptions(false);
                        }}
                      >
                        <FileText size={16} />
                      </button>
                      <Dialog
                        open={aiDialogOpen}
                        onOpenChange={setAiDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <button
                            className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md hover:bg-indigo-600 focus:bg-indigo-700"
                            onClick={() => setShowFabOptions(false)}
                          >
                            <Sparkles size={16} />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Generate AI Questions</DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col gap-3 mt-2">
                            <input
                              type="number"
                              placeholder="How many?"
                              value={aiCount}
                              onChange={(e) => setAiCount(e.target.value)}
                              className="px-3 py-2 border rounded"
                              disabled={aiGenerating}
                            />
                            <button
                              onClick={handleGenerateAI}
                              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:bg-indigo-700 flex items-center justify-center"
                              disabled={aiGenerating}
                            >
                              {aiGenerating ? (
                                <>
                                  <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                  </svg>
                                  Generating...
                                </>
                              ) : (
                                "Generate"
                              )}
                            </button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  ) : null}
                  <button
                    className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md hover:bg-indigo-700 focus:bg-indigo-800"
                    onClick={() => {
                      handleSaveQuiz();
                      setShowFabOptions(false);
                    }}
                  >
                    <Save size={16} />
                  </button>
                </div>

                <button
                  className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg hover:bg-indigo-600 focus:bg-indigo-700"
                  onClick={() => setShowFabOptions(!showFabOptions)}
                >
                  <Plus size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {fields.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full py-20">
                    <p className="text-gray-500">
                      No fields added yet. Click the + button to get started.
                    </p>
                  </div>
                )}
                {fields.map((field) => (
                  <MemoizedField
                    key={field.id}
                    field={field}
                    updateFieldData={updateFieldData}
                    removeField={removeField}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Dialog
        open={showErrorDialog}
        onOpenChange={(open) => setShowErrorDialog(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{errorMessage}</p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() =>
                !errorAction ? setShowErrorDialog(false) : errorAction()
              }
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* delete confirmation modal */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">Are you sure you wanna delete this quiz?</div>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleConfirmDelete}
            >
              Confirm
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const EditQuizScreen = () => {
  const quizStore = useQuizStore();

  const [quizInformation, setQuizInformation] = useState<QuizMetadata>({
    created_at: new Date(),
    updated_at: new Date(),
    description: null,
    quiz_id: "",
    quiz_name: "",
    difficulty: "Easy",
    is_public: false,
    category: "",
    time_limit: 0,
  });
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  return (
    <QuizEditorProvider
      value={{
        quizInformation,
        quizQuestions,
        quizStore,
        setQuizInformation,
        setQuizQuestions,
      }}
    >
      <EditQuizScreenInner />
    </QuizEditorProvider>
  );
};

export default EditQuizScreen;
