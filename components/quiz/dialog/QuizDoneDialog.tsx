import React from 'react';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { BarChart, CheckCircle, XCircle } from 'lucide-react';

import ButtyPhone from "@/public/images/ButtyPhone.png";

interface QuizDoneDialogProps {
  quizTitle: string;
  correctPercentage: number;
  authorName: string;
  scoreEarned: number;
  correctAnswers: number;
  incorrectAnswers: number;
  isOpen: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const QuizDoneDialog: React.FC<QuizDoneDialogProps> = ({ 
  quizTitle,
  correctPercentage,
  authorName,
  scoreEarned,
  correctAnswers,
  incorrectAnswers,
  isOpen,
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="z-50 fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center">
      <div className=" rounded-lg min-w-[70%] md:min-w-[50%] lg:min-w-[30%] flex flex-col gap-4">
        <div className='flex flex-col gap-4 w-full p-10 rounded-xl bg-gradient-to-b from-[#BFCCF8] via-[#dbe3fa] via-[50%] to-[#C5D2FC]  to-[100%]'>
            <div className='flex flex-row gap-4  h-20'>
                <img src={ButtyPhone.src} className='aspect-square h-[100px]' alt="" />
                <div className='w-full flex flex-col justify-between'>
                    <span className='text-lg font-bold'>{quizTitle}</span>
                    <Progress value={correctPercentage} />
                    <span className='text-sm'>By: {authorName}</span>
                </div>
            </div>

            <div className='flex flex-row gap-2'>
                <span>Date Taken: </span>
                <span>{new Date().toDateString()} {new Date().toTimeString().split(" ")[0]}</span>
            </div>

            <div className='px-4 h-16 border-2 flex flex-row justify-start items-center gap-4 rounded-xl border-[#3f5187] '>
                <BarChart size={40} className='' />
                <div className='flex flex-col'>
                    <span className='text-sm'>Score</span>
                    <span className='text-2xl'>{scoreEarned}</span>
                </div>
            </div>

            <div className='h-16 flex flex-row gap-4'>
                <div className='px-4 flex flex-row gap-4 items-center justify-evenly flex-1 bg-green-100 border-2 border-black rounded-xl'>
                    <CheckCircle size={40}  />
                    <div className='w-full flex flex-col'>
                        <span>Correct</span>
                        <span>{correctAnswers}</span>
                    </div>
                </div>
                <div className='flex flex-row justify-start items-center gap-4 px-4 flex-1 bg-red-100 border-2 border-black rounded-xl '>
                    <XCircle size={40}  />
                    <div className='w-full flex flex-col'>
                        <span>Incorrect</span>
                        <span>{incorrectAnswers}</span>
                    </div>
                </div>
            </div>
        </div>

        <Button 
          onClick={onClose} 
          className='w-full bg-[#3f5187] h-10 hover:bg-[#576eb6] cursor-pointer transition-colors'
        >
            Continue
        </Button>
      </div>
    </div>
  );
};

export default QuizDoneDialog;
