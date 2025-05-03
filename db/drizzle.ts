import "dotenv/config";
import dotenv from "dotenv";

import { drizzle } from "drizzle-orm/node-postgres";

dotenv.config({path: "../.env"});

const db = drizzle(process.env.DB_CON_STR!);
export default db;