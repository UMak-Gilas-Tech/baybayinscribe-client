import "dotenv/config";
import dotenv from "dotenv";

import { drizzle } from "drizzle-orm/node-postgres";

dotenv.config({path: "../.env"});

const db = drizzle(process.env.DATABASE_URL!);
export default db;