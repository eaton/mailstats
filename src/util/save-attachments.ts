import jetpack from "@eatonfyi/fs-jetpack";
import { ParsedMail } from "mailparser";
import { getAttachmentFilename } from "./message-parsing.js";

export async function saveAttachments(parsed: ParsedMail, directory: string) {
  const results: string[] = [];
  const attachments = jetpack.dir(directory);
  for (const a of parsed.attachments) {
    const filename = getAttachmentFilename(a);
    attachments.write(filename, a.content);
    results.push(attachments.path(filename));
  }
  return Promise.resolve(results);
}