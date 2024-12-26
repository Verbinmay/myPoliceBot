import { Composer } from "telegraf";
import { message } from "telegraf/filters";

import { messageBotHandler } from "../commandsForBot/messageBotHandler";
import { startCommand } from "../commandsForBot/startCommand";

const composer = new Composer();

composer.command("start", startCommand);
composer.on(message(), messageBotHandler);

export { composer as middlewareBot };
