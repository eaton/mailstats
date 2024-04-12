import { sqlite } from "../index.js";

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

await sqlite.ingest(paths, {
  output: "/Volumes/Syntax/mailboxes/output/",
  saveHeaders: 'disk',
  saveHtml: 'disk',
  saveText: 'disk',
  saveAttachments: true,
  addresses: {
    self: [
      "(*@processliberation.org|*@cookingwithdrupal.org|*@memeaverse.com|*@averyspecialepisode|*@angrylittletree.com|*@eaton.fyi|*@onehundredwords.com)", // Custom domains; anything here is me
      "(jeaton@geneer.com|jeaton@rvsinfo.com|jeaton@rvsinc.com|*eaton*@lullabot.*|eaton@autogram.*)", // Work addresses
      "(jeff.eaton@nyumc.org|jeff.eaton@ibm.com|jeff_eaton@apple.com)", // Novelty client emails
      "(verb@predicate.*|jcaccounts@predicate.org|jc@predicate.net|jeff@viapositiva.net|eaton@nerdhaus.net|angrylittletree@me.com|jeff.eaton@me.com|verb@pm.sprint.com)", // Personal emails
      "(predicate@gmail.com|verb@gmail.com)", // Gmail addresses
      "(the verb is what's going on|Jeff Eaton|jeff eaton)"
    ]
  },
  analyzeText: true,
});
