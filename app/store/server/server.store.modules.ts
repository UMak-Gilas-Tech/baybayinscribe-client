import { create } from "zustand";
import db from "@/db/drizzle";
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
  getModule: (
    resource_id: string,
    module_id: string
  ) => Promise<Module[] | any>;
  getModules: (resource_id: string) => Promise<Module[] | any>;
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
  markModuleFinishedServer: (params: { moduleId: string }) => Promise<void>;
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

    (result[0] as any).file = result[0].module_id
      ? await db
          .select()
          .from(FileSchema)
          .where(eq(FileSchema.id, result[0].module_id as string))
      : null;

    console.log("Module data:", result[0]);

    return result;
  },
  getModules: async (resource_id: string) => {
    // Get all modules for the resource
    const modules = await db
      .select()
      .from(learningResourceModule)
      .where(eq(learningResourceModule.learning_resource_id, resource_id));

    // For each module, fetch its file and append it
    const modulesWithFiles = await Promise.all(
      modules.map(async (module: any) => {
        let file = null;
        if (module.module_id) {
          const files = await db
            .select()
            .from(FileSchema)
            .where(eq(FileSchema.id, module.module_id));
          file = files[0] || null;
        }
        return {
          ...module,
          file,
        };
      })
    );

    return modulesWithFiles;
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
      .then((data: any[]) => data[0]);
    return moduleData;
  },
  updateModule: async (module_id, updateData) => {
    try {
      let fileId = updateData.existingFileId;
      if (updateData.file && updateData.resource_id) {
        // Always upload a new file and update the module to point to it
        const newFileId = crypto.randomUUID();
        const uploadResponse = await put(
          `learning_resources/${updateData.resource_id}/modules/` + newFileId,
          updateData.file.stream(),
          {
            access: "public",
            allowOverwrite: true,
          }
        );
        const fileUrl = uploadResponse?.downloadUrl || null;
        if (!fileUrl) throw new Error("File upload failed");
        await db.insert(FileSchema).values({
          id: newFileId,
          name: updateData.file.name,
          url: fileUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        // Update the module's module_id to point to the new file
        await db
          .update(learningResourceModule)
          .set({ module_id: newFileId, updatedAt: new Date() })
          .where(eq(learningResourceModule.id, module_id));
        fileId = newFileId;
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
        .then((data: any[]) => data[0]);
      return updatedModule;
    } catch (error) {
      console.error("Error updating module:", error);
      throw error;
    }
  },
  deleteModule: async (module_id) => {
    await db
      .delete(learningResourceModule)
      .where(eq(learningResourceModule.id, module_id));
    return { message: "Module deleted successfully" };
  },
  markModuleFinishedServer: async ({ moduleId }) => {
    await db
      .update(learningResourceModule)
      .set({ is_finished: true, updatedAt: new Date() })
      .where(eq(learningResourceModule.module_id, moduleId));
  },
}));
