import { Status } from "@/types/type.loading";
import { create } from "zustand";

import { put, del, getDownloadUrl } from "@vercel/blob";
import { file } from "@/db/schema/file-schema";

export type StorageState = {
  status: Status;

  uploadFile?: (
    request: Request,
    fileName: string,
    directory: string[]
  ) => Promise<string | undefined>;

  fetchFile?: (directory: string[]) => void;
  deleteFile?: (directory: string[]) => void;
};

const useStorage = create<StorageState>((set, get) => ({
  status: "Idle",
  uploadFile: async (
    request: Request,
    fileName: string,
    directory: string[]
  ) => {
    set({ status: "Loading" });
    try {
      const response = await put(fileName, request.body!, {
        access: "public",
      });
      set({ status: "Loaded" });

      

      return response.downloadUrl;
    } catch (e) {
      console.error(e);
      set({ status: "Error" });
      return undefined;
    }
  },
  fetchFile: async (directory: string[]) => {
    set({ status: "Loading" });
    try {
      set({ status: "Loaded" });
      return response;
    } catch (e) {
      console.error(e);
      set({ status: "Error" });
      return undefined;
    }
  },
}));
