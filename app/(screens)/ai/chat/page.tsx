"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAiStore } from "@/app/store/store.ai";
import AppLogo from "@/public/images/BaybayInscribe-AppIcon.png";
import { SendIcon, ChevronLeft } from "lucide-react";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import remarkParse from "remark-parse";
import remarkBaybayin from "@/app/lib/remark-baybayin";

type ChatBubbleProps = {
  text: string;
  isUser: boolean;
};

const ChatPageHeader = () => {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-20 w-full h-16 sm:h-20 bg-[#e7ecfe] border-b-2 border-black flex flex-row items-center justify-start px-3 sm:px-4 gap-2 sm:gap-4">
      <button
        className="p-1.5 sm:p-2 rounded-full hover:bg-[#d3ddfd] transition-colors"
        onClick={() => router.back()}
        aria-label="Back"
      >
        <ChevronLeft size={24} className="text-[#122254] sm:w-7 sm:h-7" />
      </button>
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-300 flex items-center justify-center">
        <img
          src={AppLogo.src}
          alt="Baybayin"
          className="w-full h-full rounded-full"
        />
      </div>
      <div className="flex flex-col items-start justify-start min-w-0 flex-1">
        <h1 className="text-base sm:text-lg font-bold truncate">Baybayin AI</h1>
        <p className="text-xs text-gray-500 truncate">Powered by Google Gemini 2.0</p>
      </div>
    </div>
  );
};

