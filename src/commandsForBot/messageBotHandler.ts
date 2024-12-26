import { Context } from "telegraf";

import { handleBotService } from "../services/handleBotService";

export const messageBotHandler = async (ctx: Context) => {
  const message = ctx.message;

  if (!message || !message.from) return;

  if ("photo" in message) {
    await handleBotService.handleHashtagsChecker(ctx);
    return;
  }

  if ("document" in message) {
    await handleBotService.handleHashtagsChecker(ctx);
    return;
  }
};
