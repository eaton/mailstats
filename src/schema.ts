import 'dotenv/config';
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const message = sqliteTable('message', {
  mid: text('mid').primaryKey(),
  thread: text('thread'),
  subject: text('thread'),
  recipient: text('thread'),
  sender: text('thread'),
  date: text('thread'),
  embeddings: text('embeddings', { mode: 'json' }).$type<Record<string, number[]>>(),
  meta: text('meta', { mode: 'json' }).$type<Record<string, unknown>>(),
  headers: text('headers', { mode: 'json' }).$type<Record<string, unknown>>(),
});

export const participant = sqliteTable('participant', {
  mid: text('mid').references(() => message.mid),
  rel: text('rel'),
  aid: text('aid').references(() => address.aid),
});

export const address = sqliteTable('address', {
  aid: text('aid'),
  address: text('address'),
  domain: text('domain'),
  name: text('name'),
});

export const attachment = sqliteTable('attachment', {
  mid: text('mid'),
  cid: text('cid'),
  contentType: text('contentType'),
  bytes: integer('bytes'),
  filename: text('filename'),
  checksum: text('checksum'),
  headers: text('headers', { mode: 'json' }).$type<Record<string, unknown>>(),
  embeddings: text('embeddings', { mode: 'json' }).$type<Record<string, number[]>>(),
  meta: text('meta', { mode: 'json' }).$type<Record<string, unknown>>(),
});

export const messagelabel = sqliteTable('messagelabel', {
  mid: text('mid').notNull().references(() => message.mid),
  lid: integer('lid').notNull().references(() => label.lid)
});

export const label = sqliteTable('label', {
  lid: integer('lid').primaryKey(),
  name: text('name').notNull().unique()
});