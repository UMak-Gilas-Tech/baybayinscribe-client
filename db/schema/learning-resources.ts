import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { file } from "./file-schema";

export const learningResource = pgTable("learning_resource", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull(),
  created_by: text("created_by").notNull(),
  description: text("description").notNull(),
  is_visible: boolean("is_visible").notNull().default(false),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const learningResourceModule = pgTable("learning_resource_module", {
  id: uuid("id").primaryKey(),
  module_name: text("module_name").notNull(),
  module_description: text("module_description").notNull(),
  learning_resource_id: uuid("learning_resource_id").references(
    () => learningResource.id
  ),
  module_id: uuid("module_id").references(() => file.id),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const learningResourceProgress = pgTable("learning_resource_progress", {
  id: uuid("id").primaryKey(),
  learning_resource_module_id: uuid("learning_resource_module_id").references(
    () => learningResourceModule.id
  ),
  user_id: text("user_id").notNull(),
  progress: text("progress").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
