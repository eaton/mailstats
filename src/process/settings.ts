import 'dotenv/config';
import jetpack from '@eatonfyi/fs-jetpack';

export interface Options {
  [key: string]: unknown,
  
  /**
   * Output directory for generated data. By default, mailstats will create an 'output'
   * subdirectory in the current working directory.
   */
  output?: string,

  /**
   * The name of a sqlite database file. If FALSE, no database will be created; this
   * can be useful for extracting ONLY attachments or body text from a mailbox.
   */
  db?: string | false,

  /**
   * Save the full parsed message headers in addition to basic metadata.
   * Note: Saving headers to the database will dramatically increase its size.
   * 
   * @defaultValue: false
   */
  saveHeaders?: 'db' | 'disk' | false,

  /**
   * Save the full text of each message.
   * Note: Saving message text to the database will dramatically increase its size.
   * 
   * @defaultValue: 'disk'
   */
  saveText?: 'db' | 'disk' | false,

  /**
   * Save the full text of each message.
   * Note: Saving message HTML to the database will dramatically increase its size.
   * 
   * @defaultValue: false
   */
  saveHtml?: 'db' | 'disk' | false,

  /**
   * Save any file attachments to disk.
   * 
   * @defaultValue: false
   */
  saveAttachments?: boolean,

  /**
   * Add descriptive labels to email addresses (or address names) matching specific
   * patterns. These labels are applied to the address records themselves, not
   * specific email messages, and can be used for filtering later.
   * 
   * @example
   * ```
   * const options.addresses = {
   *   boss: 'my-boss@example.com',
   *   me: ['my-address@example.com', 'my-other-email@example.com'],
   *   noreply: '(no-reply|do-not-reply)@*',
   * }
   * ```
   * @defaultValue: empty
   */
  addresses?: Record<string, string | string[]>,

  /**
   * Display CLI progress indicators while processing mailbox files.
   * 
   * @defaultValue: true
   */
  showProgress?: boolean,
}


/**
 * Given a partial set of configuration options, generate a fully populated
 * settings object that can be used by mailstats.
 */
export function populateSettings(options: Options) {
  const merged: Required<Options> = {
    db: process.env.DB_URL ?? 'mailstats.db',
    output: process.env.OUTPUT_DIR ?? 'output',
    saveHeaders: false,
    saveText: 'disk',
    saveHtml: false,
    saveAttachments: false,
    addresses: {},
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
