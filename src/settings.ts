import 'dotenv/config';
import jetpack from '@eatonfyi/fs-jetpack';

export interface Options {
  db?: string,
  output?: string,
  progress?: boolean,
  headers?: boolean
  attachments?: boolean
  bodyText?: boolean
  bodyHtml?: boolean
}

export function populateSettings(options: Options) {
  const merged: Required<Options> = {
    db: process.env.DB_URL ?? 'mailstats.db',
    output: process.env.OUTPUT_DIR ?? 'output',
    attachments: true,
    headers: false,
    bodyText: true,
    bodyHtml: true,
    progress: true,
    ...options,
  };

  // If the DB path/name is a full URL or `:memory:`, we leave it as is because
  // the driver will sort out the details. Otherwise, we prefix it with the output
  // path to construct an absolute path.
  if (merged.db !== ':memory:' && !URL.canParse(merged.db)) {
    merged.db = jetpack.dir(merged.output).path(merged.db);
  }

  return merged;
}
