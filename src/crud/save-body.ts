import jetpack from "@eatonfyi/fs-jetpack";
import { nanohash } from "@eatonfyi/ids";
import { ParsedMail } from "mailparser";

export async function saveBody(parsed: ParsedMail): Promise<string[]> {
  const mid = parsed.messageId ?? nanohash(parsed.headers);
  const results: string[] = [];

  const messages = jetpack.dir(process.env.MESSAGE_DIR ?? 'output/messages');
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