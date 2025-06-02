"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import {
  InputContainer,
  SwitchButton,
  TransliteratorHeader,
} from "./components";
import baybayifyWord, { baybayinToLatin } from "@/lib/baybayify";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";
import { useTranslate } from "@/app/store/store.translate";
import { useSearchParams } from "next/navigation";

function TransliterationContent() {
  const [latinText, setLatinText] = useState("");
  const [baybayinText, setBaybayinText] = useState(baybayifyWord(""));
  const [switchOrder, setSwitchOrder] = useState(false);
  const [latinLang, setLatinLang] = useState("filipino");
  const [loading, setLoading] = useState(false);

  const params = useSearchParams();
  const translate = useTranslate((s) => s.translate);
  const translateFilToEng = useTranslate((s) => s.translateFilToEng);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (params.get("s")) {
      setLatinText(params.get("s") || "");
    }
  }, [params]);

  // Debounced translation effect for English and Filipino-to-English
  useEffect(() => {
    if (latinLang === "filipino") {
      setLoading(false);
      return;
    }
    if (switchOrder) {
      // Baybayin -> Latin (baybayinText to latinText)
      if (latinLang === "english" && baybayinText) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
          setLoading(true);
          const latin = baybayinToLatin(baybayinText);
          setLatinText(latin);
          if (latin) {
            const translated = await translateFilToEng(latin);
            setLatinText(translated ?? latin);
          }
          setLoading(false);
        }, 1000);
        return () => {
          if (debounceRef.current) clearTimeout(debounceRef.current);
        };
      }
    } else {
      // Latin -> Baybayin (latinText to baybayinText)
      if (latinLang === "english" && latinText) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
          setLoading(true);
          const translated = await translate(latinText);
          setBaybayinText(translated ? baybayifyWord(translated) : "");
          setLoading(false);
        }, 1000);
        return () => {
          if (debounceRef.current) clearTimeout(debounceRef.current);
        };
      }
    }
    if (!latinText && !baybayinText) setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latinText, baybayinText, latinLang, switchOrder]);

  const handleLatinChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLatinText(value);
    if (latinLang !== "english") {
      setBaybayinText(value === "" ? "" : baybayifyWord(value));
    }
    // If english, effect will handle translation
  };

  const handleBaybayinChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setBaybayinText(value);
    if (latinLang !== "english") {
      setLatinText(value === "" ? "" : baybayinToLatin(value));
    }
    // If english, effect will handle translation
  };

  const latinInput = (
    <InputContainer
      title="Latin Alphabet"
      value={latinText}
      onChange={handleLatinChange}
      placeholder="Type Latin..."
      headerRight={
        <Select
          value={latinLang}
          onValueChange={setLatinLang}
          disabled={loading}
        >
          <SelectTrigger className="w-fit bg-neutral-white/25 backdrop-blur-sm text-blue-200 border-blue-300/20 focus:border-blue-500 ">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-white/25 backdrop-blur-sm text-blue-200 border-blue-300/20 focus:border-blue-500">
            <SelectItem
              className="hover:bg-blue-900 flex items-center gap-2"
              value="filipino"
            >
              <Image
                src="/images/flag-ph.webp"
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
                src="/images/flag-us.webp"
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
      value={baybayinText}
      onChange={handleBaybayinChange}
      placeholder="Ilgy+"
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

        <div className="flex flex-col md:flex-row gap-2 sm:gap-3 md:gap-4 items-center relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/30 z-10 pointer-events-none">
              <span className="text-blue-200 text-sm animate-pulse bg-neutral-800/80 px-4 py-2 rounded">
                Translating...
              </span>
            </div>
          )}
          {switchOrder
            ? [baybayinInput, switchBtn, latinInput]
            : [latinInput, switchBtn, baybayinInput]}
        </div>
      </section>
    </main>
  );
}

export default function TransliterationScreen() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-col items-center min-h-full font-sans">
          <TransliteratorHeader />
          <div className="flex items-center justify-center p-8">
            <span className="text-blue-200 text-sm animate-pulse">
              Loading...
            </span>
          </div>
        </main>
      }
    >
      <TransliterationContent />
    </Suspense>
  );
}
