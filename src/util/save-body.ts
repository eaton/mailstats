import jetpack from "@eatonfyi/fs-jetpack";
import { MboxMessage } from "./format-message.js";

export async function saveBody(input: MboxMessage, directory: string): Promise<string[]> {
  const results: string[] = [];

  const messages = jetpack.dir(directory);

  if (input.html) {
    results.push(messages.path(`${input.mid}.html`));
    messages.write(`${input.mid}.html`, input.html);
  }
  if (input.text) {
    results.push(messages.path(`${input.mid}.txt`));
    messages.write(`${input.mid}.txt`, input.text);
  }
  return Promise.resolve(results);
}