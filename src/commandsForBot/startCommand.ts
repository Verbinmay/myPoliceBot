import { Context } from "telegraf";

export const startCommand = async (ctx: Context) => {
  ctx.reply("Welcome to the bot!");
};
