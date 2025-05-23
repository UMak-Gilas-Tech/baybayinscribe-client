import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.prod') });

export default defineConfig({
  out: './db/generated',
  schema: './db/schema/**/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
