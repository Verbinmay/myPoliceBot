import { Context } from "telegraf";

import { Message } from "@telegraf/types";

export const getMessageText = (ctx: Context): string => {
  return (ctx.message as Message.TextMessage).text.trim();
};
