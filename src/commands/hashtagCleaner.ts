import { Context } from "telegraf";

import { addToCache } from "../helpers/addToCache";
import { deleteMessage } from "../helpers/deleteMessage";
import { SETTINGS } from "../settings";

const recentChecks = new Set<number>();
const messageSenders = new Set<number>();

export const hashtagCleaner = async (ctx: Context) => {
  const message = ctx.message;

  if (!message || !message.from) return;

  const userId = message.from.id;
  if (recentChecks.has(userId)) {
    return;
  }

  if (SETTINGS.TREADS_ID.includes(message.message_thread_id ?? 0)) {
    if ("photo" in message || "document" in message) {
      if ("caption" in message && message.caption?.includes("#")) {
        addToCache(recentChecks, userId);
        return;
      }
      if (!messageSenders.has(userId)) {
        const resMessage = await ctx.reply("Это еще что такое!!!", {
          message_thread_id: message.message_thread_id,
        });
        await deleteMessage(ctx, resMessage.message_id);
      }
      addToCache(messageSenders, userId);

      await ctx.deleteMessage();
    }
  }
};
