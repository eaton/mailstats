import { MboxStreamer } from "@eatonfyi/mbox-streamer";
import PQueue from "p-queue";
import { SingleBar, Presets } from 'cli-progress';

import { sqlite } from "./index.js";
import { formatMessage, saveAttachments, saveBody } from "./util/index.js";
import { Options, populateSettings } from './settings.js';

export async function importMbox(mailbox: string, opt: Options = {}) {
  const options = populateSettings(opt);
  const db = sqlite.getDatabase(options.db);
  const parser = new MboxStreamer();

  const q = new PQueue({ autoStart: false });
  q.add(() => parser.parse(mailbox));

  let read = 0;
  let processed = 0;

  const bar = new SingleBar({ }, Presets.shades_grey);
  bar.start(0, 1);

  parser.on('message', (input, total) => {
    read = total + 1;

    const m = formatMessage(input);
    q.add(() => {
      const promises: Promise<unknown>[] = [];
      promises.push(sqlite.insertMessage(m, db).then(() => {}));
      if (options.attachments !== false) promises.push(saveAttachments(m.attachments, options.attachments));
      if (options.messages !== false) promises.push(saveBody(m, options.messages));
      return Promise.all(promises);
    });
  });

  // Each time a task wraps up, we update the progress. 
  q.on('completed', () => {
    processed++;
    bar.setTotal(read);
    bar.update(processed);
  });

  // When the queue is idle, all tasks are complete.
  q.on('idle', () => {
    bar.stop();
  });
  
  q.start();
  return q.onIdle();
}