import { create } from "zustand";
import { Status } from "../../types/type.loading";
import { promptGemini } from "../../lib/genai";

interface AiStore {
  status: Status;
  response: string;
  error: string | null;
  sendPrompt: (prompt: string) => Promise<void>;
  reset: () => void;
}

export const useAiStore = create<AiStore>((set) => ({
  status: "Idle",
  response: "",
  error: null,
  sendPrompt: async (prompt) => {
    set({ status: "Loading", error: null, response: "" });
    try {
      const text = await promptGemini(prompt);
      set({ status: "Loaded", response: text });
    } catch (e: any) {
      set({ status: "Error", error: e.message || "Unknown error" });
    }
  },
  reset: () => {
    set({ status: "Idle", response: "", error: null });
  },
}));
