import fs from 'fs';
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';


export default defineConfig({
  out: './db/generated',
  schema: './db/schema/**/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: {
      rejectUnauthorized: true,
      ca: process.env.SSL_CA ? fs.readFileSync(process.env.SSL_CA, "utf-8") : undefined,
    }
  },
});
