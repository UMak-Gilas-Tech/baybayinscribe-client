import { create } from "zustand";

interface ModuleState {
  // current module data, extend the type as needed
  module?: any;
  error?: string;
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
}

export const useModuleStore = create<ModuleState>((set) => ({
  module: null,
  error: undefined,
  getModule: async (resourceId, moduleId) => {
    try {
      const res = await fetch(`/api/lessons/${resourceId}/module/${moduleId}`);
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const data = await res.json();
      set({ module: data, error: undefined });
    } catch (e: any) {
      set({ error: e.message });
    }
  },
  createModule: async ({
    resourceId,
    module_title,
    module_description,
    file,
  }) => {
    try {
      const formData = new FormData();
      formData.append("module_title", module_title);
      formData.append("module_description", module_description);
      if (file) {
        formData.append("file", file);
      }

      const res = await fetch(`/api/lessons/${resourceId}/module/create`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const data = await res.json();
      set({ module: data, error: undefined });
    } catch (e: any) {
      set({ error: e.message });
    }
  },
  deleteModule: async ({ resourceId, moduleId }) => {
    try {
      const res = await fetch(
        `/api/lessons/${resourceId}/module/${moduleId}/delete`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        throw new Error(await res.text());
      }
      set({ module: null, error: undefined });
    } catch (e: any) {
      set({ error: e.message });
    }
  },
  getModules: async (resourceId) => {
    try {
      const res = await fetch(`/api/lessons/${resourceId}/modules`);
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const data = await res.json();
      set({ module: data, error: undefined });
    } catch (e: any) {
      set({ error: e.message });
    }
  },
  updateModuleFile: async ({ resourceId, moduleId, file, existingFileId }) => {
    try {
      // assemble form data. Send file and, if provided, the existing file id.
      const formData = new FormData();
      formData.append("file", file);
      if (existingFileId) {
        formData.append("existingFileId", existingFileId);
      }

      const res = await fetch(
        `/api/lessons/${resourceId}/module/${moduleId}/update`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const data = await res.json();
      set({ module: data, error: undefined });
    } catch (e: any) {
      set({ error: e.message });
    }
  },
  updateModuleContent: async ({
    resourceId,
    moduleId,
    module_title,
    module_description,
  }) => {
    try {
      const formData = new FormData();
      formData.append("module_title", module_title);
      formData.append("module_description", module_description);

      const res = await fetch(
        `/api/lessons/${resourceId}/module/${moduleId}/update`,
        {
          method: "PATCH",
          body: formData,
        }
      );
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const data = await res.json();
      set({ module: data, error: undefined });
    } catch (e: any) {
      set({ error: e.message });
    }
  },
}));
