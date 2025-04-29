"use client";
import React, { useState, useEffect } from "react";
import { useAiStore } from "@/app/store/store.ai";
import AppLogo from "@/public/images/BaybayInscribe-AppIcon.png";
import { SendIcon } from "lucide-react";
import Markdown from "react-markdown";
import { parseSentence } from "@/lib/parse_baybayin";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type ChatBubbleProps = {
  text: string;
  isUser: boolean;
};

const ChatPageHeader = () => {
  return (
    <div className="bg-[#e7ecfe] w-full h-20 border-b-2 border-black flex flex-row items-center justify-start px-4 gap-4">
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
    <div
      className={`w-full h-auto flex flex-row items-start ${
        props.isUser ? "justify-end" : "justify-start items-center"
      }`}
    >
      {!props.isUser && (
        <img src={AppLogo.src} alt="BaybayInscribe Logo" className="w-12 h-12 rounded-full mx-6" />
      )}

      <div
        className={`p-4 rounded-xl w-1/2 flex ${
          props.isUser
            ? "items-center gap-2 bg-[#d3ddfd] border-[0.5px] border-[#3f5187] text-black"
            : "flex-col items-start gap-2 bg-[#e7ecfc] border-[0.5px] border-[#3f5187] text-black"
        }`}
      >
        <span
          className={`${
            props.isUser ? "text-[#122254] text-right" : "text-white"
          }`}
        ></span>

        <Markdown
          children={displayText}
          components={{
            // wrap each paragraph
            p({ node, children, ...rest }) {
              // flatten children to plain string
              const raw = React.Children.toArray(children)
                .map((c) => (typeof c === "string" ? c : ""))
                .join("");
              return <p {...rest}>{parseSentence(raw)}</p>;
            },
            // catch any remaining text nodes
            text({ node, children }) {
              const raw = (children as Array<string>)[0] as string;
              return <>{parseSentence(raw)}</>;
            },
          }}
        />

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

const ChatPageChatBody = ({
  messages,
}: {
  messages: { text: string; isUser: boolean }[];
}) => (
  <div className="flex-1 w-full overflow-y-auto">
    {messages.length > 0 ? (
      <div className="w-3/4 mx-auto flex flex-col gap-4 p-4">
        {messages.map((m, i) => (
          <ChatBubble key={i} text={m.text} isUser={m.isUser} />
        ))}
      </div>
    ) : (
      <div className="w-full h-full mx-auto flex flex-col items-center justify-center gap-4 p-4 ">
        <div className="bg-[#e7ecfc] w-1/2 p-4 px-6 shadow-xl rounded-xl flex flex-col items-start justify-center">
          <div className="flex flex-row gap-4">
            <img
              src={AppLogo.src}
              className="h-14 rounded-xl shadow-xl aspect-square"
              alt=""
            />

            <div className="flex flex-col items-start justify-start">
              <h2 className="font-bold text-2xl">Kamusta!</h2>
              <span>Ano ang maitutulong ko sa iyo ngayon?</span>
            </div>
          </div>

          <div className="h-[0.5px] bg-black w-full my-6"></div>

          <div className="flex flex-row gap-4 *:hover:bg-black *:hover:text-white *:transition-all *:duration-200 *:ease-in-out p-2 px-4 rounded-full cursor-pointer">
            <span className="p-2 px-4 border-[0.5px] border-black rounded-full">
              Paano isulat ang...
            </span>
            <span className="p-2 px-4 border-[0.5px] border-black rounded-full">
              Ano ang transliterasyon ng...
            </span>
          </div>
        </div>
      </div>
    )}
  </div>
);

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
  <div className="w-full flex justify-center items-center">
    <div className="relative w-1/2 h-16 flex items-center gap-4 px-4">
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
        className="w-full h-full border-2 border-[#122254] rounded-full px-4 text-sm"
      />
      <button
        onClick={onSend}
        disabled={disabled}
        className="absolute right-9 hover:cursor-pointer rounded-full px-4 py-2 text-sm"
      >
        <SendIcon size={20} className="text-black" />
      </button>
    </div>
  </div>
);

const ChatPage = () => {
  const { response, status, sendPrompt, reset } = useAiStore();
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
      }, 250);
    }
    if (status === "Error") {
      setAnimating(false);
    }
  }, [status]);

  return (
    <div className="h-full flex flex-col">
      <ChatPageHeader />
      <ChatPageChatBody messages={messages} />
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
