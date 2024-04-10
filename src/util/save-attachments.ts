import jetpack from "@eatonfyi/fs-jetpack";
import { MboxMessage } from "./format-message.js";

export async function saveAttachments(input: MboxMessage, directory: string) {
  const results: string[] = [];
  const attachments = jetpack.dir(directory);
  for (const a of input.attachments) {
    attachments.write(a.filename, a.content);
    results.push(attachments.path(a.filename));
  }
  return Promise.resolve(results);
}