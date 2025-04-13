import React from "react";
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

  // Add helper function to compute total score
  const calculateScore = () => {
    if (!quizContext.quiz) return 0;
    return quizContext.quiz.questions.reduce((acc, question) => {
      const answerRecord = quizContext.answerHistory.find(
        (a) => a.questionNumber === question.question_number
      );
      if (answerRecord?.isCorrect) {
        let multiplier = 1;
        if (quizContext.quiz!.metadata.difficulty === "Moderate") multiplier = 1.5;
        else if (quizContext.quiz?.metadata.difficulty === "Hard") multiplier = 2.5;
        return acc + 10 * multiplier;
      }
      return acc;
    }, 0);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
      <div className="flex flex-col h-screen w-full lg:px-20 md:px-14 px-10">
        <div className="flex flex-col">
          {quizContext.currentQuestion ? (
            <QuizPlayerStatistics
              duration={quizContext.quiz?.metadata.time_limit}
              onTimerEnd={() => {
                quizContext.setHealth((h) => h - 1);
                toast.error("Time's up!");
                quizContext.recordAnswer({
                  questionNumber: quizContext.currentQuestion?.question_number,
                  question: quizContext.currentQuestion?.question!,
                  answer: "Time's up",
                  isCorrect: false,
                  type: quizContext.currentQuestion?.type as QuestionType,
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
                questionNumber: quizContext.currentQuestion?.question_number,
                question: quizContext.currentQuestion?.question!,
                answer: result,
                isCorrect,
                type: quizContext.currentQuestion?.type as QuestionType,
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
              value={(quizContext.progress / quizContext.quiz.questions.length) * 100} // converted to percentage
              max={100} // progress is now out of 100
            />
          </div>
        ) : (
          null
        )}
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
                questionNumber: quizContext.currentQuestion?.question_number,
                question: quizContext.currentQuestion?.question!,
                answer: selected,
                isCorrect,
                type: quizContext.currentQuestion?.type as QuestionType,
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
            onSubmit={(isCorrect) => {
              quizContext.recordAnswer({
                questionNumber: quizContext.currentQuestion?.question_number,
                question: quizContext.currentQuestion?.question!,
                answer: quizContext.currentQuestion?.correct_answer,
                isCorrect: isCorrect as boolean,
                type: quizContext.currentQuestion?.type as QuestionType,
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
            quizContext.answerHistory.filter((a) => a.isCorrect).length
          }
          authorName="Sebby Siazon"
          correctPercentage={
            (quizContext.answerHistory.filter((a) => a.isCorrect).length /
              quizContext.answerHistory.length) *
            100
          }
          incorrectAnswers={
            quizContext.answerHistory.filter((a) => !a.isCorrect).length
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
