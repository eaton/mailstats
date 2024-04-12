import { SingleBar, MultiBar, ValueType, Options as ProgressOptions } from 'cli-progress';
import { getDatabase, DatabaseInstance } from '../sqlite/get-database.js';
import { insertMessage } from '../sqlite/insert-message.js';
import { saveAttachments, saveHeaders, saveHtml, saveText } from "../util/index.js";
import { Options, populateSettings } from './settings.js';
import { buildQueue } from '../build-queue.js';
import PQueue from 'p-queue';
import jetpack from '@eatonfyi/fs-jetpack';
import { filesize } from 'filesize';
import { formatDistance } from '@eatonfyi/dates';
import { NLP } from '../util/process-text.js';
import { prepareMessage } from './prepare-message.js';
import { labelAddresses } from '../util/label-addresses.js';

/**
 * Read one or more UNIX MBox files and process each of the messages.
 * 
 * By default, this function will create a new sqlite database one
 * doesn't exist, save the metadata for each email into it, save
 * the plaintext and HTML versions of each email into a 'messages'
 * folder, and save every attachment into an 'attachments' folder.
 */
export async function ingest(mailbox: string | string[], opt: Options = {}) {
  const options = populateSettings(opt);
  const db = options.db ? getDatabase(options.db) : undefined;
  const multibar = new MultiBar({ stopOnComplete: true, hideCursor: true }, ProgressPreset);
  let bytesBar: SingleBar | undefined = undefined;

  const paths = Array.isArray(mailbox) ? mailbox : [mailbox];
  const queue = new PQueue({ concurrency: 1, autoStart: false });

  let totalBytes = 0;

  if (options.showProgress && paths.length > 1) {
    console.log(` Processing ${paths.length} mailbox${paths.length > 1 ? 'es' : ''}...`)
    bytesBar = multibar.create(0, 0);
  }

  for (const path of paths) {
    if (!jetpack.exists(path)) {
      console.log(`Skipping ${path}; couldn't find file.`);
      continue;
    }
    const fileBytes = jetpack.inspect(path)?.size ?? 0;
    totalBytes += fileBytes;
    queue.add(() => processSingleMailbox(path, options, db, (options.showProgress) ? multibar.create(0, -1) : undefined, bytesBar))
  }

  if (bytesBar && totalBytes < 5_000_000) {
    multibar.remove(bytesBar);
  } else {
    bytesBar?.setTotal(totalBytes);
  }

  queue.start();
  await queue.onIdle().then(() => multibar.stop());
}

async function processSingleMailbox(path: string, options: Required<Options>, db?: DatabaseInstance,  bar?: SingleBar, bytesBar?: SingleBar): Promise<void> {
  const nlp = options.analyzeText ? new NLP() : false;

  const queue = buildQueue(path, async (input, bytes, status) => {
    bar?.setTotal(status.messagesRead);
    const promises: Promise<unknown>[] = [];

    if (Object.keys(options.addresses).length) {
      labelAddresses(input, options.addresses);
    }

    if (nlp && input.text && input.text.trim().length) {
      const raw = nlp.getWords(input.text);
      const original = nlp.getWords(nlp.stripQuotedLines(input.text));
      const words = {
        total: raw.length,
        original: original.length,
        quoted: raw.length - original.length,
        sentiment: nlp.sentiment.getSentiment(original)
      }
      input.meta['words'] = words;
    }

    if (options.saveAttachments) promises.push(
      saveAttachments(input, options.output)
        .catch((err: unknown) => dumpError(err, input, input.mid + '+a', options.output))
    );

    if (options.saveText === 'disk') promises.push(saveText(input, options.output));
    if (options.saveHtml === 'disk') promises.push(saveHtml(input, options.output));
    if (options.saveHeaders === 'disk') promises.push(saveHeaders(input, options.output));

    if (db) promises.push(
      insertMessage(prepareMessage(input, options), db).then(() => {})
        .catch((err: unknown) => dumpError(err, input, input.mid, options.output))
    );

    bytesBar?.increment(bytes);

    return Promise.all(promises);
  });

  queue.on('completed', () => bar?.increment());

  queue.start();
  bar?.start(0, -1);
  return queue.onIdle();
}

const ProgressPreset = {
  format: ' \u001b[90m{bar}\u001b[0m {percentage}% | ETA: {eta} | {value}/{total}',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  formatValue: (v: number, options: ProgressOptions, type: ValueType): string => {
    switch (type) {
      case 'eta':
        if (v === 0) return 'N/A'
        return formatDistance(v??0 * 1000, 0, { addSuffix: false });
      case 'total':
      case 'value': 
        return (v > 1_000_000) ? filesize(v) : v.toString();
      case 'percentage':
        return v.toString().padStart(3, ' ');
      default:
        return v.toString();
    }
  }
}

function dumpError(err: unknown, input: object, id: string, dir: string) {
  jetpack.dir(dir).dir('errors').write(id + '.json', JSON.stringify({ error: err, message: input }));
}
