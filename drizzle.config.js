import 'dotenv/config';
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
 schema: "./src/schema.ts",
  driver: 'better-sqlite',
  dbCredentials: {
    url: process.env.SQLITE_DB ?? ':memory:'
  },
  verbose: true,
  strict: true,
  out: './migrations',
})
