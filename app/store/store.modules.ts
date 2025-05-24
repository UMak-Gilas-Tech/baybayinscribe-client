import axios from "@/lib/axios";
import { Status } from "@/types/type.loading";
import { create } from "zustand";
import { LearningResourceModule } from "@/types/type.lessons";

interface ModuleState {
  module?: LearningResourceModule | null;
  modules?: LearningResourceModule[];
  error?: string;
  status?: Status;
  getModule: (resourceId: string, moduleId: string) => Promise<void>;
  createModule: (params: {
    resourceId: string;
    module_title: string;
    module_description: string;
    file?: File | null;
  }) => Promise<void>;
  deleteModule: (params: {
    resourceId: string;
    moduleId: string;
  }) => Promise<void>;
  getModules: (resourceId: string) => Promise<void>;
  updateModuleFile: (params: {
    resourceId: string;
    moduleId: string;
    file: File;
    existingFileId?: string;
  }) => Promise<void>;
  updateModuleContent: (params: {
    resourceId: string;
    moduleId: string;
    module_title: string;
    module_description: string;
  }) => Promise<void>;
  markModuleFinished: (params: { lessonId: string; moduleId: string; userId: string }) => Promise<boolean>;
}

export const useModuleStore = create<ModuleState>((set) => ({
  module: null,
  modules: [],
  error: undefined,
  status: undefined,
  getModule: async (resourceId, moduleId) => {
    try {
      set({ status: "Loading" });
      const res = await axios.get(`lessons/${resourceId}/module/${moduleId}`);
      const data = res.data;
      console.log("Module data:", data);
      set({ module: data, error: undefined, status: "Loaded" });
    } catch (e: unknown) {
      set({ error: (e as Error).message, status: "Error" });
    }
  },
  createModule: async ({
    resourceId,
    module_title,
    module_description,
    file,
  }) => {
    try {
      set({ status: "Loading" });
      const formData = new FormData();
      formData.append("module_title", module_title);
      formData.append("module_description", module_description);
      if (file) {
        formData.append("file", file);
      }

      const res = await axios.post(
        `lessons/${resourceId}/module/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = res.data;
      set({ module: data, error: undefined, status: "Loaded" });
    } catch (e: unknown) {
      set({ error: (e as Error).message, status: "Error" });
    }
  },
  deleteModule: async ({ resourceId, moduleId }) => {
    try {
      set({ status: "Loading" });
      await axios.delete(
        `lessons/${resourceId}/module/${moduleId}/delete`
      );
      set({ module: null, error: undefined, status: "Loaded" });
    } catch (e: unknown) {
      set({ error: (e as Error).message, status: "Error" });
    }
  },
  getModules: async (resourceId) => {
    try {
      set({ status: "Loading" });
      const res = await axios.get(`lessons/${resourceId}/modules`);
      const data = res.data;
      set({ modules: data, error: undefined, status: "Loaded" });
    } catch (e: unknown) {
      set({ error: (e as Error).message, status: "Error" });
    }
  },
  updateModuleFile: async ({ resourceId, moduleId, file, existingFileId }) => {
    try {
      set({ status: "Loading" });
      const formData = new FormData();
      formData.append("file", file);
      if (existingFileId) {
        formData.append("existingFileId", existingFileId);
      }

      const res = await axios.put(
        `lessons/${resourceId}/module/${moduleId}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = res.data;
      set({ module: data, error: undefined, status: "Loaded" });
    } catch (e: unknown) {
      set({ error: (e as Error).message, status: "Error" });
    }
  },
  updateModuleContent: async ({
    resourceId,
    moduleId,
    module_title,
    module_description,
  }) => {
    try {
      set({ status: "Loading" });
      const formData = new FormData();
      formData.append("module_title", module_title);
      formData.append("module_description", module_description);

      const res = await axios.patch(
        `lessons/${resourceId}/module/${moduleId}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = res.data;
      set({ module: data, error: undefined, status: "Loaded" });
    } catch (e: unknown) {
      set({ error: (e as Error).message, status: "Error" });
    }
  },
  markModuleFinished: async ({ lessonId, moduleId, userId }) => {
    try {
      set({ status: "Loading" });
      await axios.post(`/lessons/${lessonId}/module/${moduleId}/finish`, { userId });
      set({ status: "Loaded", error: undefined });
      return true;
    } catch (e: unknown) {
      set({ error: (e as Error).message, status: "Error" });
      console.error("Error marking module as finished:", e);
      return false;
    }
  },
}));
