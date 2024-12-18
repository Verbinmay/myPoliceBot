import { Composer } from "telegraf";

import { message } from "../node_modules/telegraf/filters";
import { hashtagCleaner } from "./commands/hashtagCleaner";

const composer = new Composer();

composer.on(message(), hashtagCleaner);

// composer.command("start", start);

export { composer as middleware };
