import 'dotenv/config';
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

/**
 * An individual email message, either sent or received. This table doesn't include
 * message bodies; we store them separately on the filesystem to avoid bogging down
 * the database with text we'd rather analyze using different methods.
 */
export const message = sqliteTable('message', {
  mid: text('mid').primaryKey(),
  thread: text('thread'),
  subject: text('subject'),
  recipient: text('recipient'),
  sender: text('sender'),
  date: text('date'),
  labels: text('labels', { mode: 'json' }).$type<string[]>(),
  embeddings: text('embeddings', { mode: 'json' }).$type<Record<string, number[]>>(),
  meta: text('meta', { mode: 'json' }).$type<Record<string, unknown>>(),
  headers: text('headers', { mode: 'json' }).$type<Record<string, unknown>>(),
});

/**
 * The relationships between a single message and the email addresses referenced
 * in its headers. The specific header an email appeared in (ie, `to`, `from`, `cc`,
 * or `bcc`) is stored in the 'rel' column.
 */
export const participant = sqliteTable('participant', {
  mid: text('mid'), // .references(() => message.mid),
  rel: text('rel'),
  aid: text('aid'), // .references(() => address.aid),
});

/**
 * Individual email addresses and the names attached to them. Note that only the first
 * name used with an email address will be stored; down the line we might keep track
 * of aliases but for now, nah.
 */
export const address = sqliteTable('address', {
  aid: text('aid').primaryKey(),
  address: text('address'),
  domain: text('domain'),
  name: text('name'),
});

/**
 * An email attachment included with a message. Note that this is a record of the
 * attachment and its metadata; we store the attachments themselves on disk, where
 * analysis is easier. 
 */
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