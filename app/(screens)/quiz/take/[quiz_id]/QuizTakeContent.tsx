import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Progress } from "../../../../../components/ui/progress";
import QuizPlayerStatistics from "../../../../../components/quiz/QuizPlayerStatistics";
import SketchpadComponent from "../../../../../components/quiz/Sketchpad";
import { Button } from "../../../../../components/ui/button";
import { QuestionType } from "../../../../../types/type.quiz";
import { QuestionHolderComponent } from "../../../../../components/quiz/QuestionHolder";
import Identification from "../../../../../components/quiz/fields/Identification";
import MultipleChoice from "../../../../../components/quiz/fields/MultipleChoice";
import baybayifyWord from "../../../../../lib/baybayify";
import QuizDoneDialog from "../../../../../components/quiz/dialog/QuizDoneDialog";
import { useQuizTakeContext } from "./QuizTakeContext";
import { useRouter } from "next/navigation";
import useQuizStore from "@/app/store/store.quiz";
import { authClient } from "@/app/lib/auth-client";

export const SubmitButton = () => {
  const { onSubmit } = useQuizTakeContext();
  return (
    <Button className="z-10 bg-blue-500 w-1/2" onClick={onSubmit}>
      Submit
    </Button>
  );
};

export const QuizTakeContent = () => {
  const quizContext = useQuizTakeContext();
  const router = useRouter();
  const quizStore = useQuizStore();
  const [userId, setUserId] = React.useState<string | null>(null);

  const dumpedRef = useRef(false);

  useEffect(() => {
    (async () => {
      const session = await authClient.getSession();
      if (session.data) {
        setUserId(session.data.user.id);
      }
    })();
  }, []);

  useEffect(() => {
    if (!quizContext.quiz || dumpedRef.current) return;

    const isOutOfHealth = quizContext.health === 0;
    const isQuizCompleted =
      quizContext.progress >= quizContext.quiz.questions.length;

    if ((isOutOfHealth || isQuizCompleted) && !dumpedRef.current) {
      // Fill unanswered questions if any
      const unanswered = quizContext.quiz.questions.filter(
        (q) =>
          !quizContext.answerHistory.some((a) => a.quiz_question_id === q.id)
      );
      unanswered.forEach((q) => {
        quizContext.recordAnswer({
          quiz_question_id: q.id,
          is_correct: false,
          user_answer: "Unanswered",
          attempt: 0,
          answered_at: new Date().toISOString(),
          quiz_id: quizContext.quiz!.metadata.quiz_id,
          user_id: userId || "", // Ensure user_id is set
        });
      });

      dumpedRef.current = true;

      // Use a timeout to ensure state updates before submitting
      setTimeout(() => {
        quizStore.submitQuizAnswers(quizContext.quiz!.metadata.quiz_id, [
          ...quizContext.answerHistory.map((a) => ({
            ...a,
            user_id: userId || "", // Ensure user_id is set
          })),
          ...unanswered.map((q) => ({
            quiz_question_id: q.id,
            is_correct: false,
            user_answer: "Unanswered",
            attempt: 0,
            answered_at: new Date().toISOString(),
            quiz_id: quizContext.quiz!.metadata.quiz_id,
            user_id: userId || "", // Ensure user_id is set
          })),
        ]);
      }, 0);
    }
  }, [
    quizContext.health,
    quizContext.progress,
    quizContext.quiz,
    quizContext.answerHistory,
    quizStore,
  ]);

  // Add helper function to compute total score
  const calculateScore = () => {
    if (!quizContext.quiz) return 0;
    return quizContext.quiz.questions.reduce((acc, question) => {
      const answerRecord = quizContext.answerHistory.find(
        (a) => a.quiz_question_id === question.id
      );
      if (answerRecord?.is_correct) {
        let multiplier = 1;
        if (quizContext.quiz!.metadata.difficulty === "Moderate")
          multiplier = 1.5;
        else if (quizContext.quiz?.metadata.difficulty === "Hard")
          multiplier = 2.5;
        return acc + 10 * multiplier;
      }
      return acc;
    }, 0);
  };

  // Helper to determine if quiz is done
  const isQuizDone =
    quizContext.quiz &&
    (quizContext.progress >= quizContext.quiz.questions.length ||
      quizContext.health === 0);

  // Check if current question is a sketch question
  const isSketchQuestion =
    quizContext.currentQuestion &&
    (quizContext.currentQuestion.type === QuestionType.SKT ||
      quizContext.currentQuestion.type === "sketch");

  // Show loading if quiz or model is not ready for sketch questions
  const shouldShowLoading =
    !quizContext.quiz || (isSketchQuestion && !quizContext.isModelReady);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
      <div className="flex flex-col h-screen w-full lg:px-20 md:px-14 px-10">
        {/* Show loading state */}
        {shouldShowLoading && !isQuizDone && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center">
              <p className="text-xl font-semibold mb-4">
                {!quizContext.quiz ? "Loading quiz..." : "Preparing AI model..."}
              </p>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              {isSketchQuestion && (
                <p className="text-sm text-gray-600 mt-2">
                  This may take a moment for sketch questions
                </p>
              )}
            </div>
          </div>
        )}

        {/* Only show quiz content if ready and not done */}
        {!isQuizDone && !shouldShowLoading && (
          <>
            <div className="flex flex-col">
              {quizContext.quiz && quizContext.currentQuestion ? (
                <QuizPlayerStatistics
                  duration={quizContext.quiz.metadata.time_limit}
                  onTimerEnd={() => {
                    quizContext.setHealth((h) => h - 1);
                    quizContext.recordAnswer({
                      quiz_question_id: quizContext.currentQuestion
                        ? quizContext.currentQuestion.id
                        : "",
                      is_correct: false,
                      user_answer: "Unanswered",
                      attempt: 0,
                      answered_at: new Date().toISOString(),
                      quiz_id: quizContext.quiz!.metadata.quiz_id,
                      user_id: userId || "",
                    });
                    if (quizContext.health === 0) return;
                    setTimeout(
                      () => quizContext.setProgress((val) => val + 1),
                      1000
                    );
                  }}
                />
              ) : null}
              {quizContext.currentQuestion &&
              (quizContext.currentQuestion.type === QuestionType.IDT ||
                quizContext.currentQuestion.type === "quiz" ||
                quizContext.currentQuestion.type === QuestionType.MCQ ||
                quizContext.currentQuestion.type === "multipleChoice") ? (
                <QuestionHolderComponent
                  questionHighlight={{
                    mainQuestion: quizContext.currentQuestion.question!,
                    isBaybayin:
                      quizContext.currentQuestion.language === "Baybayin",
                    text: quizContext.currentQuestion.display_text
                      ? baybayifyWord(quizContext.currentQuestion.display_text)
                      : undefined,
                  }}
                />
              ) : null}
            </div>

            {/* Sketch questions - only show when model is ready */}
            {quizContext.currentQuestion &&
            quizContext.currentQuestion.description &&
            isSketchQuestion &&
            quizContext.isModelReady ? (
              <SketchpadComponent
                key={quizContext.currentQuestion.question_number}
                characters={(quizContext.currentQuestion.character as string)!}
                question={quizContext.currentQuestion.description}
                inference={quizContext.inference}
                onDrawingSubmit={(result, isCorrect) => {
                  quizContext.recordAnswer({
                    quiz_question_id: quizContext.currentQuestion
                      ? quizContext.currentQuestion.id
                      : "",
                    is_correct: isCorrect,
                    user_answer: result,
                    attempt: 0,
                    answered_at: new Date().toISOString(),
                    quiz_id: quizContext.quiz!.metadata.quiz_id,
                    user_id: userId || "",
                  });
                  
                  if (isCorrect) {
                    toast.success("Correct!");
                  } else {
                    // Automatically fail and reduce health for wrong sketches
                    quizContext.setHealth((health) => health - 1);
                    if (result === "No detection") {
                      toast.error("No character detected! Try drawing more clearly.");
                    } else {
                      toast.error(`Incorrect! You drew: ${result}`);
                    }
                  }
                  
                  // Auto-advance to next question after a delay
                  setTimeout(
                    () => quizContext.setProgress((val) => val + 1),
                    1500
                  );
                }}
              />
            ) : null}
            {quizContext.currentQuestion && quizContext.quiz ? (
              <div className="w-full flex items-center justify-center py-10">
                <Progress
                  className="w-full md:w-3/4 lg:w-1/2"
                  value={
                    (quizContext.progress / quizContext.quiz.questions.length) *
                    100
                  } // converted to percentage
                  max={100} // progress is now out of 100
                />
              </div>
            ) : null}
            {quizContext.currentQuestion &&
            (quizContext.currentQuestion.type === QuestionType.MCQ ||
              quizContext.currentQuestion.type === "multipleChoice") ? (
              <MultipleChoice
                key={quizContext.currentQuestion.question_number}
                options={[
                  ...(quizContext.currentQuestion.options as string[])!.map(
                    (option, index) => ({
                      label: option,
                      isCorrect:
                        parseInt(
                          quizContext.currentQuestion!.correct_answer ?? "0"
                        ) === index,
                    })
                  ),
                ]}
                onAnswer={(selected, isCorrect) => {
                  quizContext.recordAnswer({
                    quiz_question_id: quizContext.currentQuestion
                      ? quizContext.currentQuestion.id
                      : "",
                    is_correct: isCorrect,
                    user_answer: selected.label,
                    attempt: 0,
                    answered_at: new Date().toISOString(),
                    quiz_id: quizContext.quiz!.metadata.quiz_id,
                    user_id: userId || "", // Ensure user_id is set
                  });
                  if (!isCorrect) quizContext.setHealth((h) => h - 1);
                  setTimeout(
                    () => quizContext.setProgress((val) => val + 1),
                    1000
                  );
                }}
              />
            ) : null}
            {quizContext.currentQuestion &&
            (quizContext.currentQuestion.type === QuestionType.SKT ||
              quizContext.currentQuestion.type === "sketch") ? (
              <div className="flex flex-col items-center justify-center w-full gap-4">
                <SubmitButton />
              </div>
            ) : null}
            {quizContext.currentQuestion &&
            (quizContext.currentQuestion.type === QuestionType.IDT ||
              quizContext.currentQuestion.type === "quiz") ? (
              <Identification
                correctAnswer={quizContext.currentQuestion.correct_answer!}
                onAnswer={(userAnswer, isCorrect) => {
                  quizContext.recordAnswer({
                    quiz_question_id: quizContext.currentQuestion
                      ? quizContext.currentQuestion.id
                      : "",
                    is_correct: isCorrect,
                    user_answer: userAnswer,
                    attempt: 0,
                    answered_at: new Date().toISOString(),
                    quiz_id: quizContext.quiz!.metadata.quiz_id,
                    user_id: userId || "", // Ensure user_id is set
                  });
                  if (isCorrect) toast.success("Correct!");
                  else {
                    quizContext.setHealth((h) => h - 1);
                    toast.error("Incorrect!");
                  }
                  setTimeout(
                    () => quizContext.setProgress((val) => val + 1),
                    1000
                  );
                }}
              />
            ) : null}
          </>
        )}
      </div>

      {/* Show QuizDoneDialog only when quiz is done */}
      {isQuizDone && (
        <QuizDoneDialog
          isOpen={true}
          scoreEarned={calculateScore()}
          correctAnswers={
            quizContext.answerHistory.filter((a) => a.is_correct).length
          }
          authorName="Sebby Siazon"
          correctPercentage={
            (quizContext.answerHistory.filter((a) => a.is_correct).length /
              quizContext.answerHistory.length) *
            100
          }
          incorrectAnswers={
            quizContext.answerHistory.filter((a) => !a.is_correct).length
          }
          quizTitle={
            quizContext.quiz
              ? quizContext.quiz.metadata.quiz_name!
              : "Quiz Title Placeholder"
          }
          onClose={() => router.back()}
        />
      )}
    </div>
  );
};
