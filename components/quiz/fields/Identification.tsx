import React from "react";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";

export type IdentificationProps = {
  correctAnswer: string;
  onSubmit: (isCorrect: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>;

const Identification = (props: IdentificationProps) => {
  const [answer, setAnswer] = React.useState<string>("");

  const handleSubmit = () => {
    const isCorrect =
      answer.trim().toLowerCase() === props.correctAnswer.trim().toLowerCase();
    props.onSubmit(isCorrect);
  }; 

  return (
    <div className="z-10 w-full flex flex-col justify-center items-center gap-4">
      <Textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="bg-[#D3DDFD] border-2 border-[#31384D] w-full md:w-3/4 lg:w-1/2 h-20"
        placeholder="Type your answer here..."
      />
      <Button onClick={handleSubmit} className="bg-[#576EB6] w-full md:w-3/4 lg:w-1/2">Submit</Button>
    </div>
  );
};

export default Identification;
