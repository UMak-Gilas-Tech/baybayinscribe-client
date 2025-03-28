import {
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { file } from "./file-schema";

export const learningResource = pgTable("learning_resource", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull(),
  markdown_file: uuid("file_id").references(() => file.id),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
