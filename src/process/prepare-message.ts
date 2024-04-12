import { Options } from "./settings.js";
import { MboxMessage } from "../types.js";

/**
 * Takes a fully-populated MboxMessage and strips out any properties
 * that shouldn't be saved to the database. 
 */
export function prepareMessage(input: MboxMessage, options: Options): MboxMessage {
  return {
    ...input,
    headers: (options.saveHeaders !== 'db') ? {} : input.headers,
    html: (options.saveText !== 'db') ? '' : input.html,
    text: (options.saveHtml !== 'db') ? '' : input.text
  }
}