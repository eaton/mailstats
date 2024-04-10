# Mailstats

A terrifying, enormous wad of weirdness.

## Installation

In an existing node.js project, run `npm i eaton/mailstats`.

## Usage

### Node.js

```typescript
import { processMbox } from '@eatonfy/mailstats';

await processMbox('~/my-mail.mbox');
```

```typescript
import { MboxStreamer, getDatabase, insertMessage, saveBody } from '@eatonfy/mailstats';

const parser = new MboxStreamer();
const db = getDatabase(':memory:');

parser.on('message', m => insertMessage(m, db));
await parser.parse('~/my-mail.mbox');

// Do zany SQL stuff with `db`
```

### CLI

```bash
npm install -G eaton/mailstats

mailstats ~/my-mail.mbox
```
