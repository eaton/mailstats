import * as mime from "@thi.ng/mime";
import { nanohash } from "@eatonfyi/ids";
import { ParsedMail, Attachment, EmailAddress, AddressObject } from "mailparser";

/**
 * Generates a filename for an attachment, rexpecting the one that was specified
 * in the attachment's headers if it exists, and constructing one that respects
 * its mime-type if not.
 */
export function getAttachmentFilename(input: Attachment) {
  return input.filename ?? [getAttachmentId(input), mime.preferredExtension(input.contentType)].join('.')
}

/**
 * Generates a unique ID for a message attachment, first by checking the attachment's
 * content-id header and falling back to a hash of the attachment's headers.
 */
export function getAttachmentId(input: Attachment) {
  return input.cid ?? nanohash(input.headers);
}

/**
 * Generates a unique ID for a message from the hash value of its headers.
 * This is safer than relying on the actual message-id, which may not be populated.
 */
export function getMessageId(input: ParsedMail) {
  // return input.messageId ?? nanohash(input.headers);
  return nanohash(input.headers);
}

/**
 * Attempts to extract the primary sender's address a message's headers'; this 
 * is relatively naive and simply grabs the first of any addresses listed in
 * the field.
 */
export function getSender(input: ParsedMail) {
  const val = input.headers.get('from');
  if (isAddressObject(val)) {
    return val.value[0]?.address ?? val.value[0]?.name;
  }
}

/**
 * Attempts to extract the email address a message was actually *delivered* to
 * from the message headers; this is not necessarily the same as the recipient
 * listed in the `To:` field of the message.
 */
export function getRecipient(input: ParsedMail) {
  const val = input.headers.get('delivered-to') ?? input.headers.get('to');
  if (isAddressObject(val)) {
    return val.value[0]?.address ?? val.value[0]?.name;
  }
}

/**
 * Extracts the list of GMail labels from a message's headers, returning them as
 * an array of strings. Returns `undefined` if no labels exist.
 */
export function getMessageLabels(input: ParsedMail) {
  const labels = input.headers.get('X-Gmail-Labels');
  if (labels) {
    return labels.toString().split(',').map(l => l.trim());
  }
  return undefined;
}

/**
 * Ensure the input is a mailboxparser EmailAddress object.
 */
export function isEmailAddress(input: unknown): input is EmailAddress {
  return !!input && (typeof input === 'object') && ('name' in input) && ('email' in input)
}

/**
 * Ensure the input is a mailboxparser AddressObject. Note that AddressObjects
 * can contain multiple valid EmailAddress objects in their `value` property;
 */
export function isAddressObject(input: unknown): input is AddressObject {
  return !!input && (typeof input === 'object') && ('value' in input) && ('text' in input)
}
