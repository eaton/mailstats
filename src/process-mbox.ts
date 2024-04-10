import { MboxStreamer } from "@eatonfyi/mbox-streamer";
import { getDatabase, insertMessage } from "./crud/index.js";
import { saveAttachments, saveBody } from "./util/index.js";
import { Options, populateSettings } from './settings.js';

export async function processMbox(mailbox: string, opt: Options = {}) {
  const options = populateSettings(opt);

  const db = getDatabase(options.db);
  const parser = new MboxStreamer();

  parser.on('message', m => {
    insertMessage(m, db);
    if (options.attachments !== false) saveAttachments(m, options.attachments);
    if (options.messages !== false) saveBody(m, options.messages);
  });

  await parser.parse(mailbox);
}