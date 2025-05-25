"use client";

import { useState } from "react";
import {
  InputContainer,
  SwitchButton,
  TransliteratorHeader,
} from "./components";
import baybayifyWord, {
  baybayinToLatin,
  latinToBaybayinUnicode,
} from "@/lib/baybayify";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";

export default function TransliterationScreen() {
  const [latinText, setLatinText] = useState("");
  const [baybayinText, setBaybayinText] = useState(baybayifyWord(""));
  const [switchOrder, setSwitchOrder] = useState(false);
  const [latinLang, setLatinLang] = useState("default");

  const handleLatinChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLatinText(value);
    setBaybayinText(value === "" ? "" : baybayifyWord(value));
  };

  const handleBaybayinChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const wrapped = value === "" ? "" : baybayifyWord(value);
    setBaybayinText(wrapped);
    setLatinText(wrapped === "" ? "" : baybayinToLatin(wrapped));
  };

  const latinInput = (
    <InputContainer
      title="Latin Alphabet"
      value={latinText}
      onChange={handleLatinChange}
      placeholder="Type Latin..."
      headerRight={
        <Select value={latinLang} onValueChange={setLatinLang}>
          <SelectTrigger className="w-fit bg-neutral-white/25 backdrop-blur-sm text-blue-200 border-blue-300/20 focus:border-blue-500 ">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-white/25 backdrop-blur-sm text-blue-200 border-blue-300/20 focus:border-blue-500">
            <SelectItem className="hover:bg-blue-900" value="default">
              🌐 Auto-Detect (Default)
            </SelectItem>
            <SelectItem
              className="hover:bg-blue-900 flex items-center gap-2"
              value="filipino"
            >
              <Image
                src="/images/flag-ph.svg"
                alt="Philippines flag"
                width={20}
                height={20}
              />
              Filipino
            </SelectItem>
            <SelectItem
              className="hover:bg-blue-900 flex items-center gap-2"
              value="english"
            >
              <Image
                src="/images/flag-us.svg"
                alt="US flag"
                width={20}
                height={20}
              />
              English
            </SelectItem>
          </SelectContent>
        </Select>
      }
    />
  );

  const baybayinInput = (
    <InputContainer
      title="Baybayin"
      value={latinToBaybayinUnicode(baybayinText)}
      onChange={handleBaybayinChange}
      placeholder="Type Baybayin..."
      className="font-[Baybayin_Simple_TAWBID] text-xl sm:text-2xl md:text-3xl lg:text-4xl"
    />
  );

  const switchBtn = (
    <SwitchButton
      onClick={() => setSwitchOrder(!switchOrder)}
      currentOrder={switchOrder}
    />
  );

  return (
    <main className="flex flex-col items-center min-h-full font-sans">
      <TransliteratorHeader />

      <section className="w-full max-w-8xl px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex md:hidden mb-2 sm:mb-3 md:mb-4">
          <SwitchButton
            onClick={() => setSwitchOrder(!switchOrder)}
            isMobile
            currentOrder={switchOrder}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-2 sm:gap-3 md:gap-4 items-center">
          {switchOrder
            ? [baybayinInput, switchBtn, latinInput]
            : [latinInput, switchBtn, baybayinInput]}
        </div>
      </section>
    </main>
  );
}
