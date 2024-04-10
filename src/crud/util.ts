import * as mime from "@thi.ng/mime";
import { nanohash } from "@eatonfyi/ids";
import { ParsedMail, Attachment, EmailAddress, AddressObject } from "mailparser";

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
  if (isAddressObject(val)) {
    return val.value[0]?.address ?? val.value[0]?.name;
  }
}

export function getMessageLabels(input: ParsedMail) {
  return undefined;
}

export function isEmailAddress(input: unknown): input is EmailAddress {
  return !!input && (typeof input === 'object') && ('name' in input) && ('email' in input)
}

export function isAddressObject(input: unknown): input is AddressObject {
  return !!input && (typeof input === 'object') && ('value' in input) && ('text' in input)
}
