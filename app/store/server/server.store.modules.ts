import { create } from "zustand";
import db from "@/db";
import { and, eq } from "drizzle-orm";
import { learningResourceModule } from "@/db/schema/learning-resources";
import { file as FileSchema } from "@/db/schema/file-schema";
import { put } from "@vercel/blob";

interface Module {
  id: string;
  learning_resource_id: string | null;
  module_name: string;
  module_description: string;
  module_id: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ModuleStore {
  getModule: (resource_id: string, module_id: string) => Promise<Module[]>;
  createModule: (
    resource_id: string,
    title: string,
    description: string,
    file?: File | null
  ) => Promise<Module>;
  updateModule: (
    module_id: string,
    updateData: Partial<Pick<Module, "module_name" | "module_description">> & {
      file?: File | null;
      existingFileId?: string;
      resource_id?: string;
    }
  ) => Promise<Module>;
  deleteModule: (module_id: string) => Promise<{ message: string }>;
}

export const useModuleStore = create<ModuleStore>((set, get) => ({
  getModule: async (resource_id: string, module_id: string) => {
    const result = await db
      .select()
      .from(learningResourceModule)
      .where(
        and(
          eq(learningResourceModule.module_id, module_id),
          eq(learningResourceModule.learning_resource_id, resource_id)
        )
      );
    return result;
  },
  createModule: async (resource_id, title, description, file = null) => {
    let fileDataUuid: string | null = null;
    if (file) {
      fileDataUuid = crypto.randomUUID();
      const uploadResponse = await put(
        `learning_resources/${resource_id}/modules/` + fileDataUuid,
        file.stream(),
        {
          access: "public",
          allowOverwrite: true,
        }
      );
      const fileUpload = uploadResponse.downloadUrl;
      await db.insert(FileSchema).values({
        id: fileDataUuid,
        name: file.name,
        url: fileUpload,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    const newModuleId = crypto.randomUUID();
    const moduleData = await db
      .insert(learningResourceModule)
      .values({
        id: newModuleId,
        learning_resource_id: resource_id,
        module_name: title,
        module_description: description,
        module_id: fileDataUuid,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
      .then((data) => data[0]);
    return moduleData;
  },
  updateModule: async (module_id, updateData) => {
    if (updateData.file && updateData.resource_id) {
      const fileId = updateData.existingFileId;
      if (!fileId) throw new Error("File Reference does not exist.");
      const uploadResponse = await put(fileId, updateData.file.stream(), {
        access: "public",
        allowOverwrite: true,
      });
      const fileUrl = uploadResponse?.downloadUrl || null;
      if (!fileUrl) throw new Error("File upload failed");
      await db
        .update(FileSchema)
        .set({ url: fileUrl })
        .where(eq(FileSchema.id, fileId));
    }
    const fieldsToUpdate: any = { updatedAt: new Date() };
    if (updateData.module_name)
      fieldsToUpdate.module_name = updateData.module_name;
    if (updateData.module_description)
      fieldsToUpdate.module_description = updateData.module_description;
    const updatedModule = await db
      .update(learningResourceModule)
      .set(fieldsToUpdate)
      .where(eq(learningResourceModule.id, module_id))
      .returning()
      .then((data) => data[0]);
    return updatedModule;
  },
  deleteModule: async (module_id) => {
    await db
      .delete(learningResourceModule)
      .where(eq(learningResourceModule.id, module_id));
    return { message: "Module deleted successfully" };
  },
}));
