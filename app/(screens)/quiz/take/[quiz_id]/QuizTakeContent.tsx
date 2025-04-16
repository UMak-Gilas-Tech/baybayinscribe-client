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
import LoadingSpinner from "../../../../../components/shared/LoadingSpinner";
import QuizDoneDialog from "../../../../../components/quiz/dialog/QuizDoneDialog";
import { useQuizTakeContext } from "./QuizTakeContext";
import { useRouter } from "next/navigation";
import useQuizStore from "@/app/store/store.quiz";
import { uuid } from "drizzle-orm/pg-core";

export const SubmitButton = () => {
  const { onSubmit } = useQuizTakeContext();
  return (
    <Button className="z-10 bg-[#576eb6] w-1/2" onClick={onSubmit}>
      Submit
    </Button>
  );
};

export const QuizTakeContent = () => {
  const quizContext = useQuizTakeContext();
  const router = useRouter();
  const quizStore = useQuizStore();

  const dumpedRef = useRef(false);

  useEffect(() => {
    if (quizContext.health === 0 && quizContext.quiz && !dumpedRef.current) {
      const unanswered = quizContext.quiz.questions.filter(
        (q) =>
          !quizContext.answerHistory.some(
            (a) => a.id === q.id
          )
      );
      unanswered.forEach((q) => {
        quizContext.recordAnswer({
          quiz_question_id: quizContext.currentQuestion?.id!,
                  is_correct: false,
                  user_answer: "Unanswered",
                  attempt: 0,
                  answered_at: new Date(),
                  quiz_id: quizContext.quizId!
        });
      });
      dumpedRef.current = true;

      quizStore.submitQuizAnswers(
        quizContext.quiz.metadata.quiz_id,
        quizContext.answerHistory
      );
    }
  }, [quizContext.health, quizContext.quiz, quizContext.answerHistory]);

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

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
      <div className="flex flex-col h-screen w-full lg:px-20 md:px-14 px-10">
        <div className="flex flex-col">
          {quizContext.quiz && quizContext.currentQuestion ? (
            <QuizPlayerStatistics
              duration={quizContext.quiz.metadata.time_limit}
              onTimerEnd={() => {
                quizContext.setHealth((h) => h - 1);
                toast.error("Time's up!");
                quizContext.recordAnswer({
                  quiz_question_id: quizContext.currentQuestion?.id!,
                  is_correct: false,
                  user_answer: "Unanswered",
                  attempt: 0,
                  answered_at: new Date(),
                  quiz_id: quizContext.quizId!
                });
                setTimeout(
                  () => quizContext.setProgress((val) => val + 1),
                  1000
                );
              }}
            />
          ) : null}
          {quizContext.currentQuestion &&
          (quizContext.currentQuestion.type === QuestionType.IDT ||
            quizContext.currentQuestion.type === QuestionType.MCQ) ? (
            <QuestionHolderComponent
              questionHighlight={{
                mainQuestion: quizContext.currentQuestion.question!,
                isBaybayin: quizContext.currentQuestion.language === "Baybayin",
                text: quizContext.currentQuestion.display_text
                  ? baybayifyWord(quizContext.currentQuestion.display_text)
                  : undefined,
              }}
            />
          ) : null}
        </div>

        {quizContext.currentQuestion &&
        quizContext.currentQuestion.description &&
        quizContext.currentQuestion.type === QuestionType.SKT ? (
          <SketchpadComponent
            key={quizContext.currentQuestion.question_number}
            characters={(quizContext.currentQuestion.character as string)!}
            question={quizContext.currentQuestion.description}
            inference={quizContext.inference}
            onDrawingSubmit={(result, isCorrect) => {
              quizContext.recordAnswer({
                  quiz_question_id: quizContext.currentQuestion?.id!,
                  is_correct: isCorrect,
                  user_answer: result,
                  attempt: 0,
                  answered_at: new Date(),
                  quiz_id: quizContext.quizId!
              });
              if (isCorrect) toast.success("Correct!");
              else {
                quizContext.setHealth((health) => health - 1);
                toast.error("Incorrect!");
              }
              setTimeout(() => quizContext.setProgress((val) => val + 1), 1000);
            }}
          />
        ) : null}
        {quizContext.currentQuestion && quizContext.quiz ? (
          <div className="w-full flex items-center justify-center py-10">
            <Progress
              className="w-full md:w-3/4 lg:w-1/2"
              value={
                (quizContext.progress / quizContext.quiz.questions.length) * 100
              } // converted to percentage
              max={100} // progress is now out of 100
            />
          </div>
        ) : null}
        {quizContext.currentQuestion &&
        quizContext.currentQuestion.type === QuestionType.MCQ ? (
          <MultipleChoice
            key={quizContext.currentQuestion.question_number}
            options={[
              ...(quizContext.currentQuestion.options as string[])!.map(
                (option) => ({
                  label: option,
                  isCorrect:
                    quizContext.currentQuestion!.correct_answer === option,
                })
              ),
            ]}
            onAnswer={(selected, isCorrect) => {
              quizContext.recordAnswer({
                  quiz_question_id: quizContext.currentQuestion?.id!,
                  is_correct: isCorrect,
                  user_answer: selected.label,
                  attempt: 0,
                  answered_at: new Date(),
                  quiz_id: quizContext.quizId!
              });
              if (!isCorrect) quizContext.setHealth((h) => h - 1);
              setTimeout(() => quizContext.setProgress((val) => val + 1), 1000);
            }}
          />
        ) : null}
        {quizContext.currentQuestion &&
        quizContext.currentQuestion.type === QuestionType.SKT ? (
          <div className="flex flex-col items-center justify-center w-full gap-4">
            <SubmitButton />
          </div>
        ) : null}
        {quizContext.currentQuestion &&
        quizContext.currentQuestion.type === QuestionType.IDT ? (
          <Identification
            correctAnswer={quizContext.currentQuestion.correct_answer!}
            onAnswer={(userAnswer, isCorrect) => {
              quizContext.recordAnswer({
                  quiz_question_id: quizContext.currentQuestion?.id!,
                  is_correct: isCorrect,
                  user_answer: userAnswer,
                  attempt: 0,
                  answered_at: new Date(),
                  quiz_id: quizContext.quizId!
              });
              if (isCorrect) toast.success("Correct!");
              else {
                quizContext.setHealth((h) => h - 1);
                toast.error("Incorrect!");
              }
              setTimeout(() => quizContext.setProgress((val) => val + 1), 1000);
            }}
          />
        ) : null}
      </div>

      {quizContext.currentQuestion && (
        <QuizDoneDialog
          isOpen={
            quizContext.currentQuestion?.question_number ===
              quizContext.quiz?.questions.length || quizContext.health === 0
          }
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
