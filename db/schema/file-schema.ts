import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const file = pgTable("file", {
  id: uuid("id").primaryKey(),
  name: uuid("name").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
