import jetpack from "@eatonfyi/fs-jetpack";
import { MboxMessage } from "../types.js";
import { utimes } from "fs/promises";

export async function saveText(input: MboxMessage, dir: string): Promise<void> {
  if (!input.text) return Promise.resolve();

  const filename = jetpack.dir(dir).dir('text').path(`${input.mid}.txt`);
  return jetpack.writeAsync(filename, input.text).then(() => {
    if (input.date) utimes(filename, input.date, input.date);
    return void 0;
  });
}

export async function saveHtml(input: MboxMessage, dir: string): Promise<void> {
  if (!input.html) return Promise.resolve();

  const filename = jetpack.dir(dir).dir('html').path(`${input.mid}.html`);
  return jetpack.writeAsync(filename, input.html).then(() => {
    if (input.date) utimes(filename, input.date, input.date);
    return void 0;
  });
}

// TODO: Consider just saving the raw headers rather than JSON-encoded ones.

export async function saveHeaders(input: MboxMessage, output: string): Promise<void> {
  if (!input.headers) return Promise.resolve();

  const filename = jetpack.dir(output).dir('headers').path(`${input.mid}.json`);
  return jetpack.writeAsync(filename, JSON.stringify(input.headers)).then(() => {
    if (input.date) utimes(filename, input.date, input.date);
    return void 0;
  });
}

// TODO: Accept the full message instead of the attachment array, and set file mod dates to the message's date.
// TODO: Check for file collisions and rename files, then update the original MboxAttachment record to reflect the new name.

export async function saveAttachments(input: MboxMessage, dir: string) {
  const attachments = jetpack.dir(dir).dir('attachments');

  const promises: Promise<void>[] = [];
  for (const attachment of input.attachments) {
    const filename = attachment.filename.replaceAll('../', '/'); // What the fuck, people, seriously
    promises.push(
      attachments.writeAsync(filename, attachment.content).then(() => {
      if (input.date) utimes(attachments.path(filename), input.date, input.date);
        return void 0;
      })
    );
  }
  return promises;
}
