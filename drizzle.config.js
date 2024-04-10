import 'dotenv/config';
import { defineConfig } from 'drizzle-kit'
import jetpack from '@eatonfyi/fs-jetpack';

// A little fancy footwork to ensure we respect output directories etc.
let dbUrl = process.env.DB_URL;
if (dbUrl !== ':memory:') {
  dbUrl = jetpack.dir(process.env.OUTPUT_DIR ?? 'output').path(dbUrl ?? 'mailstats.db');
}

export default defineConfig({
 schema: "./src/sqlite/schema.ts",
  driver: 'better-sqlite',
  dbCredentials: { url: dbUrl },
  verbose: true,
  strict: true,
  out: './migrations',
})
