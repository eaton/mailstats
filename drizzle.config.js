import 'dotenv/config';
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
 schema: "./src/crud/schema.ts",
  driver: 'better-sqlite',
  dbCredentials: {
    url: process.env.DB_URL ?? ':memory:'
  },
  verbose: true,
  strict: true,
  out: './migrations',
})
