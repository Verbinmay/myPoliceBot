import { Context } from "telegraf";

export const start = async (ctx: Context) => {
  ctx.reply("Welcome to the bot!");
};
