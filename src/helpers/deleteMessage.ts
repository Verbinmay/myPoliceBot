import { Context } from "telegraf";

export const deleteMessage = async (ctx: Context, messageId: number) => {
  setTimeout(async () => {
    await ctx.deleteMessage(messageId);
  }, 3000);
};
