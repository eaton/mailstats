import { MboxStreamer } from "@eatonfyi/mbox-streamer";
import { getDatabase, insertMessage, saveAttachments, saveBody } from "./crud/index.js";

await processMbox('./test/example.mbox');

export async function processMbox(path: string) {
  const db = getDatabase();
  const parser = new MboxStreamer();
  parser.on('message', m => insertMessage(db, m));

  await parser.parse(path);
}