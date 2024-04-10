import { AddressObject, Attachment, AttachmentCommon, EmailAddress, ParsedMail } from "mailparser";

import { canParse, parse } from "@eatonfyi/urls";
import { nanohash } from "@eatonfyi/ids";

import { getAttachmentFilename, getAttachmentId, getMessageId, getMessageLabels, getRecipient, getSender } from './helpers.js';

export type MboxMessage = {
  mid: string,
  subject?: string,
  sender?: string,
  recipient?: string,
  date?: Date,
  labels?: string[],
  headers?: Record<string, unknown>,
  text?: string,
  html?: string,
  meta?: Record<string, unknown>,
  embeddings?: Record<string, number[]>,
  participants: Record<string, MboxAddress[]>,
  attachments: MboxAttachment[],
};

export type MboxAttachment = {
  cid: string,
  mid: string,
  bytes: number,
  contentType: string,
  filename: string,
  checksum: string,
  content: Buffer,
  headers?: Record<string, unknown>,
  meta?: Record<string, unknown>,
  embeddings?: Record<string, number[]>,
};

export type MboxAddress = {
  aid: string,
  name: string,
  address?: string,
  domain?: string
};

export function formatMessage(input: ParsedMail): MboxMessage {
  const mid = getMessageId(input);
  const output: MboxMessage = {
    mid,
    subject: input.subject,
    sender: getSender(input),
    recipient: getRecipient(input),
    date: input.date,
    labels: getMessageLabels(input),
    headers: undefined,
    text: input.text,
    html: input.html || undefined,
    meta: undefined,
    embeddings: undefined,
    participants: formatParticipants(input),
    attachments: input.attachments.map(a => formatAttachment(mid, a)),
  };

  return output;
}

function formatAttachment(mid: string, input: Attachment) {
  return { 
    mid,
    cid: getAttachmentId(input),
    contentType: input.contentType,
    bytes: input.size,
    checksum: input.checksum,
    filename: getAttachmentFilename(input),
    content: input.content
  }
}

function formatParticipants(input: ParsedMail) {
  return {
    from: addrs(input.from).map(e => addrToRecord(e)),
    to: addrs(input.to).map(e => addrToRecord(e)),
    cc: addrs(input.cc).map(e => addrToRecord(e)),
    bcc: addrs(input.bcc).map(e => addrToRecord(e))
  };
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