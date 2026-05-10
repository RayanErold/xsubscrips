import dotenv from "dotenv";
import path from "path";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Load environment variables for local development
// Tries local .env first, then walks up to the monorepo root
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });
}
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(process.cwd(), "../../.env"), quiet: true });
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection fails
});

// Prevent process crash if the pool encounters an error
pool.on("error", (err) => {
  console.error("Unexpected error on idle database client", err);
});

export const db = drizzle(pool, { schema });

export * from "./schema";
