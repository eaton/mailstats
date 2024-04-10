import 'dotenv/config';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { ParsedMail, EmailAddress, AddressObject } from 'mailparser';
import { nanohash } from '@eatonfyi/ids';
import { canParse, parse } from '@eatonfyi/urls'
import * as mime from "@thi.ng/mime";
import { message, participant, address, attachment } from './schema.js';
import { getMessageId, getMessageLabels, getRecipient, getSender } from './util.js';

type DatabaseInstance = BetterSQLite3Database<Record<string, never>>;

export async function insertMessage(db: DatabaseInstance, parsed: ParsedMail) {
  const mid = getMessageId(parsed);

  await db.insert(message)
    .values({
      mid,
      subject: parsed.subject,
      sender: getSender(parsed),
      recipient: getRecipient(parsed),
      date: parsed.date?.toISOString(),
      labels: getMessageLabels(parsed)
    }).onConflictDoNothing();

  if (parsed.attachments.length) {
    await db.insert(attachment)
      .values(parsed.attachments.map(a => ({
        mid,
        cid: a.contentId ?? nanohash(a.checksum),
        contentType: a.contentType,
        bytes: a.size,
        checksum: a.checksum,
        filename:  a.filename ?? `${a.cid}.${mime.preferredExtension(a.contentType)}`
      }))).onConflictDoNothing();
    }

  const allInvolved = {
    from: addrs(parsed.from).map(e => addrToRecord(e)),
    to: addrs(parsed.to).map(e => addrToRecord(e)),
    cc: addrs(parsed.cc).map(e => addrToRecord(e)),
    bcc: addrs(parsed.bcc).map(e => addrToRecord(e))
  };
  
  await db.insert(address)
    .values(Object.values(allInvolved).flat())
    .onConflictDoNothing();
  

  const participants = Object.entries(allInvolved).flatMap(([rel, list]) => {
    return list.map(email => ({ mid, rel, aid: email.aid }));
  });

  await db.insert(participant)
    .values(participants)
    .onConflictDoNothing();

  return Promise.resolve();
}

function addrs(input?: AddressObject | AddressObject[]) {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.flatMap(a => a.value);
  }
  return input.value;
}

function addrToRecord(input: EmailAddress) {
  const domain = canParse('mailto:' + input.address) ? parse('mailto:' + input.address).domain : undefined
  return {
    aid: nanohash(input.address ?? input.name),
    name: input.name,
    address: input.address,
    domain
  }
}