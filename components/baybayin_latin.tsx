import baybayifyWord, {
  baybayifySymbol,
  baybayinToLatin,
} from "@/lib/baybayify";
import React, { useState } from "react";

// ToggleSpan component: renders two variants and toggles on click.
type ToggleSpanProps = {
  // left variant and right variant.
  left: string;
  right: string;
};

const ToggleSpan: React.FC<ToggleSpanProps> = ({ left, right }) => {
  const [showLeft, setShowLeft] = useState(true);
  const current = showLeft ? left : right;
  return (
    <span className="inline-block text-center mr-1 *:text-2xl">
      <span onClick={() => setShowLeft(!showLeft)} className="cursor-pointer">
        {baybayifyWord(current)}
      </span>
      <br />
      <span
        onClick={() => setShowLeft(!showLeft)}
        className="font-sans underline cursor-pointer text-xl"
      >
        {current}
      </span>
    </span>
  );
};

// BaybayinLatin component: accepts an array of characters and renders items with "_" as toggleable.
type BaybayinLatinProps = {
  characters: string[];
};

const BaybayinLatin: React.FC<BaybayinLatinProps> = ({ characters }) => {
  return (
    <span className="font-[Baybayin_Simple_TAWBID] *:text-2xl">
      {characters.map((char, index) => {
        if (char.includes("_")) {
          const parts = char.split("_");
          if (parts.length === 2) {
            return <ToggleSpan key={index} left={parts[0]} right={parts[1]} />;
          }
        }
        // For non-toggleable characters
        return (
          <span key={index} className="inline-block text-center mr-1">
            <span className="px-1 ">
              {baybayifyWord(
                characters.length - 1 != index
                  ? char
                  : char.length == 1
                  ? char + "+"
                  : char
              )}
            </span>
            <br />
            <span className="font-sans">
              {baybayinToLatin(
                characters.length - 1 != index
                  ? char
                  : char.length == 1
                  ? char + "+"
                  : char
              )}
            </span>
          </span>
        );
      })}
    </span>
  );
};

export default BaybayinLatin;
