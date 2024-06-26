import 'dotenv/config';
import Database from 'better-sqlite3';
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import jetpack from '@eatonfyi/fs-jetpack';

export type DatabaseInstance = BetterSQLite3Database<Record<string, never>>;

export function getDatabase(path = ':memory:'): DatabaseInstance {
  const dbNew = (path === ':memory:' || !jetpack.exists(path));

  const sqlite = new Database(path);
  const db = drizzle(sqlite);

  if (dbNew) {
    const sqlFile = jetpack.find({ matching: './migrations/0000_*.sql' }).pop();
    if (sqlFile) {
      const sql = jetpack.read(sqlFile);
      if (sql) sqlite.exec(sql)
    }
    // migrate(db, { migrationsFolder: "migrations" });
  }

  return db;
}
