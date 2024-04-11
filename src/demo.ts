import { MboxStreamer } from "@eatonfyi/mbox-streamer";
import { formatMessage } from "./util/index.js";
import PQueue from "p-queue";
import { importMbox } from "./index.js";

await importMbox("./test/example.mbox");
