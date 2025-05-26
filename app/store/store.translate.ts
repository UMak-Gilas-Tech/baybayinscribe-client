import customAxios from "axios";
import { create } from "zustand";

const translationAxios = customAxios.create({
  baseURL: "https://lingva.ml/api/v1/en/tl",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const filToEngAxios = customAxios.create({
  baseURL: "https://lingva.ml/api/v1/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export type TranslateStore = {
  translate: (text: string) => Promise<string | undefined>;
  translateFilToEng: (text: string) => Promise<string | undefined>;
};

export const useTranslate = create<TranslateStore>(() => ({
  translate: async (text) => {
    try {
      const response = await translationAxios.get(`/tl/en/${text}`);
      return response.data.translation;
    } catch (error) {
      console.error("Translation error:", error);
      return undefined;
    }
  },
  translateFilToEng: async (text) => {
    try {
      const response = await filToEngAxios.post(`/en/tl/${text}`);
      return response.data.translation;
    } catch (error) {
      console.error("Filipino to English translation error:", error);
      return undefined;
    }
  },
}));
