import test from 'ava';
import jetpack from '@eatonfyi/fs-jetpack';
import { importMbox } from "../src/import.js";

const dir = jetpack.dir('./test/process');

test('process example mailbox', async t => {
  dir.remove();
  await importMbox(jetpack.path('./test/example.mbox'), { output: dir.path() });

  t.assert(dir.exists('mailstats.db'));

  t.is(dir.read('messages/sPtEI2kY.html'), '<div>This is the first test email.</div>\n');
  t.is(dir.read('messages/sPtEI2kY.txt'), 'This is the first test email.\n\n--\nTester One\ntester1@example.com\n');
  t.is(dir.read('messages/aBZjPvKj.html'), '<div>This is a second test email.</div>\n');

  dir.remove();
})
