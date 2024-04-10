# Mailstats

A terrifying, enormous wad of weirdness.

## Installation

In an existing node.js project, run `npm i eaton/mailstats`.

## Usage

### Node.js

```typescript
import { MboxStreamer, getDatabase, insertMessage, formatMessage, saveAttachment } from '@eatonfy/mailstats';

const parser = new MboxStreamer();
const db = getDatabase(':memory:');

parser.on('message', async raw => {
  const message = formatMessage(raw);
  const pdfs = message.attachments.filter(a => a.contentType === 'application/pdf');

  if (pdfs.length) {
    await insertMessage(message, db);
    await saveAttachments(pdfs, 'received-files');
  }
});

await parser.parse('~/my-mail.mbox');
// Run queries! Amaze your friends!
```
