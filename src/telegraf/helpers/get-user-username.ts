import { Context } from "telegraf";

export const getUserUsername = (context: Context): string | null => {
  if ("callback_query" in context.update) {
    return context.update.callback_query.from.username ?? null;
  }

  if ("message" in context.update) {
    return context.update.message.from.username ?? null;
  }

  if ("my_chat_member" in context.update) {
    return context.update.my_chat_member.from.username ?? null;
  }

  return null;
};