const ChatBubble = (props: ChatBubbleProps) => {
  const router = useRouter();
  
  // extract navigation commands with keywords
  const commands: Array<{type: "sketch" | "transliterate", keyword?: string}> = [];
  
  // Check for sketch command with keyword
  const sketchMatch = props.text.match(/navigate:sketch(?:\?s=([^&\s]+))?/);
  if (sketchMatch) {
    commands.push({
      type: "sketch",
      keyword: sketchMatch[1] ? decodeURIComponent(sketchMatch[1]) : undefined
    });
  }
  
  // Check for transliterate command with keyword
  const transliterateMatch = props.text.match(/navigate:transliterate(?:\?s=([^&\s]+))?/);
  if (transliterateMatch) {
    commands.push({
      type: "transliterate", 
      keyword: transliterateMatch[1] ? decodeURIComponent(transliterateMatch[1]) : undefined
    });
  }

  // strip navigation tokens from display text
  const displayText = props.text
    .replace(/navigate:sketch(?:\?s=[^&\s]+)?/g, "")
    .replace(/navigate:transliterate(?:\?s=[^&\s]+)?/g, "")
    .replace(/undefined/g, "")
    .trim();

  return (
    <div
      className={`w-full flex ${
        props.isUser ? "justify-end" : "justify-start"
      } px-3 sm:px-4 lg:px-6`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[60%] xl:max-w-[50%] p-3 sm:p-4 shadow-lg transition-colors text-sm sm:text-base
        ${
          props.isUser
            ? "bg-blue-500 text-white rounded-bl-lg rounded-tl-lg rounded-tr-lg"
            : "bg-white text-gray-800 rounded-br-lg rounded-tr-lg rounded-tl-lg"
        }`}
      >
        <span
          className={`${
            props.isUser ? "text-white text-right" : "text-white"
          }`}
        ></span>

        <div className={`prose prose-sm sm:prose-base max-w-none ${props.isUser ? "text-white" : "text-left"}`}>
          <Markdown remarkPlugins={[remarkParse, remarkBaybayin]}>
            {displayText}
          </Markdown>
        </div>

        {/* render navigation buttons if any */}
        {commands.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            {commands.map((cmd, index) => (
              <Button
                key={`${cmd.type}-${index}`}
                data-navigate={cmd.type}
                data-keyword={cmd.keyword}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-xs sm:text-sm whitespace-nowrap"
                onClick={() => {
                  if (cmd.type === "sketch") {
                    const url = cmd.keyword ? `/ai/sketch?s=${encodeURIComponent(cmd.keyword)}` : "/ai/sketch";
                    router.push(url);
                  } else if (cmd.type === "transliterate") {
                    const url = cmd.keyword ? `/transliterator?s=${encodeURIComponent(cmd.keyword)}` : "/transliterator";
                    router.push(url);
                  }
                }}
              >
                {cmd.type === "sketch" 
                  ? `Gumuhit ka!${cmd.keyword ? ` (${cmd.keyword})` : ''}` 
                  : `Go to Transliterate${cmd.keyword ? ` (${cmd.keyword})` : ''}`
                }
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Loading placeholder with bouncing dots
const LoadingBubble = () => (
  <div className="w-full h-auto flex flex-row items-start justify-start px-3 sm:px-4 lg:px-6">
    <div className="p-3 sm:p-4 rounded-xl w-full max-w-[85%] sm:max-w-[60%] md:max-w-[50%] flex items-center gap-2 bg-[#e7ecfc] border-[0.5px] border-[#3f5187]">
      <span className="flex space-x-1">
        <span
          className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        />
        <span
          className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />
        <span
          className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        />
      </span>
    </div>
  </div>
);

const ChatPageChatBody = ({
  messages,
  animating,
}: {
  messages: { text: string; isUser: boolean }[];
  animating: boolean;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, animating]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
    >
      {messages.map((m, i) => (
        <ChatBubble key={i} text={m.text} isUser={m.isUser} />
      ))}
      {messages.length === 0 && !animating && (
        <div className="h-full flex flex-col lg:flex-row items-center justify-center w-full py-4 sm:py-8 px-4">
          <div className="flex flex-col items-center lg:items-start justify-center text-center lg:text-left order-2 lg:order-1">
            <span className="text-xl sm:text-2xl md:text-3xl font-semibold mb-1 text-[#122254]">
              Kamusta! Ako si
            </span>
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 sm:mb-4 text-blue-600 drop-shadow-lg font-sans">
              Butty
            </span>
            <span className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 font-medium max-w-sm sm:max-w-md lg:max-w-xl leading-relaxed">
              Isa akong maliit, pero matalinong butanding na handa kang tulungan sa
              iyong mga katanungan tungkol sa{" "}
              <span className="font-bold text-blue-700">Baybayin</span> at iba
              pang mga paksa.
              <br />
              <span className="block mt-2 sm:mt-3">
                Ano ang maitutulong ko sa iyo ngayon?
              </span>
            </span>
          </div>
          <div className="order-1 lg:order-2 mb-4 lg:mb-0 lg:ml-8">
            <img
              src="/images/ButtyWave.png"
              className="h-32 sm:h-40 md:h-48 lg:h-64 w-auto"
              alt="Butty waving"
            />
          </div>
        </div>
      )}
      {animating && <LoadingBubble />}
    </div>
  );
};

const ChatPageInput = ({
  input,
  setInput,
  onSend,
  disabled,
}: {
  input: string;
  setInput: (s: string) => void;
  onSend: () => void;
  disabled: boolean;
}) => (
  <div className="sticky bottom-0 p-3 sm:p-4 flex justify-center bg-gradient-to-t from-white via-white to-transparent">
    <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        // send on Enter
        onKeyDown={(e) => {
          if (e.key === "Enter" && !disabled) {
            e.preventDefault();
            onSend();
          }
        }}
        disabled={disabled}
        placeholder="Ilagay ang mensahe mo dito..."
        className="w-full h-12 sm:h-14 border border-gray-600 rounded-full px-4 sm:px-6 pr-12 sm:pr-14 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-transparent"
      />
      <button
        onClick={onSend}
        disabled={disabled}
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 transition p-1"
      >
        <SendIcon size={20} className="sm:w-6 sm:h-6" />
      </button>
    </div>
  </div>
);

const ChatPage = () => {
  const { response, status, sendPrompt } = useAiStore();
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [animating, setAnimating] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { text: input, isUser: true }]);
    setInput("");
    setAnimating(true);
    await sendPrompt(input);
  };
  
  useEffect(() => {
    if (status === "Loaded") {
      const words = response.split(" ").filter((w) => w.trim() !== "" && w !== "undefined");
      if (words.length === 0) {
        setAnimating(false);
        return;
      }
      
      let idx = 0;
      // Initialize with the first word
      setMessages((m) => [...m, { text: words[0], isUser: false }]);
      idx = 1;
      
      if (words.length === 1) {
        setAnimating(false);
        return;
      }
      
      const iv = setInterval(() => {
        if (idx >= words.length) {
          clearInterval(iv);
          setAnimating(false);
        } else {
          setMessages((m) => {
            const prev = m.slice(0, -1);
            const last = m[m.length - 1];
            const updated = last.text + " " + words[idx];
            return [...prev, { ...last, text: updated }];
          });
          idx++;
        }
      }, 80);
    }
    if (status === "Error") {
      setAnimating(false);
    }
  }, [status, response]);

  return (
    <div className="flex flex-col h-screen">
      <ChatPageHeader />
      <ChatPageChatBody messages={messages} animating={animating} />
      <ChatPageInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        disabled={animating || status === "Loading"}
      />
    </div>
  );
};

export default ChatPage;
