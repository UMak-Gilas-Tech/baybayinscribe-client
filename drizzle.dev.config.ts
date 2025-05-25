import * as path from 'path';
import * as dotenv from 'dotenv';

// Load .env.dev before anything else
dotenv.config({ path: path.resolve(process.cwd(), '.env.dev') });

import { defineConfig } from 'drizzle-kit';
console.log(process.env.DATABASE_URL);
export default defineConfig({
  out: './db/dev/generated',
  schema: './db/schema/**/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_DEV!,
  },
});
