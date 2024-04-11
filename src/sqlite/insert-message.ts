import 'dotenv/config';
import { message, participant, address, attachment } from './schema.js';
import { DatabaseInstance } from './get-database.js';
import { MboxMessage } from '../util/index.js';

export async function insertMessage(input: MboxMessage, db: DatabaseInstance) {

  await db.insert(message)
    .values({
      mid: input.mid,
      subject: input.subject,
      sender: input.sender,
      recipient: input.recipient,
      date: input.date?.toISOString(),
      labels: input.labels,
      headers: input.headers,
      meta: input.meta,
      embeddings: input.embeddings,
    }).onConflictDoNothing();

  if (input.attachments.length) {
    await db.insert(attachment)
      .values(input.attachments.map(a => ({
        mid: input.mid,
        cid: a.cid,
        contentType: a.contentType,
        bytes: a.bytes,
        checksum: a.checksum,
        filename: a.filename,
        headers: a.headers,
        meta: a.meta,
        embeddings: a.embeddings
      }))).onConflictDoNothing();
    }
  
  await db.insert(address)
    .values(Object.values(input.participants).flat())
    .onConflictDoNothing();
  
  const participants = Object.entries(input.participants).flatMap(([rel, list]) => {
    return list.map(email => ({
      mid: input.mid,
      rel,
      aid: email.aid
    }));
  });

  await db.insert(participant)
    .values(participants)
    .onConflictDoNothing();

  return Promise.resolve();
}
