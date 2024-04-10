import jetpack from "@eatonfyi/fs-jetpack";
import { ParsedMail } from "mailparser";
import { getMessageId } from "./message-parsing.js";

export async function saveBody(parsed: ParsedMail, directory: string): Promise<string[]> {
  const mid = getMessageId(parsed);
  const results: string[] = [];

  const messages = jetpack.dir(directory);

  if (parsed.html) {
    results.push(messages.path(`${mid}.html`));
    messages.write(`${mid}.html`, parsed.html);
  }
  if (parsed.text) {
    results.push(messages.path(`${mid}.txt`));
    messages.write(`${mid}.txt`, parsed.text);
  }
  return Promise.resolve(results);
}