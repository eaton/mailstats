import { MboxStreamer } from "@eatonfyi/mbox-streamer";
import { sqlite } from "./index.js";
import { formatMessage, saveAttachments, saveBody } from "./util/index.js";
import { Options, populateSettings } from './settings.js';

export async function processMbox(mailbox: string, opt: Options = {}) {
  const options = populateSettings(opt);

  const db = sqlite.getDatabase(options.db);
  const parser = new MboxStreamer();

  parser.on('message', input => {
    const m = formatMessage(input);
    sqlite.insertMessage(m, db);
    if (options.attachments !== false) saveAttachments(m, options.attachments);
    if (options.messages !== false) saveBody(m, options.messages);
  });

  await parser.parse(mailbox);
}