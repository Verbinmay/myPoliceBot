import { config } from "dotenv";

config();

export const SETTINGS = {
  PORT: process.env.PORT ?? 3003,
  TREADS_ID: [4865, 539],
};

export const ERRORMESSAGES = {};
