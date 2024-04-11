import { sqlite } from "./index.js";

const testFile = './test/example.mbox';

const paths = [
  "/Volumes/Syntax/mailboxes/input/bonsai@angrylittletree.mbox",
  "/Volumes/Syntax/mailboxes/input/jeff@autogram.is.mbox",
  "/Volumes/Syntax/mailboxes/input/jeff@eaton.fyi.mbox",
  "/Volumes/Syntax/mailboxes/input/jeff@viapositva.net.mbox",
  "/Volumes/Syntax/mailboxes/input/Sent.mbox",
  "/Volumes/Syntax/mailboxes/input/Inbox.mbox",
  "/Volumes/Syntax/mailboxes/input/predicate@gmail.com.mbox",
  "/Volumes/Syntax/mailboxes/input/eaton@lullabot.mbox",
];

await sqlite.ingest("/Volumes/Syntax/mailboxes/input/eaton@lullabot.mbox", { output: "/Volumes/Syntax/mailboxes/", saveHtml: false });
