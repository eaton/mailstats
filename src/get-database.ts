import 'dotenv/config';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

export function getDatabase() {
  const sqlite = new Database(process.env.SQLITE_DB);
  const db = drizzle(sqlite);
}
