import { MboxStreamer } from "@eatonfyi/mbox-streamer";
import PQueue from "p-queue";
import { parseMessage } from "./util/index.js";
import { MboxMessage } from "./types.js";

export type MboxQueueStatus = {
  bytesRead: number,
  messagesRead: number,
};

export type MboxQueueTask = (input: MboxMessage, messageBytes: number, status: MboxQueueStatus) => Promise<unknown>;

export function buildQueue(mailbox: string, func: MboxQueueTask): PQueue  {
  const parser = new MboxStreamer();
  const status: MboxQueueStatus = {
    bytesRead: 0,
    messagesRead: 0,
  };

  const q = new PQueue({ autoStart: false });

  q.add(() => parser.parse(mailbox));

  parser.on('message', (input, total, msgBytes, totalBytes) => {
    status.messagesRead = total;
    status.bytesRead = totalBytes;
    q.add(() => func(parseMessage(input), msgBytes, status));
  });
  
  return q;
}