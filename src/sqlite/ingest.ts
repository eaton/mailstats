import { SingleBar, Presets } from 'cli-progress';
import { getDatabase } from './get-database.js';
import { insertMessage } from './insert-message.js';
import { saveAttachments, saveBody, saveHtml, saveText } from "../util/index.js";
import { Options, populateSettings } from '../settings.js';
import { buildQueue } from '../build-queue.js';
import path from 'path';

export async function ingest(mailbox: string, opt: Options = {}) {
  const options = populateSettings(opt);
  const db = getDatabase(options.db);
  const bar = new SingleBar({ stopOnComplete: true }, Presets.shades_grey);

  if (options.progress) {
    // Technically, the queue is tasks + 1, so we start at -1 to
    // keep the end result sensible.
    bar.start(0, -1);
  }

  const queue = buildQueue(mailbox, async (input, status) => {
    bar.setTotal(status.messagesRead);
    const promises: Promise<unknown>[] = [];
    
    if (!options.headers) input.headers = undefined;

    promises.push(insertMessage(input, db).then(() => {}));
    if (options.attachments) promises.push(saveAttachments(input.attachments, options.output));
    if (options.bodyText) promises.push(saveText(input, options.output));
    if (options.bodyHtml) promises.push(saveHtml(input, options.output));
    return Promise.all(promises);
  });

  queue.on('completed', () => bar.increment());  
  queue.start();

  return queue.onIdle();
}