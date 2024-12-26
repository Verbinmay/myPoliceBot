import { config } from "dotenv";

config();

export const SETTINGS = {
  PORT: process.env.PORT ?? 3003,
  TREADS_ID: [4865, 539],
  MONGO_URL: process.env.MONGO_URL ?? "",
  ADMIN_ID: [424027533],
  MODERATORS_USERNAME: [
    "eviridis",
    "R_a_da",
    "EnglofDeath",
    "KaiLeXX777",
    "maku_du",
    "revan_may",
  ],
};

export const ERRORMESSAGES = {};
