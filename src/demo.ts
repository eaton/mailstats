import { MboxStreamer } from "@eatonfyi/mbox-streamer";
import { formatMessage } from "./util/index.js";

await demo('./test/example.mbox');

export async function demo(mailbox: string) {
  const parser = new MboxStreamer();
  const addresses: Record<string, { sent: number, received: number }> = {};

  parser.on('message', (input, total) => {
    const m = formatMessage(input);
    addresses[m.sender ?? 'unknown'] ??= { sent: 0, received: 0 };
    addresses[m.sender ?? 'unknown'].sent++;
    addresses[m.recipient ?? 'unknown'] ??= { sent: 0, received: 0 };
    addresses[m.recipient ?? 'unknown'].received++;

    if (total % 100 === 0) {
      console.log(total, 'messages processed...')
    }
  });

  parser.on('finish', total => {
    console.log('Finished!', total, 'messages processed.');
    console.log(addresses);
  });

  console.log('Analyzing ./test/example.mbox...');
  return parser.parse(mailbox);
}