"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Heart, Hourglass } from "lucide-react";
import { useQuizTakeContext } from "@/app/(screens)/quiz/take/[quiz_id]/QuizTakeContext";

interface QuizPlayerStatisticsProps {
  duration?: number;
  onTimerEnd?: () => void;
}

const QuizPlayerStatistics = ({
  duration = 30,
  onTimerEnd = () => {},
}: QuizPlayerStatisticsProps) => {
  const quizTakeContext = useQuizTakeContext();
  const [initialHealth, setInitialHealth] = useState<number | undefined>(
    undefined
  );
  const [timeRemaining, setTimeRemaining] = useState<number>(duration);
  const timerEndedRef = useRef(false);

  const resetTimer = () => {
    timerEndedRef.current = false;
    setTimeRemaining(duration);
  };

  useEffect(() => {
    resetTimer();
  }, [quizTakeContext.currentQuestion]);

  useEffect(() => {
    setInitialHealth(quizTakeContext.health);
  }, []);

  useEffect(() => {
    setTimeRemaining(duration);
  }, [duration]);

  const memoizedOnTimerEnd = useCallback(() => {
    onTimerEnd();
  }, [onTimerEnd]);

  useEffect(() => {
    if (quizTakeContext.health === 0) {
      setTimeRemaining(0);
      return;
    }
    let timer: NodeJS.Timeout;
    if (timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            if (!timerEndedRef.current) {
              timerEndedRef.current = true;
              memoizedOnTimerEnd();
            }
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeRemaining, memoizedOnTimerEnd, quizTakeContext.health]);

  return (
    <>
      <div className="w-full p-2 sm:p-4 rounded-lg inline-flex justify-between items-center">
        <div className="flex justify-start items-center gap-4">
          {quizTakeContext.health != undefined && initialHealth != undefined
            ? Array.from({ length: initialHealth }).map((value, index) =>
                quizTakeContext.health! > index ? (
                  <Heart
                    key={index}
                    className={`w-5 h-5 sm:w-6 sm:h-6 text-red-400 ${
                      quizTakeContext.health == 1 ? "animate-heartbeat" : ""
                    } `}
                    fill="oklch(0.704 0.191 22.216)"
                  />
                ) : (
                  <Heart
                    key={index}
                    className={`w-5 h-5 sm:w-6 sm:h-6 text-red-400 animate-shake `}
                  />
                )
              )
            : null}
        </div>
        <div className="px-6 py-2 bg-violet-200 rounded-3xl flex justify-start items-center gap-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 relative rounded-full bg-[#576Eb6] p-4">
            <span className="absolute inset-0 flex items-center justify-center text-orange-200 text-xl sm:text-2xl font-bold font-['Work_Sans']">
              {timeRemaining}
            </span>
          </div>
          <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 relative overflow-hidden">
            <Hourglass
              className={`w-8 h-8 sm:w-9 sm:h-9 ${
                timeRemaining <= 5
                  ? "text-red-500 animate-heartbeat duration-[9000]"
                  : ""
              }`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizPlayerStatistics;
