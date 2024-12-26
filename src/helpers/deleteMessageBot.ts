import { Context } from "telegraf";

export const deleteMessageBot = async (ctx: Context, messageId: number) => {
  try {
    setTimeout(async () => {
      await ctx.deleteMessage(messageId);
    }, 3000);
  } catch (e) {
    console.log(e);
  }
};
