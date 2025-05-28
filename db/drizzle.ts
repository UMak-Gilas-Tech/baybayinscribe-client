import "dotenv/config";
import dotenv from "dotenv";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, PoolConfig } from "pg";

dotenv.config({path: "../.env"});

const poolConfig: PoolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        ca: process.env.SSL_CA,
    }
};

const pool = new Pool(poolConfig);

const db = drizzle(pool);

export default db;