import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { learningResource } from "./learning-resources";
import { user, userInformation } from "./auth-schema";

export const file = pgTable("file", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  uploaded_by: text("uploaded_by").references(() => user.id),
  learning_resource_id: uuid("learning_resource_id").references(() => learningResource.id),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
