import { AddressObject, Attachment, ParsedMail, EmailAddress, HeaderLines } from "mailparser";
import { getAttachmentFilename, getAttachmentId, getMessageId, getMessageLabels, isAddressObject } from './helpers.js';
import { MboxAddress, MboxAttachment, MboxMessage } from "../types.js";
import { canParse, parse } from "@eatonfyi/urls";
import { nanohash } from "@eatonfyi/ids";

export function parseMessage(input: ParsedMail): MboxMessage {
  const mid = getMessageId(input);
  const output: MboxMessage = {
    mid,
    messageId: input.messageId,
    inReplyTo: input.inReplyTo,
    date: input.date,
    subject: input.subject,
    sender: getSender(input),
    recipient: getRecipient(input),
    headers: formatHeaderLines(input.headerLines),
    text: input.text,
    html: input.html || undefined,
    participants: parseParticipants(input),
    attachments: input.attachments.map(a => parseAttachment(mid, a)),
    labels: getMessageLabels(input) ?? [],
    meta: {},
  };

  return output;
}

function parseAttachment(mid: string, input: Attachment): MboxAttachment {
  return { 
    mid,
    cid: getAttachmentId(input),
    contentType: input.contentType,
    bytes: input.size,
    checksum: input.checksum,
    filename: getAttachmentFilename(input),
    headers: formatHeaderLines(input.headerLines),
    content: input.content,
    meta: {}
  }
}

function parseParticipants(input: ParsedMail): Record<string, MboxAddress[]> {
  return {
    from: addrs(input.from).map(e => parseEmailAddress(e)),
    to: addrs(input.to).map(e => parseEmailAddress(e)),
    cc: addrs(input.cc).map(e => parseEmailAddress(e)),
    bcc: addrs(input.bcc).map(e => parseEmailAddress(e))
  };
}

export function parseEmailAddress(input: EmailAddress) {
  let address = input.address?.replace(/^['"]/, '').replace(/['"]$/, '').trim().toLocaleLowerCase();
  let name = input.name?.replace(/^['"]/, '').replace(/['"]$/, '').trim();

  if ((address || (address?.trim().length === 0)) && canParse(name)) {
    address = name;
  }

  const domain = canParse('mailto:' + address) ? parse('mailto:' + address).domain.toLocaleLowerCase() : undefined
  return {
    aid: nanohash(address ?? name),
    name,
    address,
    domain,
    labels: []
  }
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

/**
 * Attempts to extract the primary sender's address a message's headers'; this 
 * is relatively naive and simply grabs the first of any addresses listed in
 * the field.
 */
export function getSender(input: ParsedMail) {
  // TODO: Look at the top-level sender/recipient data, not just the address list.
  const val = input.headers.get('from');
  if (isAddressObject(val)) {
    if (val.value.length) {
      const email = parseEmailAddress(val.value[0])
      const sender = email.address || email.name;
      return sender?.trim().length ? sender : undefined
    } else {
      return val.text.trim().length ? val.text : undefined;
    }
  }
}

/**
 * Attempts to extract the email address a message was actually *delivered* to
 * from the message headers; this is not necessarily the same as the recipient
 * listed in the `To:` field of the message.
 */
export function getRecipient(input: ParsedMail) {
  // TODO: Look at the top-level sender/recipient data, not just the address list.
  const val = input.headers.get('delivered-to') ?? input.headers.get('to');
  if (isAddressObject(val)) {
    if (val.value.length) {
      const email = parseEmailAddress(val.value[0])
      const recipient = email.address || email.name
      return recipient?.trim().length ? recipient : undefined
    } else {
      return val.text.trim().length ? val.text : undefined;
    }
  }
}
