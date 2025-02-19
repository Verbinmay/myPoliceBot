import { Context } from "telegraf";

import { Message } from "@telegraf/types";

import { addToCache } from "../helpers/addToCache";
import { deleteMessageBot } from "../helpers/deleteMessageBot";
import { getHashtagsFromString } from "../helpers/getHashtagsFromString";
import { SETTINGS } from "../settings";

const recentChecks = new Set<number>();
const messageSenders = new Set<number>();

export const handleBotService = {
  async handleHashtagsChecker(ctx: Context) {
    try {
      const message = ctx.message! as
        | Message.PhotoMessage
        | Message.DocumentMessage;

      if (!SETTINGS.TREADS_ID.includes(message.message_thread_id ?? 0)) return;

      const userId = message.from?.id ?? 0;
      if (recentChecks.has(userId)) {
        return;
      }
      const hashtags = getHashtagsFromString(message.caption ?? "");
      if (hashtags.length > 0) {
        addToCache(recentChecks, userId);
        return;
      }
      if (!messageSenders.has(userId)) {
        const resMessage = await ctx.reply("Это еще что такое!!!", {
          message_thread_id: message.message_thread_id,
        });
        await deleteMessageBot(ctx, resMessage.message_id);
      }
      addToCache(messageSenders, userId);

      await ctx.deleteMessage();
    } catch (e) {
      console.log(e);
    }
  },
};
