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
    <div className="sticky top-0 z-20 w-full h-20 bg-[#e7ecfe] border-b-2 border-black flex flex-row items-center justify-start px-4 gap-4">
      <button
        className="p-2 rounded-full hover:bg-[#d3ddfd] transition-colors"
        onClick={() => router.back()}
        aria-label="Back"
      >
        <ChevronLeft size={28} className="text-[#122254]" />
      </button>
      <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
        <img
          src={AppLogo.src}
          alt="Baybayin"
          className="w-full h-full rounded-full"
        />
      </div>
      <div className="flex flex-col items-start justify-start">
        <h1 className="text-lg font-bold">Baybayin AI</h1>
        <p className="text-xs text-gray-500">Powered by Google Gemini 2.0</p>
      </div>
    </div>
  );
};

const ChatBubble = (props: ChatBubbleProps) => {
  const router = useRouter();
  // extract navigation commands
  const commands: Array<"sketch" | "transliterate"> = [];
  if (props.text.includes("navigate:sketch")) commands.push("sketch");
  if (props.text.includes("navigate:transliterate"))
    commands.push("transliterate");

  // strip navigation tokens from display text
  const displayText = props.text
    .replace(/navigate:sketch/g, "")
    .replace(/navigate:transliterate/g, "")
    .replace(/undefined/g, "")
    .trim();

  return (
    <div className={`w-full flex ${props.isUser ? "justify-end" : "justify-start"} px-4`}>
      <div className={`max-w-[60%] p-4 shadow-lg transition-colors
        ${props.isUser
          ? "bg-blue-500 text-white rounded-bl-lg rounded-tl-lg rounded-tr-lg"
          : "bg-white text-gray-800 rounded-br-lg rounded-tr-lg rounded-tl-lg"}`}
      >
        <span
          className={`${
            props.isUser ? "text-[#122254] text-right" : "text-white"
          }`}
        ></span>

        <Markdown
          remarkPlugins={[remarkParse, remarkBaybayin]}
        >
          {displayText}
        </Markdown>

        {/* render navigation buttons if any */}
        {commands.length > 0 && (
          <div className="flex gap-2 mt-2">
            {commands.map((cmd) => (
              <Button
                key={cmd}
                data-navigate={cmd}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => {
                  if (cmd === "sketch") {
                    router.push("/ai/sketch");
                  } else if (cmd === "transliterate") {
                    router.push("/transliterator");
                  }
                }}
              >
                {cmd === "sketch" ? "Gumuhit ka!" : "Go to Transliterate"}
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
  <div className="w-full h-auto flex flex-row items-start justify-start">
    <div className="p-4 rounded-xl w-1/2 flex items-center gap-2 bg-[#e7ecfc] border-[0.5px] border-[#3f5187]">
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
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, animating]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
    >
      {messages.map((m, i) => (
        <ChatBubble key={i} text={m.text} isUser={m.isUser} />
      ))}
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
  <div className="sticky bottom-0 p-4 flex justify-center">
    <div className="relative w-full max-w-xl">
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
        placeholder="Type your message here..."
        className="w-full h-14 border border-gray-300 rounded-full px-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-transparent"
      />
      <button
        onClick={onSend}
        disabled={disabled}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 transition"
      >
        <SendIcon size={24} />
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
      const words = response.split(" ").filter((w) => w && w !== "undefined");
      let idx = 0;
      setMessages((m) => [...m, { text: "", isUser: false }]);
      const iv = setInterval(() => {
        if (idx >= words.length) {
          clearInterval(iv);
          setAnimating(false);
        } else {
          setMessages((m) => {
            const prev = m.slice(0, -1);
            const last = m[m.length - 1];
            const updated = last.text
              ? last.text + " " + words[idx]
              : words[idx];
            return [...prev, { ...last, text: updated }];
          });
          idx++;
        }
      }, 80); // was 250, now 80ms for faster loading
    }
    if (status === "Error") {
      setAnimating(false);
    }
  }, [status]);

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
