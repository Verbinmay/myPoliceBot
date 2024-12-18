import { Composer } from "telegraf";

import { message } from "../node_modules/telegraf/filters";
import { hashtagCleaner } from "./commands/hashtagCleaner";
import { start } from "./commands/start";

const composer = new Composer();

composer.command("start", start);
composer.on(message(), hashtagCleaner);

export { composer as middleware };
