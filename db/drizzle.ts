import "dotenv/config";
import dotenv from "dotenv";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, PoolConfig } from "pg";

dotenv.config({path: "../.env"});

const poolConfig: PoolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.SSL_CA
        ? {
            ca: Buffer.from(process.env.SSL_CA, 'base64'),
        }
        : undefined,
};

const pool = new Pool(poolConfig);

const db = drizzle(pool);

export default db;