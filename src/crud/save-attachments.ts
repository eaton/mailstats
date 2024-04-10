import jetpack from "@eatonfyi/fs-jetpack";
import { ParsedMail } from "mailparser";
import { getAttachmentFilename } from "./util.js";

export async function saveAttachments(parsed: ParsedMail) {
  const results: string[] = [];
  const attachments = jetpack.dir(process.env.ATTACHMENT_DIR ?? 'output/attachments');
  for (const a of parsed.attachments) {
    const filename = getAttachmentFilename(a);
    attachments.write(filename, a.content);
    results.push(attachments.path(filename));
  }
  return Promise.resolve(results);
}