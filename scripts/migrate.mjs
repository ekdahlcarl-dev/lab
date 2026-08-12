import { readFile } from "node:fs/promises";
import pg from "pg";

const { Client } = pg;
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const sql = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
const client = new Client({ connectionString });
await client.connect();
try {
  await client.query(sql);
  console.log("Database schema applied.");
} finally {
  await client.end();
}
