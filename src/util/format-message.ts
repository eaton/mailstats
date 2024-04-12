import { AddressObject, Attachment, ParsedMail, Headers, HeaderValue, StructuredHeader, HeaderLines } from "mailparser";

import { formatEmailAddress, getAttachmentFilename, getAttachmentId, getMessageId, getMessageLabels, getRecipient, getSender } from './helpers.js';

export type MboxMessage = {
  mid: string,
  subject?: string,
  sender?: string,
  recipient?: string,
  date?: Date,
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
  domain?: string,
  meta?: Record<string, unknown>
};

export function formatMessage(input: ParsedMail): MboxMessage {
  const mid = getMessageId(input);
  const output: MboxMessage = {
    mid,
    subject: input.subject,
    sender: getSender(input),
    recipient: getRecipient(input),
    date: input.date,
    headers: formatHeaderLines(input.headerLines),
    text: input.text,
    html: input.html || undefined,
    meta: { labels: getMessageLabels(input) },
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
    headers: formatHeaderLines(input.headerLines),
    content: input.content
  }
}

function formatParticipants(input: ParsedMail) {
  return {
    from: addrs(input.from).map(e => formatEmailAddress(e)),
    to: addrs(input.to).map(e => formatEmailAddress(e)),
    cc: addrs(input.cc).map(e => formatEmailAddress(e)),
    bcc: addrs(input.bcc).map(e => formatEmailAddress(e))
  };
}

function formatHeaderLines(input: HeaderLines) {
  return Object.fromEntries([...input ?? []].map(h => [h.key, h.line]));
}

function addrs(input?: AddressObject | AddressObject[]) {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.flatMap(a => a.value);
  }
  return input.value;
}
