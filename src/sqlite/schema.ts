import 'dotenv/config';
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

/**
 * An individual email message, either sent or received. This table doesn't include
 * message bodies; we store them separately on the filesystem to avoid bogging down
 * the database with text we'd rather analyze using different methods.
 */
export const message = sqliteTable('message', {
  mid: text('mid').primaryKey(),
  messageId: text('messageId'),
  inReplyTo: text('inReplyTo'),
  date: text('date'),
  subject: text('subject'),
  sender: text('sender'),
  recipient: text('recipient'),
  text: text('text'),
  html: text('html'),
  headers: text('headers', { mode: 'json' }).$type<Record<string, unknown>>(),
  labels: text('labels', { mode: 'json' }).$type<string[]>(),
  meta: text('meta', { mode: 'json' }).$type<Record<string, unknown>>(),
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
  name: text('name'),
  domain: text('domain'),
  labels: text('labels', { mode: 'json' }).$type<string[]>(),
});

/**
 * An email attachment included with a message. Note that this is a record of the
 * attachment and its metadata; we store the attachments themselves on disk, where
 * analysis is easier. 
 */
export const attachment = sqliteTable('attachment', {
  cid: text('cid').primaryKey(),
  mid: text('mid'),
  contentType: text('contentType'),
  bytes: integer('bytes'),
  filename: text('filename'),
  checksum: text('checksum'),
});