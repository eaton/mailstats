import { MboxStreamer } from "@eatonfyi/mbox-streamer";
import { formatMessage } from "./util/index.js";

await demo('./test/example.mbox');

export async function demo(mailbox: string) {
  const parser = new MboxStreamer();

  parser.on('message', input => {
    const m = formatMessage(input);
    console.log(`${m.date?.toISOString().split('T')[0]}: "${m.subject}" from <${m.sender}>`);
  });
  parser.on('finish', total => console.log(`${total} messages processed.`));

  console.log('Analyzing ./test/example.mbox...');
  return parser.parse(mailbox);
}