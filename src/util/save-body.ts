import jetpack from "@eatonfyi/fs-jetpack";
import { MboxMessage } from "./format-message.js";

export async function saveBody(input: MboxMessage, output: string): Promise<void[]> {
  return Promise.all<Promise<void>>([saveText(input, output), saveHtml(input, output)]);
}

export async function saveText(input: MboxMessage, output: string): Promise<void> {
  return new Promise(resolve => {
    if (input.text) {
      jetpack.dir(output).dir('messages').write(`${input.mid}.txt`, input.text);
    }
    resolve();
  });
}

export async function saveHtml(input: MboxMessage, output: string): Promise<void> {
  return new Promise(resolve => {
    if (input.html) {
      jetpack.dir(output).dir('messages').write(`${input.mid}.html`, input.html);
    }
    resolve();
  });
}