import 'dotenv/config';
import { message, participant, address, attachment } from './schema.js';
import { DatabaseInstance } from './get-database.js';
import { MboxMessage } from '../types.js';

export async function insertMessage(input: MboxMessage, db: DatabaseInstance) {

  const promises: Promise<unknown>[] = [];

  promises.push(db.insert(message)
    .values({
      mid: input.mid,
      subject: input.subject,
      messageId: input.messageId,
      inReplyTo: input.inReplyTo,
      sender: input.sender,
      recipient: input.recipient,
      date: input.date?.toISOString(),
      headers: input.headers,
      labels: input.labels,
      meta: input.meta,
    }).onConflictDoNothing().then(() => {}));

  if (input.attachments.length) {
    promises.push(db.insert(attachment)
      .values(input.attachments.map(a => ({
        mid: input.mid,
        cid: a.cid,
        contentType: a.contentType,
        bytes: a.bytes,
        checksum: a.checksum,
        filename: a.filename,
      }))).onConflictDoNothing().then(() => {}));
  }
  
  promises.push(db.insert(address)
    .values(Object.values(input.participants).flat())
    .onConflictDoNothing().then(() => {}));
  
  const participants = Object.entries(input.participants).flatMap(([rel, list]) => {
    return list.map(email => ({
      mid: input.mid,
      rel,
      aid: email.aid
    }));
  });

  promises.push(db.insert(participant)
    .values(participants)
    .onConflictDoNothing().then(() => {}));

  return Promise.all(promises);
}
