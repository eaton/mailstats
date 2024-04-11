import 'dotenv/config';
import jetpack from '@eatonfyi/fs-jetpack';


/**
 * Description placeholder
 */
export interface Options {
  output?: string,
  db?: string | false,
  saveHeaders?: boolean
  saveAttachments?: boolean
  saveText?: boolean
  saveHtml?: boolean
  showProgress?: boolean,
}

export function populateSettings(options: Options) {
  const merged: Required<Options> = {
    db: process.env.DB_URL ?? 'mailstats.db',
    output: process.env.OUTPUT_DIR ?? 'output',
    saveAttachments: true,
    saveHeaders: false,
    saveText: true,
    saveHtml: true,
    showProgress: true,
    ...options,
  };

  // If the DB path/name is a full URL or `:memory:`, we leave it as is because
  // the driver will sort out the details. Otherwise, we prefix it with the output
  // path to construct an absolute path.
  if (merged.db !== false) {
    if (merged.db !== ':memory:' && !URL.canParse(merged.db)) {
      merged.db = jetpack.dir(merged.output).path(merged.db);
    }  
  }

  return merged;
}
