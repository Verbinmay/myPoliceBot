import bodyParser from "body-parser";
import cors from "cors";
import crypto from "crypto";
import { config } from "dotenv";
import express from "express";
import cron from "node-cron";
import OpenAI from "openai";
import { getTdjson } from "prebuilt-tdlib";
import * as tdl from "tdl";
import { Telegraf } from "telegraf";

import { middlewareBot } from "./middlewares/middlewareEventBot";
import { handleUpdate } from "./middlewares/middlewareEventClient";
import { clientTGService } from "./services/clientTGService";

config();

const url = process.env.WEBHOOK_DOMAIN;

if (!url) {
  console.log("Unable to start without configured URL");
  console.log("Specify the URL with the BOT_URL environment variable");
  process.exit();
}

tdl.configure({ tdjson: getTdjson() });

export const bot = new Telegraf(process.env.BOT_TOKEN ?? "");
bot.use(middlewareBot);

export const clientTG = tdl.createClient({
  apiId: Number(process.env.api_id ?? 222),
  apiHash: process.env.api_hash ?? "",
});

clientTG.on("error", console.error);
clientTG.on("update", async (update) => {
  await handleUpdate(update);
});

const setClientTg = async () => {
  await clientTG.login();
};

export const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEP_TOKEN,
  maxRetries: 4,
});
// export const openai = new OpenAI({
//   apiKey: process.env.GPT_TOKEN,
//   maxRetries: 4,
// });

const hash = crypto
  .createHash("sha256")
  .update(process.env.BOT_TOKEN ?? "")
  .digest("base64");

const setupWebhook = async (url: string, hash: string) => {
  app.use(await bot.createWebhook({ domain: `${url}/${hash}` }));
};

export const app = express();
app.use(bodyParser.json());
app.use(cors()); // Разрешаем любым фронтам делать запросы на наш бэк
setupWebhook(url, hash);
setClientTg();
app.use(bot.webhookCallback(`/${url}`));
app.get("/", (req, res) => {
  res.status(200).json({ version: "1.0" });
});
cron.schedule("0 3 * * *", async () => {
  await clientTGService.updateChatsMessages();
});
