import bodyParser from "body-parser";
import cors from "cors";
import crypto from "crypto";
import { config } from "dotenv";
import express from "express";
import { Telegraf } from "telegraf";

import { middleware } from "./middleware";

config();

// Получаем URL и ключи
const url = process.env.WEBHOOK_DOMAIN;

if (!url) {
  console.log("Unable to start without configured URL");
  console.log("Specify the URL with the BOT_URL environment variable");
  process.exit();
}

// Создаем экземпляр бота
const bot = new Telegraf(process.env.BOT_TOKEN ?? "");
bot.use(middleware);

// Настройка хеширования для webhook
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
app.use(bot.webhookCallback(`/${url}`));
app.get("/", (req, res) => {
  res.status(200).json({ version: "1.0" });
});
