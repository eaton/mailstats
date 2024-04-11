import jetpack from "@eatonfyi/fs-jetpack";
import { MboxMessage } from "./format-message.js";

export async function saveBody(input: MboxMessage, output: string): Promise<void> {
  return Promise.all([saveText(input, output), saveHtml(input, output)]).then(() => void 0);
}

export async function saveText(input: MboxMessage, output: string): Promise<void> {
  if (input.text) {
    jetpack.dir(output).dir('messages').write(`${input.mid}.txt`, input.text);
  }
  return Promise.resolve();
}

export async function saveHtml(input: MboxMessage, output: string): Promise<void> {
  if (input.html) {
    jetpack.dir(output).dir('messages').write(`${input.mid}.html`, input.html);
  }
  return Promise.resolve();
}