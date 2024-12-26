import { Context } from "telegraf";

import { Message } from "@telegraf/types";

import { addToCache } from "../helpers/addToCache";
import { deleteMessageBot } from "../helpers/deleteMessageBot";
import { getHashtagsFromString } from "../helpers/getHashtagsFromString";
import { SETTINGS } from "../settings";
import { getUserId } from "../telegraf/helpers/get-user-id";
import { getUserUsername } from "../telegraf/helpers/get-user-username";

const recentChecks = new Set<number>();
const messageSenders = new Set<number>();

function checkAdminOrModerators(ctx: Context): boolean {
  const userId = getUserId(ctx);
  const userName = getUserUsername(ctx) ?? "";

  return (
    SETTINGS.ADMIN_ID.includes(userId) ||
    SETTINGS.MODERATORS_USERNAME.includes(userName)
  );
}

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
