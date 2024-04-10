import * as mime from "@thi.ng/mime";
import { nanohash } from "@eatonfyi/ids";
import { ParsedMail, Attachment, EmailAddress } from "mailparser";

export function getAttachmentFilename(input: Attachment) {
  return input.filename ?? [getAttachmentId(input), mime.preferredExtension(input.contentType)].join('.')
}

export function getAttachmentId(input: Attachment) {
  return input.cid ?? nanohash(input.headers);
}

export function getMessageId(input: ParsedMail) {
  // return input.messageId ?? nanohash(input.headers);
  return nanohash(input.headers);
}

export function getSender(input: ParsedMail) {
  return input.from?.value[0]?.address;
}

export function getRecipient(input: ParsedMail) {
  const val = input.headers.get('delivered-to');
  if (isEmailAddress(val)) {
    return val.address ?? val.name;
  }
}

export function getMessageLabels(input: ParsedMail) {
  return undefined;
}

export function isEmailAddress(input: unknown): input is EmailAddress {
  return !!input && (typeof input === 'object') && ('name' in input) && ('email' in input)
}
