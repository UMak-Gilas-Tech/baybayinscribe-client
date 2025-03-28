import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema",
  out: "./db/generated",

  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
