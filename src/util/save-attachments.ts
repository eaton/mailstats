import jetpack from "@eatonfyi/fs-jetpack";
import { MboxAttachment } from "./format-message.js";

export async function saveAttachments(input: MboxAttachment[], directory: string) {
  return new Promise(resolve => {
    const results: string[] = [];
    const attachments = jetpack.dir(directory).dir('attachments');
    for (const a of input) {
      attachments.write(a.filename, a.content);
      results.push(attachments.path(a.filename));
    }
    resolve(results);
  })
}