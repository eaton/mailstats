# Mailstats

Ingest, anaylze, and noodle around with huge piles of email.

Mailstats parses and extracts (potentially) useful information from UNIX Mbox mail archives. It uses a streaming parser so multi-gigabyte mailboxes can be processed with minimal overhead, and tosses each message into a queue for processing.

By default, it will create a sqlite database to store email metadata (subjects, dates, senders, recipients, etc) and a folder on disk to store each messages' text body, html body, and attachments.

## Installation

In an existing node.js project, run `npm i eaton/mailstats`.

## Usage

### Basic mailbox ingestion

```typescript
import { ingest } from "@eatonfyi/mailstats";

// Default options
const options = {
  output: './output',
  db: 'mailstats.db',
  saveHeaders: true,
  saveAttachments: true,
  saveText: true,
  saveHtml: true
  showProgress: true,
};

await ingest("./test/example.mbox", options);
```

### Custom processing functions

```typescript
import { buildQueue, MboxQueueTask, MboxMessage } from '@eatonfyi/mailstats';

const task: MboxQueueTask = (message: MboxMessage) => {
  console.log(message.subject);
  return Promise.all([
    yourCustomFunction(message),
    yourCustomIndexer(message.messageId, message.text),
  ]);
});
await buildQueue("./test/example.mbox", task).start();
```
