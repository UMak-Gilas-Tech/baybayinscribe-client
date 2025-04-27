"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import TransliteratorHeader from "@/public/images/TransliteratorHeader.png";
import baybayifyWord, { baybayinToLatin } from "@/lib/baybayify";

const TransliterationScreen = () => {

  const [latinText, setLatinText] = useState("");
  const [baybayinText, setBaybayinText] = useState(baybayifyWord(""));

  // New state to toggle the order of inputs
  const [switchOrder, setSwitchOrder] = useState(false);

  const handleLatinChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLatinText(value);
    // if input is empty, clear baybayinText, otherwise convert
    setBaybayinText(value === "" ? "" : baybayifyWord(value));
  };

  const handleBaybayinChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const wrapped = value === "" ? "" : baybayifyWord(value);
    setBaybayinText(wrapped);
    // if input is empty, clear latinText, otherwise convert back
    setLatinText(wrapped === "" ? "" : baybayinToLatin(wrapped));
  };

  // Render input section for Latin
  const renderLatinInput = () => (
    <div className="border-2 border-[#31384D] bg-[#e7ecfe] lg:rounded-xl rounded-t-xl flex-1 w-full p-2">
      <h2 className="text-2xl p-2 font-bold mb-2">Latin</h2>
      <textarea
        value={latinText}
        onChange={handleLatinChange}
        placeholder="Type Latin..."
        className="w-full p-3 rounded-md resize-none h-[250px] md:min-h-[400px]"
        rows={20}
      />
    </div>
  );

  const renderBaybayinInput = () => (
    <div className="border-2 border-[#31384D] bg-[#e7ecfe] lg:rounded-xl md:rounded-xl rounded-b-xl p-2 flex-1 w-full">
      <h2 className="text-2xl p-2 font-bold mb-2">Baybayin</h2>
      <textarea
        value={baybayinText}
        onChange={handleBaybayinChange}
        placeholder="Type Baybayin..."
        className="w-full p-3 rounded-md  resize-none h-[250px] md:min-h-[400px] font-[Baybayin_Simple_TAWBID]"
        rows={20}
      />
    </div>
  );

  return (
    <div className="flex flex-col items-center h-full p-4 md:p-8">
      <img className="h-38 my-4" src={TransliteratorHeader.src} alt="Header" />
      <div className="w-full max-w-[90%]">
        {/* Mobile-only switch button */}
        <div className="flex justify-end md:hidden mb-4">
          <div
            onClick={() => setSwitchOrder(!switchOrder)}
            className="cursor-pointer text-2xl font-bold"
          >
            ⇆ Switch
          </div>
        </div>
        <div className="flex flex-col md:flex-row lg:gap-4 md:gap-2 items-center">
          {switchOrder ? renderBaybayinInput() : renderLatinInput()}
          {/* Desktop-only switch arrow */}
          <div
            onClick={() => setSwitchOrder(!switchOrder)}
            className="hidden md:block cursor-pointer text-2xl font-bold"
          >
            ⇆
          </div>
          {switchOrder ? renderLatinInput() : renderBaybayinInput()}
        </div>
      </div>
    </div>
  );
};

export default TransliterationScreen;
